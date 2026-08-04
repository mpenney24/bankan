import { z } from 'zod';
import { TicketSchema } from './TicketSchema.js';
import { Ticket } from './Ticket.js';

export const ColumnSchema = z.object({
    id: z.uuid(),
    stateId: z.string(),
    displayName: z.string(),
    // Mitch - remove these old references
    prevColumnId: z.string().nullable(),
    nextColumnId: z.string().nullable(),
    tickets: z.array(TicketSchema).readonly()
});

export type IColumn = z.infer<typeof ColumnSchema>;
export type IColumnReadOnly = Readonly<IColumn>;

export interface IColumnInternal extends IColumnReadOnly {
    _addTicket(ticket: Ticket): void;
    _removeTicket(ticketId: string): void;
}
