import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { Board } from '../../domain/entities/Board.js';
import { ERROR_CODES } from '../../errors/ErrorCodes.js';
import { ICreateTicket, IMoveTicket } from '../../domain/entities/TicketSchema.js';
import { useServices } from '../services/ServiceContext.js';

export function useBoard(boardId: string) {
    const { ticketService, boardRepository } = useServices();
    const [board, setBoard] = useState<Board | null>(null);
    const [loading, setLoading] = useState(true);
    const [error] = useState<Error | null>(null);

    useEffect(() => {
        const unsubscribe = boardRepository.subscribe(boardId, (fetchedBoard) => {
            setBoard(fetchedBoard);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [boardId]);

    const updateBoard = async (
        update: (mutatedBoard: Board) => Promise<void>
    ) => {
        if (!board) return;
        
        const mutatedBoard = board.clone();

        try {
            await update(mutatedBoard);
        } catch (err) {
            console.error(ERROR_CODES.UIB01, err);
            toast.error('Failed to update board, rolling back...');
            setBoard(board);
        }
    }

    const handleTicketDrop = useCallback(async (payload: IMoveTicket) => {
        await updateBoard((mutatedBoard) => 
            ticketService.moveTicket(mutatedBoard, payload.ticketId, payload.targetColumnId)
        );
    }, [board, ticketService]);

    const handleAddTicket = useCallback(async (payload: ICreateTicket) => {
        await updateBoard((mutatedBoard) => 
            ticketService.addTicket(mutatedBoard, payload)
        );
    }, [board, ticketService]);

    return { board, loading, error, handleTicketDrop, handleAddTicket };
}