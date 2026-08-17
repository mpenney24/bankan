import { Result } from '../../common/Result';

export interface Identifiable {
    readonly id: string;
    version?: number;
}

export type EntitySubscriptionCallback<T> = (entity: T | null) => void;

export interface IFirestoreRepository<T extends Identifiable> {
    subscribe(id: string, callback: EntitySubscriptionCallback<T>): void;
    save(entity: T): Promise<Result<void>>;
    getAll(): Promise<T[]>;
    getById(id: string): Promise<Result<T>>;
}
