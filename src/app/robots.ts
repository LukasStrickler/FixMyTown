import type { MetadataRoute } from 'next'
import { i18n } from '@/i18n-config'
import { getBaseUrl } from '@/lib/utils'

// Generate language paths dynamically
const PUBLIC_PATHS = [
    '/',
    ...i18n.locales.map(locale => `/${locale}`),
    ...i18n.locales.map(locale => `/${locale}/`),
    '/imprint',
    '/privacy',
    '/terms',
    '/contact',
    '/about'
]

const LANGUAGE_INDEPENDENT_PATHS = ['/api/']
const LANGUAGE_DEPENDENT_BASE_PATHS = ['/admin/', '/worker/', '/account', '/error', '/myReports', '/myReports/', '/report', '/login', '/verify-request']

const PRIVATE_PATHS = [
    ...LANGUAGE_INDEPENDENT_PATHS,
    ...LANGUAGE_DEPENDENT_BASE_PATHS.flatMap(path =>
        i18n.locales.map(locale => `/${locale}${path}`)
    )
]

export default function robots(): MetadataRoute.Robots {
    const baseUrl = getBaseUrl()

    return {
        rules: {
            userAgent: '*',
            allow: PUBLIC_PATHS,
            disallow: PRIVATE_PATHS
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
} 