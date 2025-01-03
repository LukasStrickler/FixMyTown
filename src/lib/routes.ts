import { i18n } from '@/i18n-config'

export const BASE_PUBLIC_PATHS = [
    '',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/imprint'
] as const

// Paths that should be excluded from locale handling and middleware processing
export const IGNORED_PATHS = new Set([
    '/favicon.ico',
    '/hero-image.webp',
    '/FixMyTown_logo.png',
    '/hero-image-blur.webp',
    '/robots.txt',
    '/sitemap.xml'
])

export const LANGUAGE_INDEPENDENT_PATHS = ['/api/'] as const

export const LANGUAGE_DEPENDENT_BASE_PATHS = [
    '/admin/',
    '/worker/',
    '/account',
    '/error',
    '/myReports',
    '/myReports/',
    '/report',
    '/login',
    '/verify-request'
] as const

// Helper functions
export const getPublicPaths = (withRoot = true) => [
    ...(withRoot ? ['/'] : []),
    ...BASE_PUBLIC_PATHS.filter(path => path !== ''),
    ...i18n.locales.map(locale => `/${locale}`),
    ...i18n.locales.map(locale => `/${locale}/`)
]

export const getPrivatePaths = () => [
    ...LANGUAGE_INDEPENDENT_PATHS,
    ...LANGUAGE_DEPENDENT_BASE_PATHS.flatMap(path =>
        i18n.locales.map(locale => `/${locale}${path}`)
    )
]

export const getLocalizedPublicPaths = () =>
    i18n.locales.flatMap(locale =>
        BASE_PUBLIC_PATHS.map(route => `/${locale}${route}`)
    ) 