import { ArrowLeftIcon, ShareIcon, ShoppingCartIcon, StarIcon } from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import ProductCard from '@/components/shared/product_card';
import { Button } from '@/components/ui/button';
import {
    formatPrice,
    getProduct,
    getProductSpecifications,
    getProductTranslation,
    getRelatedProducts
} from '@/lib/products';

export async function generateMetadata({
    params
}: {
    params: { slug: string; locale: string };
}): Promise<Metadata> {
    const product = await getProduct(params.slug);

    if (!product) {
        return {
            title: 'محصول یافت نشد',
            description: 'این محصول وجود ندارد.'
        };
    }

    const translation = getProductTranslation(product, params.locale);
    const t = await getTranslations('Products.single');

    const title = `${translation.title} | محصولات آذرین آژور`;
    const { description } = translation;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            locale: params.locale === 'fa' ? 'fa_IR' : 'en_US',
            images: [
                {
                    url: product.image,
                    width: 1200,
                    height: 630,
                    alt: translation.title
                }
            ]
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [product.image]
        },
        alternates: {
            canonical: `/products/${params.slug}`,
            languages: {
                en: `/en/products/${params.slug}`,
                fa: `/fa/products/${params.slug}`
            }
        }
    };
}

export default async function ProductPage({ params }: { params: { slug: string; locale: string } }) {
    const product = await getProduct(params.slug);

    if (!product) {
        notFound();
    }

    const t = await getTranslations('Products.single');
    const tProducts = await getTranslations('Products');
    const translation = getProductTranslation(product, params.locale);
    const specifications = getProductSpecifications(product.id);
    const relatedProducts = await getRelatedProducts(product.id);

    // Generate structured data for SEO
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: translation.title,
        description: translation.description,
        image: product.image,
        sku: product.id,
        brand: {
            '@type': 'Brand',
            name: specifications.brand
        },
        offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'IRR',
            availability: 'https://schema.org/InStock',
            seller: {
                '@type': 'Organization',
                name: 'آذرین آژور'
            }
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            reviewCount: '24'
        }
    };

    return (
        <>
            {/* Structured Data */}
            <script
                type='application/ld+json'
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            <div className='min-h-screen bg-background'>
                {/* Breadcrumb */}
                <div className='bg-muted/30 py-4'>
                    <div className='custom-container'>
                        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                            <Link href='/products' className='hover:text-primary transition-colors'>
                                {tProducts('title')}
                            </Link>
                            <span>/</span>
                            <span className='text-foreground'>{translation.title}</span>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className='py-8'>
                    <div className='custom-container'>
                        {/* Back Button */}
                        <div className='mb-6'>
                            <Link href='/products'>
                                <Button variant='outline' className='gap-2'>
                                    <ArrowLeftIcon className='h-4 w-4' />
                                    {t('backToProducts')}
                                </Button>
                            </Link>
                        </div>

                        {/* Product Details */}
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16'>
                            {/* Product Image */}
                            <div className='space-y-4'>
                                <div className='aspect-square relative overflow-hidden rounded-lg border bg-muted/10'>
                                    <Image
                                        src={product.image}
                                        alt={translation.title}
                                        fill
                                        className='object-cover transition-transform hover:scale-105'
                                        priority
                                    />
                                </div>
                                {/* Thumbnail Gallery - placeholder for future implementation */}
                                <div className='grid grid-cols-4 gap-2'>
                                    {[...Array(4)].map((_, i) => (
                                        <div
                                            key={i}
                                            className='aspect-square relative overflow-hidden rounded border bg-muted/10'>
                                            <Image
                                                src={product.image}
                                                alt={`${translation.title} ${i + 1}`}
                                                fill
                                                className='object-cover opacity-60 hover:opacity-100 transition-opacity cursor-pointer'
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className='space-y-6'>
                                <div>
                                    <h1 className='text-3xl font-bold text-foreground mb-2 font-auto'>
                                        {translation.title}
                                    </h1>
                                    <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                                        <span>
                                            {t('productCode')}: {product.id}
                                        </span>
                                        <div className='flex items-center gap-1'>
                                            {[...Array(5)].map((_, i) => (
                                                <StarIcon
                                                    key={i}
                                                    className={`h-4 w-4 ${
                                                        i < 4
                                                            ? 'fill-yellow-400 text-yellow-400'
                                                            : 'text-muted-foreground'
                                                    }`}
                                                />
                                            ))}
                                            <span className='mr-1'>(4.8)</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className='p-4 bg-primary-1 rounded-lg'>
                                    <div className='text-2xl font-bold text-primary-5 font-auto'>
                                        {formatPrice(product.price)}
                                    </div>
                                    <p className='text-sm text-muted-foreground mt-1'>
                                        شامل مالیات و هزینه ارسال
                                    </p>
                                </div>

                                {/* Quick Specs */}
                                <div className='grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg'>
                                    <div>
                                        <span className='text-sm text-muted-foreground'>
                                            {tProducts('size')}
                                        </span>
                                        <p className='font-semibold'>{product.size}</p>
                                    </div>
                                    <div>
                                        <span className='text-sm text-muted-foreground'>{t('brand')}</span>
                                        <p className='font-semibold'>{specifications.brand}</p>
                                    </div>
                                    <div>
                                        <span className='text-sm text-muted-foreground'>
                                            {tProducts('availability')}
                                        </span>
                                        <p className='font-semibold text-green-600'>{tProducts('inStock')}</p>
                                    </div>
                                    <div>
                                        <span className='text-sm text-muted-foreground'>{t('delivery')}</span>
                                        <p className='font-semibold'>{specifications.delivery}</p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className='space-y-3'>
                                    <Button size='lg' className='w-full gap-2'>
                                        <ShoppingCartIcon className='h-5 w-5' />
                                        {t('addToCart')}
                                    </Button>
                                    <div className='grid grid-cols-2 gap-3'>
                                        <Button variant='outline' size='lg'>
                                            {t('buyNow')}
                                        </Button>
                                        <Button variant='outline' size='lg' className='gap-2'>
                                            <ShareIcon className='h-4 w-4' />
                                            {t('shareProduct')}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Product Details Tabs */}
                        <div className='mb-16'>
                            <div className='border-b'>
                                <div className='flex space-x-8'>
                                    <button className='py-4 px-1 border-b-2 border-primary text-primary font-medium text-sm'>
                                        {t('description')}
                                    </button>
                                    <button className='py-4 px-1 border-b-2 border-transparent text-muted-foreground hover:text-foreground font-medium text-sm'>
                                        {t('specifications')}
                                    </button>
                                    <button className='py-4 px-1 border-b-2 border-transparent text-muted-foreground hover:text-foreground font-medium text-sm'>
                                        {t('reviews')}
                                    </button>
                                </div>
                            </div>

                            <div className='py-8'>
                                {/* Description Tab Content */}
                                <div className='prose prose-lg max-w-none'>
                                    <p className='text-muted-foreground leading-relaxed'>
                                        {translation.description}
                                    </p>

                                    <h3 className='text-xl font-semibold text-foreground mt-8 mb-4'>
                                        {t('features')}
                                    </h3>
                                    <ul className='space-y-2 text-muted-foreground'>
                                        <li>• کیفیت ممتاز و استاندارد بین‌المللی</li>
                                        <li>• مقاومت بالا در برابر عوامل جوی</li>
                                        <li>• نصب آسان و سریع</li>
                                        <li>• گارانتی معتبر و پشتیبانی فنی</li>
                                        <li>• قیمت رقابتی و مناسب</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Technical Specifications */}
                        <div className='mb-16'>
                            <h2 className='text-2xl font-bold text-foreground mb-6 font-auto'>
                                {t('technicalSpecs')}
                            </h2>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div className='space-y-4'>
                                    <div className='flex justify-between py-3 border-b border-muted'>
                                        <span className='text-muted-foreground'>{t('dimensions')}</span>
                                        <span className='font-semibold'>{specifications.dimensions}</span>
                                    </div>
                                    <div className='flex justify-between py-3 border-b border-muted'>
                                        <span className='text-muted-foreground'>{t('weight')}</span>
                                        <span className='font-semibold'>{specifications.weight}</span>
                                    </div>
                                    <div className='flex justify-between py-3 border-b border-muted'>
                                        <span className='text-muted-foreground'>{t('material')}</span>
                                        <span className='font-semibold'>{specifications.material}</span>
                                    </div>
                                    <div className='flex justify-between py-3 border-b border-muted'>
                                        <span className='text-muted-foreground'>{t('color')}</span>
                                        <span className='font-semibold'>{specifications.color}</span>
                                    </div>
                                </div>
                                <div className='space-y-4'>
                                    <div className='flex justify-between py-3 border-b border-muted'>
                                        <span className='text-muted-foreground'>{t('origin')}</span>
                                        <span className='font-semibold'>{specifications.origin}</span>
                                    </div>
                                    <div className='flex justify-between py-3 border-b border-muted'>
                                        <span className='text-muted-foreground'>{t('warranty')}</span>
                                        <span className='font-semibold'>{specifications.warranty}</span>
                                    </div>
                                    <div className='py-3 border-b border-muted'>
                                        <span className='text-muted-foreground'>{t('certifications')}</span>
                                        <div className='mt-2 flex flex-wrap gap-2'>
                                            {specifications.certifications.map((cert, index) => (
                                                <span
                                                    key={index}
                                                    className='px-2 py-1 bg-primary-1 text-primary-5 rounded text-sm'>
                                                    {cert}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Related Products */}
                        {relatedProducts.length > 0 && (
                            <div>
                                <h2 className='text-2xl font-bold text-foreground mb-6 font-auto'>
                                    {t('relatedProducts')}
                                </h2>
                                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                                    {relatedProducts.map((relatedProduct) => (
                                        <ProductCard key={relatedProduct.id} product={relatedProduct} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
