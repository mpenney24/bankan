import { FirestoreRepository } from "../../infrastructure/persistence/firestore/FirestoreRepository.js";
import { Board } from "../entities/Board.js";
import { Ticket } from "../entities/Ticket.js";
import { ICreateTicket } from "../entities/TicketSchema.js";
import { DomainEventDispatcher } from "../events/DomainEventDispatcher.js";

export class TicketService {

    constructor(
        private readonly boardRepository: FirestoreRepository<Board>,
        private readonly eventDispatcher: DomainEventDispatcher
    ) {}

    public async moveTicket(
        board: Board, 
        ticketId: string, 
        targetColumnId: string
    ): Promise<void> {
        board.moveTicket(ticketId, targetColumnId);

        await this.persistAndDispatch(board);
    }

    public async addTicket(
        board: Board, 
        ticket: ICreateTicket
    ): Promise<void> {
        board.addTicket(Ticket.create(ticket));

        await this.persistAndDispatch(board);
    }

    private async persistAndDispatch(board: Board): Promise<void> {
        // Mitch - for testing optimistic updates!
        // await new Promise((resolve) => setTimeout(resolve, 1000));
        // throw new Error("Simulated network failure");

        await this.boardRepository.save(board);

        const events = board.getDomainEvents();
        if (events.length > 0) {
            board.clearDomainEvents();
            await this.eventDispatcher.dispatch(events);
        }
    }

}