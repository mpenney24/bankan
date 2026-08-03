import { ERROR_CODES } from "../../../errors/ErrorCodes.js";
import { FirestoreRepository } from "../../../infrastructure/persistence/firestore/FirestoreRepository.js";
import { Result } from "../../common/Result.js";
import { IBoardReadOnly } from "../../entities/BoardSchema.js";
import { GetBoardQuery } from "./GetBoardQuery.js";

export class GetBoardHandler {
    constructor(
        private readonly boardRepo: FirestoreRepository<IBoardReadOnly>,
    ) {}

    async execute(query: GetBoardQuery): Promise<Result<IBoardReadOnly>> {
        const result = await this.boardRepo.getById(query.boardId);
        
        if (!result.isFailure) {
            return Result.fail(ERROR_CODES.B02(query.boardId));
        }

        return result;
    }
}