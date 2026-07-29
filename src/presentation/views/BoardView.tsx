import React, { useEffect, useState, useCallback } from 'react';
import { plainToInstance } from 'class-transformer';
import { ColumnComponent } from '../components/ColumnComponent.js';
import { Board } from '../../domain/entities/Board.js';
import { FirestoreRepository } from '../../infrastructure/persistence/firestore/FirestoreRepository.js';
import { getFirestoreDb } from '../../infrastructure/persistence/firestore/connection.js';
import { TicketService } from '../../domain/services/TicketService.js';
import { styled } from 'styled-components';

const ColumnsWrapper = styled.div`
    display: flex;
    flex-direction: row;
    gap: 1.5rem;
    align-items: flex-start;
    overflow-x: auto;
    padding-bottom: 1rem;
    width: 100%;
`;

const BOARD_ID: string = import.meta.env.VITE_FIREBASE_BOARD_ID;

export const BoardView: React.FC = () => {
    const [board, setBoard] = useState<Board | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const boardRepo = new FirestoreRepository(getFirestoreDb(), 'boards', Board);

    useEffect(() => {
        boardRepo.getById(BOARD_ID).then((loadedBoard) => {
            setBoard(loadedBoard);
            setIsLoading(false);
        });
    }, []);

    const handleTicketDrop = useCallback(async (ticketId: string, targetColumnId: string) => {
        if (!board) return;

        // Clone board instance to safely trigger React state re-render
        const boardCopy = plainToInstance(Board, board);

        try {
            // DDD Aggregate Root handles the domain logic update
            TicketService.moveTicket(board, ticketId, () => targetColumnId);
            
            setBoard(boardCopy);
            await boardRepo.save(board);
        } catch (error) {
            console.error('Failed to move ticket:', error);
            setBoard(board); // Revert state on failure
        }
    }, [board]);

    if (isLoading || !board) {
        return <div>Loading board...</div>;
    }

    console.log(JSON.stringify(board, null, 2));

    return (
        <div className="board-wrapper">
            <h1 className="board-title">Bankan Board</h1>
            <ColumnsWrapper>
                {board.columns.map(col => (
                    <ColumnComponent
                        key={col.stateId}
                        columnId={col.id}
                        title={col.displayName}
                        tickets={board.getColumn(col.stateId).tickets}
                        onTicketDrop={handleTicketDrop}
                    />
                ))}
            </ColumnsWrapper>
        </div>
    );
};