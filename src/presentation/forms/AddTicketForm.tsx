import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { CreateTicketSchema, ICreateTicket } from '../../domain/entities/TicketSchema.js';
import { ERROR_CODES } from '../../errors/ErrorCodes.js';
import { FormField } from '../components/FormComponent.js';

interface AddTicketFormProps {
    onAddTicket: (payload: ICreateTicket) => void;
}

export const AddTicketForm: React.FC<AddTicketFormProps> = ({ onAddTicket }) => {
    const methods = useForm({
        resolver: zodResolver(CreateTicketSchema),
    });

    const onSubmit = (data: ICreateTicket) => {
        try {
            onAddTicket(data);
            methods.reset();
        } catch (error) {
            console.error(ERROR_CODES.UIT01, error);
        }
    };

    const onError = (fieldErrors: typeof methods.formState.errors) => {
        console.warn('⚠️ Zod Validation Failed:', fieldErrors);
    };

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={methods.handleSubmit(onSubmit, onError)}
                className="add-ticket-form"
            >
                <div className="ticket-form-fields">
                    <FormField
                        name="name"
                        label="Ticket Name"
                        placeholder="e.g., Fix login bug"
                    />

                    <FormField name="priority" label="Priority" />

                    <FormField
                        name="description"
                        label="Description"
                        placeholder="Details of the login bug..."
                        isTextarea={true}
                        containerClassName="form-group full-width"
                    />
                </div>

                <div className="ticket-form-actions">
                    <button type="submit" className="primary-btn">
                        Create Ticket
                    </button>
                </div>
            </form>
        </FormProvider>
    );
};
