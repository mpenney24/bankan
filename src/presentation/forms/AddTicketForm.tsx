import React from 'react';
import { useForm } from 'react-hook-form';
import { ICreateTicket, CreateTicketSchema } from '../../domain/entities/TicketSchema.js';
import { ERROR_CODES } from '../../errors/ErrorCodes.js';
import { zodResolver } from '@hookform/resolvers/zod';

interface AddTicketFormProps {
    onAddTicket: (payload: ICreateTicket) => void;
}

export const AddTicketForm: React.FC<AddTicketFormProps> = ({ onAddTicket }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(CreateTicketSchema)
    });

    // Mitch - make it so these onSuccess/onError are global and generic?
    const onSubmit = (data: ICreateTicket) => {
        console.log("🔥 onSubmit was successfully triggered by React Hook Form with data:", data);
        try {
            onAddTicket(data);
            reset();
        } catch (error) {
            console.error(ERROR_CODES.UIT01, error);
        }
    };

    const onError = (fieldErrors: typeof errors) => {
        console.warn("⚠️ Zod Validation Failed:", fieldErrors);
    };

    // are the errors.priority bits needed and is there a better way to do it?

    return (
        <form onSubmit={handleSubmit(onSubmit, onError)} className="add-ticket-form">
            <div className="ticket-form-fields">
                <div className="form-group">
                    <label>Ticket Name</label>
                    <input 
                        type="text" 
                        placeholder="e.g., Fix login bug" 
                        {...register('name')} 
                    />
                    {errors.name && <span className="error">{errors.name.message}</span>}
                </div>

                <div className="form-group">
                    <label>Priority</label>
                    <input 
                        type="text" 
                        {...register('priority')} 
                    />
                    {errors.priority && <span className="error">{errors.priority.message}</span>}
                </div>

                <div className="form-group full-width">
                    <label>Description</label>
                    <textarea 
                        placeholder="Detailed description..." 
                        {...register('description')} 
                    />
                    {errors.description && <span className="error">{errors.description.message}</span>}
                </div>
            </div>

            <div className="ticket-form-actions">
                <button type="submit" className="primary-btn">Create Ticket</button>
            </div>
        </form>
    );
};