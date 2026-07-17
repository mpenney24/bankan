import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let db: Firestore;

export function getFirestoreDb(): Firestore {
    if (db) return db;

    if (getApps().length === 0) {
        const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
        
        if (!serviceAccountPath) {
            throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_PATH environment variable");
        }

        initializeApp({
            credential: cert(serviceAccountPath)
        });
    }

    db = getFirestore();
    db.settings({ ignoreUndefinedProperties: true });
    
    return db;
}