import { describe, it, expect, beforeEach } from "vitest";
import * as h from "../test/helpers.js";
import { TicketService } from "./TicketService.js";
import { Board } from "../entities/Board.js";
import { Ticket } from "../entities/Ticket.js";

describe('TicketService', () => {

    let board: Board;
    let tickBacklog: Ticket;
    let tickInProgress: Ticket;
    let tickDone: Ticket;

    beforeEach(() => {
        board = h.createBoard();
        tickBacklog = board.getColumn(h.COLUMN_ID_BACKLOG).tickets[0]!;
        tickInProgress = board.getColumn(h.COLUMN_ID_IN_PROGRESS).tickets[0]!;
        tickDone = board.getColumn(h.COLUMN_ID_DONE).tickets[0]!;
    });

    describe('#regressTicket', () => {
        
        it('should successfully prevent a ticket in BACKLOG from regressing to a non-existent column', () => {
            expect(tickBacklog.columnId).toBe(h.COLUMN_ID_BACKLOG);

            TicketService.regressTicket(board, tickBacklog.id);
            
            expect(tickBacklog.columnId).toBe(h.COLUMN_ID_BACKLOG);
            expect(tickBacklog.updated).toBe(null);
        });

        it('should successfully regress a ticket in IN_PROGRESS to BACKLOG', () => {
            expect(tickInProgress.columnId).toBe(h.COLUMN_ID_IN_PROGRESS);

            TicketService.regressTicket(board, tickInProgress.id);
            
            expect(tickInProgress.columnId).toBe(h.COLUMN_ID_BACKLOG);
            expect(tickInProgress.updated).not.toBe(null);
        });

        it('should successfully regress a ticket in DONE to IN_PROGRESS', () => {
            expect(tickDone.columnId).toBe(h.COLUMN_ID_DONE);

            TicketService.regressTicket(board, tickDone.id);
            
            expect(tickDone.columnId).toBe(h.COLUMN_ID_IN_PROGRESS);
            expect(tickDone.updated).not.toBe(null);
        });

    });

    describe('#progressTicket', () => {

        it('should successfully progress a ticket in BACKLOG to IN_PROGRESS', () => {
            expect(tickBacklog.columnId).toBe(h.COLUMN_ID_BACKLOG);

            TicketService.progressTicket(board, tickBacklog.id);
            
            expect(tickBacklog.columnId).toBe(h.COLUMN_ID_IN_PROGRESS);
            expect(tickBacklog.updated).not.toBe(null);
        });

        it('should successfully progress a ticket in IN_PROGRESS to DONE', () => {
            expect(tickInProgress.columnId).toBe(h.COLUMN_ID_IN_PROGRESS);

            TicketService.progressTicket(board, tickInProgress.id);
            
            expect(tickInProgress.columnId).toBe(h.COLUMN_ID_DONE);
            expect(tickInProgress.updated).not.toBe(null);
        });

        it('should successfully prevent a ticket in DONE from progressing to a non-existent column', () => {
            expect(tickDone.columnId).toBe(h.COLUMN_ID_DONE);

            TicketService.progressTicket(board, tickDone.id);
            
            expect(tickDone.columnId).toBe(h.COLUMN_ID_DONE);
            expect(tickDone.updated).toBe(null);
        });

    });

});