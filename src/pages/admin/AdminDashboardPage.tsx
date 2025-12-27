import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UtensilsCrossed, Building2, Calendar, Users, LogOut, Shield, Bus, Bell, ShieldAlert } from 'lucide-react';

const AdminDashboardPage: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Double check specific admin roles and redirect if they land here accidentally? 
    // Super admin sees all, others might be redirected by RoleBasedHome, but safe to keep links here.

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const modules = [
        {
            title: 'User Management',
            description: 'Manage users, roles and permissions',
            icon: Users,
            color: 'text-blue-500',
            bgColor: 'bg-blue-500/10',
            path: '/admin/users',
            role: 'super_admin'
        },
        {
            title: 'Food Admin',
            description: 'Manage canteen menu & orders',
            icon: UtensilsCrossed,
            color: 'text-orange-500',
            bgColor: 'bg-orange-500/10',
            path: '/admin/food',
            role: 'all' // visible to super and food logic handled by route
        },
        {
            title: 'Events Admin',
            description: 'Create & manage campus events',
            icon: Calendar,
            color: 'text-pink-500',
            bgColor: 'bg-pink-500/10',
            path: '/admin/events',
            role: 'all'
        },
        {
            title: 'Transport Admin',
            description: 'Manage bus routes & tracking',
            icon: Bus, // Make sure to import Bus from lucide-react (it was missing in file)
            color: 'text-indigo-500',
            bgColor: 'bg-indigo-500/10',
            path: '/admin/transport',
            role: 'all'
        },
        {
            title: 'Resource Admin',
            description: 'Manage bookings & inventory',
            icon: Building2,
            color: 'text-purple-500',
            bgColor: 'bg-purple-500/10',
            path: '/admin/resources',
            role: 'all'
        },
        {
            title: 'Grievances',
            description: 'Review student reports',
            icon: ShieldAlert, // Make sure to import ShieldAlert
            color: 'text-red-500',
            bgColor: 'bg-red-500/10',
            path: '/admin/grievances',
            role: 'super_admin'
        },
        {
            title: 'Notifications',
            description: 'Broadcast alerts to students',
            icon: Bell, // Make sure to import Bell from lucide-react
            color: 'text-indigo-500',
            bgColor: 'bg-indigo-500/10',
            path: '/admin/notifications',
            role: 'super_admin'
        }
    ];

    return (
        <div className="min-h-screen bg-background p-6 fade-in">
            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back, {user?.name}</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="p-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {modules.map((module, index) => (
                    <button
                        key={index}
                        onClick={() => navigate(module.path)}
                        className="glass-panel p-6 rounded-2xl flex items-start gap-4 hover:scale-[1.02] transition-transform text-left group"
                    >
                        <div className={`p-3 rounded-xl ${module.bgColor} group-hover:bg-opacity-20 transition-colors`}>
                            <module.icon className={`w-6 h-6 ${module.color}`} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-foreground mb-1">{module.title}</h3>
                            <p className="text-sm text-muted-foreground">{module.description}</p>
                        </div>
                    </button>
                ))}
            </div>

            <div className="mt-8 p-4 rounded-2xl bg-secondary/5 border border-secondary/10 flex items-center gap-3">
                <Shield className="w-5 h-5 text-secondary" />
                <p className="text-sm text-secondary font-medium">You have super admin privileges.</p>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
