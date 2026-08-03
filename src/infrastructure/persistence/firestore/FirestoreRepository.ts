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
import { ClassConstructor } from "class-transformer";
import { ERROR_CODES } from "../../../errors/ErrorCodes.js";
import { ZodType } from "zod";
import { Result } from "../../../domain/common/Result.js";

export interface Identifiable {
    readonly id: string;
}

export type EntitySubscriptionCallback<T> = (entity: T | null) => void;

export class FirestoreRepository<T extends Identifiable> {
    private readonly documents: CollectionReference<T>;

    constructor(
        private readonly db: Firestore, 
        collectionName: string,
        entityClass: ClassConstructor<T>,
        entitySchema: ZodType<any>
    ) {
        this.documents = collection(this.db, collectionName).withConverter(
            createFirestoreConverter(entityClass, entitySchema)
        ) as CollectionReference<T>;
    }

    public subscribe(id: string, callback: EntitySubscriptionCallback<T>) {
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

    public async getById(id: string): Promise<Result<T>> {
        if (!id || id.trim() === '') throw new Error(ERROR_CODES.F00);
    
        const docRef = doc(this.documents, id);
        const snapshot = await getDoc(docRef);
        
        if (!snapshot.exists()) return Result.fail(ERROR_CODES.F01(id));
        return Result.ok(snapshot.data());
    }
}