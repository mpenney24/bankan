import { DomainEventDispatcher } from "../../domain/events/DomainEventDispatcher.js";
import { DomainEvent } from "../../domain/events/DomainEvents.js";
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
        private readonly eventBus: DomainEventDispatcher,
        private readonly eventNameOrPrefix: string,
        private readonly entityRepo: FirestoreRepository<T>,
        private readonly summaryRepo: FirestoreRepository<IDomainSummary>
    ) {}

    public start(): void {
        this.unsubscribe = this.eventBus.register(this.eventNameOrPrefix, async (event) => {
            await this.handleDomainEvent(event);
        });
    }

    public stop(): void {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }
    }

    private async handleDomainEvent(event: DomainEvent): Promise<void> {
        const entity = await this.entityRepo.getById(event.getAggregateId());
        if (entity.isSuccess) {
            await this.recalculateSummary(entity.value);
        } else {
            console.log(ERROR_CODES.F01, entity.error);
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