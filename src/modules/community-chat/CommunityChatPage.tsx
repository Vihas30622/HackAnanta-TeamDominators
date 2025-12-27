import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ChatFeed from './components/ChatFeed';
import ThreadView from './components/ThreadView';

const CommunityChatPage = () => {
    return (
        <div className="min-h-screen bg-background text-foreground animate-in fade-in">
            {/* Routes inside the module for specific views */}
            {/* 
                We use wildcard route in App.tsx: /community-chat/* 
                So here we just match sub-paths.
             */}
            <Routes>
                <Route index element={
                    <>
                        {/* Custom Header for Feed */}
                        <header className="p-4 pt-14 pb-4 sticky top-0 bg-background/95 backdrop-blur-md z-10 border-b">
                            <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-3xl">forum</span>
                                Community Chat
                            </h1>
                            <p className="text-sm text-muted-foreground font-medium">Messages disappear in 2 hours ⏳2️⃣h</p>
                        </header>

                        <div className="p-4">
                            <ChatFeed />
                        </div>
                    </>
                } />
                <Route path=":postId" element={<ThreadView />} />
            </Routes>
        </div>
    );
};

export default CommunityChatPage;
