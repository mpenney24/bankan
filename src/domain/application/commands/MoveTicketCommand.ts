import { BoardId, ColumnId, TicketId } from '../../common/Types.js';

export class MoveTicketCommand {
    constructor(
        public readonly boardId: BoardId,
        public readonly ticketId: TicketId,
        public readonly targetColumnId: ColumnId
    ) {}
}
