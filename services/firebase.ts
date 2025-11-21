
import { initializeApp } from 'firebase/app';
import * as firebaseAuth from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Workaround for TS import errors: cast the module to any to access members
const { getAuth, GoogleAuthProvider } = firebaseAuth as any;

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD11z3r_sCHypxzwGtrmonTz9_5Xv-VJQw",
  authDomain: "commonsyouth.firebaseapp.com",
  projectId: "commonsyouth",
  storageBucket: "commonsyouth.firebasestorage.app",
  messagingSenderId: "1003978591288",
  appId: "1:1003978591288:web:6e751c922dc705f8fdaacd"
};

let app = null;
let auth = null;
let googleProvider = null;
let db = null;
let storage = null;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  db = getFirestore(app);
  storage = getStorage(app);
  console.log("Firebase initialized successfully with provided keys");
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

export { app, auth, googleProvider, db, storage };
    