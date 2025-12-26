import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellOff, X, AlertTriangle, Calendar, UtensilsCrossed, Bus, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  requestNotificationPermission, 
  getNotificationPermissionStatus,
  setupForegroundMessageListener,
  NotificationPayload,
  NotificationType
} from '@/lib/notifications';
import { toast } from 'sonner';

const notificationIcons: Record<NotificationType, React.ElementType> = {
  emergency: AlertTriangle,
  event: Calendar,
  canteen: UtensilsCrossed,
  transport: Bus,
  general: Info,
};

const notificationColors: Record<NotificationType, string> = {
  emergency: 'bg-destructive',
  event: 'bg-secondary',
  canteen: 'bg-success',
  transport: 'bg-primary',
  general: 'bg-muted',
};

const NotificationBanner: React.FC = () => {
  const { user } = useAuth();
  const [showBanner, setShowBanner] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | 'unsupported'>('default');
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    const status = getNotificationPermissionStatus();
    setPermissionStatus(status);

    // Show banner if permission not yet granted and user is logged in
    if (status === 'default' && user) {
      // Delay showing banner for better UX
      const timer = setTimeout(() => setShowBanner(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  useEffect(() => {
    // Setup foreground message listener
    if (permissionStatus === 'granted') {
      setupForegroundMessageListener((payload) => {
        const Icon = notificationIcons[payload.type];
        
        toast(payload.title, {
          description: payload.body,
          icon: <Icon className="w-5 h-5" />,
          duration: 5000,
          action: payload.type === 'emergency' ? {
            label: 'View',
            onClick: () => window.location.href = '/emergency',
          } : undefined,
        });
      });
    }
  }, [permissionStatus]);

  const handleEnableNotifications = async () => {
    setIsRequesting(true);
    
    try {
      const token = await requestNotificationPermission(user?.id);
      
      if (token) {
        setPermissionStatus('granted');
        setShowBanner(false);
        toast.success('Notifications enabled!', {
          description: "You'll receive alerts for emergencies, events, and orders.",
        });
      } else {
        toast.error('Could not enable notifications', {
          description: 'Please check your browser settings.',
        });
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
      toast.error('Failed to enable notifications');
    } finally {
      setIsRequesting(false);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('notification_banner_dismissed', Date.now().toString());
  };

  if (permissionStatus === 'unsupported' || permissionStatus === 'granted') {
    return null;
  }

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50 p-4 safe-area-top"
        >
          <div className="glass-card p-4 mx-auto max-w-md">
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-secondary">
                <Bell className="w-5 h-5 text-secondary-foreground" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Stay Updated</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Get notified about emergencies, events, and your canteen orders.
                </p>
                
                <div className="flex gap-2 mt-3">
                  <Button
                    onClick={handleEnableNotifications}
                    disabled={isRequesting}
                    size="sm"
                    className="gradient-primary"
                  >
                    {isRequesting ? 'Enabling...' : 'Enable Notifications'}
                  </Button>
                  <Button
                    onClick={handleDismiss}
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                  >
                    Later
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationBanner;
