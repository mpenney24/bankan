import { ICreateTicket } from "../../entities/TicketSchema.js";

export class AddTicketCommand {
    constructor(
        public readonly boardId: string,
        public readonly createTicketPayload: ICreateTicket
    ) {}
}