import { describe, it, expect, beforeEach } from "vitest";
import * as h from "../test/helpers.js";
import { Column } from "./Column.js";
import { Ticket } from "./Ticket.js";

describe('Column', () => {

    let ticketId: number;
    let column: Column;
    let ticket: Ticket;

    beforeEach(() => {
        ticketId = 1;
        column = h.createColumn(h.COLUMN_ID_BACKLOG);
        ticket = h.createTicket(ticketId++, h.COLUMN_ID_BACKLOG);
    })

    describe('#addTicket', () => {
        
        it('should successfully add a new ticket', () => { 
            expect(column.tickets).toHaveLength(0);

            column.addTicket(ticket);

            expect(column.tickets).toHaveLength(1);
            expect(column.tickets).toContain(ticket);
        });

        it('should not duplicate tickets of the same id', () => {
            expect(column.tickets).toHaveLength(0);

            column.addTicket(ticket);
            column.addTicket(ticket);

            expect(column.tickets).toHaveLength(1);
            expect(column.tickets).toContain(ticket);
        });

        
    });

    describe('#removeTicket', () => {
        it('should successfully remove the ticket if it exists', () => {
            expect(column.tickets).toHaveLength(0);

            column.addTicket(ticket);

            expect(column.tickets).toHaveLength(1);
            expect(column.tickets).toContain(ticket);

            column.removeTicket(ticket.id);

            expect(column.tickets).toHaveLength(0);
            expect(column.tickets).not.toContain(ticket);
        });
    });
});