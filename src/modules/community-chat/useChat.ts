import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    addDoc,
    doc,
    updateDoc,
    increment,
    deleteDoc
} from 'firebase/firestore';
import { toast } from 'sonner';
import { ChatPost, ChatReply } from './types';
import { useAuth } from '@/contexts/AuthContext';

export const useChat = (postId: string | null = null) => {
    const { user } = useAuth();
    const [posts, setPosts] = useState<ChatPost[]>([]);
    const [replies, setReplies] = useState<ChatReply[]>([]);
    const [loading, setLoading] = useState(true);

    // Helper to check validity
    const isValid = (expiresAt: string) => new Date(expiresAt).getTime() > Date.now();

    // 1. Fetch Posts (Main Feed)
    useEffect(() => {
        if (!db || postId) return; // Don't fetch feed if looking at a thread

        // We fetch posts created in the last 2 hours (approx) to avoid downloading ancient history
        // But strict filtering happens on client for precise second-by-second expiry
        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();

        // Query: Active posts only? 
        // Firestore limitation: cannot filter by derived 'expiresAt' > NOW dynamically in realtime without reset.
        // Strategy: Fetch all 'recent' posts and filter client side.
        const q = query(
            collection(db, 'community_posts'),
            where('expiresAt', '>', new Date().toISOString()), // Initial filter
            orderBy('expiresAt', 'asc') // Ordery by expiry to help index? Or created? 
            // Better: orderBy createdAt desc, but we need composite index. 
            // Let's stick to simple: Get valid ones. 
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() } as ChatPost))
                .filter(item => isValid(item.expiresAt))
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Newest first

            setPosts(items);
            setLoading(false);
        });

        // Refresh every minute to prune expired posts visuals
        const interval = setInterval(() => {
            setPosts(prev => prev.filter(p => isValid(p.expiresAt)));
        }, 10000); // Check every 10s

        return () => {
            unsubscribe();
            clearInterval(interval);
        }
    }, [postId]);

    // 2. Fetch Replies (Thread View)
    useEffect(() => {
        if (!db || !postId) return;

        const q = query(
            collection(db, `community_posts/${postId}/replies`),
            orderBy('createdAt', 'asc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() } as ChatReply))
                .filter(item => isValid(item.expiresAt));

            setReplies(items);
            setLoading(false);
        });

        const interval = setInterval(() => {
            setReplies(prev => prev.filter(r => isValid(r.expiresAt)));
        }, 10000);

        return () => {
            unsubscribe();
            clearInterval(interval);
        }
    }, [postId]);

    // Actions
    const createPost = async (text: string) => {
        if (!user || !db) return;
        if (text.length < 1 || text.length > 300) {
            toast.error("Message must be 1-300 characters");
            return;
        }

        const now = new Date();
        const expires = new Date(now.getTime() + 2 * 60 * 60 * 1000); // +2 Hours

        try {
            await addDoc(collection(db, 'community_posts'), {
                userId: user.id,
                userName: user.name,
                userEmail: user.email,
                userAvatar: user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`,
                text,
                createdAt: now.toISOString(),
                expiresAt: expires.toISOString(),
                replyCount: 0
            });
            toast.success("Posted! Disappears in 2 hours.");
        } catch (e) {
            console.error(e);
            toast.error("Failed to post");
        }
    };

    const createReply = async (text: string) => {
        if (!user || !db || !postId) return;

        const now = new Date();
        const expires = new Date(now.getTime() + 2 * 60 * 60 * 1000); // +2 Hours independently

        try {
            // Add Reply
            await addDoc(collection(db, `community_posts/${postId}/replies`), {
                postId,
                userId: user.id,
                userName: user.name,
                userAvatar: user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`,
                text,
                createdAt: now.toISOString(),
                expiresAt: expires.toISOString()
            });

            // Increment Reply Count
            await updateDoc(doc(db, 'community_posts', postId), {
                replyCount: increment(1)
            });

            toast.success("Reply sent!");
        } catch (e) {
            console.error(e);
            toast.error("Failed to reply");
        }
    };

    const deletePost = async (id: string, authorId: string) => {
        if (!user || !db) return;
        if (user.id !== authorId && user.role !== 'super_admin') {
            toast.error("You can only delete your own posts");
            return;
        }
        if (window.confirm("Delete this post?")) {
            await deleteDoc(doc(db, 'community_posts', id));
            toast.success("Deleted");
        }
    };

    return { posts, replies, loading, createPost, createReply, deletePost, user };
};
