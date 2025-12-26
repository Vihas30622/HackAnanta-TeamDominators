import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, BellRing, AlertTriangle, Calendar, UtensilsCrossed, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  requestNotificationPermission, 
  getNotificationPermissionStatus,
  showLocalNotification
} from '@/lib/notifications';
import { toast } from 'sonner';

const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const [permissionStatus, setPermissionStatus] = React.useState(getNotificationPermissionStatus());
  const [isRequesting, setIsRequesting] = React.useState(false);

  const handleEnableNotifications = async () => {
    setIsRequesting(true);
    try {
      const token = await requestNotificationPermission(user?.id);
      if (token) {
        setPermissionStatus('granted');
        toast.success('Notifications enabled!');
      }
    } catch (error) {
      toast.error('Failed to enable notifications');
    } finally {
      setIsRequesting(false);
    }
  };

  const sendTestNotification = (type: 'emergency' | 'event' | 'canteen') => {
    const notifications = {
      emergency: {
        title: '🚨 Emergency Alert',
        body: 'This is a test emergency notification from CampusOS.',
      },
      event: {
        title: '📅 New Event',
        body: 'Tech Fest 2024 registrations are now open!',
      },
      canteen: {
        title: '🍽️ Order Ready',
        body: 'Your order #1234 is ready for pickup.',
      },
    };

    showLocalNotification({
      ...notifications[type],
      type,
    });

    toast.success('Test notification sent!', {
      description: 'Check your notification center.',
    });
  };

  const notificationTypes = [
    {
      icon: AlertTriangle,
      title: 'Emergency Alerts',
      description: 'Critical safety notifications and SOS alerts',
      color: 'bg-destructive',
    },
    {
      icon: Calendar,
      title: 'Event Updates',
      description: 'New events, reminders, and registration confirmations',
      color: 'bg-secondary',
    },
    {
      icon: UtensilsCrossed,
      title: 'Canteen Orders',
      description: 'Order confirmations and pickup notifications',
      color: 'bg-success',
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="px-4 pt-4 pb-4 safe-area-top">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 -ml-2 rounded-xl hover:bg-card transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">Notifications</h1>
            <p className="text-sm text-muted-foreground">Manage your alerts</p>
          </div>
        </div>
      </header>

      {/* Permission Status */}
      <div className="px-4 mb-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`glass-card p-4 ${
            permissionStatus === 'granted' 
              ? 'bg-success/10 border-success/30' 
              : 'bg-warning/10 border-warning/30'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${
              permissionStatus === 'granted' ? 'bg-success' : 'bg-warning'
            }`}>
              {permissionStatus === 'granted' ? (
                <BellRing className="w-5 h-5 text-success-foreground" />
              ) : (
                <Bell className="w-5 h-5 text-warning-foreground" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">
                {permissionStatus === 'granted' 
                  ? 'Notifications Enabled' 
                  : 'Enable Notifications'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {permissionStatus === 'granted'
                  ? "You'll receive important alerts"
                  : 'Stay updated with campus alerts'}
              </p>
            </div>
            {permissionStatus !== 'granted' && (
              <Button
                onClick={handleEnableNotifications}
                disabled={isRequesting}
                size="sm"
                className="gradient-primary"
              >
                {isRequesting ? 'Enabling...' : 'Enable'}
              </Button>
            )}
            {permissionStatus === 'granted' && (
              <Check className="w-6 h-6 text-success" />
            )}
          </div>
        </motion.div>
      </div>

      {/* Notification Types */}
      <div className="px-4 mb-6">
        <h2 className="text-sm font-medium text-muted-foreground mb-3">Notification Types</h2>
        <div className="space-y-3">
          {notificationTypes.map((type, index) => (
            <motion.div
              key={type.title}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="module-card"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${type.color}`}>
                  <type.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{type.title}</h3>
                  <p className="text-xs text-muted-foreground">{type.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Test Notifications */}
      {permissionStatus === 'granted' && (
        <div className="px-4">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Test Notifications</h2>
          <div className="glass-card p-4">
            <p className="text-sm text-muted-foreground mb-4">
              Send test notifications to verify everything works correctly.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => sendTestNotification('emergency')}
                className="text-destructive border-destructive/30"
              >
                <AlertTriangle className="w-4 h-4 mr-1" />
                Emergency
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => sendTestNotification('event')}
                className="text-secondary border-secondary/30"
              >
                <Calendar className="w-4 h-4 mr-1" />
                Event
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => sendTestNotification('canteen')}
                className="text-success border-success/30"
              >
                <UtensilsCrossed className="w-4 h-4 mr-1" />
                Canteen
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Permission Denied Info */}
      {permissionStatus === 'denied' && (
        <div className="px-4">
          <div className="glass-card p-4 bg-destructive/10 border-destructive/30">
            <h3 className="font-medium text-foreground mb-2">Notifications Blocked</h3>
            <p className="text-sm text-muted-foreground">
              You've blocked notifications for this site. To enable them:
            </p>
            <ol className="text-sm text-muted-foreground mt-2 space-y-1 list-decimal list-inside">
              <li>Click the lock icon in your browser's address bar</li>
              <li>Find "Notifications" in the permissions</li>
              <li>Change it from "Block" to "Allow"</li>
              <li>Refresh this page</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
