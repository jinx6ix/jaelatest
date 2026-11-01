import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import TourPage from '@/app/[locale]/(frontend)/tours/[slug]/page'
import { buildMetadata } from '@/lib/seo'
import { getSiteContext } from '@/lib/site'

type Args = {
  params: Promise<{
    slug?: string
    locale: string
  }>
}

export default TourPage

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '', locale } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'tours',
    limit: 1,
    depth: 2,
    locale: locale as any,
    where: { slug: { equals: decodedSlug } },
  })
  const tour = result.docs?.[0] as any
  const ctx = await getSiteContext(locale)

  return buildMetadata({
    ctx,
    path: `/budget-tours/${decodedSlug}`,
    title: tour?.meta?.title || tour?.title || decodedSlug,
    description: tour?.meta?.description || tour?.summary,
    image: tour?.meta?.image || tour?.heroImage || tour?.gallery?.[0]?.image,
  })
}
