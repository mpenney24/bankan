import { BoardId, ColumnId, TicketId } from "../common/Types.js";

export interface DomainEvent {
    readonly dateTimeOccurred: Date;
    getAggregateId(): string;
}

export interface DomainEventProducer {
    getDomainEvents(): DomainEvent[];
    clearDomainEvents(): void;
}

export interface ITicketEventPayload {
    boardId: BoardId;
    ticketId: TicketId;
}

export class TicketAddedEvent implements DomainEvent {
    public readonly dateTimeOccurred = new Date();

    constructor(public readonly payload: ITicketEventPayload) {}

    public getAggregateId(): string {
        return this.payload.boardId;
    }

    public static create(payload: ITicketEventPayload) {
        return new TicketAddedEvent(payload);
    }
}

export class TicketMovedEvent implements DomainEvent {
    public readonly dateTimeOccurred = new Date();

    constructor(
        public readonly payload: ITicketEventPayload,
        public readonly targetColumnId: ColumnId
    ) {}

    public getAggregateId(): string {
        return this.payload.boardId;
    }

    public static create(payload: ITicketEventPayload, targetColumnId: ColumnId) {
        return new TicketMovedEvent(payload, targetColumnId);
    }
}