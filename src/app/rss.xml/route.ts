import { getPosts, getSiteContext } from '@/lib/site'
import { docPath } from '@/lib/routes'

export const dynamic = 'force-dynamic'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export async function GET() {
  const ctx = await getSiteContext('en')
  const posts = await getPosts('en', 50)
  const items = posts
    .map((p) => {
      const url = `${ctx.origin}/en${docPath(ctx.routes, 'posts', p)}`
      return `<item><title>${esc(p.title)}</title><link>${url}</link><guid>${url}</guid>${p.publishedAt ? `<pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>` : ''}<description>${esc(((p.meta as any)?.description as string) || '')}</description></item>`
    })
    .join('')
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${esc(String(ctx.site?.siteName || 'Blog'))}</title><link>${ctx.origin}/en/${ctx.routes.blog.prefix}</link><description>${esc(String((ctx.site as any)?.seo?.defaultDescription || ''))}</description>${items}</channel></rss>`
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } })
}
