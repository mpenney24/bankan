// src/presentation/components/TicketCard.tsx
import { Ticket } from '@bankan/domain';
import React from 'react';
import { styled } from 'styled-components';

const CardContainer = styled.div`
    background-color: white;
    border: 1px solid lightgrey;
    border-radius: 6px;
    padding: 1rem;
    margin-bottom: 0.5rem;
    cursor: grab;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    &:active {
        cursor: grabbing;
    }
`;

const TicketTitle = styled.h4`
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
    color: #333;
`;

const TicketDescription = styled.p`
    margin: 0;
    font-size: 0.875rem;
    color: #666;
`;

interface Props {
    ticket: Ticket;
}

export const TicketComponent: React.FC<Props> = React.memo(({ ticket }) => {
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData('text/plain', ticket.id);
        e.dataTransfer.effectAllowed = 'move';
    };

    return (
        <CardContainer draggable={true} onDragStart={handleDragStart}>
            <TicketTitle>{ticket.name}</TicketTitle>
            {ticket.description && (
                <TicketDescription>{ticket.description}</TicketDescription>
            )}
        </CardContainer>
    );
});
