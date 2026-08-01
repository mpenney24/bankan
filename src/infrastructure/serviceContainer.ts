import { InMemoryEventDispatcher } from '../domain/events/DomainEventDispatcher.js';
import { FirestoreRepository } from './persistence/firestore/FirestoreRepository.js';
import { Board } from '../domain/entities/Board.js';
import { BoardSchema } from '../domain/entities/BoardSchema.js';
import { TicketService } from '../domain/services/TicketService.js';
import { getFirestoreDb } from './persistence/firestore/connection.js';
import { registerDomainEvents } from './events/registerEvents.js';

const eventDispatcher = new InMemoryEventDispatcher();
registerDomainEvents(eventDispatcher);

const boardRepository = new FirestoreRepository(
    getFirestoreDb(), 
    'boards', 
    Board, 
    BoardSchema
);

const ticketService = new TicketService(boardRepository, eventDispatcher);

export { ticketService, boardRepository };