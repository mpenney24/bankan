import { ColumnCanBeAddedSpec } from '../common/specifications/ColumnSpecs.js';
import { TicketCanBeAddedSpec } from '../common/specifications/TicketSpecs.js';
import {
    ColumnId,
    ColumnIdSchema,
    createBoardId,
    createColumnId,
    StateId,
    StateSchema,
} from '../common/Types.js';
import { Board } from '../entities/Board.js';
import { Column } from '../entities/Column.js';
import { Ticket } from '../entities/Ticket.js';
import { ICreateTicket } from '../entities/TicketSchema.js';

export const mock = <T>(implementation: Partial<T>): T => {
    return implementation as T;
};

// KEY LOGIC

export const COLUMN_ID_BACKLOG: ColumnId = createColumnId();
export const COLUMN_ID_IN_PROGRESS: ColumnId = createColumnId();
export const COLUMN_ID_DONE: ColumnId = createColumnId();

export const COLUMN_ID_INVALID: ColumnId = createColumnId();

// STATE LOGIC

export const COLUMN_STATE_ID_BACKLOG: StateId = 'BACKLOG';
export const COLUMN_STATE_ID_IN_PROGRESS: StateId = 'IN_PROGRESS';
export const COLUMN_STATE_ID_DONE: StateId = 'DONE';

export const COLUMN_STATE_ID_INVALID: StateId = 'INVALID' as StateId;

// SCHEMA LOGIC

export type ColumnSchemaDefinition = Pick<Column, 'id' | 'displayName'>;

export const TEST_BOARD_COLUMN_SCHEMA: Record<string, ColumnSchemaDefinition> = {
    [COLUMN_STATE_ID_BACKLOG]: {
        id: ColumnIdSchema.parse(COLUMN_ID_BACKLOG),
        displayName: 'Backlog',
    },
    [COLUMN_STATE_ID_IN_PROGRESS]: {
        id: ColumnIdSchema.parse(COLUMN_ID_IN_PROGRESS),
        displayName: 'In Progress',
    },
    [COLUMN_STATE_ID_DONE]: {
        id: ColumnIdSchema.parse(COLUMN_ID_DONE),
        displayName: 'Done',
    },
};
export const TEST_BOARD_COLUMN_SCHEMA_KEYS = Object.keys(TEST_BOARD_COLUMN_SCHEMA);

// CREATION LOGIC

export const VERSION = 0;

export const createBoard = (): Board => {
    const board = new Board(createBoardId(), VERSION);

    TEST_BOARD_COLUMN_SCHEMA_KEYS.forEach((stateId) => {
        const col = createColumn(StateSchema.parse(stateId));
        col._addTicket(new TicketCanBeAddedSpec(createTicket(col.id)));
        board._addColumn(new ColumnCanBeAddedSpec(col));
    });

    if (board.columns.length !== TEST_BOARD_COLUMN_SCHEMA_KEYS.length) {
        throw new Error(
            `COLUMNS not equal, board=${board.columns.length}, expected=${TEST_BOARD_COLUMN_SCHEMA_KEYS.length}`
        );
    }

    const ticketCount = board.columns.flatMap((col) => col.tickets).length;

    if (ticketCount !== TEST_BOARD_COLUMN_SCHEMA_KEYS.length) {
        throw new Error(
            `TICKETS not equal, board=${ticketCount}, expected=${TEST_BOARD_COLUMN_SCHEMA_KEYS.length}`
        );
    }

    return board;
};

export const createColumn = (stateId: StateId = COLUMN_STATE_ID_BACKLOG): Column => {
    if (stateId === COLUMN_STATE_ID_INVALID) {
        return new Column(COLUMN_ID_INVALID, COLUMN_STATE_ID_INVALID, 'Invalid Column');
    }

    const { id, displayName } = TEST_BOARD_COLUMN_SCHEMA[stateId]!;

    return new Column(id, stateId, displayName);
};

export const createTicket = (columnId: ColumnId) => {
    return Ticket.create(createTicketPayload(columnId));
};

export const createTicketPayload = (columnId: ColumnId): ICreateTicket => {
    return {
        name: 'Test Ticket',
        columnId,
        description: 'A test ticket',
        priority: 'HIGH',
    };
};
