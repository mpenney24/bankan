import { 
    Firestore, 
    CollectionReference, 
    collection, 
    doc, 
    getDoc, 
    getDocs, 
    setDoc 
} from "firebase/firestore";
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
        this.documents = collection(this.db, collectionName).withConverter(
            createFirestoreConverter(entityClass)
        ) as CollectionReference<T>;
    }

    public async getById(id: string): Promise<T | null> {
        // Mitch - add these to Errors.ts
        if (!id || id.trim() === "") throw new Error("Invalid document ID: ID cannot be empty");
    
        const docRef = doc(this.documents, id);
        const snapshot = await getDoc(docRef);
        
        if (!snapshot.exists()) throw new Error("Invalid document ID: Document could not be found");
        return snapshot.data();
    }

    public async save(entity: T): Promise<void> {
        const docRef = doc(this.documents, entity.id);
        await setDoc(docRef, entity);
    }

    public async getAll(): Promise<T[]> {
        const querySnapshot = await getDocs(this.documents);
        return querySnapshot.docs.map(docSnap => docSnap.data());
    }
}