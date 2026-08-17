import {
    DomainEventDispatcher,
    DomainEventProducer,
    ERROR_CODES,
    Identifiable,
    IFirestoreRepository,
    Result,
} from '@bankan/domain';

export const persistAndDispatch = async <T extends Identifiable & DomainEventProducer>(
    repo: IFirestoreRepository<T>,
    eventDispatcher: DomainEventDispatcher,
    entity: T
): Promise<Result<void>> => {
    // Mitch - uncomment for testing optimistic updates!
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    // throw new Error("Simulated network failure");

    const result = await repo.save(entity);
    if (result.isFailure) {
        console.error(ERROR_CODES.UIB01, result.error);
        return Result.fail('A network error occurred while saving. Please try again.');
    }

    const events = entity.getDomainEvents();
    if (events.length > 0) {
        entity.clearDomainEvents();
        await eventDispatcher.dispatch(events);
    }

    return Result.ok();
};
