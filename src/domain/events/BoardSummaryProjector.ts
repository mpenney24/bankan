import { DomainSummaryProjector, IDomainSummary } from "../../infrastructure/events/DomainSummaryProjector.js";
import { Board } from "../entities/Board.js";

export interface BoardSummaryReadModel extends IDomainSummary {
    readonly columnCount: number;
    readonly totalTickets: number;
}

export class BoardSummaryProjector extends DomainSummaryProjector<Board> {
    
    protected async recalculateSummary(board: Board): Promise<void> {
        const totalTickets = board.columns.reduce(
            (acc, col) => acc + (col.tickets?.length ?? 0), 
            0
        );

        const summary: BoardSummaryReadModel = {
            id: board.id,
            columnCount: board.columns.length,
            totalTickets,
            updatedAt: new Date().toISOString()
        };

        await this.upsertSummary(summary);
    }

}