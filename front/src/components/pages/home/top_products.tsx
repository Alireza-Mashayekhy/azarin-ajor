import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

import ProductCard from '@/components/shared/product_card';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

export default function HomeTopProducts() {
    const t = useTranslations('home.top_products');

    const product = {
        id: '1',
        title: 'Product 1',
        price: 100,
        image: '/home/banner_1.png',
        size: '100x100',
        slug: 'product-1',
        translations: [],
        createdAt: new Date(),
        updatedAt: new Date()
    };
    return (
        <div className='py-10 custom-container'>
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-5'>
                <div>
                    <h2 className='text-2xl md:text-3xl font-bold text-primary-5 mb-4'>{t('title')}</h2>
                    <p className='text-primary-3 text-sm'>{t('subtitle')}</p>
                </div>
                <Link href='/products'>
                    <Button variant='link'>
                        {t('cta')} <ArrowLeft className='ltr:rotate-180' />
                    </Button>
                </Link>
            </div>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-10'>
                <ProductCard product={product} />
            </div>
        </div>
    );
}
