import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, Building2, MessageSquareWarning, Settings, LogOut, 
  ChevronRight, User, UtensilsCrossed, Shield, Bell, Crown
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const moreItems = [
  { icon: Heart, label: 'Mental Health', to: '/mental-health', description: 'Anonymous support' },
  { icon: Building2, label: 'Campus Resources', to: '/resources', description: 'Rooms & equipment' },
  { icon: MessageSquareWarning, label: 'Report Grievance', to: '/grievance', description: 'Anonymous reporting' },
];

const MorePage: React.FC = () => {
  const { user, logout, setUserRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const roles: { value: UserRole; label: string }[] = [
    { value: 'student', label: 'Student' },
    { value: 'food_admin', label: 'Food Admin' },
    { value: 'resource_admin', label: 'Resource Admin' },
    { value: 'super_admin', label: 'Super Admin' },
  ];

  // Admin menu items based on role
  const adminItems = [];
  if (user?.role === 'food_admin' || user?.role === 'super_admin') {
    adminItems.push({
      icon: UtensilsCrossed,
      label: 'Food Admin',
      to: '/admin/food',
      description: 'Manage canteen menu',
      color: 'bg-success',
    });
  }
  if (user?.role === 'resource_admin' || user?.role === 'super_admin') {
    adminItems.push({
      icon: Building2,
      label: 'Resource Admin',
      to: '/admin/resources',
      description: 'Manage rooms & equipment',
      color: 'bg-primary',
    });
  }
  if (user?.role === 'super_admin') {
    adminItems.push({
      icon: Crown,
      label: 'Super Admin',
      to: '/admin/users',
      description: 'Manage users & roles',
      color: 'bg-warning',
    });
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="px-4 pt-4 pb-4 safe-area-top">
        <h1 className="text-xl font-bold text-foreground">More</h1>
        <p className="text-sm text-muted-foreground">Settings & other modules</p>
      </header>

      {/* Profile Card */}
      <div className="px-4 mb-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-secondary to-highlight flex items-center justify-center overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-primary-foreground" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-foreground">{user?.name || 'Student'}</h2>
              <p className="text-sm text-muted-foreground">{user?.email || 'student@campus.edu'}</p>
              <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-medium bg-secondary/20 text-secondary rounded-full">
                {user?.role?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Student'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Admin Panel - Only show if user has admin role */}
      {adminItems.length > 0 && (
        <div className="px-4 mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Admin Panel
          </h3>
          <div className="space-y-2">
            {adminItems.map((item, index) => (
              <motion.div
                key={item.to}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={item.to} className="module-card flex items-center gap-3 border-secondary/30">
                  <div className={`p-2.5 rounded-xl ${item.color}`}>
                    <item.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{item.label}</h4>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-secondary" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* More Modules */}
      <div className="px-4 mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Modules</h3>
        <div className="space-y-2">
          {moreItems.map((item, index) => (
            <motion.div
              key={item.to}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={item.to} className="module-card flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-secondary">
                  <item.icon className="w-5 h-5 text-secondary-foreground" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{item.label}</h4>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Demo Role Switcher */}
      <div className="px-4 mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Demo: Switch Role</h3>
        <div className="glass-card p-3">
          <p className="text-xs text-muted-foreground mb-3">
            Switch roles to test admin features. In production, roles are assigned by Super Admin.
          </p>
          <div className="flex flex-wrap gap-2">
            {roles.map((role) => (
              <button
                key={role.value}
                onClick={() => {
                  setUserRole(role.value);
                  toast.success(`Switched to ${role.label}`);
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  user?.role === role.value
                    ? 'bg-secondary text-secondary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="px-4 mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Settings</h3>
        <div className="space-y-2">
          <Link to="/notifications" className="module-card flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-secondary/20">
              <Bell className="w-5 h-5 text-secondary" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-foreground">Notifications</h4>
              <p className="text-xs text-muted-foreground">Manage push notifications</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </Link>
          
          <Link to="/settings" className="module-card flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-muted">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-foreground">App Settings</h4>
              <p className="text-xs text-muted-foreground">Privacy & preferences</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </Link>
          
          <button
            onClick={handleLogout}
            className="w-full module-card flex items-center gap-3 text-left"
          >
            <div className="p-2.5 rounded-xl bg-destructive/20">
              <LogOut className="w-5 h-5 text-destructive" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-destructive">Log Out</h4>
              <p className="text-xs text-muted-foreground">Sign out of your account</p>
            </div>
          </button>
        </div>
      </div>

      {/* Version */}
      <div className="px-4 text-center">
        <p className="text-xs text-muted-foreground">CampusOS v1.0.0</p>
      </div>
    </div>
  );
};

export default MorePage;
