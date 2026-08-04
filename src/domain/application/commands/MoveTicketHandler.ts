import { FirestoreRepository } from '../../../infrastructure/persistence/firestore/FirestoreRepository.js';
import { persistAndDispatch } from '../../../infrastructure/persistence/persistAndDispatch.js';
import { Result } from '../../common/Result.js';
import { Board } from '../../entities/Board.js';
import { DomainEventDispatcher } from '../../events/DomainEventDispatcher.js';
import { MoveTicketCommand } from './MoveTicketCommand.js';

export class MoveTicketHandler {
    constructor(
        private readonly boardRepo: FirestoreRepository<Board>,
        private readonly eventDispatcher: DomainEventDispatcher
    ) {}

    async execute(command: MoveTicketCommand): Promise<Result<void>> {
        const boardResult = await this.boardRepo.getById(command.boardId);
        if (boardResult.isFailure) {
            return Result.fail(boardResult.error);
        }
        const board = boardResult.value;

        const moveResult = board.moveTicket(command.ticketId, command.targetColumnId);
        if (moveResult.isFailure) {
            return moveResult;
        }

        return persistAndDispatch(this.boardRepo, this.eventDispatcher, board);
    }
}