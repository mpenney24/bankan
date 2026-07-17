import { 
    FirestoreDataConverter, 
    QueryDocumentSnapshot, 
    WithFieldValue, 
    DocumentData 
} from "firebase-admin/firestore";
import { instanceToPlain, ClassConstructor, plainToInstance } from "class-transformer";

export function createFirestoreConverter<TApp extends object>(
    AppClass: ClassConstructor<TApp>
): FirestoreDataConverter<TApp, DocumentData> {
    return {
        toFirestore(modelObject: TApp): WithFieldValue<DocumentData> {
            return instanceToPlain(modelObject, {
                strategy: 'excludeAll'
            });
        },
        fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>): TApp {
            return plainToInstance(AppClass, snapshot.data());
        }
    };
}