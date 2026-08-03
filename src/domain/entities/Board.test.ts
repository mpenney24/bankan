import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import * as h from "../test/helpers.js";
import { ERROR_CODES } from "../../errors/ErrorCodes.js";
import { Board } from "./Board.js";
import { Ticket } from "./Ticket.js";
import { Column } from "./Column.js";
import { DomainEvent, TicketAddedEvent, TicketMovedEvent } from "../events/DomainEvents.js";
import { ClassConstructor } from "class-transformer";

function validateBoardEvent<T extends DomainEvent>(board: Board, expectedEvent: T) {
    const events = board.getDomainEvents();
    expect(events.length).toBe(1);

    const clazz = expectedEvent.constructor as ClassConstructor<T>;
    expect(events[0] instanceof clazz).toBe(true);
    
    expect(events[0]!).toStrictEqual(expectedEvent);
}

describe('Board', () => {
    
    let board: Board;
    let column: Column;
    let ticket: Ticket;

    const FIXED_DATE = new Date('2026-06-01T12:00:00Z');

    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(FIXED_DATE);

        board = h.createBoard();
        column = board.columns.find(col => col.id === h.COLUMN_ID_BACKLOG)!;
        ticket = board.getTickets(column.id).value[0]!;
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should successfully instantiate the board', () => {
        expect(board.columns.length).toBe(h.TEST_BOARD_COLUMN_SCHEMA_KEYS.length);
    });

    describe('#getTickets', () => {

        it('should successfully return the stored tickets for the target column', () => {
            const result = board.getTickets(column.id);
            expect(result.isSuccess).toBe(true);
            expect(result.value).toStrictEqual([ticket]);
        });

        it('should fail to return stored tickets if the target column cannot be found', () => {
            const result = board.getTickets(h.COLUMN_ID_INVALID);
            expect(result.isFailure).toBe(true);
            expect(result.error).toBe(ERROR_CODES.B00(h.COLUMN_ID_INVALID));
        });
    });

    describe('#addTicket', () => {

        it('should successfully add the new ticket', () => {
            const newTicket = h.createTicket(h.COLUMN_ID_BACKLOG);

            const result = board.addTicket(newTicket);
            expect(result.isSuccess).toBe(true);

            expect(board.columns.find(col => col.id === h.COLUMN_ID_BACKLOG)?.tickets.find(
                tick => tick.id === newTicket.id
            )).toStrictEqual(newTicket);

            const expectedEvent = TicketAddedEvent.create({
                    ticketId: newTicket.id,
                    boardId: board.id
                }
            );
            validateBoardEvent(board, expectedEvent);
        });

        it('should fail to add a new ticket if the target column cannot be found', () => {
            const newTicket = h.createTicket(h.COLUMN_ID_INVALID);

            const result = board.addTicket(newTicket);
            expect(result.isFailure).toBe(true);

            expect(result.error).toBe(ERROR_CODES.UIT01); 
        });

    });

    describe('#moveTicket', () => {

        it('should successfully move a ticket from one column to another and add the ticket updated date', () => {
            expect(ticket.updated).toBe(null);

            const originalColumn = board.columns.find(col => col.id === ticket.columnId)!;
            expect(originalColumn.id).toBe(h.COLUMN_ID_BACKLOG);
            expect(originalColumn.tickets).toContain(ticket);

            const result = board.moveTicket(ticket.id, h.COLUMN_ID_IN_PROGRESS);
            expect(result.isSuccess).toBe(true);

            expect(originalColumn.tickets).not.toContain(ticket);

            const newColumn = board.columns.find(col => col.id === ticket.columnId)!;
            expect(newColumn.id).toBe(h.COLUMN_ID_IN_PROGRESS);
            expect(newColumn.tickets).toContain(ticket);

            expect(ticket.columnId).toBe(h.COLUMN_ID_IN_PROGRESS);
            expect(ticket.updated).not.toBe(null);

            const expectedEvent = TicketMovedEvent.create({
                    ticketId: ticket.id,
                    boardId: board.id
                },
                newColumn.id
            );
            validateBoardEvent(board, expectedEvent);
        });
        
    });

});