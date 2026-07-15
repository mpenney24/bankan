import { describe, it, expect, beforeEach } from "vitest";
import * as h from "../test/helpers.js";
import { WorkflowService } from "./WorkflowService.js";
import { Board } from "../entities/Board.js";
import { Ticket } from "../entities/Ticket.js";

describe('WorkflowService', () => {

    let ticketId: number;

    let board: Board;
    let tickBacklog: Ticket;
    let tickInProgress: Ticket;
    let tickDone: Ticket;

    beforeEach(() => {
        ticketId = 1;

        tickBacklog = h.createTicket(ticketId++, h.COLUMN_ID_BACKLOG);
        tickInProgress = h.createTicket(ticketId++, h.COLUMN_ID_IN_PROGRESS);
        tickDone = h.createTicket(ticketId++, h.COLUMN_ID_DONE);

        board = h.createBoard([tickBacklog, tickInProgress, tickDone]);
    });

    describe('#regressTicket', () => {
        
        it('should successfully prevent a ticket in BACKLOG from regressing to a non-existent column', () => {
            expect(tickBacklog.stateId).toBe(h.COLUMN_ID_BACKLOG);

            WorkflowService.regressTicket(board, tickBacklog.id);
            
            expect(tickBacklog.stateId).toBe(h.COLUMN_ID_BACKLOG);
            expect(tickBacklog.updated).toBe(null);
        });

        it('should successfully regress a ticket in IN_PROGRESS to BACKLOG', () => {
            expect(tickInProgress.stateId).toBe(h.COLUMN_ID_IN_PROGRESS);

            WorkflowService.regressTicket(board, tickInProgress.id);
            
            expect(tickInProgress.stateId).toBe(h.COLUMN_ID_BACKLOG);
            expect(tickInProgress.updated).not.toBe(null);
        });

        it('should successfully regress a ticket in DONE to IN_PROGRESS', () => {
            expect(tickDone.stateId).toBe(h.COLUMN_ID_DONE);

            WorkflowService.regressTicket(board, tickDone.id);
            
            expect(tickDone.stateId).toBe(h.COLUMN_ID_IN_PROGRESS);
            expect(tickDone.updated).not.toBe(null);
        });

    });

    describe('#progressTicket', () => {

        it('should successfully progress a ticket in BACKLOG to IN_PROGRESS', () => {
            expect(tickBacklog.stateId).toBe(h.COLUMN_ID_BACKLOG);

            WorkflowService.progressTicket(board, tickBacklog.id);
            
            expect(tickBacklog.stateId).toBe(h.COLUMN_ID_IN_PROGRESS);
            expect(tickBacklog.updated).not.toBe(null);
        });

        it('should successfully progress a ticket in IN_PROGRESS to DONE', () => {
            expect(tickInProgress.stateId).toBe(h.COLUMN_ID_IN_PROGRESS);

            WorkflowService.progressTicket(board, tickInProgress.id);
            
            expect(tickInProgress.stateId).toBe(h.COLUMN_ID_DONE);
            expect(tickInProgress.updated).not.toBe(null);
        });

        it('should successfully prevent a ticket in DONE from progressing to a non-existent column', () => {
            expect(tickDone.stateId).toBe(h.COLUMN_ID_DONE);

            WorkflowService.progressTicket(board, tickDone.id);
            
            expect(tickDone.stateId).toBe(h.COLUMN_ID_DONE);
            expect(tickDone.updated).toBe(null);
        });

    });

});