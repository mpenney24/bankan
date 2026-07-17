export const ERROR_CODES = {
    B00: (stateId: string) => `Column stateId ${stateId} does not exist on the board`,
    B01: (ticketId: string) => `Ticket id ${ticketId} does not exist on the board`,
} as const;