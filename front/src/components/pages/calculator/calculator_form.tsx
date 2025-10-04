'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

import FormProvider from '@/components/shared/form-provider';
import RHFInput from '@/components/shared/rhf-input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type ProductOption = { slug: string; title: string };

const schema = yup.object({
    productSlug: yup.string().required('انتخاب محصول الزامی است'),
    wallArea: yup.number().typeError('عدد وارد کنید').min(0, 'منفی نباشد').required('مساحت دیوار الزامی است'),
    openingsArea: yup.number().typeError('عدد وارد کنید').min(0, 'منفی نباشد').default(0),
    coveragePerUnit: yup
        .number()
        .typeError('عدد وارد کنید')
        .moreThan(0, 'بیش از صفر باشد')
        .required('مساحت پوشش هر قطعه الزامی است'),
    wastePercent: yup
        .number()
        .typeError('عدد وارد کنید')
        .min(0, 'کمتر از ۰ نباشد')
        .max(30, 'بیشتر از ۳۰٪ توصیه نمی‌شود')
        .default(10)
});

type FormValues = yup.InferType<typeof schema>;

export default function CalculatorForm({ products }: { products: ProductOption[] }) {
    const methods = useForm<FormValues>({
        resolver: yupResolver(schema),
        defaultValues: { openingsArea: 0, wastePercent: 10 }
    });

    const {
        handleSubmit,
        control,
        formState: { isSubmitting },
        watch,
        setValue
    } = methods;

    const onSubmit = (values: FormValues) => {
        // compute
        const netArea = Math.max(0, values.wallArea - (values.openingsArea || 0));
        const withWaste = netArea * (1 + (values.wastePercent || 0) / 100);
        const units = Math.ceil(withWaste / values.coveragePerUnit);
        alert(
            `مساحت خالص: ${netArea.toFixed(2)} m²\nبا پرت: ${withWaste.toFixed(
                2
            )} m²\nتعداد قطعه موردنیاز: ${units}`
        );
    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-1 gap-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                <Controller
                    name='productSlug'
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <div className='flex flex-col gap-1 md:col-span-2'>
                            <label className='text-sm font-medium'>انتخاب محصول</label>
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder='محصول را انتخاب کنید' />
                                </SelectTrigger>
                                <SelectContent>
                                    {products.map((p) => (
                                        <SelectItem key={p.slug} value={p.slug}>
                                            {p.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {error?.message ? (
                                <p className='text-xs text-destructive'>{error.message}</p>
                            ) : null}
                        </div>
                    )}
                />

                <RHFInput name='wallArea' type='number' step='0.01' label='مساحت کل دیوارها (m²)' required />
                <RHFInput name='openingsArea' type='number' step='0.01' label='مساحت در و پنجره‌ها (m²)' />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                <RHFInput
                    name='coveragePerUnit'
                    type='number'
                    step='0.001'
                    label='مساحت پوشش هر قطعه (m²)'
                    required
                />
                <RHFInput name='wastePercent' type='number' step='1' label='درصد پرت (%)' />
            </div>

            <div>
                <Button type='submit' disabled={isSubmitting}>
                    محاسبه
                </Button>
            </div>
        </FormProvider>
    );
}
