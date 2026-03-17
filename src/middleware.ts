import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing, locales } from "./i18n/routing";
import { updateSession } from "./lib/supabase/middleware";

const intlMiddleware = createIntlMiddleware(routing);

const AUTH_ROUTES = ["/login", "/register", "/confirm-account", "/forgot-password", "/reset-password", "/setup-account"];
const PROTECTED_ROUTES = ["/dashboard", "/projects-management"];
const PUBLIC_ROUTES = ["/", "/not-authorized"];

function getPathWithoutLocale(pathname: string): string {
    for (const locale of locales) {
        if (pathname.startsWith(`/${locale}/`)) {
            return pathname.substring(`/${locale}`.length);
        }
        if (pathname === `/${locale}`) {
            return "/";
        }
    }
    return pathname;
}

function getLocaleFromPath(pathname: string): string {
    for (const locale of locales) {
        if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
            return locale;
        }
    }
    return "ar";
}

export async function middleware(request: NextRequest) {
    // Step 1: Refresh Supabase session
    const { supabaseResponse, user } = await updateSession(request);

    // Step 2: Run i18n middleware (handles locale prefixing)
    const intlResponse = intlMiddleware(request);

    // Merge cookies from supabase session into the intl response
    supabaseResponse.cookies.getAll().forEach((cookie) => {
        intlResponse.cookies.set(cookie.name, cookie.value);
    });

    const pathname = request.nextUrl.pathname;
    const pathWithoutLocale = getPathWithoutLocale(pathname);
    const locale = getLocaleFromPath(pathname);

    // Step 3: Auth routing logic
    const isAuthRoute = AUTH_ROUTES.some((route) => pathWithoutLocale.startsWith(route));
    const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathWithoutLocale.startsWith(route));

    // Routes where authenticated users should NOT be redirected away from
    const AUTH_EXCEPTIONS = ["/setup-account", "/confirm-account"];

    // If user is logged in and tries to access login/register-type auth pages,
    // redirect to dashboard (but NOT from setup-account or confirm-account)
    if (user && isAuthRoute && !AUTH_EXCEPTIONS.some((r) => pathWithoutLocale.startsWith(r))) {
        const url = request.nextUrl.clone();
        url.pathname = `/${locale}/dashboard`;
        return NextResponse.redirect(url);
    }

    // If user is NOT logged in and tries to access protected routes,
    // redirect to login
    if (!user && isProtectedRoute) {
        const url = request.nextUrl.clone();
        url.pathname = `/${locale}/login`;
        return NextResponse.redirect(url);
    }

    return intlResponse;
}

export const config = {
    // Match all pathnames except API routes, Next.js internals, and static files
    matcher: ["/((?!api|_next|auth/callback|.*\\..*).*)", "/(ar|en)/:path*"],
};
