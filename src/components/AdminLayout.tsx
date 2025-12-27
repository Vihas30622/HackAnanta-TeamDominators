import React from 'react';
import NotificationBanner from "@/components/NotificationBanner";
import InstallPrompt from "@/components/InstallPrompt";

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <>
            {/* Background Gradients (Atmosphere) - Darker for Admin feel? Keeping consistent for now but distinct */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                {/* Top Left Blue Blob */}
                <div className="absolute -top-[10%] -left-[10%] w-[80vw] h-[80vw] rounded-full bg-accent mix-blend-multiply filter blur-[80px] opacity-70 animate-pulse-slow"></div>
                {/* Center Right Secondary Blob */}
                <div className="absolute top-[20%] -right-[20%] w-[70vw] h-[70vw] rounded-full bg-secondary/30 mix-blend-multiply filter blur-[90px] opacity-60"></div>
                {/* Bottom Primary Blob */}
                <div className="absolute bottom-0 left-[10%] w-[90vw] h-[90vw] rounded-full bg-primary/10 mix-blend-multiply filter blur-[100px] opacity-50"></div>
            </div>

            <div className="relative z-10 min-h-screen pb-28">
                <NotificationBanner />
                {children}
                {/* No BottomNav for Admins */}
                <InstallPrompt />
            </div>
        </>
    );
};

export default AdminLayout;
