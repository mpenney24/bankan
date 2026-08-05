import { z } from 'zod';
import { ColumnId, ColumnIdSchema, ISODateStringSchema, TicketIdSchema } from '../common/Types.js';

export const CreateTicketSchema = z.object({
    name: z.string().min(1, "Name is required"),
    // Mitch - put this back once default is selected!
    columnId: ColumnIdSchema.default(ColumnIdSchema.parse('b5624472-edaf-4b76-8289-d89417f97dfd')), //min(1, "Column ID is required"),
    description: z.string().min(1, "Description is required"),
    priority: z.string().min(1, "Priority is required")
});

export type ICreateTicket = z.infer<typeof CreateTicketSchema>;

export const MoveTicketSchema = z.object({
    ticketId: TicketIdSchema,
    targetColumnId: ColumnIdSchema
});

export type IMoveTicket = z.infer<typeof MoveTicketSchema>;

export const TicketSchema = CreateTicketSchema.extend({
    id: TicketIdSchema,
    created: ISODateStringSchema,
    updated: ISODateStringSchema.nullable(),
});

export type ITicket = z.infer<typeof TicketSchema>;
export type ITicketReadOnly = Readonly<ITicket>;

export interface ITicketInternal extends ITicketReadOnly {
    _transitionTo(newColumnId: ColumnId): void;
}

