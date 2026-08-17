import { Result } from '../../common/Result';
import { Board } from '../../entities/Board';
import { DomainEventDispatcher } from '../../events/DomainEventDispatcher';
import { IFirestoreRepository } from '../repositories/IFirestoreRepository';
import { persistAndDispatch } from '../repositories/persistAndDispatch';
import { MoveTicketCommand } from './MoveTicketCommand';

export class MoveTicketHandler {
    constructor(
        private readonly boardRepo: IFirestoreRepository<Board>,
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
