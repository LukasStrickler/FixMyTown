import { MetadataRoute } from 'next'
import { i18n } from '@/i18n-config'

// Generate language paths dynamically
const PUBLIC_PATHS = [
    ...i18n.locales.map(locale => `/${locale}`),
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

function getBaseUrl(): string {
    if (typeof window !== "undefined") return window.location.origin
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
    return `http://localhost:${process.env.PORT ?? 3000}`
}

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