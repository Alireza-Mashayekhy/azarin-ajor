'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import Logo from '../../shared/logo';
import { DesktopNavigation } from './desktop-navigation';
import { HeaderControls } from './header-controls';
import { MobileMenu } from './mobile-menu';
import { MobileMenuButton } from './mobile-menu-button';

export const Header = () => {
    const t = useTranslations('Header');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const items = [
        {
            href: '/projects',
            label: t('projects')
        },
        {
            href: '/products',
            label: t('products')
        },
        {
            href: '/about',
            label: t('about')
        },
        {
            href: '/contact',
            label: t('contact')
        },
        {
            href: '/blog',
            label: t('blog')
        }
    ];

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <header className='fixed top-0 left-0 right-0 z-50 bg-secondary/80 backdrop-blur shadow'>
            <div className='custom-container flex items-center justify-between'>
                {/* Logo - Always visible */}
                <div className='flex-shrink-0'>
                    <Logo />
                </div>

                {/* Desktop Navigation - Hidden on mobile */}
                <DesktopNavigation items={items} />

                {/* Right side controls */}
                <div className='flex items-center gap-2'>
                    {/* Desktop controls - Hidden on mobile */}
                    <HeaderControls />

                    {/* Mobile controls - Visible on mobile */}
                    <div className='lg:hidden flex items-center gap-2'>
                        <HeaderControls isMobile />
                        <MobileMenuButton isOpen={isMobileMenuOpen} onToggle={toggleMobileMenu} />
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <MobileMenu isOpen={isMobileMenuOpen} onClose={closeMobileMenu} items={items} />
        </header>
    );
};
