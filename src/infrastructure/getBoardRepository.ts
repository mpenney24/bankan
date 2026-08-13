import { Board } from '../domain/entities/Board.js';
import { BoardSchema } from '../domain/entities/BoardSchema.js';
import { getFirestoreDb } from './persistence/firestore/connection.js';
import { FirestoreRepository } from './persistence/firestore/FirestoreRepository.js';

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
