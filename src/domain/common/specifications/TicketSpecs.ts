import { CompositeSpecification } from "../Specification.js";
import { ColumnId, TicketId } from "../Types.js";
import { Ticket } from "../../entities/Ticket.js";
import { ERROR_CODES } from "../../../errors/ErrorCodes.js";

export class TicketByIdSpec extends CompositeSpecification<Ticket> {
    public readonly errorMessage: string;

    constructor(private ticketId: TicketId) {
        super();
        this.errorMessage = ERROR_CODES.B01(ticketId);
    }
    
    isSatisfiedBy(ticket: Ticket): boolean {
        return ticket.id === this.ticketId;
    }
}

export class TicketCanBeMovedSpec extends CompositeSpecification<Ticket> {
    public readonly errorMessage: string = ERROR_CODES.UIB02;

    constructor(private targetColumnId: ColumnId) {
        super();
    }
    
    isSatisfiedBy(ticket: Ticket): boolean {
        return ticket.columnId !== this.targetColumnId;
    }
}

// Mitch - how to incorporate? (ANY OF THESE?)
export class TicketCanBeAddedSpec extends CompositeSpecification<Ticket> {
    public readonly errorMessage: string = ERROR_CODES.UIT01;

    constructor(public readonly ticketToAdd: Ticket) {
        super();
    }
    
    isSatisfiedBy(ticket: Ticket): boolean {
        return ticket.id !== this.ticketToAdd.id;
    }
}