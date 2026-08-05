import { describe, it, expect, beforeEach } from "vitest";
import * as h from "../test/helpers.js";
import { Column } from "./Column.js";
import { Ticket } from "./Ticket.js";

describe('Column', () => {

    let column: Column;
    let ticket: Ticket;

    beforeEach(() => {
        column = h.createColumn(h.COLUMN_STATE_ID_BACKLOG);
        ticket = h.createTicket(h.COLUMN_ID_BACKLOG);
    })

    describe('#addTicket', () => {
        
        it('should successfully add a new ticket', () => { 
            expect(column.tickets).toHaveLength(0);

            column._addTicket(ticket);

            expect(column.tickets).toHaveLength(1);
            expect(column.tickets).toContain(ticket);
        });

        it('should not duplicate tickets of the same id', () => {
            expect(column.tickets).toHaveLength(0);

            column._addTicket(ticket);
            column._addTicket(ticket);

            expect(column.tickets).toHaveLength(1);
            expect(column.tickets).toContain(ticket);
        });

        
    });

    describe('#removeTicket', () => {
        it('should successfully remove the ticket if it exists', () => {
            expect(column.tickets).toHaveLength(0);

            column._addTicket(ticket);

            expect(column.tickets).toHaveLength(1);
            expect(column.tickets).toContain(ticket);

            column._removeTicket(ticket.id);

            expect(column.tickets).toHaveLength(0);
            expect(column.tickets).not.toContain(ticket);
        });
    });
});