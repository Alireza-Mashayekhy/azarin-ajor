'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

export default function HomeBanner() {
    const t = useTranslations('home.hero');

    return (
        <div className='relative w-full' data-testid='banner-container'>
            <div className='w-full relative max-h-screen h-[calc(100vh-48px)] sm:h-[calc(100vh-64px)]'>
                <Image
                    src='/home/banner_1.png'
                    alt='home banner'
                    fill
                    className='object-cover'
                    loading='eager'
                />
            </div>

            <div className='absolute w-full h-full top-0 left-0 z-10 bg-black/60 flex items-center justify-center **:px-8'>
                <div className='text-center text-white max-w-4xl'>
                    <h1 className='text-3xl md:text-6xl font-bold mb-4 animate-fade-in'>{t('title')}</h1>
                    <h2 className='text-lg md:text-3xl font-semibold mb-6 text-yellow-400 animate-fade-in-delay'>
                        {t('subtitle')}
                    </h2>
                    <p className='text-sm md:text-xl mb-8 leading-relaxed animate-fade-in-delay-2'>
                        {t('description')}
                    </p>
                    <Link href='/products'>
                        <Button variant='secondary'>{t('cta')}</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
