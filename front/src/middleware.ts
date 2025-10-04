import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('token')?.value;
    const role = request.cookies.get('role')?.value;

    // Extract locale from pathname
    const pathnameHasLocale = routing.locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    const locale = pathnameHasLocale ? pathname.split('/')[1] : routing.defaultLocale;

    const pathWithoutLocale = pathnameHasLocale ? pathname.slice(`/${locale}`.length) : pathname;

    // Define protected routes
    const adminRoutes = ['/admin'];
    const panelRoutes = ['/panel'];
    const loginRoutes = ['/login'];

    const isAdminRoute = adminRoutes.some((route) => pathWithoutLocale.startsWith(route));
    const isPanelRoute = panelRoutes.some((route) => pathWithoutLocale.startsWith(route));
    const isLoginRoute = loginRoutes.some((route) => pathWithoutLocale.startsWith(route));

    if (token && role) {
        if (role === 'USER' && isAdminRoute) {
            return NextResponse.redirect(new URL(`/${locale}/panel`, request.url));
        }

        if (isLoginRoute) {
            const redirectPath = role === 'ADMIN' ? '/admin' : '/panel';
            return NextResponse.redirect(new URL(`/${locale}${redirectPath}`, request.url));
        }
    }

    if (!token) {
        if (isAdminRoute || isPanelRoute) {
            return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
        }
    }

    return intlMiddleware(request);
}

export const config = {
    // Match all pathnames except for
    // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};
