import { Menu, X } from 'lucide-react';

import { Button } from '../../ui/button';

interface MobileMenuButtonProps {
    isOpen: boolean;
    onToggle: () => void;
}

export const MobileMenuButton = ({ isOpen, onToggle }: MobileMenuButtonProps) => {
    return (
        <Button
            variant='outline'
            size='icon'
            onClick={onToggle}
            className='w-8 h-8'
            aria-label={isOpen ? 'Close menu' : 'Open menu'}>
            {isOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
    );
};
