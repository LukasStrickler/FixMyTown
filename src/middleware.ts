import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { i18n } from "./i18n-config";

import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { getPublicPaths, IGNORED_PATHS } from '@/lib/routes'

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

const PUBLIC_PATHS = new Set(getPublicPaths())

type ValidLocale = typeof i18n.locales[number];
const LOCALES = new Set<ValidLocale>(i18n.locales);

export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (IGNORED_PATHS.has(pathname)) return;

    // Create response headers
    const headers = new Headers({
        'x-pathname': pathname,
    });

    // Add x-robots-tag header based on path
    if (PUBLIC_PATHS.has(pathname) || PUBLIC_PATHS.has(pathname.slice(0, -1))) {
        headers.set('x-robots-tag', 'index,follow');
    } else {
        headers.set('x-robots-tag', 'noindex');
    }

    const segments = pathname.split('/');
    const firstSegment = segments[1];

    if (firstSegment && firstSegment.length === 2) {
        if (!LOCALES.has(firstSegment as ValidLocale)) {
            const locale = getLocale(request) ?? i18n.defaultLocale;
            segments.splice(1, 1);
            return NextResponse.redirect(
                new URL(`/${locale}${segments.join('/')}`, request.url),
                { headers }
            );
        }
        return NextResponse.next({ headers });
    }

    const locale = getLocale(request) ?? i18n.defaultLocale;
    return NextResponse.redirect(
        new URL(`/${locale}${pathname}`, request.url),
        { headers }
    );
}


export const config = {
    // Matcher ignoring `/_next/`, `/api/`, and specific files
    matcher: ["/((?!api|admin|_next/static|_next/image|favicon.ico).*)"],
};