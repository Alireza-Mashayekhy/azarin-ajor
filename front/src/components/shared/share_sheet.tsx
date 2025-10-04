'use client';

import { Copy, Instagram, Send, Share2 } from 'lucide-react';
import { useMemo } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ShareSheetProps {
    url: string; // relative or absolute
    title: string;
    className?: string;
}

export default function ShareSheet({ url, title, className }: ShareSheetProps) {
    const absoluteUrl = useMemo(() => {
        if (typeof window === 'undefined') return url;
        try {
            const isAbsolute = /^https?:\/\//i.test(url);
            return isAbsolute ? url : `${window.location.origin}${url.startsWith('/') ? url : `/${url}`}`;
        } catch {
            return url;
        }
    }, [url]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(absoluteUrl);
            toast.success('لینک کپی شد');
        } catch (e) {
            toast.error('کپی لینک ناموفق بود');
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size='icon' variant='secondary' className={className} aria-label='share'>
                    <Share2 className='size-4' />
                </Button>
            </DialogTrigger>
            <DialogContent className='max-w-sm p-4'>
                <DialogTitle className='mb-2 text-base'>اشتراک گذاری</DialogTitle>
                <DialogDescription>{title}</DialogDescription>
                <div className='flex items-center gap-2'>
                    <input
                        className='flex-1 rounded-md border px-3 py-2 text-sm'
                        value={absoluteUrl}
                        disabled
                    />
                    <Button onClick={handleCopy} variant='secondary' className='shrink-0 shadow'>
                        <Copy className='size-4' />
                        <span className='mr-2'>کپی</span>
                    </Button>
                </div>
                <div className='flex items-center justify-center gap-5'>
                    <a
                        href={`https://t.me/share/url?url=${encodeURIComponent(
                            absoluteUrl
                        )}&text=${encodeURIComponent(title)}`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex items-center justify-center rounded-md w-10 h-10 transition bg-[#229ED9] text-white hover:opacity-90'
                        aria-label='اشتراک در تلگرام'
                        title='تلگرام'>
                        <Send className='size-4' />
                    </a>
                    <a
                        href={`https://www.instagram.com/`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex items-center justify-center rounded-md w-10 h-10 transition bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white hover:opacity-90'
                        aria-label='باز کردن اینستاگرام'
                        title='اینستاگرام'>
                        <Instagram className='size-4' />
                    </a>
                    <a
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                            `${title} ${absoluteUrl}`
                        )}`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex items-center justify-center rounded-md w-10 h-10 transition bg-[#25D366] text-white hover:opacity-90'
                        aria-label='اشتراک در واتس‌اپ'
                        title='واتس‌اپ'>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 32 32'
                            className='size-5 fill-current'>
                            <path d='M20.11 17.45c-.28-.14-1.61-.79-1.86-.88-.25-.09-.43-.14-.61.14-.18.28-.7.88-.86 1.06-.16.18-.32.21-.6.07-.28-.14-1.16-.43-2.2-1.37-.81-.72-1.36-1.61-1.52-1.88-.16-.28-.02-.43.12-.57.12-.12.28-.32.41-.48.14-.16.18-.28.28-.46.09-.18.05-.35-.02-.49-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.46-.16 0-.35-.02-.53-.02-.18 0-.49.07-.75.35-.25.28-.98.96-.98 2.34s1.01 2.71 1.15 2.9c.14.18 1.98 3.02 4.79 4.23.67.29 1.19.46 1.6.59.67.21 1.28.18 1.76.11.54-.08 1.61-.66 1.84-1.3.23-.64.23-1.19.16-1.3-.07-.11-.25-.18-.53-.32z' />
                            <path d='M26.72 5.28C23.87 2.43 20.08.94 16 .94S8.13 2.43 5.28 5.28C2.43 8.13.94 11.92.94 16c0 2.08.54 4.12 1.57 5.92L1.05 30.95l9.19-1.43c1.73.95 3.69 1.45 5.76 1.45 4.08 0 7.87-1.49 10.72-4.34 2.85-2.85 4.34-6.64 4.34-10.72s-1.49-7.87-4.34-10.72zm-2.1 19.33C22.13 27.1 19.19 28.2 16 28.2c-1.78 0-3.51-.48-5.02-1.38l-.36-.22-5.46.85.87-5.32-.24-.34C4.82 20.26 4.33 18.13 4.33 16c0-3.19 1.1-6.13 3.39-8.43C9.02 5.28 11.96 4.18 15.15 4.18s6.13 1.1 8.43 3.39c2.29 2.29 3.39 5.24 3.39 8.43 0 3.19-1.1 6.13-3.39 8.43z' />
                        </svg>
                    </a>
                </div>
            </DialogContent>
        </Dialog>
    );
}
