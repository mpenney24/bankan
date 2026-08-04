import { 
    FirestoreDataConverter, 
    QueryDocumentSnapshot, 
    WithFieldValue, 
    DocumentData 
} from "firebase/firestore";
import { instanceToPlain, ClassConstructor, plainToInstance } from "class-transformer";
import { ZodType } from "zod";

export function createFirestoreConverter<TApp extends object>(
    AppClass?: ClassConstructor<TApp>,
    schema?: ZodType<TApp>
): FirestoreDataConverter<TApp, DocumentData> {
    return {
        toFirestore(modelObject: TApp): WithFieldValue<DocumentData> {
            if(schema) schema.parse(modelObject);
            if(AppClass) return instanceToPlain(modelObject, {
                strategy: 'excludeAll'
            });
            return modelObject;
        },
        fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>): TApp {
            if(schema) schema.parse(snapshot.data());
            if(AppClass) return plainToInstance(AppClass, snapshot.data()); 
            return snapshot.data() as TApp;
        }
    };
}