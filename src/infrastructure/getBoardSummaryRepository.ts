import { BoardSummaryReadModel } from './events/BoardSummaryProjector.js';
import { getFirestoreDb } from './persistence/firestore/connection.js';
import { FirestoreRepository } from './persistence/firestore/FirestoreRepository.js';

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
