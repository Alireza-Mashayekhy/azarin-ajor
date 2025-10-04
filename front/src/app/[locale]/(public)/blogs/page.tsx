import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import BlogsContent from '@/components/pages/blogs/blogs-content';
import { getBlogs } from '@/lib/blogs';
import { Blog_type } from '@/types/blog';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('blog');

    const title = t('title');
    const description = t('seoDescription');

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
            locale: 'fa_IR',
            alternateLocale: 'en_US'
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description
        },
        alternates: {
            canonical: '/blogs',
            languages: {
                en: '/en/blogs',
                fa: '/fa/blogs'
            }
        }
    };
}

export default async function Blogs({ searchParams }: { searchParams: { page?: string } }) {
    const t = await getTranslations('blog');
    const currentPage = parseInt(searchParams.page || '1', 10);

    // Fetch blogs with SSR
    let blogsData;
    try {
        blogsData = await getBlogs();
        blogsData.currentPage = currentPage;
    } catch (error) {
        console.error('Error fetching blogs:', error);
        // Fallback to empty data
        blogsData = { blogs: [], totalPages: 0, currentPage: 1, totalBlogs: 0, categories: [] };
    }

    // Generate structured data for SEO
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: t('title'),
        description: t('description'),
        url: '/blogs',
        mainEntity: {
            '@type': 'ItemList',
            numberOfItems: blogsData.totalBlogs,
            itemListElement: blogsData.blogs.map((blog: Blog_type, index: number) => ({
                '@type': 'BlogPosting',
                position: index + 1,
                headline: blog.title,
                description: blog.description,
                image: blog.image,
                datePublished: blog.date,
                author: {
                    '@type': 'Person',
                    name: blog.author
                },
                url: `/blogs/${blog.id}`
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

            <BlogsContent blogsData={blogsData} selectedCategory='all' />
        </>
    );
}
