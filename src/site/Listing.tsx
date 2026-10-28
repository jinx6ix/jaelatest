import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { SiteContext } from '@/lib/site'
import { findTours, getActiveOffers, getDestinations, getGalleryItems, getPayloadClient, getPosts, getUpcomingDepartures, getVehicles } from '@/lib/site'
import { makeT } from '@/i18n'
import { ROUTE_SOURCES, withLocale, type RouteKey, type TourVariant } from '@/lib/routes'
import { breadcrumbNode, graph, itemListNode, webPageNode } from '@/lib/schema'
import { buildMetadata, pageUrl } from '@/lib/seo'
import { docPath } from '@/lib/routes'
import { Breadcrumbs } from './Breadcrumbs'
import { JsonLd } from './JsonLd'
import { DepartureRow, OfferCard, PostCard, TourCard, VehicleCard } from './Cards'
import { RenderSiteBlocks } from './blocks'
import { baseOrg } from './TourPage'
import { MediaGalleryBlock } from './blocks'

export type SearchParams = Record<string, string | string[] | undefined>
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)

export async function getPageDoc(locale: string, slug: string) {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'pages', where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] }, limit: 1, depth: 2, locale: locale as any, overrideAccess: true })
  return res.docs[0] || null
}

export async function listingMetadata(ctx: SiteContext, key: RouteKey, sp: SearchParams): Promise<Metadata> {
  const t = makeT(ctx.dict)
  const page: any = await getPageDoc(ctx.locale, ctx.routes[key].prefix)
  const header = (page?.layout || []).find((b: any) => b.blockType === 'pageHeader')
  const title = page?.meta?.title || header?.title || t(`listing.${key}.title` as any)
  const description = page?.meta?.description || header?.text || t(`listing.${key}.text` as any)
  const filtered = Object.keys(sp).some((k) => ['destination', 'length', 'type'].includes(k) && sp[k])
  return buildMetadata({ ctx, path: `/${ctx.routes[key].prefix}`, title, description, image: page?.meta?.image || header?.image, noindex: filtered })
}

export async function ListingPage({ ctx, routeKey, sp }: { ctx: SiteContext; routeKey: RouteKey; sp: SearchParams }) {
  const { locale, routes } = ctx
  const t = makeT(ctx.dict)
  const src = ROUTE_SOURCES[routeKey]
  const page: any = await getPageDoc(locale, routes[routeKey].prefix)
  const blocks: any[] = page?.layout || []
  const header = blocks.find((b) => b.blockType === 'pageHeader')
  const rest = blocks.filter((b) => b !== header)
  const title = header?.title || t(`listing.${routeKey}.title` as any)
  const text = header?.text || t(`listing.${routeKey}.text` as any)
  const url = pageUrl(ctx, locale, `/${routes[routeKey].prefix}`)
  const crumbs = [{ name: t('breadcrumb.home'), href: `/${locale}` }, { name: routes[routeKey].label }]
  const destination = one(sp.destination)
  const length = one(sp.length) as any
  const type = one(sp.type)

  let grid: React.ReactNode = null
  let items: { name: string; url: string }[] = []
  let count = 0

  if (src.collection === 'tours') {
    const variants: TourVariant[] | null = src.variants ?? (type === 'accessible' || type === 'budget' || type === 'migration' ? [type as TourVariant] : null)
    const tours = await findTours({ locale, variants, destinationSlug: destination, length: ['short', 'mid', 'long'].includes(length) ? length : undefined })
    count = tours.length
    items = tours.map((x) => ({ name: x.title, url: `${ctx.origin}/${locale}${docPath(routes, 'tours', x)}` }))
    const dests = await getDestinations(locale)
    grid = (
      <>
        <nav className="jt-pills" aria-label={t('listing.types')}>
          {(['tours', 'disabilityTours', 'budgetTours', 'migrationTours', 'joinInTours', 'offers'] as RouteKey[]).map((k) => (
            <Link key={k} href={withLocale(locale, `/${routes[k].prefix}`)} aria-current={k === routeKey ? 'page' : undefined} className={k === routeKey ? 'is-on' : undefined}>
              {routes[k].label}
            </Link>
          ))}
        </nav>
        <form className="jt-filter" method="get" action={withLocale(locale, `/${routes[routeKey].prefix}`)}>
          <label>
            <span>{t('finder.destination')}</span>
            <select name="destination" defaultValue={destination || ''}>
              <option value="">{t('finder.any')}</option>
              {dests.map((d) => (
                <option key={d.id} value={d.slug || ''}>
                  {d.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>{t('finder.length')}</span>
            <select name="length" defaultValue={length || ''}>
              <option value="">{t('finder.anyLength')}</option>
              <option value="short">{t('finder.len.short')}</option>
              <option value="mid">{t('finder.len.mid')}</option>
              <option value="long">{t('finder.len.long')}</option>
            </select>
          </label>
          {routeKey === 'tours' && (
            <label>
              <span>{t('finder.needs')}</span>
              <select name="type" defaultValue={type || ''}>
                <option value="">{t('finder.standard')}</option>
                <option value="accessible">{t('finder.wheelchair')}</option>
                <option value="budget">{t('variant.budget')}</option>
                <option value="migration">{t('variant.migration')}</option>
              </select>
            </label>
          )}
          <button className="jt-btn jt-btn--brand" type="submit">
            {t('finder.submit')}
          </button>
        </form>
        {tours.length ? (
          <div className="jt-grid jt-grid--3">
            {tours.map((x, i) => (
              <TourCard key={x.id} tour={x} routes={routes} locale={locale} t={t} priority={i < 3} />
            ))}
          </div>
        ) : (
          <p className="jt-empty">{t('listing.empty')}</p>
        )}
      </>
    )
  } else if (src.collection === 'joint-departures') {
    const deps = await getUpcomingDepartures(locale, { limit: 60 })
    count = deps.length
    items = deps.map((d) => ({ name: typeof d.tour === 'object' ? (d.tour as any).title : '', url: `${ctx.origin}/${locale}${docPath(routes, 'joint-departures', d)}` }))
    grid = deps.length ? (
      <ul className="jt-deplist jt-deplist--page">
        {deps.map((d) => (
          <DepartureRow key={d.id} dep={d} routes={routes} locale={locale} t={t} />
        ))}
      </ul>
    ) : (
      <p className="jt-empty">{t('listing.empty')}</p>
    )
  } else if (src.collection === 'offers') {
    const offers = await getActiveOffers(locale)
    count = offers.length
    items = offers.map((o) => ({ name: o.name, url: `${ctx.origin}/${locale}${docPath(routes, 'offers', o)}` }))
    grid = offers.length ? (
      <div className="jt-grid jt-grid--3">
        {offers.map((o) => (
          <OfferCard key={o.id} offer={o} routes={routes} locale={locale} t={t} />
        ))}
      </div>
    ) : (
      <p className="jt-empty">{t('listing.empty')}</p>
    )
  } else if (src.collection === 'posts') {
    const posts = await getPosts(locale, 60)
    count = posts.length
    items = posts.map((p) => ({ name: p.title, url: `${ctx.origin}/${locale}${docPath(routes, 'posts', p)}` }))
    grid = posts.length ? (
      <div className="jt-grid jt-grid--3">
        {posts.map((p) => (
          <PostCard key={p.id} post={p} routes={routes} locale={locale} />
        ))}
      </div>
    ) : (
      <p className="jt-empty">{t('listing.empty')}</p>
    )
  } else if (src.collection === 'vehicles') {
    if (!rest.some((b) => b.blockType === 'vehicleGrid')) {
      const vs = await getVehicles(locale)
      count = vs.length
      items = vs.map((v) => ({ name: v.name, url: `${ctx.origin}/${locale}${docPath(routes, 'vehicles', v)}` }))
      grid = (
        <div className="jt-grid jt-grid--3">
          {vs.map((v) => (
            <VehicleCard key={v.id} v={v} routes={routes} locale={locale} t={t} />
          ))}
        </div>
      )
    }
  } else if (src.collection === 'gallery-items') {
    if (!rest.some((b) => b.blockType === 'mediaGallery')) grid = <MediaGalleryBlock ctx={ctx} block={{ blockType: 'mediaGallery' }} />
  }

  const nodes = [
    baseOrg(ctx),
    webPageNode({ url, name: title, description: text, locale, origin: ctx.origin, type: 'CollectionPage' }),
    breadcrumbNode(url, crumbs.map((c, i) => ({ name: c.name, url: i === 0 ? `${ctx.origin}${c.href}` : undefined }))),
    items.length ? itemListNode(url, items) : null,
  ]

  return (
    <div className="jt-listing">
      <JsonLd data={graph(...nodes)} />
      <section className="jt-pagehead">
        <div className="jt-wrap">
          <Breadcrumbs items={crumbs} label={t('breadcrumb.label')} />
          <h1>{title}</h1>
          {text && <p>{text}</p>}
          {count > 0 && <p className="jt-pagehead__count">{t('listing.count', { n: count })}</p>}
        </div>
      </section>
      {grid && (
        <section className="jt-section">
          <div className="jt-wrap">{grid}</div>
        </section>
      )}
      <RenderSiteBlocks blocks={rest} ctx={ctx} />
    </div>
  )
}
