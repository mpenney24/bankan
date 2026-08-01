import { 
    FirestoreDataConverter, 
    QueryDocumentSnapshot, 
    WithFieldValue, 
    DocumentData 
} from "firebase/firestore";
import { instanceToPlain, ClassConstructor, plainToInstance } from "class-transformer";
import { ZodType } from "zod";

export function createFirestoreConverter<TApp extends object>(
    AppClass: ClassConstructor<TApp>,
    schema: ZodType<TApp>
): FirestoreDataConverter<TApp, DocumentData> {
    return {
        toFirestore(modelObject: TApp): WithFieldValue<DocumentData> {
            schema.parse(modelObject);
            return instanceToPlain(modelObject, {
                strategy: 'excludeAll'
            });
        },
        fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>): TApp {
            schema.parse(snapshot.data());
            return plainToInstance(AppClass, snapshot.data());
        }
    };
}