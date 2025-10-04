'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import BlogCard from '@/components/shared/blog_card';
import CustomPagination from '@/components/shared/custom_pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { categoryToSlug } from '@/lib/blogs';
import { Blog_type } from '@/types/blog';

interface BlogsContentProps {
    blogsData: {
        blogs: Blog_type[];
        totalPages: number;
        currentPage: number;
        totalBlogs: number;
        categories: string[];
    };
    selectedCategory?: string;
    categoryTitle?: string;
}

export default function BlogsContent({
    blogsData,
    selectedCategory = 'all',
    categoryTitle
}: BlogsContentProps) {
    const t = useTranslations('blog');
    const router = useRouter();

    const handleCategoryChange = (value: string) => {
        if (value === 'all') {
            router.push('/blogs');
        } else {
            const slug = categoryToSlug(value);
            router.push(`/blogs/${slug}`);
        }
    };

    const getDisplayTitle = () => {
        if (categoryTitle) {
            return `${t('title')} - ${categoryTitle}`;
        }
        return t('title');
    };

    const getDisplaySubtitle = () => {
        if (categoryTitle) {
            return `مقالات دسته‌بندی ${categoryTitle}`;
        }
        return t('subtitle');
    };

    return (
        <>
            {/* Header Section */}
            <div className='bg-gradient-to-br from-primary-1 to-primary-2 py-16'>
                <div className='custom-container'>
                    <div className='text-center'>
                        <h1 className='text-4xl md:text-5xl font-bold text-primary-5 mb-6 font-auto'>
                            {getDisplayTitle()}
                        </h1>
                        <p className='text-lg text-primary-3 font-auto leading-relaxed'>
                            {getDisplaySubtitle()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Blogs Grid */}
            <div className='py-16' id='blogs-list'>
                <div className='custom-container'>
                    {/* Category Filter */}
                    <div className='mb-8 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center'>
                        <div className='flex items-center gap-4'>
                            <span className='text-sm font-medium text-muted-foreground'>
                                {t('filterByCategory')}:
                            </span>
                            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                                <SelectTrigger className='min-w-[200px]'>
                                    <SelectValue placeholder={t('allCategories')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='all'>{t('allCategories')}</SelectItem>
                                    {blogsData.categories?.slice(1).map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {blogsData.blogs.length > 0 ? (
                        <>
                            {/* Blogs Count */}
                            <div className='mb-8'>
                                <p className='text-muted-foreground font-auto'>
                                    {blogsData.totalBlogs}{' '}
                                    {blogsData.totalBlogs === 1 ? t('blogFound') : t('blogsFound')}
                                    {selectedCategory !== 'all' && categoryTitle && (
                                        <span> در دسته‌بندی &quot;{categoryTitle}&quot;</span>
                                    )}
                                </p>
                            </div>

                            {/* Blogs Grid */}
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12'>
                                {blogsData.blogs.map((blog: Blog_type) => (
                                    <BlogCard key={blog.id} blog={blog} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {blogsData.totalPages > 1 && (
                                <div className='flex justify-center'>
                                    <CustomPagination
                                        totalPages={blogsData.totalPages}
                                        currentPage={blogsData.currentPage}
                                        scrollId='blogs-list'
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className='text-center py-16'>
                            <div className='max-w-md mx-auto'>
                                <h3 className='text-xl font-semibold text-muted-foreground mb-4 font-auto'>
                                    {t('noBlog')}
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
                                {getDisplayTitle()} - {t('seoTitle')}
                            </h2>

                            <p className='text-muted-foreground leading-relaxed mb-6'>{t('description')}</p>

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

                            <div className='mt-8 p-6 bg-primary-1 rounded-lg'>
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
    );
}
