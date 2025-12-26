import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User as FirebaseUser,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider, isFirebaseConfigured } from '@/lib/firebase';
import { toast } from 'sonner';

export type UserRole = 'student' | 'food_admin' | 'resource_admin' | 'super_admin';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isConfigured: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  setUserRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isConfigured = isFirebaseConfigured();

  // Fetch or create user profile in Firestore
  const fetchOrCreateUserProfile = async (fbUser: FirebaseUser): Promise<User> => {
    if (!db) {
      // Fallback when Firestore not available
      return {
        id: fbUser.uid,
        name: fbUser.displayName || 'Student',
        email: fbUser.email || '',
        avatar: fbUser.photoURL || undefined,
        role: 'student',
      };
    }

    const userRef = doc(db, 'users', fbUser.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        id: fbUser.uid,
        name: data.name || fbUser.displayName || 'Student',
        email: data.email || fbUser.email || '',
        avatar: data.avatar || fbUser.photoURL || undefined,
        role: data.role || 'student',
      };
    } else {
      // Create new user profile
      const newUser: User = {
        id: fbUser.uid,
        name: fbUser.displayName || 'Student',
        email: fbUser.email || '',
        avatar: fbUser.photoURL || undefined,
        role: 'student',
      };

      await setDoc(userRef, {
        ...newUser,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return newUser;
    }
  };

  useEffect(() => {
    if (!auth) {
      // Firebase not configured - use mock auth
      const savedUser = localStorage.getItem('campusos_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setIsLoading(false);
      return;
    }

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      
      if (fbUser) {
        try {
          const userProfile = await fetchOrCreateUserProfile(fbUser);
          setUser(userProfile);
          localStorage.setItem('campusos_user', JSON.stringify(userProfile));
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Fallback to basic user info
          setUser({
            id: fbUser.uid,
            name: fbUser.displayName || 'Student',
            email: fbUser.email || '',
            avatar: fbUser.photoURL || undefined,
            role: 'student',
          });
        }
      } else {
        setUser(null);
        localStorage.removeItem('campusos_user');
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    if (!auth) {
      // Mock login when Firebase not configured
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        name: 'Demo Student',
        email: 'demo@campus.edu',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
        role: 'student'
      };
      
      setUser(mockUser);
      localStorage.setItem('campusos_user', JSON.stringify(mockUser));
      setIsLoading(false);
      toast.info('Running in demo mode. Configure Firebase for real authentication.');
      return;
    }

    try {
      setIsLoading(true);
      await signInWithPopup(auth, googleProvider);
      toast.success('Signed in successfully!');
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Sign-in cancelled');
      } else if (error.code === 'auth/popup-blocked') {
        toast.error('Popup blocked. Please allow popups for this site.');
      } else {
        toast.error('Failed to sign in. Please try again.');
      }
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (auth) {
      try {
        await signOut(auth);
        toast.success('Signed out successfully');
      } catch (error) {
        console.error('Logout error:', error);
        toast.error('Failed to sign out');
      }
    } else {
      // Mock logout
      setUser(null);
      localStorage.removeItem('campusos_user');
    }
  };

  const setUserRole = async (role: UserRole) => {
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      localStorage.setItem('campusos_user', JSON.stringify(updatedUser));

      // Update in Firestore if available
      if (db && firebaseUser) {
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          await setDoc(userRef, { role, updatedAt: serverTimestamp() }, { merge: true });
        } catch (error) {
          console.error('Error updating role:', error);
        }
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      firebaseUser,
      isLoading,
      isAuthenticated: !!user,
      isConfigured,
      login,
      logout,
      setUserRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};
