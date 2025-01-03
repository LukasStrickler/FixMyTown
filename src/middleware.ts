import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { i18n } from "./i18n-config";

import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

function getLocale(request: NextRequest): string | undefined {
    // Negotiator expects plain object so we need to transform headers
    const negotiatorHeaders: Record<string, string> = {};
    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

    // @ts-expect-error readonly
    const locales: string[] = i18n.locales;

    // Use negotiator and intl-localematcher to get best locale
    const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
        locales,
    );

    const locale = matchLocale(languages, locales, i18n.defaultLocale);

    return locale;
}

const IGNORED_PATHS = new Set([
    '/favicon.ico',
    '/hero-image.webp',
    '/FixMyTown_logo.png',
    '/hero-image-blur.webp',
    '/robots.txt',
    '/sitemap.xml'
]);
type ValidLocale = typeof i18n.locales[number];
const LOCALES = new Set<ValidLocale>(i18n.locales);

export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (IGNORED_PATHS.has(pathname)) return;

    // Create response headers with x-pathname
    const headers = new Headers({
        'x-pathname': pathname,
    });

    const segments = pathname.split('/');
    const firstSegment = segments[1];

    if (firstSegment && firstSegment.length === 2) {
        if (!LOCALES.has(firstSegment as ValidLocale)) {
            // Unsupported locale, remove it and redirect
            const locale = getLocale(request) ?? i18n.defaultLocale;
            segments.splice(1, 1);
            return NextResponse.redirect(
                new URL(`/${locale}${segments.join('/')}`, request.url),
                { headers }
            );
        }
        // Supported locale found, return response with headers
        return NextResponse.next({ headers });
    }

    // No locale in pathname, add the appropriate one
    const locale = getLocale(request) ?? i18n.defaultLocale;
    return NextResponse.redirect(
        new URL(`/${locale}${pathname}`, request.url),
        { headers }
    );
}


export const config = {
    // Matcher ignoring `/_next/` and `/api/`
    matcher: ["/((?!api|admin|_next/static|_next/image|favicon.ico|.map).*)"],
};