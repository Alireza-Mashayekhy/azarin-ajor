import { Controller, RegisterOptions, useFormContext } from 'react-hook-form';

import { Label } from '@/components/shared/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

// ----------------------------------------------------------------------

export type RHFTextAreaProps = React.ComponentProps<'textarea'> & {
    name: string;
    readOnly?: boolean;
    className?: string;
    label?: React.ReactNode;
    required?: boolean;
    rules?: RegisterOptions;
};

export default function RHFTextArea({ name, className, label, required, rules, ...other }: RHFTextAreaProps) {
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
                    <Textarea
                        {...field}
                        onChange={(event) => field.onChange(event.target.value)}
                        className={cn('rounded-md h-11', className)}
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
