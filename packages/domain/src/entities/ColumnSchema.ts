import { z } from 'zod';

import { Result } from '../common/Result';
import { TicketCanBeAddedSpec } from '../common/specifications/TicketSpecs';
import { ColumnIdSchema, StateSchema, TicketId } from '../common/Types';
import { TicketSchema } from './TicketSchema';

export const ColumnSchema = z.object({
    id: ColumnIdSchema,
    stateId: StateSchema,
    displayName: z.string(),
    tickets: z.array(TicketSchema).readonly(),
});

export type IColumn = z.infer<typeof ColumnSchema>;
export type IColumnReadOnly = Readonly<IColumn>;

export interface IColumnInternal extends IColumnReadOnly {
    _addTicket(spec: TicketCanBeAddedSpec): Result<void>;
    _removeTicket(ticketId: TicketId): void;
}
