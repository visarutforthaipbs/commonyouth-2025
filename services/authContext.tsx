
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { auth, googleProvider, db } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Environment configuration
const USE_MOCK_AUTH = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_AUTH === 'true';

// Mock User Data for Fallback (only available in development)
const ADMIN_EMAILS = ['demo@commonsyouth.org', 'admin@commonsyouth.org', 'visarut298@gmail.com', 'jirasak.sek@gmail.com'];

const MOCK_USER: User = {
  uid: 'mock-user-123',
  email: 'demo@commonsyouth.org',
  name: 'Admin User (Demo)',
  profileImage: 'https://ui-avatars.com/api/?name=Commons+Youth&background=7AA874&color=fff',
  bio: 'ผู้ดูแลระบบ (Admin Account)',
  role: 'admin'
};

interface AuthContextType {
  user: User | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  updateUserProfile: (name: string, bio: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // REAL FIREBASE MODE
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: any) => {
        if (firebaseUser) {
          // Force token refresh to get latest custom claims
          const idTokenResult = await firebaseUser.getIdTokenResult();
          
          // 1. Basic info from Google Auth with custom claims for role
          let userProfile: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || 'User',
            profileImage: firebaseUser.photoURL || undefined,
            bio: '',
            // Use custom claim if available, fallback to email check for compatibility
            role: idTokenResult.claims.admin === true ? 'admin' : 
                  (firebaseUser.email && ADMIN_EMAILS.includes(firebaseUser.email)) ? 'admin' : 'user'
          };

          // 2. Fetch extended info (Bio) from Firestore if available
          if (db) {
            try {
              const userDocRef = doc(db, 'users', firebaseUser.uid);
              const userSnapshot = await getDoc(userDocRef);
              
              if (userSnapshot.exists()) {
                const data = userSnapshot.data();
                // Merge Firestore data (like bio, or updated name) with Auth data
                userProfile = { ...userProfile, ...data };
              }
            } catch (e) {
              console.error("Error fetching user profile from Firestore:", e);
            }
          }

          setUser(userProfile);
        } else {
          setUser(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } 
    
    // MOCK MODE (only in development with explicit flag)
    else if (USE_MOCK_AUTH) {
      const storedUser = localStorage.getItem('cyp_mock_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    } else {
      // No auth available and mock disabled
      setLoading(false);
    }
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    
    if (auth && googleProvider) {
      try {
        await signInWithPopup(auth, googleProvider);
      } catch (error: any) {
        console.error("Login failed", error);
        
        // Handle Domain Error specifically to help the user
        if (error.code === 'auth/unauthorized-domain') {
          const currentDomain = window.location.hostname;
          alert(
            `Access Blocked by Firebase.\n\n` +
            `The domain "${currentDomain}" is not authorized.\n\n` +
            `Please go to Firebase Console > Authentication > Settings > Authorized Domains.\n` +
            `Add this domain to the list.`
          );
        } else {
          alert(`Login failed: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    } else {
      // Mock Login Fallback (only in development)
      if (!USE_MOCK_AUTH) {
        throw new Error('Mock authentication is disabled. Please configure Firebase or enable VITE_USE_MOCK_AUTH in development.');
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser(MOCK_USER);
      localStorage.setItem('cyp_mock_user', JSON.stringify(MOCK_USER));
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    
    if (auth) {
      await signOut(auth);
    } else if (USE_MOCK_AUTH) {
      // Mock Logout (only in development)
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(null);
      localStorage.removeItem('cyp_mock_user');
    }
    setLoading(false);
  };

  const updateUserProfile = async (name: string, bio: string) => {
    if (!user) return;

    // Optimistic UI Update
    const updatedUser = { ...user, name, bio };
    setUser(updatedUser);

    if (auth && db) {
      try {
         const userDocRef = doc(db, 'users', user.uid);
         // Merge: true ensures we don't overwrite existing fields if we add more later
         await setDoc(userDocRef, { 
           name, 
           bio, 
           email: user.email, 
           profileImage: user.profileImage 
         }, { merge: true });
         console.log("User profile updated in Firestore");
      } catch (e) {
        console.error("Error updating profile in Firestore", e);
        alert("Failed to save profile to database (Local update only).");
      }
    } else {
      // Mock Persistence
      localStorage.setItem('cyp_mock_user', JSON.stringify(updatedUser));
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, logout, loading, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
