import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import ProductCard from '@/components/shared/product_card';
import { Product_type } from '@/types/product';
function getProducts() {
    return {
        products: []
    };
}

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('Products');

    const title = t('title');
    const description = t('seoDescription');

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
            locale: 'en_US',
            alternateLocale: 'fa_IR'
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description
        },
        alternates: {
            canonical: '/products',
            languages: {
                en: '/en/products',
                fa: '/fa/products'
            }
        }
    };
}

export default async function Products() {
    const t = await getTranslations('Products');

    // Fetch products with SSR
    let products;
    try {
        products = await getProducts();
    } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback to mock data
    }

    // Generate structured data for SEO
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: t('title'),
        description: t('description'),
        url: '/products',
        mainEntity: {
            '@type': 'ItemList',
            numberOfItems: products?.products.length,
            itemListElement: products?.products.map((product: Product_type, index: number) => ({
                '@type': 'Product',
                position: index + 1,
                name: product.title,
                description: product.translations.find((t) => t.locale === 'en')?.description || '',
                image: product.image,
                offers: {
                    '@type': 'Offer',
                    price: product.price,
                    priceCurrency: 'IRR',
                    availability: 'https://schema.org/InStock'
                },
                url: `/products/${product.slug}`
            }))
        }
    };

    return (
        <>
            {/* Structured Data */}
            <script
                type='application/ld+json'
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            <>
                {/* Header Section */}
                <div className='bg-gradient-to-br from-primary-1 to-primary-2 py-16'>
                    <div className='custom-container'>
                        <div className='text-center '>
                            <h1 className='text-4xl md:text-5xl font-bold text-primary-5 mb-6 font-auto'>
                                {t('title')}
                            </h1>
                            <p className='text-lg text-primary-3 font-auto leading-relaxed'>
                                {t('subtitle')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className='py-16'>
                    <div className='custom-container'>
                        {products?.products.length && products?.products.length > 0 ? (
                            <>
                                {/* Products Count */}
                                <div className='mb-8'>
                                    <p className='text-muted-foreground font-auto'>
                                        {products?.products.length}{' '}
                                        {products?.products.length === 1
                                            ? t('productFound')
                                            : t('productsFound')}
                                    </p>
                                </div>

                                {/* Products Grid */}
                                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                                    {products?.products.map((product: Product_type) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className='text-center py-16'>
                                <div className='max-w-md mx-auto'>
                                    <h3 className='text-xl font-semibold text-muted-foreground mb-4 font-auto'>
                                        {t('noProducts')}
                                    </h3>
                                    <p className='text-muted-foreground font-auto'>{t('tryAdjusting')}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* SEO Content Section */}
                <div className='bg-muted/30 py-16'>
                    <div className='custom-container'>
                        <div>
                            <div className='prose prose-lg max-w-none font-auto'>
                                <h2 className='text-2xl font-bold text-primary-5 mb-6'>
                                    {t('title')} - {t('seoTitle')}
                                </h2>

                                <p className='text-muted-foreground leading-relaxed mb-6'>
                                    {t('description')}
                                </p>

                                <div>
                                    <h3 className='text-xl font-semibold text-primary-5 mb-4 mt-8'>
                                        {t('whyChooseTitle')}
                                    </h3>
                                    <ul className='space-y-2 text-muted-foreground'>
                                        {t.raw('whyChooseItems').map((item: string, index: number) => (
                                            <li key={index}>• {item}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className='mt-8 py-6 bg-primary-1 rounded-lg'>
                                    <h3 className='text-xl font-semibold text-primary-5 mb-4'>
                                        {t('servicesTitle')}
                                    </h3>
                                    <p className='text-muted-foreground mb-4'>{t('servicesDescription')}</p>
                                    <div className='flex flex-wrap gap-4'>
                                        {t.raw('serviceTags').map((tag: string, index: number) => (
                                            <span
                                                key={index}
                                                className='px-3 py-1 bg-primary-4 text-white rounded-full text-sm'>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </>
    );
}
