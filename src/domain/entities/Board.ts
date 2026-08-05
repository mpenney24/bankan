import { Column } from "./Column.js";
import { Ticket } from "./Ticket.js";
import { Exclude, Expose, Type } from "class-transformer";
import { IBoardInternal } from "./BoardSchema.js";
import { TicketAddedEvent, TicketMovedEvent } from "../events/DomainEvents.js";
import { DomainEventAggregateRoot } from "../events/DomainEventAggregateRoot.js";
import { Result } from "../common/Result.js";
import { ERROR_CODES } from "../../errors/ErrorCodes.js";
import { ISpecification } from "../common/Specification.js";
import { TicketCanBeAddedSpec, TicketCanBeMovedSpec } from "../common/specifications/TicketSpecs.js";

import type { BoardId, ColumnId, TicketId } from "../common/Types.js";

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
        return this._getColumn(ticket.columnId)
            .bind(column => {

                const ticketAddSpec = new TicketCanBeAddedSpec(ticket);
                return column._addTicket(ticketAddSpec)
                    .map(() => {
                        this.addDomainEvent(new TicketAddedEvent({ boardId: this.id, ticketId: ticket.id }));
                    });
            });
    }

    public moveTicket(ticketId: TicketId, targetColumnId: ColumnId): Result<void> {
        return this._getTicket(ticketId)
            .bind(ticket => 
                this._getSourceAndTargetColumns(ticket.columnId, targetColumnId)
                    .bind(([sourceCol, targetCol]) => {
                        
                        const moveSpec = new TicketCanBeMovedSpec(targetCol.id);
                        if (!moveSpec.isSatisfiedBy(ticket)) {
                            return Result.fail<void>(moveSpec.errorMessage);
                        }

                        return targetCol._addTicket(new TicketCanBeAddedSpec(ticket))
                            .map(() => {
                                sourceCol._removeTicket(ticket.id);
                                ticket._transitionTo(targetColumnId);
                                this.addDomainEvent(new TicketMovedEvent({ boardId: this.id, ticketId }, targetColumnId));
                            });
                    })
            );
    }

    public _addColumn(column: Column): void {
        if (!this._columns.some(col => col.id === column.id)) {
            this._columns.push(column);
        }
    }

    private _getTicket(ticketId: TicketId): Result<Ticket> {
        const ticket = this._columns
            .flatMap(col => col.tickets)
            .find(t => t.id === ticketId);

        return ticket ? Result.ok(ticket) : Result.fail(ERROR_CODES.B01(ticketId));
    }

    private _getColumn(columnId: ColumnId): Result<Column> {
        const column = this._columns.find(col => col.id === columnId);
        return column ? Result.ok(column) : Result.fail(ERROR_CODES.B00(columnId));
    }

    private _getSourceAndTargetColumns(sourceId: ColumnId, targetId: ColumnId): Result<[Column, Column]> {
        const source = this._getColumn(sourceId);
        const target = this._getColumn(targetId);

        const combined = Result.combine([source, target]);
        if (combined.isFailure) {
            return Result.fail(combined.error);
        }

        return Result.ok([source.value, target.value]);
    }

}