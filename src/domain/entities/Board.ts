import { Column } from "./Column.js";
import { ERROR_CODES } from "../../errors/ErrorCodes.js";
import { Ticket } from "./Ticket.js";
import { Exclude, Expose, instanceToInstance, Type } from "class-transformer";
import { IBoard } from "./BoardSchema.js";
import { TicketAddedEvent, TicketMovedEvent } from "../events/DomainEvents.js";
import { DomainEventAggregateRoot } from "../events/DomainEventAggregateRoot.js";

// DDD - Aggregate root
@Exclude()
export class Board extends DomainEventAggregateRoot implements IBoard {
    
    @Expose({ name: 'columns' })
    @Type(() => Column)
    private _columns: Column[] = [];

    constructor(
        private _id: string
    ) {
        super();
    }

    @Expose() get id(): string { return this._id; }
    private set id(id: string) { this._id = id; }

    @Expose() get columns(): Column[] { return this._columns; }
    private set columns(columns: Column[]) { this._columns = columns }

    public clone(): Board {
        return instanceToInstance(this);
    }

    public getColumn(columnId: string): Column {
        const column = this._columns.find(col => col.id === columnId);
        if (!column) throw new Error(ERROR_CODES.B00(columnId));
        return column;
    }

    public getTicket(ticketId: string): Ticket {
        for(const column of this._columns) {
            const ticket = column.tickets.find(t => t.id === ticketId);
            if (ticket) {
                return ticket;
            }
        }
        throw new Error(ERROR_CODES.B01(ticketId));
    }

    public addTicket(ticket: Ticket): void {
        const column = this.getColumn(ticket.columnId);

        column.addTicket(ticket);

        this.addDomainEvent(new TicketAddedEvent({ boardId: this.id, ticketId: ticket.id }));
    }

    public moveTicket(ticketId: string, targetColumnId: string): void {
        const ticket = this.getTicket(ticketId);
        
        const sourceCol = this.getColumn(ticket.columnId);
        const targetCol = this.getColumn(targetColumnId);

        ticket.transitionTo(targetColumnId);

        sourceCol.removeTicket(ticket.id);
        targetCol.addTicket(ticket);

        this.addDomainEvent(new TicketMovedEvent({ boardId: this.id, ticketId: ticketId }, targetColumnId));
    }

}