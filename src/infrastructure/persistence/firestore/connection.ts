import { initializeApp, getApps } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

let db: Firestore;

export function getFirestoreDb(): Firestore {
    if (db) return db;

    const env = (typeof import.meta !== 'undefined' && (import.meta as any).env) || process.env;

    if (getApps().length === 0) {
        initializeApp({
            apiKey: env.VITE_FIREBASE_API_KEY,
            authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
            projectId: env.VITE_FIREBASE_PROJECT_ID,
            storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
            appId: env.VITE_FIREBASE_APP_ID,
        });
    }

    db = getFirestore();
    
    return db;
}