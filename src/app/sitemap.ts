import type { MetadataRoute } from 'next'
import { getLocalizedPublicPaths } from '@/lib/routes'
import { getBaseUrl } from '@/lib/utils'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = getBaseUrl()

    const languageRoutes = getLocalizedPublicPaths().map(route => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route.endsWith('/') ? 1.0 : 0.8
    }))

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