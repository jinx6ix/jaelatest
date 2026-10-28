import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import React, { cache } from 'react'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import configPromise from '@payload-config'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { getSiteContext } from '@/lib/site'
import { routeKeyForPrefix } from '@/lib/routes'
import { buildMetadata } from '@/lib/seo'
import { ListingPage, listingMetadata, type SearchParams } from '@/site/Listing'
import { RenderSiteBlocks } from '@/site/blocks'
import { JsonLd } from '@/site/JsonLd'
import { baseOrg } from '@/site/TourPage'
import { graph, webPageNode, websiteNode } from '@/lib/schema'

type Args = {
  params: Promise<{ slug?: string; locale: string }>
  searchParams?: Promise<SearchParams>
}

const queryPage = cache(async ({ slug, locale }: { slug: string; locale: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({ collection: 'pages', draft, limit: 1, pagination: false, overrideAccess: draft, locale: locale as any, depth: 2, where: { slug: { equals: slug } } })
  return (result.docs?.[0] as RequiredDataFromCollectionSlug<'pages'> | undefined) || null
})

export default async function Page({ params, searchParams }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = 'home', locale } = await params
  const decoded = decodeURIComponent(slug)
  const ctx = await getSiteContext(locale)

  const key = routeKeyForPrefix(ctx.routes, decoded)
  if (key) return <ListingPage ctx={ctx} routeKey={key} sp={(await searchParams) || {}} />

  const url = `/${locale}/${decoded === 'home' ? '' : decoded}`
  const page: any = await queryPage({ slug: decoded, locale })
  if (!page) return <PayloadRedirects url={url} />

  const isHome = decoded === 'home'
  const pageUrl = `${ctx.origin}/${locale}${isHome ? '' : `/${decoded}`}`
  const nodes = [
    baseOrg(ctx),
    isHome ? websiteNode(ctx.origin, ctx.site?.siteName || 'JaeTravel', locale) : null,
    webPageNode({ url: pageUrl, name: page.meta?.title || page.title, description: page.meta?.description, locale, origin: ctx.origin, modified: page.updatedAt }),
  ]
  return (
    <div className="jt-page">
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}
      <JsonLd data={graph(...nodes)} />
      <RenderSiteBlocks blocks={page.layout || []} ctx={ctx} />
    </div>
  )
}

export async function generateMetadata({ params, searchParams }: Args): Promise<Metadata> {
  const { slug = 'home', locale } = await params
  const decoded = decodeURIComponent(slug)
  const ctx = await getSiteContext(locale)
  const key = routeKeyForPrefix(ctx.routes, decoded)
  if (key) return listingMetadata(ctx, key, (await searchParams) || {})
  const page: any = await queryPage({ slug: decoded, locale })
  if (!page) return {}
  const header = (page.layout || []).find((b: any) => b.blockType === 'pageHeader' || b.blockType === 'homeHero')
  const title = page.meta?.title || header?.title || header?.slides?.[0]?.headline || page.title
  return buildMetadata({
    ctx,
    path: decoded === 'home' ? '/' : `/${decoded}`,
    title,
    description: page.meta?.description || header?.text || header?.slides?.[0]?.text,
    image: page.meta?.image || header?.image || header?.slides?.[0]?.image,
    bareTitle: decoded === 'home',
  })
}
