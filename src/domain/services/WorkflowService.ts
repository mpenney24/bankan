import { Board } from "../entities/Board.js";
import { Column } from "../entities/Column.js";

export class WorkflowService {

    public static regressTicket(board: Board, ticketId: string): void {
        this.moveTicket(board, ticketId, (currentColumn) => currentColumn.prevColumn);
    }

    public static progressTicket(board: Board, ticketId: string): void {
        this.moveTicket(board, ticketId, (currentColumn) => currentColumn.nextColumn);
    }

    private static moveTicket(
        board: Board, 
        ticketId: string, 
        resolveNextStateId: (column: Column) => string | null
    ): void {
        const currentColumn = board.getColumn(board.getTicket(ticketId).columnId);

        const targetStateId = resolveNextStateId(currentColumn);
        if (!targetStateId) return;

        board.moveTicket(ticketId, targetStateId);
    }

}