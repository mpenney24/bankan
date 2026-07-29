import React from 'react';
import { ColumnComponent } from '../components/ColumnComponent.js';
import { styled } from 'styled-components';
import { useBoard } from '../hooks/useBoard.js';

const ColumnsWrapper = styled.div`
    display: flex;
    flex-direction: row;
    gap: 1.5rem;
    align-items: flex-start;
    overflow-x: auto;
    padding-bottom: 1rem;
    width: 100%;

    & > * {
        flex: 1;
        min-width: 280px;
        max-width: 350px;
    }
`;

const BOARD_ID: string = import.meta.env.VITE_FIREBASE_BOARD_ID;

export const BoardView: React.FC = () => {
    const { board, loading, error, handleTicketDrop } = useBoard(BOARD_ID);

    if (loading) return <div>Loading board...</div>;
    if (error) return <div>Error loading board: {error.message}</div>;
    if (!board) return <div>Board not found</div>;

    return (
        <div className="board-wrapper">
            <h1 className="board-title">Bankan Board</h1>
            <ColumnsWrapper>
                {board.columns.map(col => (
                    <ColumnComponent
                        key={col.id}
                        columnId={col.id}
                        title={col.displayName}
                        tickets={board.getColumn(col.id).tickets}
                        onTicketDrop={handleTicketDrop}
                    />
                ))}
            </ColumnsWrapper>
        </div>
    );
};