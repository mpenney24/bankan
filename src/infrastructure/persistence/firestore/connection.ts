import { getApps, initializeApp } from 'firebase/app';
import { connectFirestoreEmulator, Firestore, getFirestore } from 'firebase/firestore';

let db: Firestore;
let isEmulatorConnected = false;

export function getFirestoreDb(): Firestore {
    if (db) return db;

    const env =
        (typeof import.meta !== 'undefined' && (import.meta as any).env) ||
        (typeof process !== 'undefined' && process.env) ||
        {};

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

    const useEmulator = env.VITE_USE_EMULATOR === 'true' || env.MODE === 'test';

    if (useEmulator && !isEmulatorConnected) {
        try {
            connectFirestoreEmulator(db, 'localhost', 8080);
            isEmulatorConnected = true;
            console.log('🔌 Connected to local Firestore Emulator');
        } catch {
            console.log(
                'Already connected to Firestore Emulator - skipping hot-reload error'
            );
        }
    }

    return db;
}
