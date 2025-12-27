import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ArrowLeft, UserX, Trash2, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface Grievance {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    category: string;
    description: string;
    isAnonymous: boolean;
    status: 'pending' | 'resolved';
    createdAt: any;
}

const GrievanceAdminPage: React.FC = () => {
    const [grievances, setGrievances] = useState<Grievance[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!db) return;

        // Listen for grievances in real-time
        const q = query(collection(db, 'grievances'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Grievance[];
            setGrievances(items);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching grievances:", error);
            toast.error("Failed to load grievances.");
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleStatusUpdate = async (id: string, newStatus: 'pending' | 'resolved') => {
        try {
            await updateDoc(doc(db, 'grievances', id), { status: newStatus });
            toast.success(`Marked as ${newStatus}`);
        } catch (e) {
            toast.error("Failed to update status");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this report?")) {
            try {
                await deleteDoc(doc(db, 'grievances', id));
                toast.success("Report deleted");
            } catch (e) {
                toast.error("Failed to delete");
            }
        }
    };

    return (
        <div className="min-h-screen bg-background pb-10">
            <header className="px-4 pt-4 pb-4 safe-area-top border-b border-border sticky top-0 bg-background/80 backdrop-blur-md z-10">
                <div className="flex items-center gap-3">
                    <Link to="/admin/dashboard" className="p-2 -ml-2 rounded-xl hover:bg-card transition-colors">
                        <ArrowLeft className="w-5 h-5 text-foreground" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-foreground">Grievances</h1>
                        <p className="text-sm text-muted-foreground">{grievances.length} reports</p>
                    </div>
                </div>
            </header>

            <div className="px-4 py-6 space-y-4">
                {loading ? (
                    <div className="text-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    </div>
                ) : grievances.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                        <p>No grievances reported yet.</p>
                    </div>
                ) : (
                    grievances.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="glass-card p-4 rounded-xl border border-border"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${item.category === 'Harassment' || item.category === 'Bullying'
                                            ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                            : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                        }`}>
                                        {item.category}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {item.createdAt?.seconds ? new Date(item.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                                    </span>
                                </div>
                                <div className="flex gap-1">
                                    {item.status === 'resolved' ? (
                                        <button onClick={() => handleStatusUpdate(item.id, 'pending')} className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200" title="Reopen">
                                            <CheckCircle className="w-4 h-4" />
                                        </button>
                                    ) : (
                                        <button onClick={() => handleStatusUpdate(item.id, 'resolved')} className="p-1.5 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200" title="Mark Resolved">
                                            <Clock className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button onClick={() => handleDelete(item.id)} className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <p className="text-foreground text-sm leading-relaxed mb-3">
                                {item.description}
                            </p>

                            <div className="flex items-center gap-2 pt-3 border-t border-border/50">
                                {item.isAnonymous ? (
                                    <>
                                        <UserX className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-xs font-semibold text-muted-foreground">Anonymous Student</span>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                                            {item.userName?.[0] || 'U'}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-semibold text-foreground">{item.userName}</span>
                                            <span className="text-[10px] text-muted-foreground">{item.userEmail}</span>
                                        </div>
                                    </>
                                )}
                                <div className="ml-auto">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                        }`}>
                                        {item.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default GrievanceAdminPage;
