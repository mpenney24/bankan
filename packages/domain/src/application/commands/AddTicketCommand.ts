import { BoardId } from '../../common/Types';
import { ICreateTicket } from '../../entities/TicketSchema';

export class AddTicketCommand {
    constructor(
        public readonly boardId: BoardId,
        public readonly createTicketPayload: ICreateTicket
    ) {}
}
