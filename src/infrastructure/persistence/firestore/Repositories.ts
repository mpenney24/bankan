import { Board } from '../../../domain/entities/Board.js';
import { getFirestoreDb } from './connection.js';
import { FirestoreRepository } from './FirestoreRepository.js';

export class Repositories {
    private static db = getFirestoreDb();

    public static readonly board = new FirestoreRepository(
        Repositories.db, 
        'boards', 
        Board
    );
}