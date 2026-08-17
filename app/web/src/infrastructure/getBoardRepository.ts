import { Board, BoardSchema } from '@bankan/domain';

import { getFirestoreDb } from './persistence/firestore/connection';
import { FirestoreRepository } from './persistence/firestore/FirestoreRepository';

let boardRepositoryInstance: FirestoreRepository<Board> | null = null;

export function getBoardRepository(): FirestoreRepository<Board> {
    if (boardRepositoryInstance) {
        return boardRepositoryInstance;
    }

    boardRepositoryInstance = new FirestoreRepository(
        getFirestoreDb(),
        'boards',
        Board,
        BoardSchema
    );

    return boardRepositoryInstance;
}
