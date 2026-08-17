import { Result } from '../../common/Result';
import { IBoardReadOnly } from '../../entities/BoardSchema';
import { IFirestoreRepository } from '../repositories/IFirestoreRepository';
import { GetBoardQuery } from './GetBoardQuery';

export class GetBoardHandler {
    constructor(private readonly boardRepo: IFirestoreRepository<IBoardReadOnly>) {}

    async execute(query: GetBoardQuery): Promise<Result<IBoardReadOnly>> {
        const result = await this.boardRepo.getById(query.boardId);

        if (result.isFailure) {
            return Result.fail(result.error);
        }

        return result;
    }
}
