'use client';

import { useTranslations } from 'next-intl';

import { useCountUp } from '@/hooks/useCountUp';

function StatItem({ value, suffix, description }: { value: number; suffix: string; description: string }) {
    const { count, elementRef } = useCountUp({
        end: value,
        duration: 2000
    });

    return (
        <div className='flex flex-col items-center'>
            <div ref={elementRef} className='text-3xl font-bold text-primary-3'>
                {count}
                {suffix}
            </div>
            <div className='text-lg text-center'>{description}</div>
        </div>
    );
}

export default function HomeStats() {
    const t = useTranslations('home.stats');

    const items = [
        {
            value: 500,
            suffix: '+',
            description: t('items.projects')
        },
        {
            value: 120,
            suffix: '+',
            description: t('items.employees')
        },
        {
            value: 25,
            suffix: '+',
            description: t('items.experience')
        },
        {
            value: 98,
            suffix: '%',
            description: t('items.satisfaction')
        }
    ];

    return (
        <div className='bg-background'>
            <div className='py-10 custom-container grid grid-cols-2 md:grid-cols-4 gap-5'>
                {items.map((item, index) => (
                    <StatItem
                        key={index}
                        value={item.value}
                        suffix={item.suffix}
                        description={item.description}
                    />
                ))}
            </div>
        </div>
    );
}
