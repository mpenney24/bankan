import { randomUUID } from "crypto";
import { Board } from "../entities/Board.js";
import { Column } from "../entities/Column.js";
import { Ticket } from "../entities/Ticket.js";
import { ICreateTicket } from "../entities/TicketSchema.js";
import { ColumnId, ColumnIdSchema, createBoardId, createColumnId, State, StateSchema } from "../common/Types.js";

export const mock = <T>(implementation: Partial<T>): T => {
    return implementation as T;
}

// KEY LOGIC

export const COLUMN_ID_BACKLOG: ColumnId = createColumnId();
export const COLUMN_ID_IN_PROGRESS: ColumnId = createColumnId();
export const COLUMN_ID_DONE: ColumnId = createColumnId();

export const COLUMN_ID_INVALID: ColumnId = createColumnId();

export const COLUMN_STATE_ID_BACKLOG: State = StateSchema.parse('BACKLOG');
export const COLUMN_STATE_ID_IN_PROGRESS: State = StateSchema.parse('IN_PROGRESS');
export const COLUMN_STATE_ID_DONE: State = StateSchema.parse('DONE');

export const COLUMN_STATE_ID_INVALID: State = StateSchema.parse('INVALID');

// SCHEMA LOGIC

export type ColumnSchemaDefinition = Pick<Column, 'id' | 'displayName'>;

export const TEST_BOARD_COLUMN_SCHEMA: Record<string, ColumnSchemaDefinition> = {
   [COLUMN_STATE_ID_BACKLOG]: {
       id: ColumnIdSchema.parse(COLUMN_ID_BACKLOG),
       displayName: 'Backlog'
   },
   [COLUMN_STATE_ID_IN_PROGRESS]: {
       id: ColumnIdSchema.parse(COLUMN_ID_IN_PROGRESS),
       displayName: 'In Progress'
   },
   [COLUMN_STATE_ID_DONE]: {
       id: ColumnIdSchema.parse(COLUMN_ID_DONE), 
       displayName: 'Done'
   }
};
export const TEST_BOARD_COLUMN_SCHEMA_KEYS = Object.keys(TEST_BOARD_COLUMN_SCHEMA);

// CREATION LOGIC

export const VERSION = 0;

export const createBoard = (): Board => {
    const board = new Board(createBoardId(), VERSION);
    
    TEST_BOARD_COLUMN_SCHEMA_KEYS.forEach(stateId => {
        const col = createColumn(StateSchema.parse(stateId));
        col._addTicket(createTicket(col.id));
        board._addColumn(col);
    });
    
    return board;
}

export const createColumn = (
    stateId: State = COLUMN_STATE_ID_BACKLOG
): Column => {

    if (stateId === COLUMN_STATE_ID_INVALID) {
        return new Column(COLUMN_ID_INVALID, COLUMN_STATE_ID_INVALID, 'Invalid Column');
    }

    const { id, displayName } = TEST_BOARD_COLUMN_SCHEMA[stateId]!;

    return new Column(id, stateId, displayName);
};

export const createTicket = (columnId: ColumnId) => {
    return Ticket.create(createTicketPayload(columnId));
}

export const createTicketPayload = (columnId: ColumnId): ICreateTicket => {
    return { name: 'Test Ticket', columnId, description: 'A test ticket', priority: 'HIGH' }
}