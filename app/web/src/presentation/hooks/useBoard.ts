import {
    AddTicketCommand,
    BoardId,
    ERROR_CODES,
    IBoardExternal,
    ICreateTicket,
    IMoveTicket,
    MoveTicketCommand,
    Result,
} from '@bankan/domain';
import * as Sentry from '@sentry/react';
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
    }, [board]);

    const handleTicketDrop = useCallback(
        async ({ ticketId, targetColumnId }: IMoveTicket) => {
            const execute = createBoardAction((command: MoveTicketCommand) =>
                boardServiceFacade.moveTicket(command)
            );
            await execute({ boardId, ticketId, targetColumnId });
        },
        [board]
    );

    const handleAddTicket = useCallback(
        async (createTicketPayload: ICreateTicket) => {
            const execute = createBoardAction((command: AddTicketCommand) =>
                boardServiceFacade.addTicket(command)
            );
            await execute({ boardId, createTicketPayload });
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

function createBoardAction<TCommand extends Record<string, any>>(
    boardServiceFacadeUpdate: (command: TCommand) => Promise<Result<void>>
) {
    return async (command: TCommand) => {
        // Mitch - These now throw errors due to great encapsulation of the domain!

        // const col = board.columns[0]!
        // board.columns.push()
        // col.tickets.push();
        // col._removeTicket('a');
        // col.tickets[0]._transitionTo();

        const result = await boardServiceFacadeUpdate(command);

        if (result.isFailure) {
            const errorCode = ERROR_CODES.UIB01;
            console.error(errorCode, result.error);
            toast.error(errorCode);

            Sentry.withScope((scope) => {
                scope.setContext('command', command);
                scope.setTag('error_code', errorCode);
                Sentry.captureException(new Error(result.error));
            });
        }
    };
}
