import { Product_type } from '@/types/product';

// Mock function to get single product - replace with actual API call
export function getProduct(slug: string): Product_type | null {
    // Mock data for demonstration
    const mockProducts: Product_type[] = [
        {
            id: '1',
            slug: 'premium-steel-beam',
            price: 1500000,
            image: '/home/banner_1.png',
            title: 'تیر فولادی ممتاز',
            size: '200x100mm',
            translations: [
                {
                    locale: 'fa',
                    title: 'تیر فولادی ممتاز',
                    description:
                        'تیر فولادی باکیفیت با استاندارد بین‌المللی، مناسب برای سازه‌های مقاوم و پایدار. این محصول از بهترین فولاد موجود در بازار ساخته شده و دارای گواهینامه‌های معتبر کیفیت می‌باشد.'
                },
                {
                    locale: 'en',
                    title: 'Premium Steel Beam',
                    description:
                        'High-quality steel beam with international standards, suitable for strong and durable structures. This product is made from the best steel available in the market and has valid quality certificates.'
                }
            ],
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date('2024-01-15')
        },
        {
            id: '2',
            slug: 'concrete-blocks',
            price: 25000,
            image: '/home/banner_1.png',
            title: 'بلوک بتنی',
            size: '20x20x40cm',
            translations: [
                {
                    locale: 'fa',
                    title: 'بلوک بتنی استاندارد',
                    description:
                        'بلوک بتنی مرغوب با کیفیت عالی، مناسب برای دیوارکشی و ساختمان‌سازی. دارای مقاومت بالا در برابر فشار و عوامل جوی.'
                },
                {
                    locale: 'en',
                    title: 'Standard Concrete Block',
                    description:
                        'High-quality concrete block with excellent quality, suitable for wall construction and building. Has high resistance to pressure and weather conditions.'
                }
            ],
            createdAt: new Date('2024-01-10'),
            updatedAt: new Date('2024-01-10')
        },
        {
            id: '3',
            slug: 'insulation-foam',
            price: 350000,
            image: '/home/banner_1.png',
            title: 'فوم عایق',
            size: '100x50x5cm',
            translations: [
                {
                    locale: 'fa',
                    title: 'فوم عایق حرارتی',
                    description:
                        'فوم عایق حرارتی و صوتی با کیفیت ممتاز، مناسب برای عایق‌بندی ساختمان‌ها. دارای ضریب عایق‌بندی بالا و مقاوم در برابر رطوبت.'
                },
                {
                    locale: 'en',
                    title: 'Thermal Insulation Foam',
                    description:
                        'Premium thermal and acoustic insulation foam, suitable for building insulation. Has high insulation coefficient and is moisture resistant.'
                }
            ],
            createdAt: new Date('2024-01-05'),
            updatedAt: new Date('2024-01-05')
        }
    ];

    return mockProducts.find((product) => product.slug === slug) || null;
}

// Mock function to get related products
export function getRelatedProducts(currentProductId: string, limit: number = 4): Product_type[] {
    // Mock data - in real app, this would fetch related products from API
    const mockProducts: Product_type[] = [
        {
            id: '4',
            slug: 'steel-rebar',
            price: 85000,
            image: '/home/banner_1.png',
            title: 'میلگرد فولادی',
            size: '12mm',
            translations: [
                {
                    locale: 'fa',
                    title: 'میلگرد فولادی',
                    description: 'میلگرد فولادی با کیفیت عالی'
                },
                {
                    locale: 'en',
                    title: 'Steel Rebar',
                    description: 'High-quality steel rebar'
                }
            ],
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01')
        },
        {
            id: '5',
            slug: 'cement-bag',
            price: 45000,
            image: '/home/banner_1.png',
            title: 'سیمان',
            size: '50kg',
            translations: [
                {
                    locale: 'fa',
                    title: 'سیمان پرتلند',
                    description: 'سیمان پرتلند با کیفیت ممتاز'
                },
                {
                    locale: 'en',
                    title: 'Portland Cement',
                    description: 'Premium Portland cement'
                }
            ],
            createdAt: new Date('2023-12-25'),
            updatedAt: new Date('2023-12-25')
        }
    ];

    return mockProducts.filter((product) => product.id !== currentProductId).slice(0, limit);
}

// Helper function to get product translation based on locale
export function getProductTranslation(product: Product_type, locale: string = 'fa') {
    return product.translations.find((t) => t.locale === locale) || product.translations[0];
}

// Helper function to format price
export function formatPrice(price: number): string {
    return `${new Intl.NumberFormat('fa-IR').format(price)} تومان`;
}

// Mock product specifications
export function getProductSpecifications(productId: string) {
    const specs = {
        '1': {
            brand: 'آذرین آژور',
            warranty: '2 سال',
            delivery: '3-5 روز کاری',
            weight: '25 کیلوگرم',
            material: 'فولاد ضد زنگ',
            color: 'طوسی',
            origin: 'ایران',
            certifications: ['ISO 9001', 'استاندارد ملی ایران'],
            dimensions: '200x100x10 میلی‌متر'
        },
        '2': {
            brand: 'آذرین آژور',
            warranty: '1 سال',
            delivery: '1-3 روز کاری',
            weight: '18 کیلوگرم',
            material: 'بتن مسلح',
            color: 'خاکستری',
            origin: 'ایران',
            certifications: ['استاندارد ملی ایران'],
            dimensions: '20x20x40 سانتی‌متر'
        },
        '3': {
            brand: 'آذرین آژور',
            warranty: '5 سال',
            delivery: '2-4 روز کاری',
            weight: '2 کیلوگرم',
            material: 'پلی‌اورتان',
            color: 'سفید',
            origin: 'آلمان',
            certifications: ['CE', 'ISO 14001'],
            dimensions: '100x50x5 سانتی‌متر'
        }
    };

    return specs[productId as keyof typeof specs] || specs['1'];
}
