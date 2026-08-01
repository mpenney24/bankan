import { DomainEvent } from "./DomainEvents.js";

export type DomainEventHandler = (event: DomainEvent) => Promise<void> | void;

export interface DomainEventDispatcher {
    dispatch(events: DomainEvent[]): Promise<void>;
}

export class InMemoryEventDispatcher implements DomainEventDispatcher {
    private handlers = new Map<string, DomainEventHandler[]>();

    public register(eventName: string, handler: DomainEventHandler): void {
        const handlers = this.handlers.get(eventName) || [];
        this.handlers.set(eventName, [...handlers, handler]);
    }

    public async dispatch(events: DomainEvent[]): Promise<void> {
        for (const event of events) {
            const eventName = event.constructor.name;
            const eventHandlers = this.handlers.get(eventName) || [];

            for (const handler of eventHandlers) {
                await handler(event);
            }
        }
    }
}