import { z } from 'zod';
import { ColumnSchema } from './ColumnSchema.js';

export const BoardSchema = z.object({
    id: z.uuid(),
    columns: z.array(ColumnSchema)
});

export type IBoard = z.infer<typeof BoardSchema>;
