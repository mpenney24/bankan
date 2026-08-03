export class MoveTicketCommand {
    constructor(
        public readonly boardId: string,
        public readonly ticketId: string,
        public readonly targetColumnId: string
    ) {}
}