import { Result } from "../../domain/common/Result.js";
import { DomainEventDispatcher } from "../../domain/events/DomainEventDispatcher.js";
import { DomainEventProducer } from "../../domain/events/DomainEvents.js";
import { ERROR_CODES } from "../../errors/ErrorCodes.js";
import { FirestoreRepository, Identifiable } from "./firestore/FirestoreRepository.js";

export const persistAndDispatch = async<T extends Identifiable & DomainEventProducer> (
    repo: FirestoreRepository<T>, 
    eventDispatcher: DomainEventDispatcher, 
    entity: T
): Promise<Result<void>> => {
        // Mitch - for testing optimistic updates!
        // await new Promise((resolve) => setTimeout(resolve, 1000));
        // throw new Error("Simulated network failure");

        const result = await repo.save(entity);
        if(result.isFailure) {
            console.error(ERROR_CODES.UIB01, result.error);
            return Result.fail("A network error occurred while saving. Please try again.");
        }

        const events = entity.getDomainEvents();
        if (events.length > 0) {
            entity.clearDomainEvents();
            await eventDispatcher.dispatch(events);
        }

        return Result.ok();
    }