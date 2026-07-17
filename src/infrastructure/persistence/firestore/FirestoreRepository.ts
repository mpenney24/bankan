import { Firestore, CollectionReference, WriteResult } from "firebase-admin/firestore";
import { createFirestoreConverter } from "./firestoreConverter.js";
import { ClassConstructor } from "class-transformer";

export interface Identifiable {
    readonly id: string;
}

export class FirestoreRepository<T extends Identifiable> {
    private readonly documents: CollectionReference<T>;

    constructor(
        private readonly db: Firestore, 
        collectionName: string,
        entityClass: ClassConstructor<T>
    ) {
        this.documents = this.db
            .collection(collectionName)
            .withConverter(createFirestoreConverter(entityClass));
    }

    public async getById(id: string): Promise<T | null> {
        const docRef = this.documents.doc(id);
        const snapshot = await docRef.get();
        if (!snapshot.exists) return null;
        return snapshot.data()!;
    }

    public async save(entity: T): Promise<WriteResult> {
        const docRef = this.documents.doc(entity.id);
        return await docRef.set(entity);
    }

    public async getAll(): Promise<T[]> {
        const querySnapshot = await this.documents.get();
        return querySnapshot.docs.map(doc => doc.data());
    }
}