import { Controller, useFormContext } from 'react-hook-form';

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
};

export default function RHFInput({
    name,
    className,
    required,
    type = 'text',
    label,
    ...other
}: RHFInputProps) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
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
                        type={type}
                        onChange={(event) => field.onChange(event.target.value)}
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
