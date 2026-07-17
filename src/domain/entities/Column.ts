import { Exclude, Expose } from "class-transformer";
import { Ticket } from "./Ticket.js";

// DDD - Entity
export class Column {
    @Exclude() private readonly _tickets: Map<string, Ticket> = new Map();

    constructor(
        private readonly _id: string,
        private readonly _stateId: string,
        private readonly _displayName: string,
        private readonly _prevColumn: string | null,
        private readonly _nextColumn: string | null
    ) {}

    @Exclude() get id(): string { return this._id; }

    @Expose() get stateId(): string { return this._stateId; }
    @Expose() get displayName(): string { return this._displayName; }
    @Expose() get prevColumn(): string | null { return this._prevColumn; }
    @Expose() get nextColumn(): string | null { return this._nextColumn; }

    public get tickets(): readonly Ticket[] { return Array.from(this._tickets.values()); }

    public addTicket(ticket: Ticket): void {
        this._tickets.set(ticket.id, ticket);
    }

    public removeTicket(ticketId: string): void {
        this._tickets.delete(ticketId);
    }
}