
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { auth, googleProvider, db } from './firebase';
// Fix for "Module 'firebase/auth' has no exported member" error by importing namespace and casting
import * as firebaseAuth from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const { signInWithPopup, signOut, onAuthStateChanged } = firebaseAuth as any;

// Mock User Data for Fallback
const MOCK_USER: User = {
  uid: 'mock-user-123',
  email: 'demo@commonsyouth.org',
  name: 'นักกิจกรรม เยาวชน (Demo)',
  profileImage: 'https://ui-avatars.com/api/?name=Commons+Youth&background=7AA874&color=fff',
  bio: 'บัญชีทดลองใช้งาน (Mock Account)'
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
          // 1. Basic info from Google Auth
          let userProfile: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || 'User',
            profileImage: firebaseUser.photoURL || undefined,
            bio: ''
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
    
    // MOCK MODE
    else {
      const storedUser = localStorage.getItem('cyp_mock_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
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
      // Mock Login Fallback
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
    } else {
      // Mock Logout
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
