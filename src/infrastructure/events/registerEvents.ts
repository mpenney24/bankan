import { InMemoryEventDispatcher } from '../../domain/events/DomainEventDispatcher.js';
import { TicketAddedEvent, TicketMovedEvent } from '../../domain/events/DomainEvents.js';

export const registerDomainEvents = (eventDispatcher: InMemoryEventDispatcher): void => {
    eventDispatcher.register(TicketMovedEvent.name, async (event) => {
        console.log('Ticket moved side effect triggered:', event);
    });

    eventDispatcher.register(TicketAddedEvent.name, async (event) => {
        console.log('Ticket added side effect triggered:', event);
    });
};