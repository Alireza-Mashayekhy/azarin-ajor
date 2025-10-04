import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header/header';

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className='bg-primary-1'>
            <Header />
            <div className='pt-12 sm:pt-16'>{children}</div>
            <Footer />
        </div>
    );
}
