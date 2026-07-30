import { ZodType, ZodError } from 'zod';

// Mitch - delete this if not using?

export function withValidation<TOutput, TInput, TArgs extends any[]>(
    schema: ZodType<TOutput, any>,
    handler: (parsedData: TOutput, ...args: TArgs) => Promise<void> | void,
    errorHandler?: (error: ZodError) => void
) {
    return async (rawPayload: TInput, ...args: TArgs) => {
        try {
            const parsedData = schema.parse(rawPayload);
            return await handler(parsedData, ...args);
        } catch (error) {
            if (error instanceof ZodError) {
                if (errorHandler) {
                    errorHandler(error);
                } else {
                    console.error("Validation failed:", error.message);
                }
                return;
            }
            throw error;
        }
    };
}