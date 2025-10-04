'use client';
import { Check, Globe } from 'lucide-react';
import { useParams } from 'next/navigation';
import { Locale, useLocale } from 'next-intl';
import { startTransition } from 'react';

import { usePathname, useRouter } from '@/i18n/navigation';
import { languages } from '@/i18n/routing';

import { Button } from '../ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '../ui/dropdown-menu';

export function LanguageToggle() {
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();
    const currentLocale = useLocale();

    const selectedLanguage = languages.find((lang) => lang.locale === currentLocale);

    const handleChangeLabguage = (newLocale: Locale) => {
        startTransition(() => {
            router.replace(
                // @ts-expect-error -- TypeScript will validate that only known `params`
                // are used in combination with a given `pathname`. Since the two will
                // always match for the current route, we can skip runtime checks.
                { pathname, params },
                { locale: newLocale }
            );
        });
    };

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button
                    size='icon'
                    variant='outline'
                    aria-label={`Change language. Current language: ${
                        selectedLanguage?.internalName || 'Unknown'
                    }`}
                    title={`Change language. Current language: ${
                        selectedLanguage?.internalName || 'Unknown'
                    }`}>
                    <Globe className='size-4' />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align='end'
                className='font-medium'
                role='menu'
                aria-label='Language selection menu'>
                {languages.map((language, index) => (
                    <DropdownMenuItem
                        key={index}
                        className='flex justify-between items-center gap-2'
                        onClick={() => handleChangeLabguage(language.locale)}
                        aria-label={`Switch to ${language.internalName}`}
                        role='menuitem'>
                        <div className='flex items-center gap-2'>
                            <span>{language.internalName}</span>
                        </div>
                        {language.locale === selectedLanguage?.locale && (
                            <Check className='h-4 w-4' aria-hidden='true' />
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
