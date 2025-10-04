import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import BreadcrumbSchema from '@/components/shared/breadcrumb-schema';

export const metadata: Metadata = {
    title: 'درباره ما | آذرین آجر',
    description:
        'آذرین آجر؛ تولیدکننده آجر نما با کیفیت بالا. درباره تاریخچه، مأموریت، ارزش‌ها و تعهد ما به کیفیت بیشتر بدانید.',
    alternates: {
        canonical: '/about-us',
        languages: {
            en: '/en/about-us',
            fa: '/fa/about-us'
        }
    },
    openGraph: {
        title: 'درباره ما | آذرین آجر',
        description: 'آشنایی با آذرین آجر؛ تاریخچه، ارزش‌ها و تعهد ما به ارائه محصولات باکیفیت آجر نما.',
        url: '/about-us',
        type: 'website',
        locale: 'fa_IR'
    }
};

export default async function AboutUsPage() {
    const t = await getTranslations('home');

    const organizationLd = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'آذرین آجر',
        url: '/about-us',
        logo: '/logo.png',
        sameAs: ['https://instagram.com/', 'https://t.me/']
    };

    const webPageLd = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'درباره ما',
        url: '/about-us',
        breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, item: { '@id': '/', name: 'خانه' } },
                { '@type': 'ListItem', position: 2, item: { '@id': '/about-us', name: 'درباره ما' } }
            ]
        }
    };

    return (
        <>
            <script
                type='application/ld+json'
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
            />
            <script
                type='application/ld+json'
                dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }}
            />
            <BreadcrumbSchema
                items={[{ name: 'خانه', item: '/' }, { name: 'درباره ما' }]}
                id='json-ld-breadcrumb-about'
            />

            <nav className='custom-container py-4 text-sm text-muted-foreground'>
                <ol className='flex items-center gap-2'>
                    <li>
                        <Link href='/' className='link'>
                            خانه
                        </Link>
                    </li>
                    <span>/</span>
                    <li className='text-foreground'>درباره ما</li>
                </ol>
            </nav>

            <section className='py-4 md:py-8'>
                <div className='custom-container'>
                    <h1 className='text-2xl md:text-4xl font-bold text-primary-5 mb-3 font-auto'>
                        درباره آذرین آجر
                    </h1>
                    <p className='text-primary-3 font-auto max-w-3xl text-sm md:text-base'>
                        در آذرین آجر، ما با تکیه بر سال‌ها تجربه و تخصص، محصولاتی با کیفیت بالا، دوام و زیبایی
                        ارائه می‌دهیم. هدف ما خلق ارزش پایدار برای مشتریان از طریق نوآوری، صداقت و تعهد به
                        کیفیت است.
                    </p>
                </div>
            </section>

            <section className='custom-container grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 py-4'>
                <div className='rounded-xl border bg-card p-5'>
                    <h3 className='font-semibold text-primary-5 mb-2'>ماموریت ما</h3>
                    <p className='text-sm text-muted-foreground'>
                        ارائه آجر نما باکیفیت، ایمن و پایدار که استانداردهای روز صنعت را برآورده می‌کند.
                    </p>
                </div>
                <div className='rounded-xl border bg-card p-5'>
                    <h3 className='font-semibold text-primary-5 mb-2'>ارزش‌های ما</h3>
                    <ul className='list-disc pr-5 text-sm text-muted-foreground space-y-1'>
                        <li>صداقت و شفافیت</li>
                        <li>کیفیت و نوآوری</li>
                        <li>پاسخگویی و احترام به مشتری</li>
                    </ul>
                </div>
                <div className='rounded-xl border bg-card p-5'>
                    <h3 className='font-semibold text-primary-5 mb-2'>چرا آذرین آجر؟</h3>
                    <p className='text-sm text-muted-foreground'>
                        تنوع محصول، پشتیبانی تخصصی و تعهد به زمان‌بندی، ما را به انتخابی مطمئن تبدیل کرده است.
                    </p>
                </div>
            </section>

            <section className='custom-container py-10'>
                <div className='rounded-2xl border bg-card p-6 md:p-8'>
                    <h2 className='text-xl md:text-2xl font-bold text-primary-5 mb-3'>
                        تجربه‌ای مطمئن برای پروژه‌های شما
                    </h2>
                    <p className='text-muted-foreground text-sm md:text-base mb-5'>
                        تیم ما در کنار شماست تا بهترین انتخاب را برای نماهای ساختمانی رقم بزنید. از مشاوره تا
                        اجرا، همراهتان هستیم.
                    </p>
                    <div>
                        <Link
                            href='/products'
                            className='inline-flex items-center rounded-md bg-primary px-4 py-2 text-white hover:opacity-90'>
                            مشاهده محصولات
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
