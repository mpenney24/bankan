import { BoardId } from '../../common/Types.js';
import { ICreateTicket } from '../../entities/TicketSchema.js';

export class AddTicketCommand {
    constructor(
        public readonly boardId: BoardId,
        public readonly createTicketPayload: ICreateTicket
    ) {}
}
