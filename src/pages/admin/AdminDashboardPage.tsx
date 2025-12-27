import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/components/ThemeProvider';
import {
    UtensilsCrossed,
    Building2,
    Calendar,
    Users,
    LogOut,
    Shield,
    Bus,
    Bell,
    ShieldAlert,
    Sun,
    Moon,
    Flame // Import Flame icon for SOS
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy, updateDoc, doc } from 'firebase/firestore';
import { toast } from 'sonner';

const AdminDashboardPage: React.FC = () => {
    const { user, logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();
    const [sosAlerts, setSosAlerts] = React.useState<any[]>([]);

    // Listen for Active SOS Alerts
    React.useEffect(() => {
        if (!db) return;
        const q = query(collection(db, 'sos_alerts'), where('status', '==', 'active'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const alerts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSosAlerts(alerts);
            if (alerts.length > 0) {
                // Play sound or show toast for admin
                toast.error("EMERGENCY: SOS Triggered by student!");
            }
        });
        return () => unsubscribe();
    }, []);

    const resolveAlert = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!db) return;
        await updateDoc(doc(db, 'sos_alerts', id), { status: 'resolved' });
        toast.success("Alert marked as resolved");
    };

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
            role: 'all'
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
            icon: Bus,
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
            icon: ShieldAlert,
            color: 'text-red-500',
            bgColor: 'bg-red-500/10',
            path: '/admin/grievances',
            role: 'super_admin'
        },
        {
            title: 'Notifications',
            description: 'Broadcast alerts to students',
            icon: Bell,
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
                <div className="flex gap-2">

                    <button
                        onClick={handleLogout}
                        className="p-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* SOS Active Alerts Banner */}
            {sosAlerts.length > 0 && (
                <div className="mb-8 space-y-4">
                    {sosAlerts.map(alert => (
                        <div key={alert.id} className="bg-red-500 text-white p-4 rounded-xl shadow-lg border-l-8 border-red-700 animate-pulse flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/20 rounded-full">
                                    <Flame className="w-8 h-8 animate-bounce" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg uppercase tracking-wider">SOS ALERT: {alert.userName}</h3>
                                    <p className="text-sm opacity-90">
                                        Location: {alert.location ? `${alert.location.lat.toFixed(4)}, ${alert.location.lng.toFixed(4)}` : 'Unknown'}
                                    </p>
                                    <p className="text-xs opacity-75">{new Date(alert.timestamp).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {alert.location && (
                                    <button
                                        onClick={() => window.open(`https://www.google.com/maps?q=${alert.location.lat},${alert.location.lng}`, '_blank')}
                                        className="px-4 py-2 bg-white text-red-600 font-bold rounded-lg text-sm hover:bg-gray-100"
                                    >
                                        View Map
                                    </button>
                                )}
                                <button
                                    onClick={(e) => resolveAlert(alert.id, e)}
                                    className="px-4 py-2 border border-white text-white font-bold rounded-lg text-sm hover:bg-white/10"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

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
