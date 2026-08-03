export const ERROR_CODES = {
    B00: (columnId: string) => `Column id ${columnId} does not exist on the board`,
    B01: (ticketId: string) => `Ticket id ${ticketId} does not exist on the board`,
    B02: (boardId: string) => `Board id ${boardId} could not be found`,
    F00: 'Invalid document id: id cannot be empty',
    F01: (documentId: string) => `Invalid document id: id ${documentId} could not be found`,
    UIB01: 'Failed to update board, rolling back:',
    UIT01: 'Failed to add ticket, rolling back:',
    UIT02: 'Failed to load tickets. Please refresh the page and try again.',
    ZUIB01: 'Invalid drag-and-drop payload:'
} as const;