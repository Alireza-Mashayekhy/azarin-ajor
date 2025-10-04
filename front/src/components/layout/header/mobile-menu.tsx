'use client';

import { Sheet, SheetContent } from '../../ui/sheet';
import { MobileMenuContent } from './mobile-menu-content';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    items: Array<{
        href: string;
        label: string;
    }>;
}

export const MobileMenu = ({ isOpen, onClose, items }: MobileMenuProps) => {
    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent side='right' className='w-[300px] sm:w-[400px] p-0 pt-7'>
                {/* <MobileMenuHeader /> */}
                <MobileMenuContent items={items} onClose={onClose} />
            </SheetContent>
        </Sheet>
    );
};
