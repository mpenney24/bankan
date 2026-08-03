import { ERROR_CODES } from "../../errors/ErrorCodes.js";
import { FirestoreRepository } from "../../infrastructure/persistence/firestore/FirestoreRepository.js";
import { Result } from "../common/Result.js";
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
    ): Promise<Result<void>> {
        const result = board.moveTicket(ticketId, targetColumnId);

        if(result.isFailure) {
            return result;
        }

        return this.persistAndDispatch(board);
    }

    public async addTicket(
        board: Board, 
        ticket: ICreateTicket
    ): Promise<Result<void>> {
        const result = board.addTicket(Ticket.create(ticket));

        if(result.isFailure) {
            return result;
        }

        return await this.persistAndDispatch(board);
    }

    private async persistAndDispatch(board: Board): Promise<Result<void>> {
        // Mitch - for testing optimistic updates!
        // await new Promise((resolve) => setTimeout(resolve, 1000));
        // throw new Error("Simulated network failure");

        try {
            await this.boardRepository.save(board);
        } catch (error) {
            console.error(ERROR_CODES.UIB01, error);
            return Result.fail("A network error occurred while saving. Please try again.");
        }

        const events = board.getDomainEvents();
        if (events.length > 0) {
            board.clearDomainEvents();
            await this.eventDispatcher.dispatch(events);
        }

        return Result.ok();
    }

}