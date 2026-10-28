import type { MetadataRoute } from 'next'
import { getSiteContext } from '@/lib/site'

export const dynamic = 'force-dynamic'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { origin } = await getSiteContext('en')
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api/', '/next/', '/*/search', '/*?*destination=', '/*?*length=', '/*?*type='] }],
    sitemap: `${origin}/sitemap.xml`,
    host: origin,
  }
}
