import { createContext, useContext } from 'react';
import { TicketService } from '../../domain/services/TicketService.js';
import { FirestoreRepository } from '../../infrastructure/persistence/firestore/FirestoreRepository.js';
import { Board } from '../../domain/entities/Board.js';

interface ServiceContainer {
    ticketService: TicketService,
    boardRepository: FirestoreRepository<Board>
}

const ServiceContext = createContext<ServiceContainer | null>(null);

export const ServiceProvider = ServiceContext.Provider;

export const useServices = (): ServiceContainer => {
    const context = useContext(ServiceContext);
    if (!context) {
        throw new Error('useServices must be used within a ServiceProvider');
    }
    return context;
};