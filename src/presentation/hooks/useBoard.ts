import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { Board } from '../../domain/entities/Board.js';
import { Repositories } from '../../infrastructure/persistence/firestore/Repositories.js';
import { TicketService } from '../../domain/services/TicketService.js';
import { ERROR_CODES } from '../../errors/ErrorCodes.js';
import { ICreateTicket, IMoveTicket } from '../../domain/entities/TicketSchema.js';

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

    const updateBoard = async (
        update: (optimisticBoard: Board) => void
    ) => {
        if (!board) return;

        const backupBoard = board;
        
        const optimisticBoard = Repositories.board.clone(board);
        update(optimisticBoard);
        setBoard(optimisticBoard);

        try {
            // Mitch - remove this when done testing
            // await new Promise((resolve) => setTimeout(resolve, 1000));
            // throw new Error("Simulated network failure");
            await Repositories.board.save(optimisticBoard);
        } catch (err) {
            console.error(ERROR_CODES.UIB01, err);
            toast.error('Failed to update board, rolling back...');
            setBoard(backupBoard);
        }
    }

    const handleTicketDrop = useCallback(async (payload: IMoveTicket) => {
        await updateBoard((optimisticBoard) => 
            TicketService.moveTicket(optimisticBoard, payload.ticketId, () => payload.targetColumnId)
        );
    }, [board]);

    const handleAddTicket = useCallback(async (payload: ICreateTicket) => {
        await updateBoard((optimisticBoard) => 
            TicketService.addTicket(optimisticBoard, payload)
        );
    }, [board]);

    return { board, loading, error, handleTicketDrop, handleAddTicket };
}