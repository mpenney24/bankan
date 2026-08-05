import React, { useState } from 'react';
import { ColumnComponent } from '../components/ColumnComponent.js';
import { styled } from 'styled-components';
import { useBoard } from '../hooks/useBoard.js';
import { AddTicketForm } from '../forms/AddTicketForm.js';
import { BoardId } from '../../domain/common/Types.js';
import { ColumnByIdSpec } from '../../domain/common/specifications/ColumnSpecs.js';

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

const BOARD_ID: BoardId = import.meta.env.VITE_FIREBASE_BOARD_ID;

export const BoardView: React.FC = () => {
    const { board, loading, error, handleTicketDrop, handleAddTicket } = useBoard(BOARD_ID);
    const [isAdding, setIsAdding] = useState(false);

    if (loading) return <div>Loading board...</div>;
    if (error) return <div>Error loading board: {error.message}</div>;
    if (!board) return <div>Board not found</div>;

    return (
        <div className="board-wrapper">
            <div className="board-header">
                <h1 className="board-title">Bankan Board</h1>

                <button onClick={() => setIsAdding(true)} className="primary-btn">
                    + Add Ticket
                </button>

                {isAdding && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <button 
                                className="modal-close" 
                                onClick={() => setIsAdding(false)}
                            >
                                &times;
                            </button>
                            
                            <AddTicketForm 
                                onAddTicket={(payload) => {
                                    handleAddTicket(payload);
                                    setIsAdding(false);
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>

            <ColumnsWrapper>
                {board.columns.map(col => (
                    <ColumnComponent
                        key={col.id}
                        columnId={col.id}
                        title={col.displayName}
                        tickets={board.getTickets({ columnSpec: new ColumnByIdSpec(col.id) })}
                        onTicketDrop={(ticketId, targetColumnId) => handleTicketDrop({ ticketId, targetColumnId })}
                    />
                ))}
            </ColumnsWrapper>
        </div>
    );
};