import { defineRouting } from 'next-intl/routing';

export const languages = [
    { locale: 'en', name: 'English', internalName: 'English' },
    { locale: 'fa', name: 'فارسی', internalName: 'فارسی' }
];

export const routing = defineRouting({
    locales: ['en', 'fa'],

    defaultLocale: 'fa',

    localePrefix: 'as-needed'
});
