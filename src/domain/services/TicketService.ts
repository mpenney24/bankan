import { Board } from "../entities/Board.js";
import { Column } from "../entities/Column.js";

export class TicketService {

    // Mitch - are these necessary in a drag/drop context? Maybe think about refactoring this once you understand how the board works better

    public static regressTicket(board: Board, ticketId: string): void {
        this.moveTicket(board, ticketId, (currentColumn) => currentColumn.prevColumnId);
    }

    public static progressTicket(board: Board, ticketId: string): void {
        this.moveTicket(board, ticketId, (currentColumn) => currentColumn.nextColumnId);
    }

    public static moveTicket(
        board: Board, 
        ticketId: string, 
        resolveNextColumnId: (column: Column) => string | null
    ): void {
        const currentColumn = board.getColumn(board.getTicket(ticketId).columnId);

        const targetColumnId = resolveNextColumnId(currentColumn);
        if (!targetColumnId) return;

        board.moveTicket(ticketId, targetColumnId);
    }

}