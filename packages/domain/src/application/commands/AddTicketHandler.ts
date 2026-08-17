import { Result } from '../../common/Result';
import { Board } from '../../entities/Board';
import { Ticket } from '../../entities/Ticket';
import { DomainEventDispatcher } from '../../events/DomainEventDispatcher';
import { IFirestoreRepository } from '../repositories/IFirestoreRepository';
import { persistAndDispatch } from '../repositories/persistAndDispatch';
import { AddTicketCommand } from './AddTicketCommand';

export class AddTicketHandler {
    constructor(
        private readonly boardRepo: IFirestoreRepository<Board>,
        private readonly eventDispatcher: DomainEventDispatcher
    ) {}

    async execute(command: AddTicketCommand): Promise<Result<void>> {
        return (await this.boardRepo.getById(command.boardId)).bind((board) =>
            board.addTicket(Ticket.create(command.createTicketPayload)).map(() => {
                persistAndDispatch(this.boardRepo, this.eventDispatcher, board);
            })
        );
    }
}
