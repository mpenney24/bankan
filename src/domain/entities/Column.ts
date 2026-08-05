import { Exclude, Expose, Type } from "class-transformer";
import { Ticket } from "./Ticket.js";
import { IColumnInternal } from "./ColumnSchema.js";

import type { ColumnId, State, TicketId } from "../common/Types.js";

// DDD - Entity
@Exclude()
export class Column implements IColumnInternal {

    @Expose({ name: 'tickets' })
    @Type(() => Ticket)
    private _tickets: Ticket[] = [];

    constructor(
        private _id: ColumnId,
        private _stateId: State,
        private _displayName: string
    ) {}

    @Expose() get id(): ColumnId { return this._id; }
    private set id(id: ColumnId) { this._id = id; }

    @Expose() get stateId(): State { return this._stateId; }
    private set stateId(stateId: State) { this._stateId = stateId; }

    @Expose() get displayName(): string { return this._displayName; }
    private set displayName(displayName: string) { this._displayName = displayName; }

    @Expose() get tickets(): ReadonlyArray<Ticket> { return this._tickets; }
    private set tickets(tickets: Ticket[]) { this._tickets = tickets; }

    public _addTicket(ticket: Ticket): void {
        if (!this._tickets.find(t => t.id === ticket.id)) {
            this._tickets.push(ticket);
        }
    }

    public _removeTicket(ticketId: TicketId): void {
        this.tickets = this._tickets.filter(t => t.id !== ticketId);
    }
}