import { Controller, RegisterOptions, useFormContext } from 'react-hook-form';

import { Label } from '@/components/shared/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// ----------------------------------------------------------------------

export type RHFInputProps = React.ComponentProps<'input'> & {
    name: string;
    readOnly?: boolean;
    className?: string;
    label?: React.ReactNode;
    required?: boolean;
    rules?: RegisterOptions;
    formatNumber?: boolean; // Format numbers with thousand separators
};

export default function RHFInput({
    name,
    className,
    required,
    type = 'text',
    label,
    rules,
    formatNumber = false,
    ...other
}: RHFInputProps) {
    const { control } = useFormContext();

    const formatNumberValue = (value: string | number): string => {
        if (!formatNumber || value === '' || value === null || value === undefined)
            return String(value || '');

        // Remove any non-digit characters except decimal point
        const cleanValue = String(value).replace(/[^\d.]/g, '');

        // Split by decimal point
        const parts = cleanValue.split('.');

        // Format the integer part with thousand separators
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        return parts.join('.');
    };

    const parseNumberValue = (value: string): number | string => {
        if (!formatNumber || value === '') return value;

        // Remove commas and parse as number
        const cleanValue = value.replace(/,/g, '');
        const parsed = parseFloat(cleanValue);

        return isNaN(parsed) ? '' : parsed;
    };

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
                    <Input
                        {...field}
                        type={formatNumber ? 'text' : type}
                        value={formatNumber ? formatNumberValue(field.value) : field.value}
                        onChange={(event) => {
                            const value = formatNumber
                                ? parseNumberValue(event.target.value)
                                : event.target.value;
                            field.onChange(value);
                        }}
                        className={cn('rounded-md', className)}
                        {...other}
                        aria-invalid={Boolean(error)}
                        id={name}
                        placeholder={other?.placeholder}
                    />
                    {error?.message ? <p className='text-xs text-destructive'>{error.message}</p> : null}
                </div>
            )}
        />
    );
}
