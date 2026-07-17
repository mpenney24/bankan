import { describe, it, expect, beforeEach } from "vitest";
import * as h from "../test/helpers.js";

describe('Ticket', () => {

    describe('#transitionTo', () => {
        
        it('should successfully change columnId and add updated date', () => {
            const tick = h.createTicket(h.COLUMN_ID_BACKLOG);

            expect(tick.columnId).toBe(h.COLUMN_ID_BACKLOG);
            expect(tick.updated).toBe(null);
            
            tick.transitionTo(h.COLUMN_ID_IN_PROGRESS);
            
            expect(tick.columnId).toBe(h.COLUMN_ID_IN_PROGRESS);
            expect(tick.created).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
            expect(tick.updated).not.toBe(null);
        });

    });

});