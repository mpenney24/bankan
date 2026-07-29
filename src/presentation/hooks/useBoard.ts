import { useState, useEffect, useCallback } from 'react';
import { Board } from '../../domain/entities/Board.js';
import { Repositories } from '../../infrastructure/persistence/firestore/Repositories.js';
import { TicketService } from '../../domain/services/TicketService.js';

export function useBoard(boardId: string) {
    const [board, setBoard] = useState<Board | null>(null);
    const [loading, setLoading] = useState(true);
    const [error] = useState<Error | null>(null);

    useEffect(() => {
        const unsubscribe = Repositories.board.subscribe(boardId, (fetchedBoard) => {
            setBoard(fetchedBoard);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [boardId]);

    const handleTicketDrop = useCallback(async (ticketId: string, targetColumnId: string) => {
        if (!board) return;

        try {
            TicketService.moveTicket(board, ticketId, () => targetColumnId);
            await Repositories.board.save(board);
        } catch (error) {
            console.error('Failed to move ticket:', error);
        }
    }, [board]);

    return { board, loading, error, handleTicketDrop };
}