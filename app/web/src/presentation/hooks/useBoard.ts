import {
    BoardId,
    ERROR_CODES,
    IBoardExternal,
    ICreateTicket,
    IMoveTicket,
    Result,
} from '@bankan/domain';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import { useServices } from '../services/ServiceContext';

export function useBoard(boardId: BoardId) {
    const { boardServiceFacade } = useServices();
    const [board, setBoard] = useState<IBoardExternal | null>(null);
    const [loading, setLoading] = useState(true);
    const [error] = useState<Error | null>(null);

    useEffect(() => {
        const unsubscribe = () =>
            boardServiceFacade.subscribeToBoard(boardId, (fetchedBoard) => {
                setBoard(fetchedBoard);
                setLoading(false);
            });

        return unsubscribe();
    }, [boardId]);

    const updateBoard = async (boardServiceFacadeUpdate: () => Promise<Result<void>>) => {
        if (!board) return;

        // These now throw errors due to great encapsulation of the domain!

        // const col = board.columns[0]!
        // board.columns.push()
        // col.tickets.push();
        // col._removeTicket('a');
        // col.tickets[0]._transitionTo();

        const result = await boardServiceFacadeUpdate();

        if (result.isFailure) {
            console.error(ERROR_CODES.UIB01, result.error);
            toast.error(ERROR_CODES.UIB01);
        }
    };

    const handleTicketDrop = useCallback(
        async ({ ticketId, targetColumnId }: IMoveTicket) => {
            await updateBoard(() =>
                boardServiceFacade.moveTicket({
                    boardId,
                    ticketId,
                    targetColumnId,
                })
            );
        },
        [board]
    );

    const handleAddTicket = useCallback(
        async (createTicketPayload: ICreateTicket) => {
            await updateBoard(() =>
                boardServiceFacade.addTicket({
                    boardId,
                    createTicketPayload,
                })
            );
        },
        [board]
    );

    return {
        board,
        loading,
        error,
        handleTicketDrop,
        handleAddTicket,
    };
}
