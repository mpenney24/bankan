import { describe, it, expect, beforeEach, vi } from "vitest";
import * as h from "../../test/helpers.js";
import { Board } from "../../entities/Board.js";
import { Ticket } from "../../entities/Ticket.js";
import { FirestoreRepository } from "../../../infrastructure/persistence/firestore/FirestoreRepository.js";
import { DomainEventDispatcher } from "../../events/DomainEventDispatcher.js";
import { afterEach } from "node:test";
import { Column } from "../../entities/Column.js";
import { ICreateTicket } from "../../entities/TicketSchema.js";
import { BoardServiceFacade } from "./BoardServiceFacade.js";
import { AddTicketHandler } from "../commands/AddTicketHandler.js";
import { MoveTicketHandler } from "../commands/MoveTicketHandler.js";
import { GetBoardHandler } from "../queries/GetBoardHandler.js";
import { MoveTicketCommand } from "../commands/MoveTicketCommand.js";
import { AddTicketCommand } from "../commands/AddTicketCommand.js";
import { Result } from "../../common/Result.js";
import { ERROR_CODES } from "../../../errors/ErrorCodes.js";

describe('BoardServiceFacade', () => {

    let boardServiceFacade: BoardServiceFacade;
    let mockBoardRepository: FirestoreRepository<Board>;
    let mockEventDispatcher: DomainEventDispatcher;

    let getBoardHandler: GetBoardHandler;
    let moveTicketHandler: MoveTicketHandler;
    let addTicketHandler: AddTicketHandler;

    let board: Board;
    let columnBacklog: Column;
    let ticketBacklog: Ticket;

    const FIXED_DATE = new Date('2026-06-01T12:00:00Z');

    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(FIXED_DATE);

        board = h.createBoard();
        columnBacklog = board.columns.find(col => col.id === h.COLUMN_ID_BACKLOG)!;
        ticketBacklog = columnBacklog.tickets[0]!;

        mockBoardRepository = h.mock<FirestoreRepository<Board>>({
            save: vi.fn().mockResolvedValue(undefined),
            getById: vi.fn().mockResolvedValue(Result.ok(board))
        });

        mockEventDispatcher = h.mock<DomainEventDispatcher>({
            dispatch: vi.fn().mockResolvedValue(undefined),
        });

        getBoardHandler = new GetBoardHandler(mockBoardRepository);
        moveTicketHandler = new MoveTicketHandler(mockBoardRepository, mockEventDispatcher);
        addTicketHandler = new AddTicketHandler(mockBoardRepository, mockEventDispatcher);

        boardServiceFacade = new BoardServiceFacade(
            mockBoardRepository,
            getBoardHandler,
            moveTicketHandler,
            addTicketHandler
        );

    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('#moveTicket', () => {
        
        it('should report a ticket successfully moved column with an event dispatch and db persist', async () => {
            const command: MoveTicketCommand = { boardId: board.id, ticketId: ticketBacklog.id, targetColumnId: h.COLUMN_ID_IN_PROGRESS };

            const result = await boardServiceFacade.moveTicket(command);
            
            expect(result.isSuccess).toBe(true);

            expect(ticketBacklog.columnId).toBe(h.COLUMN_ID_IN_PROGRESS);
            expect(ticketBacklog.updated).toBe(FIXED_DATE.toISOString());

            expect(mockBoardRepository.getById).toHaveBeenCalledWith(board.id);
            expect(mockBoardRepository.save).toHaveBeenCalledWith(board);
            expect(mockEventDispatcher.dispatch).toHaveBeenCalledOnce();
        });

        it('should report a ticket failed to move column with no event dispatch or db persist', async () => {
            const command: MoveTicketCommand = { boardId: board.id, ticketId: ticketBacklog.id, targetColumnId: h.COLUMN_ID_INVALID };

            const result = await boardServiceFacade.moveTicket(command);
            
            expect(result.isFailure).toBe(true);

            expect(ticketBacklog.columnId).toBe(h.COLUMN_ID_BACKLOG);
            expect(ticketBacklog.updated).toBe(null);

            expect(mockBoardRepository.getById).toHaveBeenCalledWith(board.id);
            expect(mockBoardRepository.save).not.toHaveBeenCalledWith(board);
            expect(mockEventDispatcher.dispatch).not.toHaveBeenCalled();
        });

        it('should fail to retrieve the board', async () => {
            const ticketCount = columnBacklog.tickets.length;
            
            const command: MoveTicketCommand = { boardId: board.id, ticketId: ticketBacklog.id, targetColumnId: h.COLUMN_ID_IN_PROGRESS };

            mockBoardRepository.getById = vi.fn().mockResolvedValue(Result.fail(ERROR_CODES.F01(command.targetColumnId)));

            const result = await boardServiceFacade.moveTicket(command);
            
            expect(result.isFailure).toBe(true);

            expect(columnBacklog.tickets.length).toBe(ticketCount);

            expect(mockBoardRepository.getById).toHaveBeenCalledWith(board.id);
            expect(mockBoardRepository.save).not.toHaveBeenCalledWith(board);
            expect(mockEventDispatcher.dispatch).not.toHaveBeenCalled();
        });

    });

    describe('#addTicket', () => {

        it('should report a ticket successfully added to column with an event dispatch and db persist', async () => {
            const ticketCount = columnBacklog.tickets.length;

            const createTicketPayload: ICreateTicket = h.createTicketPayload(h.COLUMN_ID_BACKLOG);

            const command: AddTicketCommand = { boardId: board.id, createTicketPayload }
            const result = await boardServiceFacade.addTicket(command);
            
            expect(result.isSuccess).toBe(true);
            expect(columnBacklog.tickets.length === ticketCount + 1);

            const savedNewTicket = columnBacklog.tickets.find(tick => tick.name === createTicketPayload.name)!;

            expect(savedNewTicket).toBeDefined();
            expect(savedNewTicket.updated).toBe(null);

            expect(mockBoardRepository.getById).toHaveBeenCalledWith(board.id);
            expect(mockBoardRepository.save).toHaveBeenCalledWith(board);
            expect(mockEventDispatcher.dispatch).toHaveBeenCalledOnce();
        });

        it('should report a ticket failed to add to column with no event dispatch or db persist', async () => {
            const ticketCount = columnBacklog.tickets.length;

            const createTicketPayload: ICreateTicket = h.createTicketPayload(h.COLUMN_ID_INVALID);

            const command: AddTicketCommand = { boardId: board.id, createTicketPayload }
            const result = await boardServiceFacade.addTicket(command);
            
            expect(result.isFailure).toBe(true);

            expect(columnBacklog.tickets.length).toBe(ticketCount);

            expect(mockBoardRepository.getById).toHaveBeenCalledWith(board.id);
            expect(mockBoardRepository.save).not.toHaveBeenCalledWith(board);
            expect(mockEventDispatcher.dispatch).not.toHaveBeenCalled();
        });

        it('should fail to retrieve the board', async () => {
            const ticketCount = columnBacklog.tickets.length;

            const createTicketPayload: ICreateTicket = h.createTicketPayload(h.COLUMN_ID_INVALID);

            mockBoardRepository.getById = vi.fn().mockResolvedValue(Result.fail(ERROR_CODES.F01(createTicketPayload.columnId)));

            const command: AddTicketCommand = { boardId: board.id, createTicketPayload }
            const result = await boardServiceFacade.addTicket(command);
            
            expect(result.isFailure).toBe(true);

            expect(columnBacklog.tickets.length).toBe(ticketCount);

            expect(mockBoardRepository.getById).toHaveBeenCalledWith(board.id);
            expect(mockBoardRepository.save).not.toHaveBeenCalledWith(board);
            expect(mockEventDispatcher.dispatch).not.toHaveBeenCalled();
        });

    });

});