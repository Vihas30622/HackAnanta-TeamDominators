import { getToken, onMessage, Messaging } from 'firebase/messaging';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getMessagingInstance, getVapidKey, db } from '@/lib/firebase';

export type NotificationType = 'emergency' | 'event' | 'canteen' | 'transport' | 'general';

export interface NotificationPayload {
  title: string;
  body: string;
  type: NotificationType;
  data?: Record<string, string>;
}

// Request notification permission and get FCM token
export const requestNotificationPermission = async (userId?: string): Promise<string | null> => {
  try {
    // Check if notifications are supported
    if (!('Notification' in window)) {
      console.log('Notifications not supported');
      return null;
    }

    // Request permission
    const permission = await Notification.requestPermission();
    
    if (permission !== 'granted') {
      console.log('Notification permission denied');
      return null;
    }

    // Get messaging instance
    const messaging = await getMessagingInstance();
    if (!messaging) {
      console.log('FCM not available');
      return null;
    }

    // Register service worker
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    console.log('Service Worker registered:', registration);

    // Get FCM token
    const vapidKey = getVapidKey();
    if (!vapidKey) {
      console.warn('VAPID key not configured');
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registration,
    });

    if (token) {
      console.log('FCM Token:', token);
      
      // Save token to Firestore if user is logged in
      if (userId && db) {
        await saveTokenToFirestore(userId, token);
      }
      
      return token;
    }

    return null;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};

// Save FCM token to Firestore
const saveTokenToFirestore = async (userId: string, token: string) => {
  if (!db) return;

  try {
    const tokenRef = doc(db, 'fcm_tokens', userId);
    await setDoc(tokenRef, {
      token,
      userId,
      updatedAt: serverTimestamp(),
      platform: 'web',
      userAgent: navigator.userAgent,
    }, { merge: true });
    
    console.log('FCM token saved to Firestore');
  } catch (error) {
    console.error('Error saving FCM token:', error);
  }
};

// Listen for foreground messages
export const setupForegroundMessageListener = async (
  onMessageReceived: (payload: NotificationPayload) => void
) => {
  const messaging = await getMessagingInstance();
  if (!messaging) return null;

  return onMessage(messaging, (payload) => {
    console.log('Foreground message received:', payload);
    
    const notification: NotificationPayload = {
      title: payload.notification?.title || 'CampusOS',
      body: payload.notification?.body || '',
      type: (payload.data?.type as NotificationType) || 'general',
      data: payload.data,
    };

    onMessageReceived(notification);
  });
};

// Check notification permission status
export const getNotificationPermissionStatus = (): NotificationPermission | 'unsupported' => {
  if (!('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
};

// Create a local notification (for testing/demos)
export const showLocalNotification = (payload: NotificationPayload) => {
  if (Notification.permission !== 'granted') {
    console.log('Notification permission not granted');
    return;
  }

  const notification = new Notification(payload.title, {
    body: payload.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    tag: payload.type,
    data: payload.data,
  });

  notification.onclick = () => {
    window.focus();
    notification.close();
  };
};
