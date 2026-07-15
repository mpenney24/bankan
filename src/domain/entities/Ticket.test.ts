import { describe, it, expect, beforeEach } from "vitest";
import * as h from "../test/helpers.js";

describe('Ticket', () => {

    let ticketId: number;

    beforeEach(() => {
        ticketId = 1;
    })

    describe('#transitionTo', () => {
        
        it('should successfully change stateId and add updated date', () => {
            const tick = h.createTicket(ticketId++, h.COLUMN_ID_BACKLOG);

            expect(tick.stateId).toBe(h.COLUMN_ID_BACKLOG);
            expect(tick.updated).toBe(null);
            
            tick.transitionTo(h.COLUMN_ID_IN_PROGRESS);
            
            expect(tick.stateId).toBe(h.COLUMN_ID_IN_PROGRESS);
            expect(tick.updated).not.toBe(null);
        });

    });

});