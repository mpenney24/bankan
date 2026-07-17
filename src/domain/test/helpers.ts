import { randomUUID } from "crypto";
import { BoardSchema } from "../config/BoardSchema.js";
import { Board } from "../entities/Board.js";
import { Column } from "../entities/Column.js";
import { Ticket } from "../entities/Ticket.js";

// KEY LOGIC

export const COLUMN_ID_BACKLOG: string = 'BACKLOG';
export const COLUMN_ID_IN_PROGRESS: string = 'IN_PROGRESS';
export const COLUMN_ID_DONE: string = 'DONE';

export const COLUMN_ID_INVALID = 'INVALID';

// SCHEMA LOGIC

export const TEST_BOARD_SCHEMA = {
   [COLUMN_ID_BACKLOG]: { 
       displayName: 'Backlog', 
       prevStateId: null, 
       nextStateId: COLUMN_ID_IN_PROGRESS 
   },
   [COLUMN_ID_IN_PROGRESS]: { 
       displayName: 'In Progress', 
       prevStateId: COLUMN_ID_BACKLOG, 
       nextStateId: COLUMN_ID_DONE 
   },
   [COLUMN_ID_DONE]: { 
       displayName: 'Done', 
       prevStateId: COLUMN_ID_IN_PROGRESS, 
       nextStateId: null 
   }
} satisfies BoardSchema;
export const TEST_BOARD_SCHEMA_KEYS = Object.keys(TEST_BOARD_SCHEMA);

// CREATION LOGIC

export const createBoard = (): Board => {
    const columns = (Object.keys(TEST_BOARD_SCHEMA)).map(id => {
        const col = createColumn(id);
        col.addTicket(createTicket(id));
        return col;
    });
    
    return new Board(columns);
}

export const createColumn = (
    stateId: string = COLUMN_ID_BACKLOG
): Column => {
    const id = randomUUID();

    if (stateId === COLUMN_ID_INVALID) {
        return new Column(id, COLUMN_ID_INVALID, 'Invalid Column', null, null);
    }

    const { displayName, prevStateId, nextStateId } = TEST_BOARD_SCHEMA[stateId]!;

    return new Column(id, stateId, displayName, prevStateId, nextStateId);
};

export const createTicket = (columnId: string) => {
    return new Ticket(randomUUID(), columnId, 'Test Ticket', 'A test ticket', new Date().toISOString());
}