import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import BlogCard from '@/components/shared/blog_card';
import BreadcrumbSchema from '@/components/shared/breadcrumb-schema';
import ShareSheet from '@/components/shared/share_sheet';
import { getBlog, getBlogs } from '@/lib/blogs';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const t = await getTranslations('blog');
    const blog = getBlog(params.slug);
    if (!blog) return { title: t('single.backToBlogs') };

    const { title: blogTitle, description, image, id } = blog;
    const title = `${blogTitle} | ${t('title')}`;
    const imageUrl = image;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [imageUrl],
            type: 'article',
            locale: 'fa_IR',
            alternateLocale: 'en_US'
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [imageUrl]
        },
        alternates: {
            canonical: `/blog/${id}`,
            languages: {
                en: `/en/blog/${id}`,
                fa: `/fa/blog/${id}`
            }
        }
    };
}

export default async function SingleBlogPage({ params }: { params: { slug: string } }) {
    const t = await getTranslations('blog');
    const blog = getBlog(params.slug);
    if (!blog) notFound();

    const { id, title, description, image, date, author, category, tags } = blog;

    // Related posts by category (exclude current)
    const { blogs } = getBlogs(category);
    const related = blogs.slice(0, 3);

    // BlogPosting structured data
    const blogPostingLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: title,
        description,
        image,
        datePublished: date,
        author: { '@type': 'Person', name: author },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `/blog/${id}`
        }
    };

    return (
        <>
            {/* JSON-LD Schemas */}
            <script
                type='application/ld+json'
                dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingLd) }}
            />
            <BreadcrumbSchema
                items={[{ name: 'خانه', item: '/' }, { name: 'وبلاگ', item: '/blogs' }, { name: title }]}
                id='json-ld-breadcrumb-blog-single'
            />

            {/* Visible breadcrumb */}
            <nav className='custom-container py-4 text-sm text-muted-foreground'>
                <ol className='flex items-center gap-2'>
                    <li>
                        <Link href='/' className='link'>
                            خانه
                        </Link>
                    </li>
                    <span>/</span>
                    <li>
                        <Link href='/blogs' className='link'>
                            وبلاگ
                        </Link>
                    </li>
                    <span>/</span>
                    <li className='text-foreground'>{title}</li>
                </ol>
            </nav>

            <div className='py-3 md:py-5'>
                <div className='custom-container'>
                    <h1 className='text-2xl md:text-4xl font-bold text-primary-5 mb-3 font-auto'>{title}</h1>
                    <p className='text-primary-3 font-auto max-w-3xl text-sm md:text-base'>{description}</p>
                </div>
            </div>

            <div className='custom-container py-10 grid grid-cols-1 lg:grid-cols-12 gap-10'>
                <article className='lg:col-span-8'>
                    <div className='relative rounded-2xl overflow-hidden shadow'>
                        <div className='relative w-full' style={{ aspectRatio: '16 / 9' }}>
                            <Image src={image} alt={title} fill className='object-cover' priority />
                        </div>
                        <div className='absolute left-3 top-3 md:left-4 md:top-4'>
                            <ShareSheet url={`/blog/${id}`} title={title} />
                        </div>
                    </div>

                    <div className='prose prose-lg max-w-none blog-description font-auto mt-6'>
                        <h2>مقدمه</h2>
                        <p>{description}</p>
                        <h3>جمع‌بندی</h3>
                        <p>
                            این یک محتوای نمونه است. برای محتواهای واقعی، متن کامل مقاله اینجا قرار می‌گیرد تا
                            ساختار صفحه و استایل پروژه را نشان دهد.
                        </p>
                    </div>
                </article>

                <aside className='lg:col-span-4 relative'>
                    <div className='sticky top-24'>
                        {related.length > 0 && (
                            <div className='rounded-xl border bg-card p-5'>
                                <h4 className='font-semibold mb-4'>{t('single.relatedPosts')}</h4>
                                <div className='space-y-4'>
                                    {related.map((item) => (
                                        <BlogCard key={item.id} blog={item} orientation='horizontal' />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </>
    );
}
