import { BoardId } from '../../common/Types';
import { Board } from '../../entities/Board';
import { IBoardExternal } from '../../entities/BoardSchema';
import { AddTicketCommand } from '../commands/AddTicketCommand';
import { AddTicketHandler } from '../commands/AddTicketHandler';
import { MoveTicketCommand } from '../commands/MoveTicketCommand';
import { MoveTicketHandler } from '../commands/MoveTicketHandler';
import { GetBoardHandler } from '../queries/GetBoardHandler';
import { GetBoardQuery } from '../queries/GetBoardQuery';
import {
    EntitySubscriptionCallback,
    IFirestoreRepository,
} from '../repositories/IFirestoreRepository';

type BoardSubscriptionCallback = EntitySubscriptionCallback<IBoardExternal>;

export class BoardServiceFacade {
    constructor(
        private readonly boardRepo: IFirestoreRepository<Board>,
        private readonly getBoardHandler: GetBoardHandler,
        private readonly moveTicketHandler: MoveTicketHandler,
        private readonly addTicketHandler: AddTicketHandler
    ) {}

    public subscribeToBoard(boardId: BoardId, onUpdate: BoardSubscriptionCallback) {
        return this.boardRepo.subscribe(boardId, onUpdate);
    }

    async getBoard(query: GetBoardQuery) {
        return this.getBoardHandler.execute(query);
    }

    async moveTicket(command: MoveTicketCommand) {
        return this.moveTicketHandler.execute(command);
    }

    async addTicket(command: AddTicketCommand) {
        return this.addTicketHandler.execute(command);
    }
}
