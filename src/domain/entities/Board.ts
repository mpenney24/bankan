import { Column } from "./Column.js";
import { ERROR_CODES } from "../../errors/ErrorCodes.js";
import { Ticket } from "./Ticket.js";

// DDD - Aggregate root
export class Board {
    private readonly _columns: Map<string, Column> = new Map();

    constructor(columns: Column[]) {
        this._columns = new Map(columns.map(col => [col.stateId, col]));
    }

    get columns(): ReadonlyMap<string, Column> { return this._columns; }

    public moveTicket(ticketId: string, targetColumnId: string): void {
        const ticket = this.getTicket(ticketId);
        
        const sourceCol = this.getColumn(ticket.columnId);
        const targetCol = this.getColumn(targetColumnId);

        ticket.transitionTo(targetColumnId);

        sourceCol.removeTicket(ticket.id);
        targetCol.addTicket(ticket);
    }

    public getColumn(stateId: string): Column {
        const column = this._columns.get(stateId);
        if (!column) throw new Error(ERROR_CODES.B00(stateId));
        return column;
    }

    public getTicket(ticketId: string): Ticket {
        for(const column of this.columns.values()) {
            const ticket = column.tickets[ticketId];
            if (ticket) {
                return ticket;
            }
        }
        throw new Error(ERROR_CODES.B01(ticketId));
    }

}