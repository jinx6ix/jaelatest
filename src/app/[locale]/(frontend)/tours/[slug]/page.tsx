import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { getSiteContext } from '@/lib/site'
import { TourPage as SiteTourPage } from '@/site/TourPage'

type Args = {
  params: Promise<{
    slug?: string
    locale: string
  }>
}

export default async function TourPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '', locale } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/' + locale + '/tours/' + decodedSlug
  const ctx = await getSiteContext(locale)

  const tour = await queryTourBySlug({ slug: decodedSlug, locale })

  if (!tour) return <PayloadRedirects url={url} />

  return (
    <div className="jt-page">
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}
      <SiteTourPage ctx={ctx} tour={tour} />
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '', locale } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const tour = await queryTourBySlug({ slug: decodedSlug, locale })

  return generateMeta({ doc: tour })
}

const queryTourBySlug = cache(async ({ slug, locale }: { slug: string; locale: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'tours',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    locale: locale as any,
    depth: 2,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
