import { DomainEvent } from "./DomainEvents.js";

export type DomainEventHandler = (event: DomainEvent) => Promise<void> | void;

export interface DomainEventDispatcher {
    register(eventNameOrPrefix: string, handler: DomainEventHandler): () => void, 
    dispatch(events: DomainEvent[]): Promise<void>;
}

export class InMemoryEventDispatcher implements DomainEventDispatcher {
    private handlers = new Map<string, DomainEventHandler[]>();

    public register(eventNameOrPrefix: string, handler: DomainEventHandler): () => void {
        const handlers = this.handlers.get(eventNameOrPrefix) || [];
        this.handlers.set(eventNameOrPrefix, [...handlers, handler]);

        return () => {
            this.handlers.clear();
        }
    }

    public async dispatch(events: DomainEvent[]): Promise<void> {
        for (const event of events) {
            const eventName = event.constructor.name;

            for (const [eventNameOrPrefix, handlers] of this.handlers.entries()) {

                if (eventName.startsWith(eventNameOrPrefix)) {
                    for (const handler of handlers) {
                        await handler(event);
                    }
                }
            }
        }
    }
}