import { 
    Firestore, 
    CollectionReference, 
    collection, 
    doc, 
    getDoc, 
    getDocs, 
    setDoc, 
    onSnapshot
} from "firebase/firestore";
import { createFirestoreConverter } from "./firestoreConverter.js";
import { ClassConstructor, instanceToPlain, plainToInstance } from "class-transformer";
import { ERROR_CODES } from "../../../errors/ErrorCodes.js";

export interface Identifiable {
    readonly id: string;
}

export class FirestoreRepository<T extends Identifiable> {
    private readonly documents: CollectionReference<T>;

    constructor(
        private readonly db: Firestore, 
        collectionName: string,
        private entityClass: ClassConstructor<T>
    ) {
        this.documents = collection(this.db, collectionName).withConverter(
            createFirestoreConverter(entityClass)
        ) as CollectionReference<T>;
    }

    public clone(entity: T): T {
        const plainData = instanceToPlain(entity);
        return plainToInstance(this.entityClass, plainData);
    }

    public subscribe(id: string, callback: (entity: T | null) => void): () => void {
        const docRef = doc(this.documents, id);
        
        return onSnapshot(docRef, (snapshot) => {
            callback(snapshot.exists() ? snapshot.data() : null);
        });
    }

    public async save(entity: T): Promise<void> {
        const docRef = doc(this.documents, entity.id);
        await setDoc(docRef, entity);
    }

    public async getAll(): Promise<T[]> {
        const querySnapshot = await getDocs(this.documents);
        return querySnapshot.docs.map(docSnap => docSnap.data());
    }

        public async getById(id: string): Promise<T | null> {
        if (!id || id.trim() === '') throw new Error(ERROR_CODES.F00);
    
        const docRef = doc(this.documents, id);
        const snapshot = await getDoc(docRef);
        
        if (!snapshot.exists()) throw new Error(ERROR_CODES.F01(id));
        return snapshot.data();
    }
}