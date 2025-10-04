'use client';
import { FormProvider as Form, UseFormReturn } from 'react-hook-form';

// ----------------------------------------------------------------------
type Props = {
    children: React.ReactNode;
    methods: UseFormReturn<any>;
    onSubmit?: VoidFunction;
    style?: React.CSSProperties;
    className?: string;
};

export default function FormProvider({ children, onSubmit, methods, style, className = '' }: Props) {
    return (
        <Form {...methods}>
            <form onSubmit={onSubmit} style={style} className={className}>
                {children}
            </form>
        </Form>
    );
}
