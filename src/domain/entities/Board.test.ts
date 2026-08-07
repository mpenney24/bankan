import { ClassConstructor } from 'class-transformer';
import { afterAll,beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { ERROR_CODES } from '../../errors/ErrorCodes.js';
import {
    ColumnByIdSpec,
    ColumnCanBeAddedSpec,
} from '../common/specifications/ColumnSpecs.js';
import { TicketByIdSpec } from '../common/specifications/TicketSpecs.js';
import { createColumnId, createTicketId, StateSchema } from '../common/Types.js';
import {
    DomainEvent,
    TicketAddedEvent,
    TicketMovedEvent,
} from '../events/DomainEvents.js';
import * as h from '../test/helpers.js';
import { Board } from './Board.js';
import { Column } from './Column.js';
import { Ticket } from './Ticket.js';

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

    beforeAll(() => {
        vi.useFakeTimers();
        vi.setSystemTime(FIXED_DATE);
    });

    afterAll(() => {
        vi.useRealTimers();
    });

    beforeEach(() => {
        board = h.createBoard();
        column = board.columns.find((col) => col.id === h.COLUMN_ID_BACKLOG)!;
        ticket = board.getTickets().value[0]!;
    });

    describe('#getTickets', () => {
        it('should successfully return the stored tickets for the target column', () => {
            const result = board.getTickets({
                columnSpec: new ColumnByIdSpec(column.id),
            });
            expect(result.isSuccess).toBe(true);
            expect(result.value).toStrictEqual([ticket]);
        });

        it('should successfully return the filtered stored tickets for the target column', () => {
            const result = board.getTickets({
                columnSpec: new ColumnByIdSpec(column.id),
                ticketSpec: new TicketByIdSpec(ticket.id),
            });
            expect(result.isSuccess).toBe(true);
            expect(result.value).toStrictEqual([ticket]);
        });

        it('should successfully return no stored tickets for the filtered target column if there are none found by the ticket filter', () => {
            const result = board.getTickets({
                columnSpec: new ColumnByIdSpec(column.id),
                ticketSpec: new TicketByIdSpec(createTicketId()),
            });
            expect(result.isSuccess).toBe(true);
            expect(result.value).toStrictEqual([]);
        });

        it('should successfully return no stored tickets if the filtered target column cannot be found', () => {
            const result = board.getTickets({
                columnSpec: new ColumnByIdSpec(h.COLUMN_ID_INVALID),
            });
            expect(result.isSuccess).toBe(true);
            expect(result.value).toStrictEqual([]);
        });
    });

    describe('#addTicket', () => {
        it('should successfully add the new ticket and dispatch TicketAddedEvent', () => {
            const newTicket = h.createTicket(h.COLUMN_ID_BACKLOG);

            const result = board.addTicket(newTicket);
            expect(result.isSuccess).toBe(true);

            expect(
                board.columns
                    .find((col) => col.id === h.COLUMN_ID_BACKLOG)
                    ?.tickets.find((tick) => tick.id === newTicket.id)
            ).toStrictEqual(newTicket);

            const expectedEvent = new TicketAddedEvent({
                ticketId: newTicket.id,
                boardId: board.id,
            });
            validateBoardEvent(board, expectedEvent);
        });

        it('should fail to add a new ticket if the target column cannot be found', () => {
            const newTicket = h.createTicket(h.COLUMN_ID_INVALID);

            const result = board.addTicket(newTicket);
            expect(result.isFailure).toBe(true);

            expect(result.error).toBe(ERROR_CODES.B00(h.COLUMN_ID_INVALID));
        });

        it('should fail to add a new ticket if the ticket already exists', () => {
            const result = board.addTicket(ticket);
            expect(result.isFailure).toBe(true);

            expect(result.error).toBe(ERROR_CODES.UIT01);
        });
    });

    describe('#moveTicket', () => {
        it('should successfully move a ticket from one column to another, populate ticket updated date, and dispatch TicketMovedEvent', () => {
            expect(ticket.updated).toBe(null);

            const originalColumn = board.columns.find(
                (col) => col.id === ticket.columnId
            )!;
            expect(originalColumn.id).toBe(h.COLUMN_ID_BACKLOG);
            expect(originalColumn.tickets).toContain(ticket);

            const result = board.moveTicket(ticket.id, h.COLUMN_ID_IN_PROGRESS);
            expect(result.isSuccess).toBe(true);

            expect(originalColumn.tickets).not.toContain(ticket);

            const newColumn = board.columns.find((col) => col.id === ticket.columnId)!;
            expect(newColumn.id).toBe(h.COLUMN_ID_IN_PROGRESS);
            expect(newColumn.tickets).toContain(ticket);

            expect(ticket.columnId).toBe(h.COLUMN_ID_IN_PROGRESS);
            expect(ticket.updated).not.toBe(null);

            const expectedEvent = new TicketMovedEvent(
                {
                    ticketId: ticket.id,
                    boardId: board.id,
                },
                newColumn.id
            );
            validateBoardEvent(board, expectedEvent);
        });

        it('should fail to move a ticket if the target ticket cannot be found', () => {
            const nonExistantTicketId = createTicketId();
            const result = board.moveTicket(nonExistantTicketId, h.COLUMN_ID_IN_PROGRESS);
            expect(result.isFailure).toBe(true);

            expect(result.error).toBe(ERROR_CODES.B01(nonExistantTicketId));
        });

        it('should fail to move a ticket if the target source cannot be found', () => {
            ticket.columnId = createColumnId();
            const result = board.moveTicket(ticket.id, h.COLUMN_ID_IN_PROGRESS);
            expect(result.isFailure).toBe(true);

            expect(result.error).toBe(ERROR_CODES.B00(ticket.columnId));
        });

        it('should fail to move a ticket if the target column cannot be found', () => {
            const result = board.moveTicket(ticket.id, h.COLUMN_ID_INVALID);
            expect(result.isFailure).toBe(true);

            expect(result.error).toBe(ERROR_CODES.B00(h.COLUMN_ID_INVALID));
        });

        it('should fail to move a ticket if the ticket already exists in the target column', () => {
            const result = board.moveTicket(ticket.id, ticket.columnId);
            expect(result.isFailure).toBe(true);

            expect(result.error).toBe(ERROR_CODES.UIB02);
        });
    });

    describe('#addColumn', () => {
        it('should successfully add a new column to the board', () => {
            const columnToAdd = new Column(
                createColumnId(),
                StateSchema.parse('QA'),
                'QA'
            );

            const result = board._addColumn(new ColumnCanBeAddedSpec(columnToAdd));
            expect(result.isSuccess).toBe(true);

            expect(board.columns).toContain(columnToAdd);
        });

        it('should fail to add a new column to the board if it already exists', () => {
            const result = board._addColumn(new ColumnCanBeAddedSpec(column));
            expect(result.isFailure).toBe(true);

            expect(result.error).toBe(ERROR_CODES.UIC01);
        });
    });
});
