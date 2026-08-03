import { randomUUID } from "crypto";
import { Board } from "../entities/Board.js";
import { Column } from "../entities/Column.js";
import { Ticket } from "../entities/Ticket.js";
import { ICreateTicket } from "../entities/TicketSchema.js";

// KEY LOGIC

export const COLUMN_ID_BACKLOG: string = randomUUID();
export const COLUMN_ID_IN_PROGRESS: string = randomUUID();
export const COLUMN_ID_DONE: string = randomUUID();

export const COLUMN_ID_INVALID: string = randomUUID();

export const COLUMN_STATE_ID_BACKLOG: string = 'BACKLOG';
export const COLUMN_STATE_ID_IN_PROGRESS: string = 'IN_PROGRESS';
export const COLUMN_STATE_ID_DONE: string = 'DONE';

export const COLUMN_STATE_ID_INVALID: string = 'INVALID';

// SCHEMA LOGIC

export type ColumnSchemaDefinition = Pick<Column, 'id' | 'displayName' | 'prevColumnId' | 'nextColumnId'>;

export const TEST_BOARD_COLUMN_SCHEMA: Record<string, ColumnSchemaDefinition> = {
   [COLUMN_STATE_ID_BACKLOG]: {
       id: COLUMN_ID_BACKLOG,
       displayName: 'Backlog', 
       prevColumnId: null, 
       nextColumnId: COLUMN_ID_IN_PROGRESS
   },
   [COLUMN_STATE_ID_IN_PROGRESS]: {
       id: COLUMN_ID_IN_PROGRESS,
       displayName: 'In Progress', 
       prevColumnId: COLUMN_ID_BACKLOG, 
       nextColumnId: COLUMN_ID_DONE 
   },
   [COLUMN_STATE_ID_DONE]: {
       id: COLUMN_ID_DONE, 
       displayName: 'Done', 
       prevColumnId: COLUMN_ID_IN_PROGRESS, 
       nextColumnId: null 
   }
};
export const TEST_BOARD_COLUMN_SCHEMA_KEYS = Object.keys(TEST_BOARD_COLUMN_SCHEMA);

// CREATION LOGIC

export const createBoard = (): Board => {
    const board = new Board(randomUUID());
    
    TEST_BOARD_COLUMN_SCHEMA_KEYS.forEach(stateId => {
        const col = createColumn(stateId);
        col.addTicket(createTicket(col.id));
        board.columns.push(col);
    });
    
    return board;
}

export const createColumn = (
    stateId: string = COLUMN_STATE_ID_BACKLOG
): Column => {

    if (stateId === COLUMN_STATE_ID_INVALID) {
        return new Column(COLUMN_ID_INVALID, COLUMN_STATE_ID_INVALID, 'Invalid Column', null, null);
    }

    const { id, displayName, prevColumnId, nextColumnId } = TEST_BOARD_COLUMN_SCHEMA[stateId]!;

    return new Column(id, stateId, displayName, prevColumnId, nextColumnId);
};

export const createTicket = (columnId: string) => {
    return Ticket.create(createTicketPayload(columnId));
}

export const createTicketPayload = (columnId: string): ICreateTicket => {
    return { name: 'Test Ticket', columnId, description: 'A test ticket', priority: 'HIGH' }
}