
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, limit, onSnapshot } from "firebase/firestore";

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [recentEvents, setRecentEvents] = useState<any[]>([]);

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, 'events'), limit(3));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecentEvents(items);
    });
    return () => unsubscribe();
  }, []);

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

      // Reset count if no 3rd click within 1 second
      clickTimeoutRef.current = setTimeout(() => {
        setSosClicks(0);
      }, 1000);

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

  // Countdown Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSosActive && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (isSosActive && countdown === 0) {
      // Trigger Action (e.g., sim call)
      console.log("SOS CALL INITIATED");
      // Optional: window.location.href = "tel:112";
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
    <div className="flex flex-col animate-in fade-in duration-500">
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
            className="bg-white text-red-600 px-8 py-3 rounded-full font-bold text-lg active:scale-95 transition-transform"
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
        <button aria-label="Notifications" onClick={() => navigate('/notifications')} className="glass w-12 h-12 flex items-center justify-center rounded-xl text-primary active:scale-95 transition-transform duration-200 relative">
          <span className="material-symbols-outlined text-[26px]">notifications</span>
          <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
      </header>

      {/* SOS Hero Section */}
      <section className="flex flex-col items-center justify-center py-8">
        <div className="relative w-48 h-48 flex items-center justify-center mb-6">
          {/* Outer Glow Rings */}
          <div className="absolute inset-0 rounded-full border-4 border-primary/10 animate-[spin_10s_linear_infinite]"></div>
          <div className="absolute inset-4 rounded-full border-4 border-dashed border-primary/20 animate-[spin_15s_linear_infinite_reverse]"></div>

          {/* Main SOS Button */}
          <button
            onClick={handleSosClick}
            className="relative w-36 h-36 rounded-full bg-gradient-to-br from-white to-[#ebf4f5] shadow-[0_10px_40px_rgba(54,116,181,0.25)] flex flex-col items-center justify-center z-10 active:scale-95 transition-all duration-300 border-4 border-white/60 group overflow-hidden"
          >
            <div className={`absolute inset - 0 transition - opacity duration - 200 ${sosClicks > 0 ? 'bg-red-500/10 opacity-100' : 'bg-primary/5 opacity-0 group-hover:opacity-100'} `}></div>
            <span className={`material - symbols - outlined text - [48px] mb - 1 material - symbols - filled drop - shadow - sm transition - colors ${sosClicks > 0 ? 'text-red-500' : 'text-primary'} `}>emergency_share</span>
            <span className={`font - black text - xl tracking - wider transition - colors ${sosClicks > 0 ? 'text-red-500' : 'text-primary'} `}>SOS</span>
          </button>

          {/* Pulsing Effect behind button */}
          <div className="absolute inset-0 rounded-full bg-primary/10 -z-10 animate-ripple"></div>
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Emergency?</h2>
          <p className="text-muted-foreground text-base font-medium">Press 3 times for help ({sosClicks}/3)</p>
        </div>
      </section>

      {/* Quick Actions Strip */}
      <div className="w-full overflow-x-auto no-scrollbar pl-6 py-4 flex gap-3 snap-x">
        {[
          { icon: 'badge', label: 'My ID', action: () => { } },
          { icon: 'directions_bus', label: 'Bus Pass', action: () => { } },
        ].map((item, idx) => (
          <button
            key={idx}
            onClick={item.action}
            className="glass shrink-0 h-11 pl-4 pr-5 rounded-full flex items-center gap-2 text-sm font-bold text-foreground whitespace-nowrap snap-start active:bg-white/60 transition shadow-sm"
          >
            <span className="material-symbols-outlined text-primary text-[20px]">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      {/* Admin Quick Access */}
      {(user?.role === 'super_admin' || user?.role === 'food_admin' || user?.role === 'resource_admin') && (
        <div className="px-6 mb-4">
          <button
            onClick={() => {
              if (user.role === 'super_admin') navigate('/admin/users');
              else if (user.role === 'food_admin') navigate('/admin/food');
              else if (user.role === 'resource_admin') navigate('/admin/resources');
            }}
            className="w-full h-12 rounded-xl bg-primary text-white font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined">admin_panel_settings</span>
            Open Admin Dashboard
          </button>
        </div>
      )}

      {/* Recent Updates (Placeholder for "Something Else") */}
      <div className="px-5 mt-6">
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
                  <h4 className="font-bold text-[#101419] text-sm truncate">{event.title}</h4>
                  <p className="text-secondary text-xs truncate">{event.description || event.date + ' @ ' + event.location}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 bg-white/50 rounded-2xl">
              <p className="text-sm text-muted-foreground">No recent updates.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
