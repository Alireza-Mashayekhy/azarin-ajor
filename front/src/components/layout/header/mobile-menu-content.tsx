import { MobileMenuControls } from './mobile-menu-controls';
import { MobileMenuNavigation } from './mobile-menu-navigation';

interface MobileMenuContentProps {
    items: Array<{
        href: string;
        label: string;
    }>;
    onClose: () => void;
}

export const MobileMenuContent = ({ items, onClose }: MobileMenuContentProps) => {
    return (
        <div className='flex flex-col h-full'>
            <MobileMenuNavigation items={items} onClose={onClose} />
            <MobileMenuControls />
        </div>
    );
};
