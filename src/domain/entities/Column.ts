import { Exclude, Expose, Type } from 'class-transformer';

import { Result } from '../common/Result.js';
import { TicketCanBeAddedSpec } from '../common/specifications/TicketSpecs.js';
import type { ColumnId, StateId, TicketId } from '../common/Types.js';
import { IColumnInternal } from './ColumnSchema.js';
import { Ticket } from './Ticket.js';

// DDD - Entity
@Exclude()
export class Column implements IColumnInternal {
    @Expose({ name: 'tickets' })
    @Type(() => Ticket)
    private _tickets: Ticket[] = [];

    constructor(
        private _id: ColumnId,
        private _stateId: StateId,
        private _displayName: string
    ) {}

    @Expose() get id(): ColumnId {
        return this._id;
    }
    private set id(id: ColumnId) {
        this._id = id;
    }

    @Expose() get stateId(): StateId {
        return this._stateId;
    }
    private set stateId(stateId: StateId) {
        this._stateId = stateId;
    }

    @Expose() get displayName(): string {
        return this._displayName;
    }
    private set displayName(displayName: string) {
        this._displayName = displayName;
    }

    @Expose() get tickets(): ReadonlyArray<Ticket> {
        return this._tickets;
    }
    private set tickets(tickets: Ticket[]) {
        this._tickets = tickets;
    }

    public _addTicket(spec: TicketCanBeAddedSpec): Result<void> {
        if (this._tickets.some((tick) => !spec.isSatisfiedBy(tick))) {
            return Result.fail(spec.errorMessage);
        }
        this._tickets.push(spec.ticketToAdd);

        return Result.ok();
    }

    public _removeTicket(ticketId: TicketId): void {
        this.tickets = this._tickets.filter((t) => t.id !== ticketId);
    }
}
