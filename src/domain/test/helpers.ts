import { BoardSchema } from "../config/BoardSchema.js";
import { Board } from "../entities/Board.js";
import { Column } from "../entities/Column.js";
import { Ticket } from "../entities/Ticket.js";

// KEY LOGIC

export const COLUMN_ID_BACKLOG = 'BACKLOG';
export const COLUMN_ID_IN_PROGRESS = 'IN_PROGRESS';
export const COLUMN_ID_DONE = 'DONE';

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

// Type logic

export type ValidTestColumnIdType = keyof typeof TEST_BOARD_SCHEMA;
export type AllTestColumnIdType = ValidTestColumnIdType | typeof COLUMN_ID_INVALID;

// CREATION LOGIC

export const createBoard = (tickets: Ticket[] = []): Board => {
    const columns = (Object.keys(TEST_BOARD_SCHEMA) as ValidTestColumnIdType[]).map(id => {
        const col = createColumn(id);
        
        const matchingTickets = tickets.filter(t => t.stateId === id);
        matchingTickets.forEach(t => col.addTicket(t));
        
        return col;
    });
    
    return new Board(columns);
}

export const createColumn = (
    stateId: AllTestColumnIdType = COLUMN_ID_BACKLOG
): Column => {
    if (stateId === COLUMN_ID_INVALID) {
        return new Column(COLUMN_ID_INVALID, 'Invalid Column', null, null);
    }

    const { displayName, prevStateId, nextStateId } = TEST_BOARD_SCHEMA[stateId];

    return new Column(stateId, displayName, prevStateId, nextStateId);
};

export const createTicket = (id: number, stateId: AllTestColumnIdType = COLUMN_ID_BACKLOG) => {
    return new Ticket(id, 'Test Ticket', 'A test ticket', stateId);
}