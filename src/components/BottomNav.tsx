import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, MapPin, UtensilsCrossed, Calendar, MoreHorizontal } from 'lucide-react';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/transport', icon: MapPin, label: 'Transport' },
  { path: '/canteen', icon: UtensilsCrossed, label: 'Canteen' },
  { path: '/events', icon: Calendar, label: 'Events' },
  { path: '/more', icon: MoreHorizontal, label: 'More' },
];

const BottomNav: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border safe-area-bottom z-40">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="nav-item relative flex-1"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 bg-secondary/20 rounded-xl"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
              <Icon 
                className={`w-5 h-5 relative z-10 transition-colors ${
                  isActive ? 'text-secondary' : 'text-muted-foreground'
                }`} 
              />
              <span 
                className={`text-[10px] font-medium relative z-10 transition-colors ${
                  isActive ? 'text-secondary' : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
