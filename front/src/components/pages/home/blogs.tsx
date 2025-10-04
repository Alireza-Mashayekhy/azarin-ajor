import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

import BlogCard from '@/components/shared/blog_card';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

export default function HomeBlogs() {
    const t = useTranslations('home.blog');

    const blog = {
        id: '1',
        title: 'blog 1',
        image: '/home/banner_1.png',
        description: 'blog 1 description',
        date: '2021-01-01',
        author: 'blog 1 author',
        category: 'blog 1 category',
        tags: ['blog 1 tag']
    };
    return (
        <div className='py-10 custom-container'>
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-5'>
                <div>
                    <h2 className='text-2xl md:text-3xl font-bold text-primary-5 mb-4'>{t('title')}</h2>
                    <p className='text-primary-3 text-sm'>{t('subtitle')}</p>
                </div>
                <Link href='/blogs'>
                    <Button variant='link'>
                        {t('cta')} <ArrowLeft className='ltr:rotate-180' />
                    </Button>
                </Link>
            </div>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-10'>
                <BlogCard blog={blog} />
            </div>
        </div>
    );
}
