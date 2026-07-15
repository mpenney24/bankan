import { describe, it, expect, beforeEach } from "vitest";
import * as h from "../test/helpers.js";
import { ERROR_CODES } from "../../errors/ErrorCodes.js";
import { Board } from "./Board.js";
import { Ticket } from "./Ticket.js";

describe('Board', () => {

    let ticketId: number;
    
    let board: Board;
    let tickBacklog: Ticket;

    beforeEach(() => {
        ticketId = 1;

        tickBacklog = h.createTicket(ticketId++, h.COLUMN_ID_BACKLOG);

        board = h.createBoard([tickBacklog]);
    });

    it('should successfully instantiate the board', () => {
        expect(board.columns.size).toBe(h.TEST_BOARD_SCHEMA_KEYS.length);
    });

    describe('#moveTicket', () => {

        it('should successfully move a ticket from one column to another and add the ticket updated date', () => {
            expect(tickBacklog.updated).toBe(null);

            const originalColumn = board.getColumn(tickBacklog.stateId);
            expect(originalColumn.stateId).toBe(h.COLUMN_ID_BACKLOG);
            expect(originalColumn.tickets).toContain(tickBacklog);

            board.moveTicket(tickBacklog.id, h.COLUMN_ID_IN_PROGRESS);

            expect(originalColumn.tickets).not.toContain(tickBacklog);

            const newColumn = board.getColumn(tickBacklog.stateId);
            expect(newColumn.stateId).toBe(h.COLUMN_ID_IN_PROGRESS);
            expect(newColumn.tickets).toContain(tickBacklog);

            const ticket = board.getTicket(tickBacklog.id);
            expect(ticket.stateId).toBe(h.COLUMN_ID_IN_PROGRESS);
            expect(ticket.updated).not.toBe(null);
        });
        
    });

    describe('#getColumn', () => {
        
        it('should successfully retrieve the stored column', () => {
            expect(board.getColumn(h.COLUMN_ID_BACKLOG)).toStrictEqual(
                board.columns.get(h.COLUMN_ID_BACKLOG)
            );
        });

        it('should throw an error if the column cannot be found', () => {
            expect(() => {
                board.getColumn(h.COLUMN_ID_INVALID)
            }).toThrowError(ERROR_CODES.B00(h.COLUMN_ID_INVALID)); 
        });

    });

    describe('#getTicket', () => {

        it('should successfully retrieve the stored ticket', () => {
            expect(board.getTicket(tickBacklog.id)).toStrictEqual(
                tickBacklog
            );
        });

        it('should throw an error if the ticket cannot be found', () => {
            expect(() => {
                board.getTicket(Infinity)
            }).toThrowError(ERROR_CODES.B01(Infinity)); 
        });

    });

});