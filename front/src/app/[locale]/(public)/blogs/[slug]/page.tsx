import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

import BlogsContent from '@/components/pages/blogs/blogs-content';
import { getBlogs, slugToCategory } from '@/lib/blogs';
import { Blog_type } from '@/types/blog';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const t = await getTranslations('blog');
    const categoryName = slugToCategory(params.slug);

    const title = `${t('title')} - ${categoryName}`;
    const description = `${t('description')} - مقالات دسته‌بندی ${categoryName}`;

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
            canonical: `/blogs/${params.slug}`,
            languages: {
                en: `/en/blogs/${params.slug}`,
                fa: `/fa/blogs/${params.slug}`
            }
        }
    };
}

export default async function CategoryBlogsPage({
    params,
    searchParams
}: {
    params: { slug: string };
    searchParams: { page?: string };
}) {
    const t = await getTranslations('blog');
    const categoryName = slugToCategory(params.slug);
    const currentPage = parseInt(searchParams.page || '1', 10);

    // Check if category exists
    const allCategories = ['طراحی وب', 'سئو', 'توسعه موبایل', 'امنیت', 'هوش مصنوعی'];
    if (!allCategories.includes(categoryName)) {
        notFound();
    }

    // Fetch blogs with SSR
    let blogsData;
    try {
        blogsData = await getBlogs(categoryName);
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
        name: `${t('title')} - ${categoryName}`,
        description: `${t('description')} - مقالات دسته‌بندی ${categoryName}`,
        url: `/blogs/${params.slug}`,
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

            <BlogsContent
                blogsData={blogsData}
                selectedCategory={categoryName}
                categoryTitle={categoryName}
            />
        </>
    );
}
