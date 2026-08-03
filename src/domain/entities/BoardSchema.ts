import { z } from 'zod';
import { ColumnSchema } from './ColumnSchema.js';
import { Board } from './Board.js';
import { Result } from '../common/Result.js';
import { Ticket } from './Ticket.js';
import { Column } from './Column.js';

export const BoardSchema = z.object({
    id: z.uuid(),
    columns: z.array(ColumnSchema).readonly()
});

export type IBoard = z.infer<typeof BoardSchema>;
export type IBoardReadOnly = Readonly<IBoard>;

export interface IBoardExternal extends IBoardReadOnly {
    clone(): Board;
    getTickets(targetColumnId: string): Result<ReadonlyArray<Ticket>>
    addTicket(ticket: Ticket): Result<void>
    moveTicket(ticketId: string, targetColumnId: string): Result<void>
}

export interface IBoardInternal extends IBoardExternal {
    _addColumn(column: Column): void;
}
