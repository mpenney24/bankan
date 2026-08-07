import { DomainEvent, DomainEventProducer } from './DomainEvents.js';

export abstract class DomainEventAggregateRoot implements DomainEventProducer {
    abstract readonly id: string;
    private _domainEvents: DomainEvent[] = [];

    protected addDomainEvent(event: DomainEvent): void {
        this._domainEvents.push(event);
    }

    public getDomainEvents(): DomainEvent[] {
        return [...this._domainEvents];
    }

    public clearDomainEvents(): void {
        this._domainEvents = [];
    }

    static isAggregateRoot(entity: any): entity is DomainEventProducer {
        return entity && entity instanceof DomainEventAggregateRoot;
    }
}
