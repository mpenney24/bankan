import React, { useState } from 'react';

import { Result } from '../../domain/common/Result.js';
import { ColumnId, TicketId, TicketIdSchema } from '../../domain/common/Types.js';
import { Ticket } from '../../domain/entities/Ticket.js';
import { ERROR_CODES } from '../../errors/ErrorCodes.js';
import { TicketComponent } from './TicketComponent.js';

interface Props {
    columnId: ColumnId;
    title: string;
    tickets: Result<ReadonlyArray<Ticket>>;
    onTicketDrop: (ticketId: TicketId, targetColumnId: ColumnId) => void;
}

export const ColumnComponent: React.FC<Props> = React.memo(
    ({ columnId, title, tickets, onTicketDrop }) => {
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
                onTicketDrop(TicketIdSchema.parse(ticketId), columnId);
            }
        };

        return (
            <div
                className={`column ${isDragOver ? 'drag-over' : ''}`}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{
                    minHeight: '300px',
                }}
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
    }
);
