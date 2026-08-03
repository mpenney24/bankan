import { Column } from "./Column.js";
import { ERROR_CODES } from "../../errors/ErrorCodes.js";
import { Ticket } from "./Ticket.js";
import { Exclude, Expose, instanceToInstance, Type } from "class-transformer";
import { IBoard } from "./BoardSchema.js";
import { TicketAddedEvent, TicketMovedEvent } from "../events/DomainEvents.js";
import { DomainEventAggregateRoot } from "../events/DomainEventAggregateRoot.js";
import { Result } from "../common/Result.js";

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

    public getTickets(targetColumnId: string): Result<Ticket[]> {
        const column = this.getColumn(targetColumnId);
        if(!column) {
            return Result.fail(ERROR_CODES.B00(targetColumnId));
        }
        return Result.ok(column.tickets);
    }

    public addTicket(ticket: Ticket): Result<void> {
        const column = this.getColumn(ticket.columnId);
        if(!column) {
            return Result.fail(ERROR_CODES.UIT01);
        }

        column.addTicket(ticket);

        this.addDomainEvent(new TicketAddedEvent({ boardId: this.id, ticketId: ticket.id }));

        return Result.ok();
    }

    public moveTicket(ticketId: string, targetColumnId: string): Result<void> {
        const ticket = this.getTicket(ticketId);
        if(!ticket) {
            return Result.fail(ERROR_CODES.B01(ticketId));
        }
        
        const sourceCol = this.getColumn(ticket.columnId);
        if(!sourceCol) {
            return Result.fail(ERROR_CODES.B00(ticket.columnId));
        }

        const targetCol = this.getColumn(targetColumnId);
        if(!targetCol) {
            return Result.fail(ERROR_CODES.B00(targetColumnId));
        }

        ticket.transitionTo(targetColumnId);

        sourceCol.removeTicket(ticket.id);
        targetCol.addTicket(ticket);

        this.addDomainEvent(new TicketMovedEvent({ boardId: this.id, ticketId: ticketId }, targetColumnId));

        return Result.ok();
    }

    private getTicket(ticketId: string): Ticket | undefined {
        for(const column of this._columns) {
            const ticket = column.tickets.find(t => t.id === ticketId);
            if (ticket) {
                return ticket;
            }
        }
    }

    private getColumn(columnId: string): Column | undefined {
        return this._columns.find(col => col.id === columnId);
    }

}