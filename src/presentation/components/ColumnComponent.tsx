import React, { useState } from 'react';
import { Ticket } from '../../domain/entities/Ticket.js';
import { TicketComponent } from './TicketComponent.js';
import { Result } from '../../domain/common/Result.js';
import { ERROR_CODES } from '../../errors/ErrorCodes.js';

interface Props {
    columnId: string;
    title: string;
    tickets: Result<Ticket[]>;
    onTicketDrop: (ticketId: string, targetColumnId: string) => void;
}

export const ColumnComponent: React.FC<Props> = React.memo(({ columnId, title, tickets, onTicketDrop }) => {
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
        
        const ticketId = e.dataTransfer.getData('text/plain');
        if (ticketId) {
            onTicketDrop(ticketId, columnId);
        }
    };

    return (
        <div
            className={`column ${isDragOver ? 'drag-over' : ''}`}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{ minHeight: '300px' }}
        >
            <div className="column-header">{title}</div>
            <div className="ticket-list">
                {tickets.isSuccess ? (
                    tickets.value.map((ticket) => (
                        <TicketComponent key={ticket.id} ticket={ticket} />
                    ))
                ) : (
                    <div>{ERROR_CODES.UIT02}</div>
                )}
            </div>
        </div>
    );
});