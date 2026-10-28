import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import React from 'react'

import { getDepartureBySlug, getOfferBySlug, getPostBySlug, getSiteContext, getTourBySlug, getVehicleBySlug } from '@/lib/site'
import { ROUTE_SOURCES, docPath, routeKeyForPrefix, tourRouteKey } from '@/lib/routes'
import { buildMetadata } from '@/lib/seo'
import { offerIsActive, cheapestFrom } from '@/lib/pricing'
import { formatMoney } from '@/lib/pricing'
import { TourPage } from '@/site/TourPage'
import { OfferPage } from '@/site/OfferPage'
import { DeparturePage, PostPage, VehiclePage } from '@/site/DetailPages'
import { priceRowsOf } from '@/site/Cards'

type Args = { params: Promise<{ slug: string; detail: string; locale: string }> }

async function resolve(args: Args) {
  const { slug, detail, locale } = await args.params
  const ctx = await getSiteContext(locale)
  const key = routeKeyForPrefix(ctx.routes, slug)
  if (!key || !ROUTE_SOURCES[key].hasDetail) return { ctx, key: null as any, doc: null as any, collection: null as any, detail }
  const collection = ROUTE_SOURCES[key].collection
  let doc: any = null
  if (collection === 'tours') doc = await getTourBySlug(locale, detail)
  if (collection === 'offers') doc = await getOfferBySlug(locale, detail)
  if (collection === 'joint-departures') doc = await getDepartureBySlug(locale, detail)
  if (collection === 'vehicles') doc = await getVehicleBySlug(locale, detail)
  if (collection === 'posts') doc = await getPostBySlug(locale, detail)
  return { ctx, key, doc, collection, detail }
}

export default async function DetailRoute(args: Args) {
  const { ctx, key, doc, collection } = await resolve(args)
  if (!doc) notFound()
  const locale = ctx.locale
  if (collection === 'tours') {
    const canonical = tourRouteKey(typeof doc.template === 'object' ? doc.template?.variant : null)
    if (canonical !== key) permanentRedirect(`/${locale}${docPath(ctx.routes, 'tours', doc)}`)
    return <TourPage ctx={ctx} tour={doc} />
  }
  if (collection === 'offers') {
    if (!offerIsActive(doc)) notFound()
    return <OfferPage ctx={ctx} offer={doc} />
  }
  if (collection === 'joint-departures') {
    if (new Date(doc.startDate) < new Date(new Date().setHours(0, 0, 0, 0)) || doc.status === 'cancelled') notFound()
    return <DeparturePage ctx={ctx} dep={doc} />
  }
  if (collection === 'vehicles') return <VehiclePage ctx={ctx} v={doc} />
  if (collection === 'posts') return <PostPage ctx={ctx} post={doc} />
  notFound()
}

export async function generateMetadata(args: Args): Promise<Metadata> {
  const { ctx, doc, collection } = await resolve(args)
  if (!doc) return {}
  const t = ctx.dict
  if (collection === 'tours') {
    const from = cheapestFrom(priceRowsOf(doc))
    const auto = `${doc.title}${from != null ? `, ${doc.durationDays} ${t['card.daysShort'] || 'days'} ${t['card.from']?.toLowerCase() || 'from'} ${formatMoney(from, 'USD', 1, ctx.locale)}` : ''}`
    return buildMetadata({ ctx, path: docPath(ctx.routes, 'tours', doc), title: doc.seo?.title || auto, description: doc.seo?.description || doc.summary, image: doc.seo?.image || doc.heroImage, noindex: doc.seo?.noindex })
  }
  if (collection === 'offers') return buildMetadata({ ctx, path: docPath(ctx.routes, 'offers', doc), title: doc.seo?.title || doc.name, description: doc.seo?.description || doc.summary, image: doc.heroImage, noindex: doc.seo?.noindex })
  if (collection === 'joint-departures') {
    const tour = typeof doc.tour === 'object' ? doc.tour : null
    const d = new Intl.DateTimeFormat(ctx.locale, { timeZone: 'UTC', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(doc.startDate))
    return buildMetadata({ ctx, path: docPath(ctx.routes, 'joint-departures', doc), title: `${tour?.title} – ${d}`, description: tour?.summary, image: tour?.heroImage })
  }
  if (collection === 'vehicles') return buildMetadata({ ctx, path: docPath(ctx.routes, 'vehicles', doc), title: doc.name, description: doc.summary, image: doc.heroImage })
  return buildMetadata({ ctx, path: docPath(ctx.routes, 'posts', doc), title: doc.meta?.title || doc.title, description: doc.meta?.description, image: doc.meta?.image || doc.heroImage, type: 'article', publishedTime: doc.publishedAt, modifiedTime: doc.updatedAt })
}
