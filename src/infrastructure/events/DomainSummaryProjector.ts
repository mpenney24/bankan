import { ERROR_CODES } from "../../errors/ErrorCodes.js";
import { FirestoreRepository, Identifiable } from "../persistence/firestore/FirestoreRepository.js";

export interface IDomainSummary {
    readonly id: string;
    readonly updatedAt: string;
}

export interface IDomainSummaryProjector {
    start(): void;
    stop(): void;
    upsertSummary(summary: IDomainSummary): Promise<void>;
}

export abstract class DomainSummaryProjector<T extends Identifiable> implements IDomainSummaryProjector {
    private unsubscribe: (() => void) | null = null;

    constructor(
        private readonly entityRepo: FirestoreRepository<T>,
        private readonly summaryRepo: FirestoreRepository<IDomainSummary>
    ) {}

    public start(): void {
        this.unsubscribe = this.entityRepo.subscribeAllChanges((changes) => {
            if(!changes) return;

            changes.forEach(async (entity) => {
                await this.recalculateSummary(entity);
            });
        });
    }

    public stop(): void {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }
    }

    public async upsertSummary(summary: IDomainSummary): Promise<void> {
        try {
            this.summaryRepo.save(summary);
        } catch(error) {
            console.log(ERROR_CODES.F02, error);
        }
    }

    protected abstract recalculateSummary(entity: T): Promise<void>;

}