import { Building, Clock, Headset, Leaf } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function HomeFeatures() {
    const t = useTranslations('home.features');

    const items = [
        {
            icon: Building,
            key: 'quality'
        },
        {
            icon: Leaf,
            key: 'sustainable'
        },
        {
            icon: Clock,
            key: 'delivery'
        },
        {
            icon: Headset,
            key: 'support'
        }
    ];

    return (
        <div className='py-10 custom-container'>
            <h2 className='text-3xl md:text-4xl font-bold text-primary-5 mb-4 text-center'>{t('title')}</h2>
            <p className='text-lg text-primary-3 max-w-2xl mx-auto text-center mb-8'>{t('subtitle')}</p>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-5'>
                {items.map((item) => (
                    <div key={item.key} className='flex flex-col gap-2 bg-background p-5 rounded-xl shadow'>
                        <item.icon className='size-8 text-primary-3' />
                        <h3 className='text-xl font-bold text-primary-5'>{t(`items.${item.key}.title`)}</h3>
                        <p className='text-primary-3 text-sm'>{t(`items.${item.key}.description`)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
