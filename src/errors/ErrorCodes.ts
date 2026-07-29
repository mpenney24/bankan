export const ERROR_CODES = {
    B00: (columnId: string) => `Column id ${columnId} does not exist on the board`,
    B01: (ticketId: string) => `Ticket id ${ticketId} does not exist on the board`,
    F00: 'Invalid document id: id cannot be empty',
    F01: (documentId: string) => `Invalid document id: id ${documentId} could not be found`
} as const;