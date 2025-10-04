import { Blog_type } from '@/types/blog';

// Mock function to get single blog - replace with actual API call
export function getBlog(id: string): Blog_type | null {
    const allBlogs = getAllBlogs();
    return allBlogs.find((blog) => blog.id === id) || null;
}

// Helper function to get all blogs
function getAllBlogs(): Blog_type[] {
    return [
        {
            id: '1',
            title: 'راهنمای کامل طراحی وب‌سایت مدرن',
            description:
                'در این مقاله به بررسی کامل اصول طراحی وب‌سایت‌های مدرن و بهترین روش‌های توسعه می‌پردازیم.',
            date: '2024-01-15',
            author: 'تیم آذرین آژور',
            image: '/home/banner_1.png',
            category: 'طراحی وب',
            tags: ['طراحی', 'وب‌سایت', 'UI/UX']
        },
        {
            id: '2',
            title: 'بهینه‌سازی سئو برای کسب و کارهای کوچک',
            description: 'نکات کلیدی و استراتژی‌های موثر برای بهبود رتبه وب‌سایت شما در موتورهای جستجو.',
            date: '2024-01-10',
            author: 'متخصص سئو',
            image: '/home/banner_1.png',
            category: 'سئو',
            tags: ['سئو', 'بازاریابی دیجیتال', 'گوگل']
        },
        {
            id: '3',
            title: 'آموزش توسعه اپلیکیشن موبایل',
            description: 'مراحل کامل توسعه اپلیکیشن موبایل از صفر تا صد با جدیدترین تکنولوژی‌ها.',
            date: '2024-01-05',
            author: 'توسعه‌دهنده موبایل',
            image: '/home/banner_1.png',
            category: 'توسعه موبایل',
            tags: ['موبایل', 'اپلیکیشن', 'React Native']
        },
        {
            id: '4',
            title: 'امنیت در وب‌سایت‌ها',
            description: 'بهترین روش‌های امنیتی برای محافظت از وب‌سایت و اطلاعات کاربران.',
            date: '2024-01-01',
            author: 'متخصص امنیت',
            image: '/home/banner_1.png',
            category: 'امنیت',
            tags: ['امنیت', 'وب', 'هک']
        },
        {
            id: '5',
            title: 'مقدمه‌ای بر هوش مصنوعی',
            description: 'آشنایی با مفاهیم پایه هوش مصنوعی و کاربردهای آن در دنیای امروز.',
            date: '2023-12-25',
            author: 'محقق هوش مصنوعی',
            image: '/home/banner_1.png',
            category: 'هوش مصنوعی',
            tags: ['هوش مصنوعی', 'یادگیری ماشین', 'AI']
        }
    ];
}

// Mock function to get blogs - replace with actual API call
export function getBlogs(category?: string) {
    // Mock data for demonstration
    const mockBlogs: Blog_type[] = [
        {
            id: '1',
            title: 'راهنمای کامل طراحی وب‌سایت مدرن',
            description:
                'در این مقاله به بررسی کامل اصول طراحی وب‌سایت‌های مدرن و بهترین روش‌های توسعه می‌پردازیم.',
            date: '2024-01-15',
            author: 'تیم آذرین آژور',
            image: '/home/banner_1.png',
            category: 'طراحی وب',
            tags: ['طراحی', 'وب‌سایت', 'UI/UX']
        },
        {
            id: '2',
            title: 'بهینه‌سازی سئو برای کسب و کارهای کوچک',
            description: 'نکات کلیدی و استراتژی‌های موثر برای بهبود رتبه وب‌سایت شما در موتورهای جستجو.',
            date: '2024-01-10',
            author: 'متخصص سئو',
            image: '/home/banner_1.png',
            category: 'سئو',
            tags: ['سئو', 'بازاریابی دیجیتال', 'گوگل']
        },
        {
            id: '3',
            title: 'آموزش توسعه اپلیکیشن موبایل',
            description: 'مراحل کامل توسعه اپلیکیشن موبایل از صفر تا صد با جدیدترین تکنولوژی‌ها.',
            date: '2024-01-05',
            author: 'توسعه‌دهنده موبایل',
            image: '/home/banner_1.png',
            category: 'توسعه موبایل',
            tags: ['موبایل', 'اپلیکیشن', 'React Native']
        },
        {
            id: '4',
            title: 'امنیت در وب‌سایت‌ها',
            description: 'بهترین روش‌های امنیتی برای محافظت از وب‌سایت و اطلاعات کاربران.',
            date: '2024-01-01',
            author: 'متخصص امنیت',
            image: '/home/banner_1.png',
            category: 'امنیت',
            tags: ['امنیت', 'وب', 'هک']
        },
        {
            id: '5',
            title: 'مقدمه‌ای بر هوش مصنوعی',
            description: 'آشنایی با مفاهیم پایه هوش مصنوعی و کاربردهای آن در دنیای امروز.',
            date: '2023-12-25',
            author: 'محقق هوش مصنوعی',
            image: '/home/banner_1.png',
            category: 'هوش مصنوعی',
            tags: ['هوش مصنوعی', 'یادگیری ماشین', 'AI']
        }
    ];

    // Filter by category if provided
    const filteredBlogs =
        category && category !== 'all' ? mockBlogs.filter((blog) => blog.category === category) : mockBlogs;

    const categories = ['همه', 'طراحی وب', 'سئو', 'توسعه موبایل', 'امنیت', 'هوش مصنوعی'];

    return {
        blogs: filteredBlogs,
        totalPages: Math.ceil(filteredBlogs.length / 6),
        currentPage: 1,
        totalBlogs: filteredBlogs.length,
        categories
    };
}

// Helper function to convert category name to slug
export function categoryToSlug(category: string): string {
    const slugMap: { [key: string]: string } = {
        'طراحی وب': 'web-design',
        سئو: 'seo',
        'توسعه موبایل': 'mobile-development',
        امنیت: 'security',
        'هوش مصنوعی': 'artificial-intelligence'
    };

    return slugMap[category] || category.toLowerCase().replace(/\s+/g, '-');
}

// Helper function to convert slug to category name
export function slugToCategory(slug: string): string {
    const categoryMap: { [key: string]: string } = {
        'web-design': 'طراحی وب',
        seo: 'سئو',
        'mobile-development': 'توسعه موبایل',
        security: 'امنیت',
        'artificial-intelligence': 'هوش مصنوعی'
    };

    return categoryMap[slug] || slug;
}
