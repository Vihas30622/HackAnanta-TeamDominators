import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';

// Firebase configuration - these are public/publishable keys
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

// Validate config
const isConfigured: boolean = !!(firebaseConfig.apiKey && firebaseConfig.projectId);

// Initialize Firebase
const app = isConfigured ? initializeApp(firebaseConfig) : null;

// Initialize services
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const googleProvider = new GoogleAuthProvider();

// Initialize messaging (with async check for browser support)
let messagingInstance: ReturnType<typeof getMessaging> | null = null;

export const getMessagingInstance = async () => {
  if (!app) return null;
  
  const supported = await isSupported();
  if (!supported) {
    console.log('FCM not supported in this browser');
    return null;
  }
  
  if (!messagingInstance) {
    messagingInstance = getMessaging(app);
  }
  
  return messagingInstance;
};

// Helper to check if Firebase is configured
export const isFirebaseConfigured = () => isConfigured;

// Get VAPID key for FCM
export const getVapidKey = () => import.meta.env.VITE_FIREBASE_VAPID_KEY || '';

export default app;
