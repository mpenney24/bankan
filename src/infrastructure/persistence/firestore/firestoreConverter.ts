import { 
    FirestoreDataConverter, 
    QueryDocumentSnapshot, 
    WithFieldValue, 
    DocumentData 
} from "firebase/firestore";
import { instanceToPlain, ClassConstructor, plainToInstance } from "class-transformer";

export function createFirestoreConverter<TApp extends object>(
    AppClass: ClassConstructor<TApp>
): FirestoreDataConverter<TApp, DocumentData> {
    return {
        toFirestore(modelObject: TApp): WithFieldValue<DocumentData> {
            return instanceToPlain(modelObject, {
                strategy: 'excludeAll',
                // Mitch - delete here if tests don't make a difference?
                exposeUnsetFields: false
            });
        },
        fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>): TApp {
            return plainToInstance(AppClass, snapshot.data());
        }
    };
}