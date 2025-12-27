import React, { useState } from 'react';
import { useChat } from '../useChat';
import { useNavigate, useParams } from 'react-router-dom';
import { ChatPost } from '../types';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const ThreadView = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const { replies, loading, createReply, user } = useChat(postId);
    const [post, setPost] = useState<ChatPost | null>(null);
    const [replyText, setReplyText] = useState("");

    // Fetch parent post once (even if hook fetches replies)
    React.useEffect(() => {
        if (!postId || !db) return;
        getDoc(doc(db, 'community_posts', postId)).then(snap => {
            if (snap.exists()) {
                setPost({ id: snap.id, ...snap.data() } as ChatPost);
            } else {
                // Post might have expired or deleted
                // navigate('/community-chat'); 
            }
        });
    }, [postId]);

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText.trim()) return;
        await createReply(replyText);
        setReplyText("");
    };

    const isExpired = post ? new Date(post.expiresAt).getTime() < Date.now() : false;

    if (!post && !loading) return <div className="p-8 text-center text-muted-foreground">Post not found or expired.</div>;

    return (
        <div className="flex flex-col h-screen bg-background">
            {/* Header */}
            <header className="p-4 border-b flex items-center gap-3 sticky top-0 bg-background/80 backdrop-blur-md z-10">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-secondary/20">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h2 className="font-bold text-lg">Thread</h2>
            </header>

            <div className="flex-1 overflow-y-auto no-scrollbar p-4 pb-32">
                {/* Parent Post */}
                {post && (
                    <div className="mb-6 animate-in fade-in slide-in-from-top-4">
                        <div className="flex items-center gap-3 mb-3">
                            <img src={post.userAvatar} className="w-10 h-10 rounded-full" alt="" />
                            <div>
                                <h3 className="font-bold">{post.userName}</h3>
                                <p className="text-xs text-muted-foreground">Posted at {new Date(post.createdAt).toLocaleTimeString()}</p>
                            </div>
                        </div>
                        <p className="text-lg leading-relaxed text-foreground pl-13 mb-4">{post.text}</p>

                        {isExpired && (
                            <div className="bg-red-500/10 text-red-500 p-2 rounded-lg text-xs font-bold text-center">
                                This post has expired. No new replies.
                            </div>
                        )}
                        <div className="h-px bg-border w-full my-4"></div>
                    </div>
                )}

                {/* Replies */}
                <div className="space-y-4 pl-4 border-l-2 border-border/40 ml-4">
                    {loading ? <p className="text-xs text-muted-foreground">Loading replies...</p> : replies.map(reply => (
                        <div key={reply.id} className="animate-in fade-in slide-in-from-bottom-2">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-sm">{reply.userName}</span>
                                <span className="text-[10px] text-muted-foreground">{new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p className="text-sm text-foreground/90 bg-secondary/10 p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl inline-block">
                                {reply.text}
                            </p>
                        </div>
                    ))}
                    {replies.length === 0 && !loading && (
                        <p className="text-xs text-muted-foreground italic">No replies yet.</p>
                    )}
                </div>
            </div>

            {/* Input */}
            {!isExpired && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
                    <form onSubmit={handleReply} className="flex gap-2 items-end max-w-md mx-auto">
                        <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Replying..."
                            className="flex-1 bg-secondary/20 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none max-h-32"
                            rows={1}
                        />
                        <button
                            type="submit"
                            disabled={!replyText.trim()}
                            className="bg-primary text-primary-foreground h-12 w-12 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform disabled:opacity-50 disabled:scale-100"
                        >
                            <span className="material-symbols-outlined">send</span>
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ThreadView;
