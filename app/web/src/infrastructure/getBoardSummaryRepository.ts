import { BoardSummaryReadModel } from './events/BoardSummaryProjector';
import { getFirestoreDb } from './persistence/firestore/connection';
import { FirestoreRepository } from './persistence/firestore/FirestoreRepository';

let boardSummaryRepositoryInstance: FirestoreRepository<BoardSummaryReadModel> | null =
    null;

export function getBoardSummaryRepository(): FirestoreRepository<BoardSummaryReadModel> {
    if (boardSummaryRepositoryInstance) {
        return boardSummaryRepositoryInstance;
    }

    boardSummaryRepositoryInstance = new FirestoreRepository<BoardSummaryReadModel>(
        getFirestoreDb(),
        'board_summaries'
    );

    return boardSummaryRepositoryInstance;
}
