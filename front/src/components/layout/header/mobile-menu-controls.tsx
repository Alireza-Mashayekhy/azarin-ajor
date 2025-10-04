import { LanguageToggle } from '../../shared/language_toggle';

export const MobileMenuControls = () => {
    return (
        <div className='px-6 py-4 border-t border-border'>
            <div className='flex items-center justify-between'>
                <LanguageToggle />
            </div>
        </div>
    );
};
