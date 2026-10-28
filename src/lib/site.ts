import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'
import { getServerSideURL } from '@/utilities/getURL'
import { cachedGlobal } from './globals'
import { getRoutes, type RoutesMap, type TourVariant } from './routes'
import { getDictionary, type Dict } from '@/i18n'
import { mediaUrl } from './media'
import type { Company, Offer, Post, SiteSetting, Tour, Vehicle, JointDeparture, GalleryItem, Destination, Season, Theme } from '@/payload-types'
import type { SeasonLite } from './pricing'

export const getPayloadClient = () => getPayload({ config: configPromise })

export type SiteContext = {
  locale: string
  site: SiteSetting
  company: Company
  theme: Theme
  routes: RoutesMap
  dict: Dict
  origin: string
  logoUrl: string
}

export const getSiteContext = cache(async (locale: string): Promise<SiteContext> => {
  const [site, company, theme, routes, dict] = await Promise.all([
    cachedGlobal('site-settings', locale, 1),
    cachedGlobal('company', locale, 1),
    cachedGlobal('theme', locale, 0),
    getRoutes(locale),
    getDictionary(locale),
  ])
  const origin = ((site?.seo?.canonicalOrigin as string) || getServerSideURL()).replace(/\/$/, '')
  return { locale, site, company, theme, routes, dict, origin, logoUrl: mediaUrl(company?.logo, 'small') || '/brand/logo.jpg' }
})

const PUBLISHED = { published: { equals: true } }

export const getSeasons = cache(async (locale: string): Promise<SeasonLite[]> => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'seasons', limit: 50, pagination: false, locale: locale as any, sort: 'sortOrder', depth: 0 })
  return res.docs.map((s: Season) => ({
    id: s.id,
    name: s.name,
    startMonth: s.startMonth,
    startDay: s.startDay,
    endMonth: s.endMonth,
    endDay: s.endDay,
    sortOrder: s.sortOrder,
  }))
})

export type TourQuery = {
  locale: string
  variants?: TourVariant[] | null
  destinationSlug?: string
  length?: 'short' | 'mid' | 'long'
  featured?: boolean
  ids?: (string | number)[]
  excludeId?: string | number
  limit?: number
}

export const findTours = async (q: TourQuery): Promise<Tour[]> => {
  const payload = await getPayloadClient()
  const and: any[] = [PUBLISHED]
  if (q.variants?.length) and.push({ 'template.variant': { in: q.variants } })
  if (q.destinationSlug) and.push({ 'destination.slug': { equals: q.destinationSlug } })
  if (q.length === 'short') and.push({ durationDays: { less_than_equal: 4 } })
  if (q.length === 'mid') and.push({ durationDays: { greater_than_equal: 5 } }, { durationDays: { less_than_equal: 7 } })
  if (q.length === 'long') and.push({ durationDays: { greater_than_equal: 8 } })
  if (q.featured) and.push({ featured: { equals: true } })
  if (q.ids?.length) and.push({ id: { in: q.ids } })
  if (q.excludeId) and.push({ id: { not_equals: q.excludeId } })
  const res = await payload.find({
    collection: 'tours',
    where: { and },
    limit: q.limit ?? 60,
    pagination: false,
    depth: 2,
    locale: q.locale as any,
    sort: ['-featured', 'durationDays'],
    overrideAccess: true,
  })
  return res.docs as Tour[]
}

export const getTourBySlug = cache(async (locale: string, slug: string): Promise<Tour | null> => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'tours',
    where: { and: [{ slug: { equals: slug } }, PUBLISHED] },
    limit: 1,
    depth: 2,
    locale: locale as any,
    overrideAccess: true,
  })
  return (res.docs[0] as Tour) ?? null
})

export const getDestinations = cache(async (locale: string): Promise<Destination[]> => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'destinations', limit: 50, pagination: false, depth: 1, locale: locale as any, sort: 'name' })
  return res.docs as Destination[]
})

const startOfToday = () => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

export const getUpcomingDepartures = async (locale: string, opts: { tourId?: string | number; limit?: number } = {}): Promise<JointDeparture[]> => {
  const payload = await getPayloadClient()
  const and: any[] = [PUBLISHED, { startDate: { greater_than_equal: startOfToday() } }, { status: { not_equals: 'cancelled' } }]
  if (opts.tourId) and.push({ tour: { equals: opts.tourId } })
  const res = await payload.find({
    collection: 'joint-departures',
    where: { and },
    limit: opts.limit ?? 20,
    pagination: false,
    depth: 2,
    sort: 'startDate',
    locale: locale as any,
    overrideAccess: true,
  })
  return res.docs as JointDeparture[]
}

export const getDepartureBySlug = cache(async (locale: string, slug: string): Promise<JointDeparture | null> => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'joint-departures',
    where: { and: [{ slug: { equals: slug } }, PUBLISHED] },
    limit: 1,
    depth: 2,
    locale: locale as any,
    overrideAccess: true,
  })
  return (res.docs[0] as JointDeparture) ?? null
})

export const getActiveOffers = async (locale: string, opts: { limit?: number; tourId?: string | number; featured?: boolean } = {}): Promise<Offer[]> => {
  const payload = await getPayloadClient()
  const and: any[] = [PUBLISHED, { validUntil: { greater_than_equal: startOfToday() } }]
  if (opts.tourId) and.push({ appliesTo: { contains: opts.tourId } })
  if (opts.featured) and.push({ featured: { equals: true } })
  const res = await payload.find({
    collection: 'offers',
    where: { and },
    limit: opts.limit ?? 30,
    pagination: false,
    depth: 2,
    sort: 'validUntil',
    locale: locale as any,
    overrideAccess: true,
  })
  const now = new Date()
  return (res.docs as Offer[]).filter((o) => !o.validFrom || new Date(o.validFrom) <= now)
}

export const getOfferBySlug = cache(async (locale: string, slug: string): Promise<Offer | null> => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'offers',
    where: { and: [{ slug: { equals: slug } }, PUBLISHED] },
    limit: 1,
    depth: 2,
    locale: locale as any,
    overrideAccess: true,
  })
  return (res.docs[0] as Offer) ?? null
})

export const getVehicles = async (locale: string): Promise<Vehicle[]> => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'vehicles', where: PUBLISHED, limit: 50, pagination: false, depth: 1, locale: locale as any, overrideAccess: true })
  return res.docs as Vehicle[]
}

export const getVehicleBySlug = cache(async (locale: string, slug: string): Promise<Vehicle | null> => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'vehicles', where: { and: [{ slug: { equals: slug } }, PUBLISHED] }, limit: 1, depth: 1, locale: locale as any, overrideAccess: true })
  return (res.docs[0] as Vehicle) ?? null
})

export const getPosts = async (locale: string, limit = 12): Promise<Post[]> => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
    limit,
    pagination: false,
    depth: 1,
    sort: '-publishedAt',
    locale: locale as any,
    overrideAccess: true,
  })
  return res.docs as Post[]
}

export const getPostBySlug = cache(async (locale: string, slug: string): Promise<Post | null> => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'posts',
    where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
    limit: 1,
    depth: 2,
    locale: locale as any,
    overrideAccess: true,
  })
  return (res.docs[0] as Post) ?? null
})

export const getGalleryItems = async (locale: string): Promise<GalleryItem[]> => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'gallery-items', where: PUBLISHED, limit: 200, pagination: false, depth: 1, sort: ['sort', 'title'], locale: locale as any, overrideAccess: true })
  return res.docs as GalleryItem[]
}
