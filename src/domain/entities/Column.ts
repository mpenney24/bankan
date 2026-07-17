import { Exclude, Expose, Type } from "class-transformer";
import { Ticket } from "./Ticket.js";

// DDD - Entity
@Exclude()
export class Column {

    @Expose({ name: 'tickets' })
    @Type(() => Ticket)
    private _tickets: Ticket[] = [];

    constructor(
        private _id: string,
        private _stateId: string,
        private _displayName: string,
        private _prevColumn: string | null,
        private _nextColumn: string | null
    ) {}

    @Expose() 
    get id(): string { return this._id; }
    private set id(id: string) { this._id = id; }

    @Expose() 
    get stateId(): string { return this._stateId; }
    private set stateId(stateId: string) { this._stateId = stateId; }

    @Expose() 
    get displayName(): string { return this._displayName; }
    private set displayName(displayName: string) { this._displayName = displayName; }

    @Expose() 
    get prevColumn(): string | null { return this._prevColumn; }
    private set prevColumn(prevColumn: string) { this._prevColumn = prevColumn; }

    @Expose() 
    get nextColumn(): string | null { return this._nextColumn; }
    private set nextColumn(nextColumn: string) { this._nextColumn = nextColumn; }

    @Expose() 
    get tickets(): readonly Ticket[] { return Array.from(this._tickets.values()); }
    private set tickets(tickets: Ticket[]) { this._tickets = tickets; }

    public addTicket(ticket: Ticket): void {
        if (!this._tickets.find(t => t.id === ticket.id)) {
            this._tickets.push(ticket);
        }
    }

    public removeTicket(ticketId: string): void {
        this.tickets = this._tickets.filter(t => t.id !== ticketId);
    }
}