import '../globals.css';

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { NextIntlClientProvider, useLocale } from 'next-intl';
import NextTopLoader from 'nextjs-toploader';

import { Toaster } from '@/components/ui/sonner';
import ApiProvider from '@/providers/api-provider';
import QueryProvider from '@/providers/query-provider';
import { ThemeProvider } from '@/providers/theme-provider';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin']
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin']
});

export const metadata: Metadata = {
    title: 'آذرین آجر - پیشگام در صنعت آجر ایران',
    description:
        'تولید کننده برتر آجرهای ساختمانی، نما و تزئینی در ایران. ارائه محصولات با کیفیت بالا و قیمت مناسب با ۳۰ سال تجربه در صنعت آجر.'
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    const locale = useLocale();
    return (
        <html lang={locale} dir={locale === 'fa' ? 'rtl' : 'ltr'}>
            <body className={`${geistSans.variable} ${geistMono.variable} font-auto antialiased`}>
                <NextIntlClientProvider>
                    <QueryProvider>
                        <ApiProvider>
                            <ThemeProvider
                                attribute='class'
                                defaultTheme='system'
                                enableSystem
                                disableTransitionOnChange>
                                <NextTopLoader showSpinner={false} color='#d97706' />
                                {children}
                                <Toaster
                                    richColors
                                    toastOptions={{
                                        style: {
                                            border: '2px solid'
                                        }
                                    }}
                                />
                            </ThemeProvider>
                        </ApiProvider>
                    </QueryProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
