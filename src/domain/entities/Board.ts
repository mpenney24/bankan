import { Column } from "./Column.js";
import { Ticket } from "./Ticket.js";
import { Exclude, Expose, Type } from "class-transformer";
import { IBoardInternal } from "./BoardSchema.js";
import { TicketAddedEvent, TicketMovedEvent } from "../events/DomainEvents.js";
import { DomainEventAggregateRoot } from "../events/DomainEventAggregateRoot.js";
import { Result } from "../common/Result.js";

import type { BoardId, ColumnId, TicketId } from "../common/Types.js";
import { ERROR_CODES } from "../../errors/ErrorCodes.js";
import { ISpecification } from "../common/Specification.js";

// DDD - Aggregate root
@Exclude()
export class Board extends DomainEventAggregateRoot implements IBoardInternal {
    
    @Expose({ name: 'columns' })
    @Type(() => Column)
    private _columns: Column[] = [];

    constructor(
        private _id: BoardId,
        private _version: number
    ) {
        super();
    }

    @Expose() get id(): BoardId { return this._id; }
    private set id(id: BoardId) { this._id = id; }

    @Expose() get columns(): ReadonlyArray<Column> { return this._columns; }
    private set columns(columns: Column[]) { this._columns = columns }

    @Expose() get version(): number { return this._version; }
    private set version(version: number) { this._version = version }

    public getTickets(specs?: { 
        columnSpec?: ISpecification<Column>; 
        ticketSpec?: ISpecification<Ticket> 
    }): Result<ReadonlyArray<Ticket>> {
        const { columnSpec, ticketSpec } = specs ?? {};

        const matchingColumns = 
            columnSpec 
            ? this._columns.filter(col => columnSpec.isSatisfiedBy(col))
            : this._columns;

        const matchingTickets = matchingColumns.flatMap(col => 
            ticketSpec 
            ? col.tickets.filter(ticket => ticketSpec.isSatisfiedBy(ticket))
            : col.tickets
        );

        return Result.ok(matchingTickets);
    }

    public addTicket(ticket: Ticket): Result<void> {
        const column = this._getColumn(ticket.columnId);
        if (!column) {
            return Result.fail(ERROR_CODES.UIT01);
        }

        column._addTicket(ticket);

        this.addDomainEvent(new TicketAddedEvent({ boardId: this.id, ticketId: ticket.id }));

        return Result.ok();
    }

    public moveTicket(ticketId: TicketId, targetColumnId: ColumnId): Result<void> {
        const ticket = this._getTicket(ticketId);
        if(!ticket) {
            return Result.fail(ERROR_CODES.B01(ticketId));
        }

        const sourceCol = this._getColumn(ticket.columnId);
        if(!sourceCol) {
            return Result.fail(ERROR_CODES.B00(ticket.columnId));
        }

        const targetCol = this._getColumn(targetColumnId);
        if(!targetCol) {
            return Result.fail(ERROR_CODES.B00(targetColumnId));
        }

        ticket._transitionTo(targetColumnId);

        targetCol._addTicket(ticket);
        sourceCol._removeTicket(ticket.id);

        this.addDomainEvent(new TicketMovedEvent({ boardId: this.id, ticketId }, targetColumnId));

        return Result.ok();
    }

    public _addColumn(column: Column): void {
        if (!this._columns.some(col => col.id === column.id)) {
            this._columns.push(column);
        }
    }

    private _getTicket(ticketId: TicketId): Ticket | undefined {
        for(const column of this._columns) {
            const ticket = column.tickets.find(tick => tick.id === ticketId);
            if (ticket) {
                return ticket;
            }
        }
    }

    private _getColumn(columnId: ColumnId): Column | undefined {
        return this._columns.find(col => col.id === columnId);
    }

}