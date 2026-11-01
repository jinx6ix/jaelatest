import type { MetadataRoute } from 'next'
import { getSiteContext } from '@/lib/site'

export const dynamic = 'force-dynamic'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { origin, site } = await getSiteContext('en')
  const aiCrawlers = (site?.seo as any)?.aiCrawlers !== false

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/search', '/*?*utm_', '/*?*gclid=', '/*?*fbclid='],
      },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Claude-SearchBot', allow: '/' },
      { userAgent: 'Claude-User', allow: '/' },
      { userAgent: 'Googlebot', allow: '/' },
      { userAgent: 'Bingbot', allow: '/' },
      {
        userAgent: 'GPTBot',
        [aiCrawlers ? 'allow' : 'disallow']: '/',
      },
      {
        userAgent: 'ClaudeBot',
        [aiCrawlers ? 'allow' : 'disallow']: '/',
      },
      {
        userAgent: 'Google-Extended',
        [aiCrawlers ? 'allow' : 'disallow']: '/',
      },
      {
        userAgent: 'CCBot',
        [aiCrawlers ? 'allow' : 'disallow']: '/',
      },
    ],
    sitemap: `${origin}/sitemap.xml`,
    host: origin,
  }
}
