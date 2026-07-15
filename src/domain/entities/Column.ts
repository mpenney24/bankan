import { Ticket } from "./Ticket.js";

// DDD - Entity
export class Column {
    private _tickets: Map<number, Ticket> = new Map();

    constructor(
        private readonly _stateId: string,
        private readonly _displayName: string,
        private readonly _prevColumn: string | null,
        private readonly _nextColumn: string | null
    ) {}

    get stateId(): string { return this._stateId; }
    get displayName(): string { return this._displayName; }
    get prevColumn(): string | null { return this._prevColumn; }
    get nextColumn(): string | null { return this._nextColumn; }

    get tickets(): readonly Ticket[] { return Array.from(this._tickets.values()); }

    public addTicket(ticket: Ticket): void {
        this._tickets.set(ticket.id, ticket);
    }

    public removeTicket(ticketId: number): void {
        this._tickets.delete(ticketId);
    }
}