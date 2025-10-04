import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
    // Typically corresponds to the `[locale]` segment
    const requested = await requestLocale;
    const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

    return {
        locale,
        messages: {
            // landing pages
            ...(await import(`../../messages/${locale}/home.json`)).default,

            // layout
            ...(await import(`../../messages/${locale}/header.json`)).default,
            ...(await import(`../../messages/${locale}/footer.json`)).default,

            // blog
            ...(await import(`../../messages/${locale}/blog.json`)).default,

            // products
            ...(await import(`../../messages/${locale}/products.json`)).default,

            // auth
            ...(await import(`../../messages/${locale}/login.json`)).default
        }
    };
});
