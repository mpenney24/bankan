import { Exclude, Expose, Type } from "class-transformer";
import { Ticket } from "./Ticket.js";
import { IColumnInternal } from "./ColumnSchema.js";

// DDD - Entity
@Exclude()
export class Column implements IColumnInternal {

    @Expose({ name: 'tickets' })
    @Type(() => Ticket)
    private _tickets: Ticket[] = [];

    constructor(
        private _id: string,
        private _stateId: string,
        private _displayName: string,
        private _prevColumnId: string | null,
        private _nextColumnId: string | null
    ) {}

    @Expose() get id(): string { return this._id; }
    private set id(id: string) { this._id = id; }

    @Expose() get stateId(): string { return this._stateId; }
    private set stateId(stateId: string) { this._stateId = stateId; }

    @Expose() get displayName(): string { return this._displayName; }
    private set displayName(displayName: string) { this._displayName = displayName; }

    @Expose() get prevColumnId(): string | null { return this._prevColumnId; }
    private set prevColumnId(prevColumnId: string) { this._prevColumnId = prevColumnId; }

    @Expose() get nextColumnId(): string | null { return this._nextColumnId; }
    private set nextColumnId(nextColumnId: string) { this._nextColumnId = nextColumnId; }

    @Expose() get tickets(): ReadonlyArray<Ticket> { return this._tickets; }
    private set tickets(tickets: Ticket[]) { this._tickets = tickets; }

    public _addTicket(ticket: Ticket): void {
        if (!this._tickets.find(t => t.id === ticket.id)) {
            this._tickets.push(ticket);
        }
    }

    public _removeTicket(ticketId: string): void {
        this.tickets = this._tickets.filter(t => t.id !== ticketId);
    }
}