import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { Board } from '../../domain/entities/Board.js';
import { ERROR_CODES } from '../../errors/ErrorCodes.js';
import { ICreateTicket, IMoveTicket } from '../../domain/entities/TicketSchema.js';
import { useServices } from '../services/ServiceContext.js';
import { Result } from '../../domain/common/Result.js';
import { IBoardExternal } from '../../domain/entities/BoardSchema.js';

export function useBoard(boardId: string) {
    const { ticketService, boardRepository } = useServices();
    const [board, setBoard] = useState<IBoardExternal | null>(null);
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
        update: (boardToMutate: Board) => Promise<Result<void>>
    ) => {
        if (!board) return;

        // These now throw errors due to great encapsulation of the domain!

        // const col = board.columns[0]!
        // board.columns.push()
        // col.tickets.push();
        // col._removeTicket('a');
        // col.tickets[0]._transitionTo();
        
        const boardToMutate = board.clone();

        const result = await update(boardToMutate);

        if(result.isFailure) {
            console.error(ERROR_CODES.UIB01, result.error);
            toast.error(ERROR_CODES.UIB01);
            setBoard(board);
        }
    }

    const handleTicketDrop = useCallback(async (payload: IMoveTicket) => {
        await updateBoard((boardToMutate) => 
            ticketService.moveTicket(boardToMutate, payload.ticketId, payload.targetColumnId)
        );
    }, [board, ticketService]);

    const handleAddTicket = useCallback(async (payload: ICreateTicket) => {
        await updateBoard((boardToMutate) => 
            ticketService.addTicket(boardToMutate, payload)
        );
    }, [board, ticketService]);

    return { board, loading, error, handleTicketDrop, handleAddTicket };
}