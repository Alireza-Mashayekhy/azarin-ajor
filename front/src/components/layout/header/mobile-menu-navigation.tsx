import { Link } from '@/i18n/navigation';

interface MobileMenuNavigationProps {
    items: Array<{
        href: string;
        label: string;
    }>;
    onClose: () => void;
}

export const MobileMenuNavigation = ({ items, onClose }: MobileMenuNavigationProps) => {
    return (
        <nav className='flex-1 px-6 py-4'>
            <div className='flex flex-col space-y-2'>
                {items.map((item) => (
                    <Link
                        href={item.href}
                        key={item.href}
                        className='text-lg py-3 px-4 hover:bg-primary/10 rounded-lg transition-colors block'
                        onClick={onClose}>
                        {item.label}
                    </Link>
                ))}
            </div>
        </nav>
    );
};
