import { Board } from "../entities/Board.js";
import { Column } from "../entities/Column.js";

export class WorkflowService {

    public static regressTicket(board: Board, ticketId: number): void {
        this.moveTicket(board, ticketId, (currentColumn) => currentColumn.prevColumn);
    }

    public static progressTicket(board: Board, ticketId: number): void {
        this.moveTicket(board, ticketId, (currentColumn) => currentColumn.nextColumn);
    }

    private static moveTicket(
        board: Board, 
        ticketId: number, 
        resolveNextStateId: (column: Column) => string | null
    ): void {
        const currentColumn = board.getColumn(board.getTicket(ticketId).stateId);

        const targetStateId = resolveNextStateId(currentColumn);
        if (!targetStateId) return;

        board.moveTicket(ticketId, targetStateId);
    }

}