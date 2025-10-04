import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { Blog_type } from '@/types/blog';

import { Button } from '../ui/button';

export default function BlogCard({
    blog,
    orientation = 'vertical'
}: {
    blog: Blog_type;
    orientation?: 'vertical' | 'horizontal';
}) {
    const t = useTranslations('blog');

    return (
        <div
            className={`rounded-xl shadow overflow-hidden ${
                orientation === 'horizontal' ? 'flex gap-4 p-4' : ''
            }`}>
            {orientation === 'horizontal' ? (
                <>
                    <div className='relative w-32 h-24 md:w-40 md:h-28 flex-none rounded-md overflow-hidden'>
                        <Image src={blog.image} alt={blog.title} fill className='object-cover' />
                    </div>
                    <div className='flex-1 flex flex-col gap-2'>
                        <h3 className='text-sm md:text-base font-bold line-clamp-2'>{blog.title}</h3>
                        {/* <p className='text-sm text-muted-foreground line-clamp-2'>{blog.description}</p> */}
                        <div className='mt-auto flex justify-end'>
                            <Button variant='link' size='sm'>
                                {t('read_more')}
                            </Button>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className='relative aspect-video'>
                        <Image src={blog.image} alt={blog.title} fill className='object-cover' />
                    </div>
                    <div className='p-4 flex flex-col gap-2'>
                        <h3 className='text-xl font-bold'>{blog.title}</h3>
                        <p>{blog.description}</p>
                        <div className='flex justify-end'>
                            <Button variant='link'>{t('read_more')}</Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
