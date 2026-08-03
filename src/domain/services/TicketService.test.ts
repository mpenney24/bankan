import { describe, it, expect, beforeEach, vi } from "vitest";
import * as h from "../test/helpers.js";
import { TicketService } from "./TicketService.js";
import { Board } from "../entities/Board.js";
import { Ticket } from "../entities/Ticket.js";
import { FirestoreRepository } from "../../infrastructure/persistence/firestore/FirestoreRepository.js";
import { DomainEventDispatcher } from "../events/DomainEventDispatcher.js";
import { afterEach } from "node:test";
import { Column } from "../entities/Column.js";
import { ICreateTicket, ITicket } from "../entities/TicketSchema.js";

describe('TicketService', () => {

    let ticketService: TicketService;
    let mockBoardRepository: FirestoreRepository<Board>;
    let mockEventDispatcher: DomainEventDispatcher;

    let board: Board;
    let columnBacklog: Column;
    let ticketBacklog: Ticket;

    const FIXED_DATE = new Date('2026-06-01T12:00:00Z');

    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(FIXED_DATE);

        mockBoardRepository = {
            save: vi.fn().mockResolvedValue(undefined),
        } as unknown as FirestoreRepository<Board>;

        mockEventDispatcher = {
            dispatch: vi.fn().mockResolvedValue(undefined),
        } as unknown as DomainEventDispatcher;

        ticketService = new TicketService(mockBoardRepository, mockEventDispatcher);

        board = h.createBoard();
        columnBacklog = board.columns.find(col => col.id === h.COLUMN_ID_BACKLOG)!;
        ticketBacklog = columnBacklog.tickets[0]!;
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('#moveTicket', () => {
        
        it('should report a ticket successfully moved column with an event dispatch and db persist', async () => {
            const result = await ticketService.moveTicket(board, ticketBacklog.id, h.COLUMN_ID_IN_PROGRESS);
            
            expect(result.isSuccess).toBe(true);

            expect(ticketBacklog.columnId).toBe(h.COLUMN_ID_IN_PROGRESS);
            expect(ticketBacklog.updated).toBe(FIXED_DATE.toISOString());

            expect(mockBoardRepository.save).toHaveBeenCalledWith(board);
            expect(mockEventDispatcher.dispatch).toHaveBeenCalledOnce();
        });

        it('should report a ticket failed to move column with no event dispatch or db persist', async () => {
            const result = await ticketService.moveTicket(board, ticketBacklog.id, h.COLUMN_ID_INVALID);
            
            expect(result.isFailure).toBe(true);

            expect(ticketBacklog.columnId).toBe(h.COLUMN_ID_BACKLOG);
            expect(ticketBacklog.updated).toBe(null);

            expect(mockBoardRepository.save).not.toHaveBeenCalledWith(board);
            expect(mockEventDispatcher.dispatch).not.toHaveBeenCalled();
        });

    });

    describe('#addTicket', () => {

        it('should report a ticket successfully added to column with an event dispatch and db persist', async () => {
            const ticketCount = columnBacklog.tickets.length;
            const newTicket: ICreateTicket = h.createTicketPayload(h.COLUMN_ID_BACKLOG);
            const result = await ticketService.addTicket(board, newTicket);
            
            expect(result.isSuccess).toBe(true);
            expect(columnBacklog.tickets.length === ticketCount + 1);

            const savedNewTicket = columnBacklog.tickets.find(tick => tick.name === newTicket.name)!;

            expect(savedNewTicket).toBeDefined();
            expect(savedNewTicket.updated).toBe(null);

            expect(mockBoardRepository.save).toHaveBeenCalledWith(board);
            expect(mockEventDispatcher.dispatch).toHaveBeenCalledOnce();
        });

        it('should report a ticket failed to add to column with no event dispatch or db persist', async () => {
            const newTicket = h.createTicket(h.COLUMN_ID_INVALID);
            const result = await ticketService.addTicket(board, newTicket);
            
            expect(result.isFailure).toBe(true);

            expect(columnBacklog.tickets).not.toContain(newTicket);
            expect(newTicket.updated).toBe(null);

            expect(mockBoardRepository.save).not.toHaveBeenCalledWith(board);
            expect(mockEventDispatcher.dispatch).not.toHaveBeenCalled();
        });

    });

});