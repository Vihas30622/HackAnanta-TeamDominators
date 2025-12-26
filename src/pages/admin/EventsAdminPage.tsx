import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Plus, Pencil, Trash2, X, Check,
    Calendar, MapPin, Search, Image as ImageIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface EventItem {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    image?: string;
}

const EventsAdminPage: React.FC = () => {
    const [events, setEvents] = useState<EventItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState<EventItem | null>(null);
    const [formData, setFormData] = useState<Omit<EventItem, 'id'>>({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        image: '',
    });

    // Fetch items from Firestore
    useEffect(() => {
        if (!db) return;

        // Ordered by date usually
        const q = query(collection(db, 'events'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as EventItem[];
            setEvents(items);
        }, (error) => {
            console.error("Error fetching events:", error);
            toast.error("Failed to load events: " + error.message);
        });

        return () => unsubscribe();
    }, []);

    const filteredItems = events.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenForm = (item?: EventItem) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                title: item.title,
                description: item.description,
                date: item.date,
                time: item.time,
                location: item.location,
                image: item.image || '',
            });
        } else {
            setEditingItem(null);
            setFormData({
                title: '',
                description: '',
                date: '',
                time: '',
                location: '',
                image: '',
            });
        }
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingItem(null);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 100 * 1024) {
                toast.error("Image too large. Please use under 100KB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!formData.title || !formData.date || !formData.location) {
            toast.error('Please fill required fields');
            return;
        }

        if (!db) {
            toast.error("Database connection failed");
            return;
        }

        try {
            if (editingItem) {
                const itemRef = doc(db, 'events', editingItem.id);
                await updateDoc(itemRef, { ...formData });
                toast.success('Event updated!');
            } else {
                await addDoc(collection(db, 'events'), {
                    ...formData,
                    createdAt: new Date().toISOString()
                });
                toast.success('Event added!');
            }
            handleCloseForm();
        } catch (error: any) {
            console.error("Error saving event:", error);
            toast.error("Failed to save: " + error.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!db) return;
        if (confirm('Are you sure you want to delete this event?')) {
            try {
                await deleteDoc(doc(db, 'events', id));
                toast.success('Event deleted');
            } catch (error) {
                console.error("Error deleting event:", error);
                toast.error("Failed to delete event");
            }
        }
    };

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header */}
            <header className="px-4 pt-4 pb-4 safe-area-top border-b border-border">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link to="/" className="p-2 -ml-2 rounded-xl hover:bg-card transition-colors">
                            <ArrowLeft className="w-5 h-5 text-foreground" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-foreground">Events Admin</h1>
                            <p className="text-sm text-muted-foreground">Manage campus events</p>
                        </div>
                    </div>
                    <Button onClick={() => handleOpenForm()} size="sm" className="gradient-primary">
                        <Plus className="w-4 h-4 mr-1" />
                        Add Event
                    </Button>
                </div>
            </header>

            {/* Search */}
            <div className="px-4 py-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search events..."
                        className="w-full bg-card rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 ring-secondary/50"
                    />
                </div>
            </div>

            {/* Events List */}
            <div className="px-4 space-y-3">
                {filteredItems.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="module-card"
                    >
                        <div className="flex items-start gap-3">
                            <div className="p-1 rounded-xl bg-muted h-20 w-20 shrink-0 overflow-hidden">
                                {item.image ? (
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded-lg" />
                                ) : (
                                    <div className="w-full h-full bg-primary/10 flex items-center justify-center rounded-lg">
                                        <Calendar className="w-8 h-8 text-primary" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-foreground truncate">{item.title}</h3>
                                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{item.description}</p>

                                <div className="flex flex-wrap gap-2 mt-2">
                                    <div className="flex items-center gap-1 text-xs text-secondary font-medium bg-secondary/10 px-2 py-0.5 rounded-md">
                                        <Calendar className="w-3 h-3" />
                                        {item.date} • {item.time}
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                                        <MapPin className="w-3 h-3" />
                                        {item.location}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <button
                                    onClick={() => handleOpenForm(item)}
                                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                                >
                                    <Pencil className="w-4 h-4 text-muted-foreground" />
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {filteredItems.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No events found</p>
                    </div>
                )}
            </div>

            {/* Add/Edit Form Modal */}
            <AnimatePresence>
                {showForm && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
                            onClick={handleCloseForm}
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="fixed bottom-0 left-0 right-0 bg-card rounded-t-3xl z-50 max-h-[90vh] overflow-hidden"
                        >
                            <div className="p-4 border-b border-border">
                                <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-4" />
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-bold text-foreground">
                                        {editingItem ? 'Edit Event' : 'Add Event'}
                                    </h2>
                                    <button onClick={handleCloseForm} className="p-2 rounded-lg hover:bg-muted">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-4 space-y-4 overflow-y-auto max-h-[70vh]">
                                {/* Image Upload */}
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-2 block">Event Image</label>
                                    <div className="flex items-start gap-4">
                                        <div className={`w-24 h-16 rounded-xl bg-muted border-2 border-dashed border-muted-foreground/30 flex items-center justify-center overflow-hidden relative ${!formData.image ? 'p-2' : ''}`}>
                                            {formData.image ? (
                                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageIcon className="w-6 h-6 text-muted-foreground" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer"
                                            />
                                            <p className="text-[10px] text-muted-foreground mt-2">Max 100KB</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-foreground mb-2 block">Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                        placeholder="Event Title"
                                        className="w-full bg-muted rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 ring-primary/50"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-foreground mb-2 block">Date</label>
                                        <input
                                            type="date"
                                            value={formData.date}
                                            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                            className="w-full bg-muted rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-2 ring-primary/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-foreground mb-2 block">Time</label>
                                        <input
                                            type="time"
                                            value={formData.time}
                                            onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                                            className="w-full bg-muted rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-2 ring-primary/50"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-foreground mb-2 block">Location</label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                        placeholder="Venue / Link"
                                        className="w-full bg-muted rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 ring-primary/50"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-foreground mb-2 block">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="Event details..."
                                        className="w-full bg-muted rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 ring-primary/50 min-h-[100px] resize-none"
                                    />
                                </div>
                            </div>

                            <div className="p-4 border-t border-border safe-area-bottom">
                                <Button onClick={handleSave} className="w-full h-12 gradient-primary text-base font-semibold">
                                    <Check className="w-5 h-5 mr-2" />
                                    {editingItem ? 'Update Event' : 'Create Event'}
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EventsAdminPage;
