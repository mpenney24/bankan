import { z } from 'zod';
import { TicketSchema } from './TicketSchema.js';

export const ColumnSchema = z.object({
    id: z.uuid(),
    stateId: z.string(),
    displayName: z.string(),
    prevColumnId: z.string().nullable(),
    nextColumnId: z.string().nullable(),
    tickets: z.array(TicketSchema)
});

export type IColumn = z.infer<typeof ColumnSchema>;
