// External Libraries
import type { MetadataRoute } from 'next'

// Utils
import { getPublicPaths, getPrivatePaths } from '@/lib/routes'
import { getBaseUrl } from '@/lib/utils'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = getBaseUrl()

    return {
        rules: [
            {
                userAgent: '*',
                allow: getPublicPaths()
            },
            {
                userAgent: '*',
                disallow: getPrivatePaths()
            }
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    }
} 