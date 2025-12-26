import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import ModuleCard from '@/components/ModuleCard';
import { 
  Shield, 
  Bus, 
  Heart, 
  Building2, 
  UtensilsCrossed, 
  Calendar, 
  MessageSquareWarning,
  ChevronRight,
  Bell,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';

const modules = [
  {
    title: 'Emergency SOS',
    description: 'One-tap emergency alert with live GPS',
    icon: Shield,
    to: '/emergency',
    gradient: 'destructive' as const,
    badge: 'Hold to activate',
  },
  {
    title: 'Transport',
    description: 'College & public transport tracking',
    icon: Bus,
    to: '/transport',
    gradient: 'primary' as const,
  },
  {
    title: 'Mental Health',
    description: 'Anonymous AI-powered support',
    icon: Heart,
    to: '/mental-health',
    gradient: 'accent' as const,
    badge: 'Anonymous',
  },
  {
    title: 'Campus Resources',
    description: 'Rooms & equipment availability',
    icon: Building2,
    to: '/resources',
    gradient: 'primary' as const,
  },
  {
    title: 'Canteen',
    description: 'Browse menu & order food',
    icon: UtensilsCrossed,
    to: '/canteen',
    gradient: 'success' as const,
  },
  {
    title: 'Events',
    description: 'Campus events & volunteering',
    icon: Calendar,
    to: '/events',
    gradient: 'accent' as const,
  },
  {
    title: 'Grievance Portal',
    description: 'Anonymous reporting system',
    icon: MessageSquareWarning,
    to: '/grievance',
    gradient: 'primary' as const,
    badge: 'Anonymous',
  },
];

const HomePage: React.FC = () => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="px-4 pt-4 pb-2 safe-area-top">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-11 h-11 rounded-full bg-gradient-to-br from-secondary to-highlight flex items-center justify-center overflow-hidden"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg">👋</span>
              )}
            </motion.div>
            <div>
              <p className="text-sm text-muted-foreground">{getGreeting()}</p>
              <h1 className="text-lg font-semibold text-foreground">
                {user?.name?.split(' ')[0] || 'Student'}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Link
              to="/notifications"
              className="p-2.5 rounded-xl bg-card hover:bg-card/80 transition-colors"
            >
              <Bell className="w-5 h-5 text-muted-foreground" />
            </Link>
            <Link
              to="/settings"
              className="p-2.5 rounded-xl bg-card hover:bg-card/80 transition-colors"
            >
              <Settings className="w-5 h-5 text-muted-foreground" />
            </Link>
          </div>
        </div>
      </header>
      
      {/* Quick Actions */}
      <section className="px-4 py-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card p-4 gradient-primary"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-primary-foreground">Campus Safety</h2>
              <p className="text-sm text-primary-foreground/70 mt-0.5">
                Emergency help is one tap away
              </p>
            </div>
            <Link
              to="/emergency"
              className="flex items-center gap-1 text-sm font-medium text-highlight"
            >
              Learn more
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>
      
      {/* Modules Grid */}
      <section className="px-4">
        <h2 className="text-sm font-medium text-muted-foreground mb-3">Modules</h2>
        <div className="space-y-3">
          {modules.map((module, index) => (
            <motion.div
              key={module.to}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <ModuleCard {...module} />
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Role Badge */}
      {user?.role && user.role !== 'student' && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mx-4 mt-6 glass-card p-3"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm text-muted-foreground">
              Logged in as{' '}
              <span className="text-secondary font-medium">
                {user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default HomePage;
