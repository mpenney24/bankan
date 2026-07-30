import { z } from 'zod';

export const CreateTicketSchema = z.object({
    name: z.string().min(1, "Name is required"),
    // Mitch - put this back once default is selected!
    columnId: z.string().default('b5624472-edaf-4b76-8289-d89417f97dfd'), //min(1, "Column ID is required"),
    description: z.string().min(1, "Description is required"),
    priority: z.string().min(1, "Priority is required")
});

export type ICreateTicket = z.infer<typeof CreateTicketSchema>;

export const MoveTicketSchema = z.object({
    ticketId: z.uuid(),
    targetColumnId: z.uuid()
});

export type IMoveTicket = z.infer<typeof MoveTicketSchema>;

export const TicketSchema = CreateTicketSchema.extend({
    id: z.uuid(),
    created: z.iso.datetime(),
    updated: z.iso.datetime().optional(),
});

export type ITicket = z.infer<typeof TicketSchema>;

