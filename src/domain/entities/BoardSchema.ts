import { z } from 'zod';
import { ColumnSchema } from './ColumnSchema.js';
import { Result } from '../common/Result.js';
import { Ticket } from './Ticket.js';
import { Column } from './Column.js';

export const BoardSchema = z.object({
    version: z.number().default(0),
    id: z.uuid(),
    columns: z.array(ColumnSchema).readonly()
});

export type IBoard = z.infer<typeof BoardSchema>
export type IBoardReadOnly = Readonly<IBoard>;

export interface IBoardExternal extends IBoardReadOnly {
    getTickets(targetColumnId: string): Result<ReadonlyArray<Ticket>>;
}

export interface IBoardInternal extends IBoardExternal {
    addTicket(ticket: Ticket): Result<void>;
    moveTicket(ticketId: string, targetColumnId: string): Result<void>;
    _addColumn(column: Column): void;
}
