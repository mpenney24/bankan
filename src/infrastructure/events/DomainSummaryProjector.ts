import { Result } from "../../domain/common/Result.js";
import { FirestoreRepository, Identifiable } from "../persistence/firestore/FirestoreRepository.js";

export interface IDomainSummary {
    readonly id: string;
    readonly updatedAt: string;
}

export interface IDomainSummaryProjector {
    start(): void;
    stop(): void;
    upsertSummary(summary: IDomainSummary): void;
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

    public async upsertSummary(summary: IDomainSummary): Promise<Result<void>> {
        return this.summaryRepo.save(summary);
    }

    protected abstract recalculateSummary(entity: T): Promise<void>;

}