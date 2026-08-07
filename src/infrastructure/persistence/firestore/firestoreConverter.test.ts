import { ClassConstructor, instanceToPlain } from 'class-transformer';
import { QueryDocumentSnapshot } from 'firebase/firestore';
import { beforeEach,describe, expect, it } from 'vitest';
import { ZodType } from 'zod';

import { Board } from '../../../domain/entities/Board.js';
import { BoardSchema } from '../../../domain/entities/BoardSchema.js';
import { Column } from '../../../domain/entities/Column.js';
import { ColumnSchema } from '../../../domain/entities/ColumnSchema.js';
import { Ticket } from '../../../domain/entities/Ticket.js';
import { TicketSchema } from '../../../domain/entities/TicketSchema.js';
import * as h from '../../../domain/test/helpers.js';
import { createFirestoreConverter } from './firestoreConverter.js';

describe('createFirestoreConverter', () => {
    let board: Board;
    let column: Column;
    let ticket: Ticket;

    beforeEach(() => {
        board = h.createBoard();
        column = board.columns.find((col) => col.id === h.COLUMN_ID_BACKLOG)!;
        ticket = column.tickets[0]!;
    });

    describe('#toFirestore', () => {
        it('should successfully compose Board object into Firestore-compatible document', () => {
            verifyFirestoreComposition(board, BoardSchema);
        });

        it('should successfully compose Column object into Firestore-compatible document', () => {
            verifyFirestoreComposition(column, ColumnSchema);
        });

        it('should successfully compose Ticket object into Firestore-compatible document', () => {
            verifyFirestoreComposition(ticket, TicketSchema);
        });

        function verifyFirestoreComposition(
            modelInstance: any,
            schema: ZodType<any>
        ): void {
            const clazz = modelInstance.constructor as ClassConstructor<any>;
            const converter = createFirestoreConverter(clazz, schema);
            const doc = converter.toFirestore(modelInstance);

            expect(doc).not.toEqual({});

            const expectedPlain = instanceToPlain(modelInstance, {
                strategy: 'excludeAll',
            });

            expect(doc).toEqual(expectedPlain);

            Object.keys(doc).forEach((key) => {
                expect(key.startsWith('_')).toBe(false);
            });
        }

        it('should successfully process a POJO into Firestore-compatible document without further class or schema parsing', () => {
            const obj = {
                id: 'POJO',
            };

            const converter = createFirestoreConverter();
            const result = converter.toFirestore(obj);

            expect(result).toBe(obj);
        });
    });

    describe('#fromFirestore', () => {
        it('should successfully decompose Firestore document into Board object', () => {
            verifyFirestoreDeomposition(board, BoardSchema);
        });

        it('should successfully decompose Firestore document into Column object', () => {
            verifyFirestoreDeomposition(column, ColumnSchema);
        });

        it('should successfully decompose Firestore document into Ticket object', () => {
            verifyFirestoreDeomposition(ticket, TicketSchema);
        });

        function verifyFirestoreDeomposition(
            modelInstance: any,
            schema: ZodType<any>
        ): void {
            const clazz = modelInstance.constructor as ClassConstructor<any>;
            const converter = createFirestoreConverter(clazz, schema);

            const plainData = instanceToPlain(modelInstance, {
                strategy: 'excludeAll',
            });

            const mockSnapshot = h.mock<QueryDocumentSnapshot>({
                id: modelInstance.id,
                data: () => plainData,
            });

            const object = converter.fromFirestore(mockSnapshot);

            expect(object).toEqual(modelInstance);
        }

        it('should successfully process a Firestore document into POJO without further class or schema parsing', () => {
            const obj = {
                id: 'POJO',
            };

            const mockSnapshot = h.mock<QueryDocumentSnapshot>({
                id: obj.id,
                data: () => obj,
            });

            const converter = createFirestoreConverter();
            const result = converter.fromFirestore(mockSnapshot);

            expect(result).toBe(obj);
        });
    });
});
