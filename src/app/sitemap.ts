import { MetadataRoute } from 'next'
import { i18n } from '@/i18n-config'

function getBaseUrl(): string {
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
    return `http://localhost:${process.env.PORT ?? 3000}`
}

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = getBaseUrl()

    const publicRoutes = [
        '',
        '/about',
        '/contact',
        '/privacy',
        '/terms',
        '/imprint'
    ]

    const languageRoutes = i18n.locales.flatMap(locale =>
        publicRoutes.map(route => ({
            url: `${baseUrl}/${locale}${route}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: route === '' ? 1.0 : 0.8
        }))
    )

    const commonRoutes = [
        {
            url: `${baseUrl}/sitemap.xml`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.3
        },
        {
            url: `${baseUrl}/robots.txt`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.3
        }
    ]

    return [...languageRoutes, ...commonRoutes]
} 