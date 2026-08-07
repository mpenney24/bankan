import { InMemoryEventDispatcher } from './DomainEventDispatcher.js';

export const registerDomainEvents = (eventDispatcher: InMemoryEventDispatcher): void => {
    eventDispatcher.register('Ticket', async (event) => {
        console.log(`${event.constructor.name} side effect triggered:`, event);
    });
};
