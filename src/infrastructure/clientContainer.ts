import { AddTicketHandler } from '../domain/application/commands/AddTicketHandler.js';
import { MoveTicketHandler } from '../domain/application/commands/MoveTicketHandler.js';
import { BoardServiceFacade } from '../domain/application/facades/BoardServiceFacade.js';
import { GetBoardHandler } from '../domain/application/queries/GetBoardHandler.js';
import { InMemoryEventDispatcher } from '../domain/events/DomainEventDispatcher.js';
import { registerDomainEvents } from '../domain/events/registerEvents.js';
import { BoardSummaryProjector } from './events/BoardSummaryProjector.js';
import { getBoardRepository } from './getBoardRepository.js';
import { getBoardSummaryRepository } from './getBoardSummaryRepository.js';

const eventDispatcher = new InMemoryEventDispatcher();
registerDomainEvents(eventDispatcher);

const boardRepository = getBoardRepository();

const getBoardHandler = new GetBoardHandler(boardRepository);
const moveTicketHandler = new MoveTicketHandler(boardRepository, eventDispatcher);
const addTicketHandler = new AddTicketHandler(boardRepository, eventDispatcher);

export const boardServiceFacade = new BoardServiceFacade(
    boardRepository,
    getBoardHandler,
    moveTicketHandler,
    addTicketHandler
);

const boardSummaryRepository = getBoardSummaryRepository();

const boardSummaryProjector = new BoardSummaryProjector(
    eventDispatcher,
    'Ticket',
    boardRepository,
    boardSummaryRepository
);
boardSummaryProjector.start();
