import { FirestoreRepository } from '../../../infrastructure/persistence/firestore/FirestoreRepository.js';
import { persistAndDispatch } from '../../../infrastructure/persistence/persistAndDispatch.js';
import { Result } from '../../common/Result.js';
import { Board } from '../../entities/Board.js';
import { Ticket } from '../../entities/Ticket.js';
import { DomainEventDispatcher } from '../../events/DomainEventDispatcher.js';
import { AddTicketCommand } from './AddTicketCommand.js';

export class AddTicketHandler {
    constructor(
        private readonly boardRepo: FirestoreRepository<Board>,
        private readonly eventDispatcher: DomainEventDispatcher
    ) {}

    async execute(command: AddTicketCommand): Promise<Result<void>> {
        const boardResult = await this.boardRepo.getById(command.boardId);
        if (boardResult.isFailure) {
            return Result.fail(boardResult.error);
        }
        const board = boardResult.value;

        const addResult = board.addTicket(Ticket.create(command.createTicketPayload));
        if (addResult.isFailure) {
            return addResult;
        }

        return persistAndDispatch(this.boardRepo, this.eventDispatcher, board);
    }
}