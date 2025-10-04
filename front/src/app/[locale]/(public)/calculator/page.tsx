import type { Metadata } from 'next';
import Link from 'next/link';

import CalculatorForm from '@/components/pages/calculator/calculator_form';
import BreadcrumbSchema from '@/components/shared/breadcrumb-schema';

export const metadata: Metadata = {
    title: 'محاسبه‌گر تعداد سنگ/آجر | آذرین آجر',
    description:
        'با وارد کردن متراژ دیوارها و کسر متراژ در و پنجره‌ها، تعداد تقریبی قطعات موردنیاز را محاسبه کنید. مناسب برای برآورد سریع خرید.',
    alternates: {
        canonical: '/calculator',
        languages: { en: '/en/calculator', fa: '/fa/calculator' }
    },
    openGraph: {
        title: 'محاسبه‌گر تعداد سنگ/آجر | آذرین آجر',
        description:
            'محاسبه تعداد موردنیاز قطعات با وارد کردن مساحت دیوار، در و پنجره و مشخصات پوشش هر قطعه.',
        url: '/calculator',
        type: 'website',
        locale: 'fa_IR'
    }
};

const products = [
    { slug: 'brick-standard', title: 'آجر نما استاندارد' },
    { slug: 'stone-travertine', title: 'سنگ تراورتن' },
    { slug: 'ceramic-30x60', title: 'سرامیک 30×60' }
];

export default function CalculatorPage() {
    const faqLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: 'چطور تعداد موردنیاز را محاسبه کنیم؟',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'مساحت خالص = مساحت کل دیوارها − مساحت در و پنجره‌ها. سپس درصد پرت (مثلاً ۱۰٪) اضافه شود و بر مساحت پوشش هر قطعه تقسیم شود.'
                }
            }
        ]
    };

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
            <BreadcrumbSchema
                items={[{ name: 'خانه', item: '/' }, { name: 'محاسبه‌گر' }]}
                id='json-ld-breadcrumb-calculator'
            />

            <nav className='custom-container py-4 text-sm text-muted-foreground'>
                <ol className='flex items-center gap-2'>
                    <li>
                        <Link href='/' className='link'>
                            خانه
                        </Link>
                    </li>
                    <span>/</span>
                    <li className='text-foreground'>محاسبه‌گر</li>
                </ol>
            </nav>

            <section className='pb-6 md:pb-10'>
                <div className='custom-container grid grid-cols-1 lg:grid-cols-2 gap-6'>
                    <div className='rounded-xl border bg-card p-5 space-y-4'>
                        <h1 className='text-2xl md:text-3xl font-bold text-primary-5'>
                            محاسبه‌گر تعداد قطعات
                        </h1>
                        <p className='text-sm text-muted-foreground'>
                            برای برآورد تعداد سنگ/آجر/سرامیک موردنیاز:
                        </p>
                        <ol className='list-decimal pr-5 text-sm text-muted-foreground space-y-1'>
                            <li>مساحت کل دیوارها را وارد کنید.</li>
                            <li>مساحت در و پنجره‌ها را کم کنید.</li>
                            <li>مساحت پوشش هر قطعه را وارد کنید (مثلاً 0.18 m²).</li>
                            <li>درصد پرت (برش و شکستگی) را لحاظ کنید.</li>
                        </ol>
                        <p className='text-xs text-muted-foreground'>
                            نکته: نتایج تقریبی است. شرایط اجرا و نوع چیدمان می‌تواند مقدار واقعی را تغییر دهد.
                        </p>
                    </div>
                    <div className='rounded-xl border bg-card p-5'>
                        <CalculatorForm products={products} />
                    </div>
                </div>
            </section>
        </>
    );
}
