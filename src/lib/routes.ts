import { cachedGlobal } from './globals'

export const LOCALES = ['en', 'de', 'fr', 'it', 'hi', 'zh', 'ar'] as const
export type Locale = (typeof LOCALES)[number]

export type RouteKey =
  | 'tours'
  | 'disabilityTours'
  | 'budgetTours'
  | 'migrationTours'
  | 'joinInTours'
  | 'offers'
  | 'vehicleHire'
  | 'blog'
  | 'gallery'

export type TourVariant = 'standard' | 'budget' | 'accessible' | 'migration' | 'specialty' | 'offer'

type Source = {
  collection: 'tours' | 'offers' | 'joint-departures' | 'vehicles' | 'posts' | 'gallery-items'
  /** Tour variants shown on this listing. null = all variants. */
  variants: TourVariant[] | null
  hasDetail: boolean
}

export const ROUTE_SOURCES: Record<RouteKey, Source> = {
  tours: { collection: 'tours', variants: null, hasDetail: true },
  disabilityTours: { collection: 'tours', variants: ['accessible'], hasDetail: true },
  budgetTours: { collection: 'tours', variants: ['budget'], hasDetail: true },
  migrationTours: { collection: 'tours', variants: ['migration'], hasDetail: true },
  joinInTours: { collection: 'joint-departures', variants: null, hasDetail: true },
  offers: { collection: 'offers', variants: null, hasDetail: true },
  vehicleHire: { collection: 'vehicles', variants: null, hasDetail: true },
  blog: { collection: 'posts', variants: null, hasDetail: true },
  gallery: { collection: 'gallery-items', variants: null, hasDetail: false },
}

export const ROUTE_DEFAULTS: Record<RouteKey, { prefix: string; label: string }> = {
  tours: { prefix: 'tours', label: 'Safaris' },
  disabilityTours: { prefix: 'disability-tours', label: 'Disability tours' },
  budgetTours: { prefix: 'budget-tours', label: 'Budget tours' },
  migrationTours: { prefix: 'migration-tours', label: 'Migration tours' },
  joinInTours: { prefix: 'join-in-tours', label: 'Join-in tours' },
  offers: { prefix: 'offers', label: 'Offers' },
  vehicleHire: { prefix: 'vehicle-hire', label: 'Vehicle hire' },
  blog: { prefix: 'blog', label: 'Blog' },
  gallery: { prefix: 'gallery', label: 'Gallery' },
}

export type RoutesMap = Record<RouteKey, { prefix: string; label: string }>

export async function getRoutes(locale: string): Promise<RoutesMap> {
  const map = JSON.parse(JSON.stringify(ROUTE_DEFAULTS)) as RoutesMap
  try {
    const g = await cachedGlobal('routes', locale, 0)
    for (const r of g?.routes || []) {
      if (r?.key && map[r.key as RouteKey]) {
        map[r.key as RouteKey] = { prefix: r.prefix || map[r.key as RouteKey].prefix, label: r.breadcrumbLabel || map[r.key as RouteKey].label }
      }
    }
  } catch {
    /* defaults */
  }
  return map
}

export const routeKeyForPrefix = (map: RoutesMap, prefix: string): RouteKey | null =>
  (Object.keys(map) as RouteKey[]).find((k) => map[k].prefix === prefix) ?? null

export const tourRouteKey = (variant?: string | null): RouteKey =>
  variant === 'accessible' ? 'disabilityTours' : variant === 'budget' ? 'budgetTours' : variant === 'migration' ? 'migrationTours' : 'tours'

export const withLocale = (locale: string, path: string) => locale === 'en' ? (path === '/' ? '/' : path) : `/${locale}${path === '/' ? '' : path}`

export const pathFor = (map: RoutesMap, key: RouteKey, slug?: string) => `/${map[key].prefix}${slug ? `/${slug}` : ''}`

/** Link fields (routeKey + url) to a path including the locale. */
export function resolveLink(link: { routeKey?: string | null; url?: string | null } | undefined | null, locale: string, map: RoutesMap): string {
  if (!link) return withLocale(locale, '/')
  const key = link.routeKey
  if (key === 'home') return withLocale(locale, '/')
  if (key && key !== 'custom' && key in map) return withLocale(locale, pathFor(map, key as RouteKey))
  const url = link.url || '/'
  if (/^(https?:|mailto:|tel:|#)/.test(url)) return url
  return withLocale(locale, url.startsWith('/') ? url : `/${url}`)
}

type AnyDoc = { slug?: string | null; template?: any }
/** Canonical path (without locale) of a document. */
export function docPath(map: RoutesMap, collection: Source['collection'], doc: AnyDoc): string {
  switch (collection) {
    case 'tours':
      return pathFor(map, tourRouteKey(typeof doc.template === 'object' ? doc.template?.variant : null), doc.slug || '')
    case 'offers':
      return pathFor(map, 'offers', doc.slug || '')
    case 'joint-departures':
      return pathFor(map, 'joinInTours', doc.slug || '')
    case 'vehicles':
      return pathFor(map, 'vehicleHire', doc.slug || '')
    case 'posts':
      return pathFor(map, 'blog', doc.slug || '')
    default:
      return '/'
  }
}
