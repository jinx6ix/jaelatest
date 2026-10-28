import type { MetadataRoute } from 'next'
import { getPayloadClient, getSiteContext } from '@/lib/site'
import { LOCALES, docPath, pathFor, type RouteKey } from '@/lib/routes'
import { absoluteUrl, mediaUrl } from '@/lib/media'
import { parseYouTubeId, ytEmbedUrl, ytThumbnail } from '@/lib/youtube'

// Rendered on request (needs the database), so the build does not.
export const dynamic = 'force-dynamic'

type Entry = MetadataRoute.Sitemap[number]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const ctx = await getSiteContext('en')
  const payload = await getPayloadClient()
  const { origin, routes } = ctx
  const today = new Date(new Date().setHours(0, 0, 0, 0)).toISOString()
  const entries: Entry[] = []

  const add = (path: string, opts: { lastModified?: string | Date; priority?: number; changeFrequency?: Entry['changeFrequency']; images?: string[]; videos?: Entry['videos'] } = {}) => {
    const languages: Record<string, string> = {}
    for (const l of LOCALES) languages[l] = `${origin}/${l}${path === '/' ? '' : path}`
    languages['x-default'] = languages.en
    for (const l of LOCALES) {
      entries.push({
        url: languages[l],
        lastModified: opts.lastModified,
        changeFrequency: opts.changeFrequency || 'weekly',
        priority: opts.priority ?? 0.6,
        alternates: { languages },
        ...(opts.images?.length ? { images: opts.images.map((i) => absoluteUrl(origin, i)) } : {}),
        ...(opts.videos?.length ? { videos: opts.videos } : {}),
      })
    }
  }

  // Pages (home, about, contact...). Pages whose slug is a route prefix are listing pages and are added below.
  const prefixes = new Set(Object.values(routes).map((r) => r.prefix))
  const pages = await payload.find({ collection: 'pages', where: { _status: { equals: 'published' } }, limit: 500, pagination: false, depth: 0, select: { slug: true, updatedAt: true } as any })
  for (const p of pages.docs as any[]) {
    if (p.slug === 'home') add('/', { lastModified: p.updatedAt, priority: 1, changeFrequency: 'daily' })
    else if (!prefixes.has(p.slug)) add(`/${p.slug}`, { lastModified: p.updatedAt, priority: 0.5, changeFrequency: 'monthly' })
  }
  for (const key of Object.keys(routes) as RouteKey[]) add(pathFor(routes, key), { priority: key === 'tours' ? 0.9 : 0.8, changeFrequency: 'daily' })

  const tours = await payload.find({ collection: 'tours', where: { published: { equals: true } }, limit: 1000, pagination: false, depth: 2, overrideAccess: true })
  for (const tour of tours.docs as any[]) {
    if (tour.seo?.noindex) continue
    const videos = (tour.videos || [])
      .map((v: any) => {
        const id = parseYouTubeId(v.youtubeUrl)
        return id ? { title: v.title, thumbnail_loc: ytThumbnail(id), description: v.description || tour.summary, player_loc: ytEmbedUrl(id).split('?')[0] } : null
      })
      .filter(Boolean)
    const imgs = [mediaUrl(tour.heroImage, 'xlarge'), ...(tour.gallery || []).slice(0, 6).map((g: any) => mediaUrl(g.image, 'xlarge'))].filter(Boolean) as string[]
    add(docPath(routes, 'tours', tour), { lastModified: tour.updatedAt, priority: 0.8, changeFrequency: 'weekly', images: imgs, videos: videos as any })
  }

  const offers = await payload.find({ collection: 'offers', where: { and: [{ published: { equals: true } }, { validUntil: { greater_than_equal: today } }] }, limit: 500, pagination: false, depth: 0, overrideAccess: true })
  for (const o of offers.docs as any[]) if (!o.seo?.noindex) add(docPath(routes, 'offers', o), { lastModified: o.updatedAt, priority: 0.7 })

  const deps = await payload.find({ collection: 'joint-departures', where: { and: [{ published: { equals: true } }, { startDate: { greater_than_equal: today } }, { status: { not_equals: 'cancelled' } }] }, limit: 500, pagination: false, depth: 0, overrideAccess: true })
  for (const d of deps.docs as any[]) add(docPath(routes, 'joint-departures', d), { lastModified: d.updatedAt, priority: 0.6 })

  const vehicles = await payload.find({ collection: 'vehicles', where: { published: { equals: true } }, limit: 200, pagination: false, depth: 0, overrideAccess: true })
  for (const v of vehicles.docs as any[]) add(docPath(routes, 'vehicles', v), { lastModified: v.updatedAt, priority: 0.6 })

  const posts = await payload.find({ collection: 'posts', where: { _status: { equals: 'published' } }, limit: 1000, pagination: false, depth: 0, overrideAccess: true })
  for (const p of posts.docs as any[]) add(docPath(routes, 'posts', p), { lastModified: p.updatedAt, priority: 0.5, changeFrequency: 'monthly' })

  return entries
}
