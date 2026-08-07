import { z } from 'zod';

import { Result } from '../common/Result.js';
import { ISpecification } from '../common/Specification.js';
import { ColumnCanBeAddedSpec } from '../common/specifications/ColumnSpecs.js';
import { BoardIdSchema, ColumnId, TicketId } from '../common/Types.js';
import { Column } from './Column.js';
import { ColumnSchema } from './ColumnSchema.js';
import { Ticket } from './Ticket.js';

export const BoardSchema = z.object({
    version: z.number().default(0),
    id: BoardIdSchema,
    columns: z.array(ColumnSchema).readonly(),
});

export type IBoard = z.infer<typeof BoardSchema>;
export type IBoardReadOnly = Readonly<IBoard>;

export interface IBoardExternal extends IBoardReadOnly {
    getTickets(specs?: {
        columnSpec?: ISpecification<Column>;
        ticketSpec?: ISpecification<Ticket>;
    }): Result<ReadonlyArray<Ticket>>;
}

export interface IBoardInternal extends IBoardExternal {
    addTicket(ticket: Ticket): Result<void>;
    moveTicket(ticketId: TicketId, targetColumnId: ColumnId): Result<void>;
    _addColumn(columnToAdd: ColumnCanBeAddedSpec): Result<void>;
}
