import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '../payload-types'
import { getServerSideURL } from './getURL'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/website-template-OG.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | any
  locale?: string
  path?: string
}): Promise<Metadata> => {
  const { doc, locale = 'en', path = '' } = args
  const serverUrl = getServerSideURL()
  const ogImage = getImageURL(doc?.meta?.image || doc?.heroImage || doc?.image)

  const title = doc?.meta?.title || doc?.title || 'JaeTravel Expeditions'
  const description = doc?.meta?.description || doc?.summary || doc?.excerpt || 'Experience the best African safaris, wildlife adventures, and bespoke expeditions with JaeTravel Expeditions.'
  const fullTitle = title.includes('JaeTravel') ? title : `${title} | JaeTravel Expeditions`

  const slugPath = Array.isArray(doc?.slug) ? doc.slug.join('/') : doc?.slug || path
  const prefix = locale === 'en' ? '' : `/${locale}`
  const canonicalUrl = `${serverUrl}${prefix}${slugPath.startsWith('/') ? slugPath : `/${slugPath}`}`.replace(/([^:]\/)\/+/g, '$1')

  return {
    metadataBase: new URL(serverUrl),
    title: { absolute: fullTitle },
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title: fullTitle,
      description,
      siteName: 'JaeTravel Expeditions',
      locale: locale === 'en' ? 'en_GB' : locale,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  }
}
