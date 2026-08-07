import { z } from 'zod';

export const BoardIdSchema = z.uuid().brand<'BoardId'>();
export const ColumnIdSchema = z.uuid().brand<'ColumnId'>();
export const TicketIdSchema = z.uuid().brand<'TicketId'>();

export type BoardId = z.infer<typeof BoardIdSchema>;
export type ColumnId = z.infer<typeof ColumnIdSchema>;
export type TicketId = z.infer<typeof TicketIdSchema>;

function createId(schema: z.ZodType<any>) {
    return schema.parse(crypto.randomUUID());
}

export function createBoardId(): BoardId {
    return createId(BoardIdSchema);
}

export function createColumnId(): ColumnId {
    return createId(ColumnIdSchema);
}

export function createTicketId(): TicketId {
    return createId(TicketIdSchema);
}

export const StateSchema = z
    .enum(['BACKLOG', 'IN_PROGRESS', 'QA', 'DONE'])
    .catch('INVALID' as any);

export type StateId = z.infer<typeof StateSchema>;

export const ISODateStringSchema = z.iso.datetime().brand<'ISODateString'>();

export type ISODateString = z.infer<typeof ISODateStringSchema>;

export function createCurrentISODate(): ISODateString {
    return ISODateStringSchema.parse(new Date().toISOString());
}
