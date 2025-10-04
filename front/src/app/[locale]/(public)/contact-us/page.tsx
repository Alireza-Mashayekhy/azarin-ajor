import type { Metadata } from 'next';
import Link from 'next/link';

import ContactContent from '@/components/pages/contact/contact_content';
import BreadcrumbSchema from '@/components/shared/breadcrumb-schema';

export const metadata: Metadata = {
    title: 'تماس با ما | آذرین آجر',
    description:
        'راه‌های ارتباط با آذرین آجر: آدرس کارخانه و دفتر فروش، شماره‌های تماس، و نقشه موقعیت دفتر فروش.',
    alternates: {
        canonical: '/contact-us',
        languages: {
            en: '/en/contact-us',
            fa: '/fa/contact-us'
        }
    },
    openGraph: {
        title: 'تماس با ما | آذرین آجر',
        description:
            'آدرس کارخانه: استان مرکزی، کیلومتر 5 جاده فرمهین آشتیان، شهرک صنعتی فرمهین، انتهای خیابان امیرکبیر | دفتر فروش: استان مرکزی، اراک، خیابان آیت الله غفاری، تقاطع خیابان جواد الائمه (جهرم).',
        url: '/contact-us',
        type: 'website',
        locale: 'fa_IR'
    }
};

export default function ContactUsPage() {
    const officeAddress = 'استان مرکزی، اراک، خیابان آیت الله غفاری، تقاطع خیابان جواد الائمه (جهرم)';
    const phone1 = '08633281160';
    const phone2 = '09183670194';

    const organizationContactLd = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'آذرین آجر',
        url: '/contact-us',
        contactPoint: [
            { '@type': 'ContactPoint', telephone: `+98-${phone1}`, contactType: 'sales' },
            { '@type': 'ContactPoint', telephone: `+98-${phone2}`, contactType: 'sales' }
        ],
        address: {
            '@type': 'PostalAddress',
            addressCountry: 'IR',
            addressRegion: 'Markazi',
            addressLocality: 'Arak',
            streetAddress: officeAddress
        }
    };

    return (
        <>
            <script
                type='application/ld+json'
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationContactLd) }}
            />
            <BreadcrumbSchema
                items={[{ name: 'خانه', item: '/' }, { name: 'تماس با ما' }]}
                id='json-ld-breadcrumb-contact'
            />

            <nav className='custom-container py-4 text-sm text-muted-foreground'>
                <ol className='flex items-center gap-2'>
                    <li>
                        <Link href='/' className='link'>
                            خانه
                        </Link>
                    </li>
                    <span>/</span>
                    <li className='text-foreground'>تماس با ما</li>
                </ol>
            </nav>

            <section className='py-6 md:py-8'>
                <div className='custom-container'>
                    <h1 className='text-2xl md:text-4xl font-bold text-primary-5 mb-3 font-auto'>
                        ارتباط با آذرین آجر
                    </h1>
                    <p className='text-primary-3 font-auto max-w-3xl text-sm md:text-base'>
                        برای دریافت مشاوره و استعلام قیمت، از طریق شماره‌های زیر یا آدرس‌های درج‌شده با ما در
                        تماس باشید.
                    </p>
                </div>
            </section>

            <ContactContent />
        </>
    );
}
