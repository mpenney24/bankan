import React, { useState } from 'react';
import { Ticket } from '../../domain/entities/Ticket.js';
import { TicketComponent } from './TicketComponent.js';

interface Props {
    columnId: string;
    title: string;
    tickets: Ticket[];
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
        >
            <div className="column-header">{title}</div>
            <div className="ticket-list">
                {tickets.map((ticket) => (
                    <TicketComponent key={ticket.id} ticket={ticket} />
                ))}
            </div>
        </div>
    );
});