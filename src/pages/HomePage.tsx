import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, limit, onSnapshot, addDoc } from "firebase/firestore";
import { toast } from "sonner";
import SOSPlugin from "@/plugins/sos-plugin";

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<any[]>([]);

  // Fetch Events
  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, 'events'), limit(3));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecentEvents(items);
    });
    return () => unsubscribe();
  }, []);

  // Fetch Emergency Contacts
  useEffect(() => {
    if (!db || !user) return;
    const q = query(collection(db, `users/${user.id}/emergency_contacts`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEmergencyContacts(items);
    }, (err) => {
      console.error("Error fetching contacts", err);
    });
    return () => unsubscribe();
  }, [user]);

  const [sosClicks, setSosClicks] = useState(0);
  const [isSosActive, setIsSosActive] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // SOS Triple Click Logic
  const handleSosClick = () => {
    if (isSosActive) return;

    setSosClicks(prev => {
      const newCount = prev + 1;

      // Clear existing timeout
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }

      // Reset count if no 3rd click within 1.5 second
      clickTimeoutRef.current = setTimeout(() => {
        setSosClicks(0);
      }, 1500);

      // Trigger SOS
      if (newCount >= 3) {
        if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
        setIsSosActive(true);
        setSosClicks(0); // Reset for next time
        return 0;
      }
      return newCount;
    });
  };

  const locationRef = useRef<{ lat: number, lng: number } | null>(null);

  const triggerSOSActions = () => {
    console.log("SOS ACTIONS TRIGGERED");

    // Immediate Action: Native SOS Logic (SMS + Direct Call)
    const SOS_NUMBER = "+918919611804"; // International Format

    SOSPlugin.triggerSOS({
      phone: SOS_NUMBER,
      contacts: emergencyContacts.map(c => c.phone) || [SOS_NUMBER],
      message: "URGENT: I am in danger. Please help!"
    }).then(() => {
      toast.success("SOS Alert Sent", { description: "Calling emergency services..." });
    }).catch(err => {
      console.error("SOS Failed", err);
      toast.error("SOS Trigger Failed", { description: "Please make the call manually if needed." });
      // Fallback only if native fails really hard
      window.location.href = `tel:${SOS_NUMBER}`;
    });

    // Background: Log Location to Firestore
    const logSOS = async (lat?: number, lng?: number) => {
      if (!db || !user) return;
      try {
        await addDoc(collection(db, 'sos_alerts'), {
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          phone: emergencyContacts[0]?.phone || 'Unknown',
          location: lat && lng ? { lat, lng } : null,
          status: 'active',
          timestamp: new Date().toISOString()
        });
      } catch (e) {
        console.error("Failed to log SOS", e);
      }
    };

    // Attempt logging (re-using cached location if valid, or fetch fresh)
    const loc = locationRef.current;
    if (loc) {
      logSOS(loc.lat, loc.lng);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          logSOS(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Location error", error);
          logSOS();
        },
        { timeout: 5000, enableHighAccuracy: true }
      );
    } else {
      logSOS();
    }
  };

  // Countdown Logic + Pre-Fetch Location
  useEffect(() => {
    let interval: NodeJS.Timeout;

    // Start Pre-fetching location immediately when SOS activates
    if (isSosActive && countdown === 5) { // Only trigger once at start
      if (navigator.geolocation) {
        console.log("Pre-fetching location...");
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            locationRef.current = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            console.log("Location pre-fetched:", locationRef.current);
          },
          (err) => console.error("Pre-fetch failed", err),
          { timeout: 4000, enableHighAccuracy: true }
        );
      }
    }

    if (isSosActive && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (isSosActive && countdown === 0) {
      triggerSOSActions();
      setIsSosActive(false);
      setCountdown(5); // Reset
      locationRef.current = null; // Clear cache
    }
    return () => clearInterval(interval);
  }, [isSosActive, countdown]);

  // Redirect to login if not authenticated
  if (!isAuthenticated && !user) {
    navigate("/login");
    return null;
  }

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <div className="flex flex-col animate-in fade-in duration-500 min-h-screen pb-24">
      {/* Red Screen Overlay */}
      {isSosActive && (
        <div className="fixed inset-0 z-[100] bg-red-600 flex flex-col items-center justify-center text-white animate-in fade-in duration-200">
          <div className="text-9xl font-black mb-4 animate-pulse">{countdown}</div>
          <h2 className="text-4xl font-bold mb-8 uppercase tracking-widest">SOS Triggered</h2>
          <p className="text-xl opacity-90 mb-12">Calling emergency contacts...</p>
          <button
            onClick={() => {
              setIsSosActive(false);
              setSosClicks(0);
              setCountdown(5);
            }}
            className="bg-white text-red-600 px-8 py-3 rounded-full font-bold text-lg active:scale-95 transition-transform shadow-xl"
          >
            CANCEL
          </button>
        </div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-14 pb-4">
        <div className="flex flex-col">
          <span className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">{currentDate}</span>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Hi, {user?.name?.split(' ')[0] || 'Student'}! 👋</h1>
        </div>
        <div className="flex items-center gap-2">
          <button aria-label="Community Chat" onClick={() => navigate('/community-chat')} className="glass w-12 h-12 flex items-center justify-center rounded-xl text-primary active:scale-95 transition-transform duration-200">
            <span className="material-symbols-outlined text-[26px]">forum</span>
          </button>
          <button aria-label="Notifications" onClick={() => navigate('/notifications')} className="glass w-12 h-12 flex items-center justify-center rounded-xl text-primary active:scale-95 transition-transform duration-200 relative">
            <span className="material-symbols-outlined text-[26px]">notifications</span>
            <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
        </div>
      </header>

      {/* SOS Hero Section */}
      <section className="flex flex-col items-center justify-center py-8">
        <div className="relative w-48 h-48 flex items-center justify-center mb-6">
          {/* Outer Glow Rings (Red for Danger) */}
          <div className="absolute inset-0 rounded-full border-4 border-red-500/20 animate-[spin_10s_linear_infinite]"></div>
          <div className="absolute inset-4 rounded-full border-4 border-dashed border-red-500/30 animate-[spin_15s_linear_infinite_reverse]"></div>

          {/* Main SOS Button */}
          <button
            onClick={handleSosClick}
            className={`relative w-36 h-36 rounded-full shadow-[0_10px_40px_rgba(220,38,38,0.4)] flex flex-col items-center justify-center z-10 active:scale-95 transition-all duration-300 border-4 border-white/60 group overflow-hidden
              bg-gradient-to-br from-red-500 to-red-600 text-white
            `}
          >
            <div className={`absolute inset-0 transition-opacity duration-200 ${sosClicks > 0 ? 'bg-white/20' : 'opacity-0'} `}></div>
            <span className="material-symbols-outlined text-[48px] mb-1 material-symbols-filled drop-shadow-sm">emergency_share</span>
            <span className="font-black text-xl tracking-wider">SOS</span>
          </button>

          {/* Pulsing Effect behind button */}
          <div className="absolute inset-0 rounded-full bg-red-500/10 -z-10 animate-ripple"></div>
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Emergency?</h2>
          <p className="text-muted-foreground text-base font-medium">
            Tap 3 times for help
            <span className={`ml-2 font-bold ${sosClicks > 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
              ({sosClicks}/3)
            </span>
          </p>
        </div>
      </section>



      {/* Admin Quick Access */}
      {(user?.role === 'super_admin' || user?.role === 'food_admin' || user?.role === 'resource_admin' || user?.role === 'transport_admin') && (
        <div className="px-6 mb-4">
          <button
            onClick={() => {
              if (user.role === 'super_admin') navigate('/admin/dashboard');
              else if (user.role === 'food_admin') navigate('/admin/food');
              else if (user.role === 'resource_admin') navigate('/admin/resources');
              else if (user.role === 'transport_admin') navigate('/admin/transport');
            }}
            className="w-full h-12 rounded-xl bg-primary text-white font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined">admin_panel_settings</span>
            Open Admin Dashboard
          </button>
        </div>
      )}

      {/* Recent Updates */}
      <div className="px-5 mt-6 mb-8">
        <h3 className="text-primary text-lg font-bold mb-3">Recent Updates</h3>
        <div className="space-y-3">
          {recentEvents.length > 0 ? (
            recentEvents.map(event => (
              <div
                key={event.id}
                onClick={() => navigate('/events')}
                className="glass-panel p-4 rounded-2xl flex gap-4 items-center shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
              >
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 overflow-hidden">
                  {event.image ? (
                    <img src={event.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined">event</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-foreground text-sm truncate">{event.title}</h4>
                  <p className="text-muted-foreground text-xs truncate">{event.description || event.date + ' @ ' + event.location}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 glass-card rounded-2xl">
              <p className="text-sm text-muted-foreground">No recent updates.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
