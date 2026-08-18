import {
    AddTicketHandler,
    BoardServiceFacade,
    GetBoardHandler,
    InMemoryEventDispatcher,
    MoveTicketHandler,
    registerDomainEvents,
} from '@bankan/domain';
import * as Sentry from '@sentry/react';

import { BoardSummaryProjector } from './events/BoardSummaryProjector';
import { getBoardRepository } from './getBoardRepository';
import { getBoardSummaryRepository } from './getBoardSummaryRepository';

Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    debug: false,
});

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
