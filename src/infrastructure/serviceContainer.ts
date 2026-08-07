import { AddTicketHandler } from '../domain/application/commands/AddTicketHandler.js';
import { MoveTicketHandler } from '../domain/application/commands/MoveTicketHandler.js';
import { BoardServiceFacade } from '../domain/application/facades/BoardServiceFacade.js';
import { GetBoardHandler } from '../domain/application/queries/GetBoardHandler.js';
import { Board } from '../domain/entities/Board.js';
import { BoardSchema } from '../domain/entities/BoardSchema.js';
import { InMemoryEventDispatcher } from '../domain/events/DomainEventDispatcher.js';
import { registerDomainEvents } from '../domain/events/registerEvents.js';
import {
    BoardSummaryProjector,
    BoardSummaryReadModel,
} from './events/BoardSummaryProjector.js';
import { getFirestoreDb } from './persistence/firestore/connection.js';
import { FirestoreRepository } from './persistence/firestore/FirestoreRepository.js';

const eventDispatcher = new InMemoryEventDispatcher();
registerDomainEvents(eventDispatcher);

const boardRepository = new FirestoreRepository(
    getFirestoreDb(),
    'boards',
    Board,
    BoardSchema
);

const getBoardHandler = new GetBoardHandler(boardRepository);
const moveTicketHandler = new MoveTicketHandler(boardRepository, eventDispatcher);
const addTicketHandler = new AddTicketHandler(boardRepository, eventDispatcher);

export const boardServiceFacade = new BoardServiceFacade(
    boardRepository,
    getBoardHandler,
    moveTicketHandler,
    addTicketHandler
);

const boardSummaryRepository = new FirestoreRepository<BoardSummaryReadModel>(
    getFirestoreDb(),
    'board_summaries'
);

const boardSummaryProjector = new BoardSummaryProjector(
    eventDispatcher,
    'Ticket',
    boardRepository,
    boardSummaryRepository
);
boardSummaryProjector.start();
