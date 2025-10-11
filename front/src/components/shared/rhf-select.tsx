import { Controller, RegisterOptions, useFormContext } from 'react-hook-form';

import { Label } from '@/components/shared/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// ----------------------------------------------------------------------

export type RHFSelectProps = {
    name: string;
    className?: string;
    label?: React.ReactNode;
    required?: boolean;
    options: { value: string | number; label: string }[];
    placeholder?: string;
    rules?: RegisterOptions;
    disabled?: boolean;
};

export default function RHFSelect({
    name,
    className,
    label,
    required,
    options,
    placeholder = 'Select an option',
    rules,
    disabled
}: RHFSelectProps) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            rules={required ? { required: `${label || name} is required`, ...rules } : rules}
            render={({ field, fieldState: { error } }) => (
                <div className='flex flex-col gap-1'>
                    {label ? (
                        <Label htmlFor={name} className='mb-1'>
                            {label}
                            {required ? <span className='text-destructive'>*</span> : null}
                        </Label>
                    ) : null}
                    <Select
                        value={field.value?.toString() || ''}
                        onValueChange={(value) => {
                            // Try to convert to number if the original type was number
                            const numValue = Number(value);
                            field.onChange(isNaN(numValue) ? value : numValue);
                        }}
                        disabled={disabled}>
                        <SelectTrigger
                            className={`w-full ${error ? 'border-destructive' : ''} ${className || ''}`}
                            aria-invalid={Boolean(error)}>
                            <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                            {options.map((option) => (
                                <SelectItem key={option.value} value={option.value.toString()}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {error?.message ? <p className='text-xs text-destructive'>{error.message}</p> : null}
                </div>
            )}
        />
    );
}
