import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// Type for Firebase config object
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
};

// Debug: Check if config values are loaded
console.log('Firebase Config Check:', {
  apiKey: !!firebaseConfig.apiKey,
  authDomain: !!firebaseConfig.authDomain,
  projectId: !!firebaseConfig.projectId,
});

// Only initialize if we have the required config
if (!firebaseConfig.apiKey) {
  console.error('Firebase configuration is missing. Check environment variables.');
  throw new Error('Firebase configuration is incomplete');
}

// Initialize Firebase app
const app: FirebaseApp = initializeApp(firebaseConfig);

// Auth
export const auth: Auth = getAuth(app);
export const provider: GoogleAuthProvider = new GoogleAuthProvider();

// Firestore DB
export const db: Firestore = getFirestore(app);
