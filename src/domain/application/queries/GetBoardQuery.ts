import { BoardId } from "../../common/Types.js";

export class GetBoardQuery {
    constructor(
        public readonly boardId: BoardId
    ) {}
}