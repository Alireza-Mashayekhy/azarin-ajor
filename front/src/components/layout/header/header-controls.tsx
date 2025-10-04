import { useTranslations } from 'next-intl';

import { LanguageToggle } from '../../shared/language_toggle';
import { Button } from '../../ui/button';

interface HeaderControlsProps {
    isMobile?: boolean;
}

export const HeaderControls = ({ isMobile = false }: HeaderControlsProps) => {
    const t = useTranslations('Header');

    if (isMobile) {
        return (
            <div className='lg:hidden flex items-center gap-2'>
                <Button size='sm' className='text-xs'>
                    {t('consultation')}
                </Button>
            </div>
        );
    }

    return (
        <div className='hidden lg:flex items-center gap-2'>
            <LanguageToggle />
            <Button>{t('consultation')}</Button>
        </div>
    );
};
