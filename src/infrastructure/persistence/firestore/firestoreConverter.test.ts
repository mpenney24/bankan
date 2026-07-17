import { describe, it, expect, beforeEach } from "vitest";
import * as h from "../../../domain/test/helpers.js";
import { Board } from "../../../domain/entities/Board.js";
import { Column } from "../../../domain/entities/Column.js";
import { Ticket } from "../../../domain/entities/Ticket.js";
import { createFirestoreConverter } from "./firestoreConverter.js";
import { ClassConstructor, instanceToPlain } from "class-transformer";
import { QueryDocumentSnapshot } from "firebase-admin/firestore";

describe('createFirestoreConverter', () => {

    let board: Board;
    let column: Column;
    let ticket: Ticket;

    beforeEach(() => {
        board = h.createBoard();
        column = board.getColumn(h.COLUMN_ID_BACKLOG);
        ticket = column.tickets[0]!;
    });

    describe('#toFirestore', () => {

        it('should successfully compose Column object into Firestore-compatible document', () => {
            verifyFirestoreComposition(column);
        });

        it('should successfully compose Ticket object into Firestore-compatible document', () => {
            verifyFirestoreComposition(ticket);
        });

        function verifyFirestoreComposition(modelInstance: any): void {
            const clazz = modelInstance.constructor as ClassConstructor<any>;
            const converter = createFirestoreConverter(clazz);
            const doc = converter.toFirestore(modelInstance);

            expect(doc).not.toEqual({});

            const expectedPlain = instanceToPlain(modelInstance, {
                strategy: 'excludeAll'
            });

            expect(doc).toEqual(expectedPlain);

            Object.keys(doc).forEach(key => {
                expect(key.startsWith('_')).toBe(false);
            });
        }

    });

    describe('#fromFirestore', () => {

        it('should successfully decompose Firestore document into Column object', () => {
            verifyFirestoreDeomposition(column);
        });

        it('should successfully decompose Firestore document into Ticket object', () => {
            verifyFirestoreDeomposition(ticket);
        });

        function verifyFirestoreDeomposition(modelInstance: any): void {
            const clazz = modelInstance.constructor as ClassConstructor<any>;
            const converter = createFirestoreConverter(clazz);
    
            const plainData = instanceToPlain(modelInstance, {
                strategy: 'excludeAll'
            });

            const mockSnapshot = {
                id: modelInstance.id,
                exists: true,
                data: () => plainData,
            } as unknown as QueryDocumentSnapshot; 

            const object = converter.fromFirestore(mockSnapshot);

            expect(object).toEqual(modelInstance);
        }

    });

});