export const ERROR_CODES = {
    B00: (columnId: string) => `B00: Column id ${columnId} does not exist on the board`,
    B01: (ticketId: string) => `B01: Ticket id ${ticketId} does not exist on the board`,
    F00: 'F00: Invalid document id: id cannot be empty',
    F01: (documentId: string) => `F01: Invalid document id: id ${documentId} could not be found`,
    UIB01: 'UIB01: Failed to update board, rolling back:',
    UIT01: 'UIB01: Failed to add ticket, rolling back:',
    ZUIB01: 'ZUIB01: Invalid drag-and-drop payload:'
} as const;