import 'reflect-metadata';

// --- Entities ---
export { Board } from './entities/Board';
export { Column } from './entities/Column';
export { Ticket } from './entities/Ticket';

// --- Schemas ---
export { BoardIdSchema, ColumnIdSchema, TicketIdSchema } from './common/Types';
export { BoardSchema } from './entities/BoardSchema';
export { ColumnSchema } from './entities/ColumnSchema';
export { CreateTicketSchema, TicketSchema } from './entities/TicketSchema';

// --- Commands ---
export { AddTicketCommand } from './application/commands/AddTicketCommand';
export { AddTicketHandler } from './application/commands/AddTicketHandler';
export { MoveTicketCommand } from './application/commands/MoveTicketCommand';
export { MoveTicketHandler } from './application/commands/MoveTicketHandler';

// --- Queries ---
export { GetBoardHandler } from './application/queries/GetBoardHandler';
export { GetBoardQuery } from './application/queries/GetBoardQuery';

// --- Facades ---
export { BoardServiceFacade } from './application/facades/BoardServiceFacade';

// --- Common ---
export { Result } from './common/Result';

// --- Repositories ---
export type {
    EntitySubscriptionCallback,
    Identifiable,
    IFirestoreRepository,
} from './application/repositories/IFirestoreRepository';
export { persistAndDispatch } from './application/repositories/persistAndDispatch';

// --- Events ---
export { InMemoryEventDispatcher } from './events/DomainEventDispatcher';
export * from './events/DomainEvents';
export { registerDomainEvents } from './events/registerEvents';

// --- Specifications ---
export {
    ColumnByIdSpec,
    ColumnCanBeAddedSpec,
} from './common/specifications/ColumnSpecs';
export {
    TicketByIdSpec,
    TicketCanBeAddedSpec,
    TicketCanBeMovedSpec,
} from './common/specifications/TicketSpecs';

// --- Types ---

export type { BoardId, ColumnId, TicketId } from './common/Types';
export type { IBoardExternal } from './entities/BoardSchema';
export type { ICreateTicket, IMoveTicket } from './entities/TicketSchema';
export type { DomainEventDispatcher } from './events/DomainEventDispatcher';

// --- Errors ---
export { ERROR_CODES } from './errors/ErrorCodes';

// --- Test ---
export * as helpers from './test/helpers';
