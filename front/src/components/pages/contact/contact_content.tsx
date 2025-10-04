'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';

const LeafletMap = dynamic(() => import('@/components/shared/leaflet_map'), { ssr: false });

export default function ContactContent() {
    const officeAddress = 'استان مرکزی، اراک، خیابان آیت الله غفاری، تقاطع خیابان جواد الائمه (جهرم)';
    const factoryAddress =
        'استان مرکزی، کیلومتر 5 جاده فرمهین آشتیان، شهرک صنعتی فرمهین، انتهای خیابان امیرکبیر';
    const phone1 = '08633281160';
    const phone2 = '09183670194';
    return (
        <section className='custom-container flex gap-6 md:gap-8 py-4'>
            {/* Left: Contact form */}
            <div className='order-2 lg:order-1 relative w-full'>
                <div className='rounded-xl border bg-card p-5 space-y-4 sticky top-24'>
                    <h2 className='font-semibold text-primary-5'>ارسال پیام</h2>
                    <ContactForm />
                </div>
            </div>

            <div className='space-y-4 w-full'>
                <div className='rounded-xl border bg-card p-5 space-y-4 order-1 lg:order-2'>
                    <h2 className='font-semibold text-primary-5'>دفتر فروش</h2>
                    <p className='text-sm text-muted-foreground'>{officeAddress}</p>
                    <div className='flex flex-wrap gap-3 text-sm'>
                        <Link href={`tel:${phone1}`} className='underline hover:text-primary'>
                            {phone1}
                        </Link>
                        <span>•</span>
                        <Link href={`tel:${phone2}`} className='underline hover:text-primary'>
                            {phone2}
                        </Link>
                    </div>
                    <div className='w-full h-72 md:h-80 rounded-xl overflow-hidden border'>
                        <LeafletMap latitude={34.0989} longitude={49.6992} address={officeAddress} />
                    </div>
                </div>

                <div className='rounded-xl border bg-card p-5 space-y-4'>
                    <h2 className='font-semibold text-primary-5'>آدرس کارخانه</h2>
                    <p className='text-sm text-muted-foreground'>{factoryAddress}</p>
                    <div className='flex flex-wrap gap-3 text-sm'>
                        <Link href={`tel:${phone1}`} className='underline hover:text-primary'>
                            {phone1}
                        </Link>
                        <span>•</span>
                        <Link href={`tel:${phone2}`} className='underline hover:text-primary'>
                            {phone2}
                        </Link>
                    </div>
                    <div className='w-full h-72 md:h-80 rounded-xl overflow-hidden border'>
                        <LeafletMap
                            latitude={34.517474059639326}
                            longitude={49.74162999534025}
                            address={officeAddress}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import FormProvider from '@/components/shared/form-provider';
import RHFInput from '@/components/shared/rhf-input';
import RHFTextArea from '@/components/shared/rhf-textarea';
import { Button } from '@/components/ui/button';

const schema = yup.object({
    firstName: yup.string().required('نام الزامی است'),
    lastName: yup.string().required('نام خانوادگی الزامی است'),
    email: yup.string().email('ایمیل معتبر نیست').required('ایمیل الزامی است'),
    phone: yup
        .string()
        .matches(/^\d{10,11}$/g, 'شماره معتبر نیست')
        .required('شماره تماس الزامی است'),
    message: yup.string().required('متن پیام الزامی است')
});

type FormValues = yup.InferType<typeof schema>;

function ContactForm() {
    const methods = useForm<FormValues>({ resolver: yupResolver(schema) });
    const {
        handleSubmit,
        formState: { isSubmitting },
        reset
    } = methods;

    async function onSubmit(values: FormValues) {
        try {
            // TODO: integrate API
            console.log('contact submit', values);
            reset();
            alert('پیام شما ارسال شد');
        } catch {
            alert('ارسال ناموفق بود');
        }
    }

    return (
        <FormProvider
            methods={methods}
            onSubmit={handleSubmit(onSubmit)}
            className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            <RHFInput required name='firstName' label='نام' placeholder='نام شما' />
            <RHFInput required name='lastName' label='نام خانوادگی' placeholder='نام خانوادگی شما' />
            <RHFInput required name='email' type='email' label='ایمیل' placeholder='example@email.com' />
            <RHFInput required name='phone' label='شماره تماس' placeholder='09xxxxxxxxx' />
            <div className='md:col-span-2'>
                <RHFTextArea required name='message' label='متن پیام' placeholder='سوال یا درخواست شما...' />
            </div>
            <div className='md:col-span-2'>
                <Button type='submit' disabled={isSubmitting} className='w-full md:w-auto'>
                    ارسال پیام
                </Button>
            </div>
        </FormProvider>
    );
}
