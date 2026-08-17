import { BoardId } from '../../common/Types';

export class GetBoardQuery {
    constructor(public readonly boardId: BoardId) {}
}
