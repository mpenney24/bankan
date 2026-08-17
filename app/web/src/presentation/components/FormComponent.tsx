import { FieldPath, FieldValues, useFormContext } from 'react-hook-form';

interface FormFieldProps<T extends FieldValues> {
    name: FieldPath<T>;
    label: string;
    placeholder?: string;
    isTextarea?: boolean;
    containerClassName?: string;
}

export function FormField<T extends FieldValues>({
    name,
    label,
    placeholder,
    isTextarea = false,
    containerClassName = 'form-group',
}: FormFieldProps<T>) {
    const {
        register,
        formState: { errors },
    } = useFormContext<T>();

    const errorMessage = name.split('.').reduce((obj: any, key) => obj?.[key], errors)
        ?.message as string | undefined;

    return (
        <div className={containerClassName}>
            <label>{label}</label>
            {isTextarea ? (
                <textarea placeholder={placeholder} {...register(name)} />
            ) : (
                <input type="text" placeholder={placeholder} {...register(name)} />
            )}
            {errorMessage && <span className="error">{errorMessage}</span>}
        </div>
    );
}
