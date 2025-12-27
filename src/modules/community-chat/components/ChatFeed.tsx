import React, { useState, useEffect } from 'react';
import { useChat } from '../useChat';
import { useNavigate } from 'react-router-dom';
import { ChatPost } from '../types';

// Helper for countdown
const TimeLeft = ({ expiresAt }: { expiresAt: string }) => {
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        const update = () => {
            const diff = new Date(expiresAt).getTime() - Date.now();
            if (diff <= 0) {
                setTimeLeft("Expired");
                return;
            }
            const mins = Math.floor(diff / 60000);
            const hrs = Math.floor(mins / 60);
            const displayMins = mins % 60;
            setTimeLeft(`${hrs}h ${displayMins}m`);
        };
        update();
        const int = setInterval(update, 60000);
        return () => clearInterval(int);
    }, [expiresAt]); // Only re-run if expiresAt changes

    return <span className="text-xs font-mono text-red-500 font-bold flex items-center gap-1">
        <span className="material-symbols-outlined text-[14px]">timer</span>
        {timeLeft}
    </span>
};

const ChatFeed = () => {
    const { posts, loading, createPost, deletePost, user } = useChat();
    const [text, setText] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;
        await createPost(text);
        setText("");
    };

    return (
        <div className="flex flex-col h-full">
            {/* Create Post */}
            <div className="p-4 glass-card mb-4 rounded-2xl relative">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <img
                        src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`}
                        className="w-10 h-10 rounded-full bg-secondary/20"
                        alt="avatar"
                    />
                    <div className="flex-1">
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="What's on your mind? (Expires in 2h)"
                            maxLength={300}
                            className="w-full bg-transparent border-none focus:ring-0 resize-none text-sm min-h-[50px] outline-none"
                        />
                        <div className="flex justify-between items-center mt-2 border-t pt-2 border-border/30">
                            <span className="text-xs text-muted-foreground">{text.length}/300</span>
                            <button
                                type="submit"
                                disabled={!text.trim() || text.length > 300}
                                className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-xs font-bold active:scale-95 transition-transform disabled:opacity-50"
                            >
                                POST
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* List */}
            <div className="flex-1 space-y-3 pb-24">
                {loading ? (
                    <div className="text-center p-8 text-muted-foreground animate-pulse">Loading discussion...</div>
                ) : posts.length === 0 ? (
                    <div className="text-center p-8 glass-panel rounded-2xl">
                        <p className="font-bold text-lg mb-2">No active discussions</p>
                        <p className="text-sm text-muted-foreground">Be the first to say something!</p>
                    </div>
                ) : (
                    posts.map(post => (
                        <div
                            key={post.id}
                            onClick={() => navigate(`/community-chat/${post.id}`)}
                            className="glass-panel p-4 rounded-2xl active:scale-[0.99] transition-transform cursor-pointer animate-in fade-in slide-in-from-bottom-2"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <img src={post.userAvatar} className="w-8 h-8 rounded-full" alt="" />
                                    <div>
                                        <h4 className="font-bold text-sm leading-none">{post.userName}</h4>
                                        <p className="text-[10px] text-muted-foreground">{new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>
                                <TimeLeft expiresAt={post.expiresAt} />
                            </div>

                            <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap mb-3 pl-10 pr-2">{post.text}</p>

                            <div className="flex items-center justify-between pl-10">
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[16px]">chat_bubble</span>
                                        {post.replyCount || 0} replies
                                    </span>
                                </div>
                                {(user?.id === post.userId || user?.role === 'super_admin') && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); deletePost(post.id, post.userId); }}
                                        className="text-red-500 text-xs font-bold hover:underline px-2 py-1"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div >
    );
};

export default ChatFeed;
