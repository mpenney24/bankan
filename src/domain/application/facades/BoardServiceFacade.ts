import { EntitySubscriptionCallback, FirestoreRepository } from "../../../infrastructure/persistence/firestore/FirestoreRepository.js";
import { BoardId } from "../../common/Types.js";
import { Board } from "../../entities/Board.js";
import { IBoardExternal } from "../../entities/BoardSchema.js";
import { AddTicketCommand } from "../commands/AddTicketCommand.js";
import { AddTicketHandler } from "../commands/AddTicketHandler.js";
import { MoveTicketCommand } from "../commands/MoveTicketCommand.js";
import { MoveTicketHandler } from "../commands/MoveTicketHandler.js";
import { GetBoardHandler } from "../queries/GetBoardHandler.js";
import { GetBoardQuery } from "../queries/GetBoardQuery.js";

type BoardSubscriptionCallback = EntitySubscriptionCallback<IBoardExternal>;

export class BoardServiceFacade {
    constructor(
        private readonly boardRepo: FirestoreRepository<Board>,
        private readonly getBoardHandler: GetBoardHandler,
        private readonly moveTicketHandler: MoveTicketHandler,
        private readonly addTicketHandler: AddTicketHandler
    ) {}

    public subscribeToBoard(boardId: BoardId, onUpdate: BoardSubscriptionCallback) {
        return this.boardRepo.subscribe(boardId, onUpdate);
    }

    async getBoard(boardId: BoardId) {
        return this.getBoardHandler.execute(new GetBoardQuery(boardId));
    }

    async moveTicket(command: MoveTicketCommand) {
        return this.moveTicketHandler.execute(command);
    }

    async addTicket(command: AddTicketCommand) {
        return this.addTicketHandler.execute(command);
    }
    
}