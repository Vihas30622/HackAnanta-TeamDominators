
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, deleteDoc, runTransaction, onSnapshot } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Share2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface EventItem {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    image?: string;
    category: string;
    maxSeats: number;
    seatsRemaining: number;
    registrationDeadline: string;
    organizerContact: string;
}

interface Registration {
    id: string; // eventId_userId
    eventId: string;
    userId: string;
    userName: string;
    userEmail: string;
    status: 'registered' | 'attended' | 'missed' | 'cancelled';
    registeredAt: string;
    attendedAt?: string;
}

const EventDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [event, setEvent] = useState<EventItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [registration, setRegistration] = useState<Registration | null>(null);
    const [processing, setProcessing] = useState(false);

    // Fetch Event Data
    useEffect(() => {
        if (!id || !db) return;

        const unsubscribe = onSnapshot(doc(db, 'events', id), (docSnap) => {
            if (docSnap.exists()) {
                setEvent({ id: docSnap.id, ...docSnap.data() } as EventItem);
            } else {
                toast.error('Event not found');
                navigate('/events');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [id, navigate]);

    // Fetch Registration Status
    useEffect(() => {
        if (!id || !user || !db) return;

        const regId = `${id}_${user.id}`;
        const unsubscribe = onSnapshot(doc(db, 'registrations', regId), (docSnap) => {
            if (docSnap.exists()) {
                setRegistration(docSnap.data() as Registration);
            } else {
                setRegistration(null);
            }
        });

        return () => unsubscribe();
    }, [id, user]);

    const handleRegister = async () => {
        if (!user || !event || !db) return;

        // Validation
        if (new Date(event.registrationDeadline) < new Date()) {
            toast.error('Registration deadline has passed.');
            return;
        }
        if (event.seatsRemaining <= 0) {
            toast.error('Event is full.');
            return;
        }

        setProcessing(true);
        const regId = `${event.id}_${user.id}`;
        const eventRef = doc(db, 'events', event.id);
        const regRef = doc(db, 'registrations', regId);

        try {
            await runTransaction(db, async (transaction) => {
                const eventDoc = await transaction.get(eventRef);
                if (!eventDoc.exists()) throw "Event does not exist!";

                const newSeats = eventDoc.data().seatsRemaining - 1;
                if (newSeats < 0) throw "Event is full!";

                transaction.update(eventRef, { seatsRemaining: newSeats });
                transaction.set(regRef, {
                    id: regId,
                    eventId: event.id,
                    userId: user.id,
                    userName: user.name,
                    userEmail: user.email,
                    status: 'registered',
                    registeredAt: new Date().toISOString()
                });
            });
            toast.success('Successfully registered! 🎉');
        } catch (e: any) {
            console.error("Registration failed: ", e);
            toast.error(e.toString() || "Registration failed");
        } finally {
            setProcessing(false);
        }
    };

    const handleCancel = async () => {
        if (!user || !event || !db) return;

        // Validation
        if (new Date(event.registrationDeadline) < new Date()) {
            toast.error('Cannot cancel after deadline.');
            return;
        }

        setProcessing(true);
        const regId = `${event.id}_${user.id}`;
        const eventRef = doc(db, 'events', event.id);
        const regRef = doc(db, 'registrations', regId);

        try {
            await runTransaction(db, async (transaction) => {
                const eventDoc = await transaction.get(eventRef);
                if (!eventDoc.exists()) throw "Event does not exist!";

                const newSeats = eventDoc.data().seatsRemaining + 1;

                transaction.update(eventRef, { seatsRemaining: newSeats });
                transaction.delete(regRef);
            });
            toast.success('Registration cancelled.');
        } catch (e: any) {
            console.error("Cancellation failed: ", e);
            toast.error("Failed to cancel");
        } finally {
            setProcessing(false);
        }
    };

    const getQRCodeUrl = () => {
        if (!user || !event) return '';
        // Data payload for QR
        const data = JSON.stringify({
            eid: event.id,
            uid: user.id
        });
        return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}`;
    };

    if (loading) return <div className="p-8 text-center">Loading event...</div>;
    if (!event) return <div className="p-8 text-center">Event not found</div>;

    const isDeadlinePassed = new Date(event.registrationDeadline) < new Date();
    const isFull = event.seatsRemaining <= 0;

    return (
        <div className="min-h-screen bg-background pb-24 relative">
            {/* Hero Image */}
            <div className="h-[40vh] w-full relative">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${event.image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80'}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-background" />
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 left-4 p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
            </div>

            {/* Content */}
            <div className="px-5 -mt-10 relative z-10">
                <div className="glass-panel p-6 rounded-[32px] shadow-xl mb-6">
                    <div className="flex items-start justify-between mb-4">
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                            {event.category}
                        </span>
                        <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                            <Users className="w-3.5 h-3.5" />
                            <span>{event.seatsRemaining} / {event.maxSeats} seats</span>
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-foreground mb-4 leading-tight">{event.title}</h1>

                    <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-sm text-secondary font-medium">
                            <div className="size-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                                <Calendar className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Date</p>
                                <p>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-secondary font-medium">
                            <div className="size-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                                <Clock className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Time</p>
                                <p>{event.time}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-secondary font-medium">
                            <div className="size-8 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                                <MapPin className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Location</p>
                                <p>{event.location}</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-border pt-4 mb-4">
                        <h3 className="text-sm font-bold mb-2">About Event</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {event.description}
                        </p>
                    </div>

                    {event.organizerContact && (
                        <div className="bg-muted/50 p-3 rounded-xl mb-4">
                            <p className="text-xs text-muted-foreground font-medium">Organizer Contact</p>
                            <p className="text-sm font-semibold">{event.organizerContact}</p>
                        </div>
                    )}
                </div>

                {/* Registration / QR Section */}
                <div className="glass-panel p-6 rounded-[32px] shadow-lg">
                    {registration ? (
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="size-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-2">
                                <div className="material-symbols-outlined">check_circle</div>
                            </div>
                            <h3 className="text-lg font-bold text-green-700">You're Registered!</h3>
                            <p className="text-xs text-muted-foreground">Show this QR code at the venue for entry.</p>

                            <div className="bg-white p-4 rounded-xl shadow-inner dashed-border">
                                <img src={getQRCodeUrl()} alt="Entry QR Code" className="w-48 h-48 mix-blend-multiply" />
                            </div>

                            <Button
                                variant="outline"
                                className="w-full text-red-500 border-red-200 hover:bg-red-50 hover:text-red-700 mt-2"
                                onClick={handleCancel}
                                disabled={processing || isDeadlinePassed}
                            >
                                {processing ? 'Processing...' : 'Cancel Registration'}
                            </Button>
                            {isDeadlinePassed && <p className="text-[10px] text-red-500">Cancellation deadline passed.</p>}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-foreground">Registration</h3>
                                    {isDeadlinePassed ? (
                                        <p className="text-xs text-red-500">Registration closed</p>
                                    ) : isFull ? (
                                        <p className="text-xs text-red-500">Event Full</p>
                                    ) : (
                                        <p className="text-xs text-green-600">Open until {new Date(event.registrationDeadline).toLocaleDateString()}</p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-bold text-primary">Free</span>
                                </div>
                            </div>

                            <Button
                                className="w-full h-12 text-base font-bold gradient-primary shadow-lg shadow-blue-500/20"
                                onClick={handleRegister}
                                disabled={processing || isDeadlinePassed || isFull}
                            >
                                {processing ? 'Processing...' : (isFull ? 'Sold Out' : (isDeadlinePassed ? 'Registration Closed' : 'RSVP Now'))}
                            </Button>
                            <p className="text-[10px] text-center text-muted-foreground">
                                By registering, you agree to the event guidelines.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventDetailsPage;
