import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, MapPin, UtensilsCrossed, Calendar, MoreHorizontal } from 'lucide-react';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: "/", icon: "home", label: "Home" },
    { path: "/events", icon: "calendar_month", label: "Events" },
    { path: "/grievance", icon: "chat_bubble", label: "Chat" },
    { path: "/settings", icon: "person", label: "Profile" },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] z-50 animate-in slide-in-from-bottom-6 duration-700 delay-300">
      <nav className="glass-dock h-[72px] rounded-[2rem] flex items-center justify-between px-2 shadow-2xl shadow-primary/10">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center w-16 h-full transition-colors gap-1 group ${active ? "text-primary" : "text-muted-foreground hover:text-secondary"
                }`}
            >
              isActive ? 'text-secondary' : 'text-muted-foreground'
                }`}
              >
              {item.label}
            </span>
            </NavLink>
      );
        })}
    </div>
    </nav >
  );
};

export default BottomNav;
