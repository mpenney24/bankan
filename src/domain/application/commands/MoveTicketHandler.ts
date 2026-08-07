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
        return (await this.boardRepo.getById(command.boardId)).bind((board) =>
            board.moveTicket(command.ticketId, command.targetColumnId).map(() => {
                persistAndDispatch(this.boardRepo, this.eventDispatcher, board);
            })
        );
    }
}
