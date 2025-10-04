import { Link } from '@/i18n/navigation';

interface DesktopNavigationProps {
    items: Array<{
        href: string;
        label: string;
    }>;
}

export const DesktopNavigation = ({ items }: DesktopNavigationProps) => {
    return (
        <nav className='hidden lg:flex items-center gap-5'>
            {items.map((item) => (
                <Link href={item.href} key={item.href} className='hover:underline transition-colors'>
                    {item.label}
                </Link>
            ))}
        </nav>
    );
};
