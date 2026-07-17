import { 
    FirestoreDataConverter, 
    QueryDocumentSnapshot, 
    WithFieldValue, 
    DocumentData 
} from "firebase-admin/firestore";
import { instanceToPlain, ClassConstructor } from "class-transformer";

export function createFirestoreConverter<TApp extends object>(
    AppClass: ClassConstructor<TApp>
): FirestoreDataConverter<TApp, DocumentData> {
    return {
        toFirestore(modelObject: TApp): WithFieldValue<DocumentData> {
            return instanceToPlain(modelObject, {
                strategy: 'excludeAll',
            });
        },

        fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>): TApp {
            const data = snapshot.data();
            const instance = Object.create(AppClass.prototype);

            instance._id = snapshot.id;

            Object.keys(data).forEach(key => {
                instance[`_${key}`] = data[key];
            });

            return instance;
        }
    };
}