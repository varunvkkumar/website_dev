// src/services/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

// ⚠️ IMPORTANT: Replace this with your actual Firebase configuration
// Follow the instructions in FIREBASE_SETUP_INSTRUCTIONS.md to get your config
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// Check if Firebase is configured
const isFirebaseConfigured = firebaseConfig.apiKey !== "your-api-key-here";

if (!isFirebaseConfigured) {
  console.error(`
🔥 FIREBASE SETUP REQUIRED 🔥

Please follow these steps:
1. Go to https://console.firebase.google.com/
2. Create a new project
3. Enable Authentication (Email/Password and Google)
4. Get your web app configuration
5. Replace the firebaseConfig object above with your actual configuration

See FIREBASE_SETUP_INSTRUCTIONS.md for detailed instructions.
  `);
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Auth functions
export const signUpWithEmail = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signInWithEmail = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

export const logout = () => {
  return signOut(auth);
};

export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export default app; 