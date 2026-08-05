import { z } from 'zod';
import { TicketSchema } from './TicketSchema.js';
import { Ticket } from './Ticket.js';
import { ColumnIdSchema, StateSchema, TicketId } from '../common/Types.js';

export const ColumnSchema = z.object({
    id: ColumnIdSchema,
    stateId: StateSchema,
    displayName: z.string(),
    tickets: z.array(TicketSchema).readonly()
});

export type IColumn = z.infer<typeof ColumnSchema>;
export type IColumnReadOnly = Readonly<IColumn>;

export interface IColumnInternal extends IColumnReadOnly {
    _addTicket(ticket: Ticket): void;
    _removeTicket(ticketId: TicketId): void;
}
