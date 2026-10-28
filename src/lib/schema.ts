/**
 * JSON-LD builders. Every structured-data block on the site comes from here, built from CMS data,
 * so the markup always matches what visitors see.
 */
type Json = Record<string, any>

export const SCHEMA_CONTEXT = 'https://schema.org'
const dollars = (cents: number) => Number((cents / 100).toFixed(2))
const clean = <T extends Json>(o: T): T => {
  for (const k of Object.keys(o)) {
    const v = o[k]
    if (v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0)) delete o[k]
  }
  return o
}

export const graph = (...nodes: (Json | null | undefined)[]) => ({
  '@context': SCHEMA_CONTEXT,
  '@graph': nodes.filter(Boolean),
})

export const orgId = (origin: string) => `${origin}/#org`

export function organizationNode(a: {
  origin: string
  name: string
  logo?: string
  image?: string
  email?: string
  telephone?: string
  tagline?: string
  address?: { street?: string | null; city?: string | null; region?: string | null; postalCode?: string | null; countryCode?: string | null }
  geo?: { lat?: number | null; lng?: number | null }
  sameAs?: string[]
  areaServed?: string[]
  openingHours?: string
}) {
  return clean({
    '@type': 'TravelAgency',
    '@id': orgId(a.origin),
    name: a.name,
    url: a.origin,
    logo: a.logo ? { '@type': 'ImageObject', url: a.logo } : undefined,
    image: a.image || a.logo,
    email: a.email,
    telephone: a.telephone,
    slogan: a.tagline,
    areaServed: a.areaServed,
    sameAs: a.sameAs,
    openingHours: a.openingHours,
    address: a.address
      ? clean({
          '@type': 'PostalAddress',
          streetAddress: a.address.street,
          addressLocality: a.address.city,
          addressRegion: a.address.region,
          postalCode: a.address.postalCode,
          addressCountry: a.address.countryCode,
        })
      : undefined,
    geo: a.geo?.lat != null && a.geo?.lng != null ? { '@type': 'GeoCoordinates', latitude: a.geo.lat, longitude: a.geo.lng } : undefined,
  })
}

export const websiteNode = (origin: string, name: string, locale: string) => ({
  '@type': 'WebSite',
  '@id': `${origin}/#website`,
  url: origin,
  name,
  inLanguage: locale,
  publisher: { '@id': orgId(origin) },
})

export const webPageNode = (a: { url: string; name: string; description?: string; locale: string; origin: string; image?: string; modified?: string; type?: string }) =>
  clean({
    '@type': a.type || 'WebPage',
    '@id': `${a.url}#webpage`,
    url: a.url,
    name: a.name,
    description: a.description,
    inLanguage: a.locale,
    isPartOf: { '@id': `${a.origin}/#website` },
    primaryImageOfPage: a.image ? { '@type': 'ImageObject', url: a.image } : undefined,
    dateModified: a.modified,
    breadcrumb: { '@id': `${a.url}#crumbs` },
  })

export const breadcrumbNode = (url: string, items: { name: string; url?: string }[]) => ({
  '@type': 'BreadcrumbList',
  '@id': `${url}#crumbs`,
  itemListElement: items.map((it, i) => clean({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.url })),
})

export const imageNode = (a: { url: string; caption?: string; creditText?: string | null; copyright?: string | null; width?: number | null; height?: number | null; origin: string }) =>
  clean({
    '@type': 'ImageObject',
    contentUrl: a.url,
    url: a.url,
    caption: a.caption,
    creditText: a.creditText,
    copyrightNotice: a.copyright,
    creator: a.creditText ? { '@type': 'Organization', name: a.creditText } : undefined,
    width: a.width,
    height: a.height,
  })

export function tourNode(a: {
  origin: string
  url: string
  name: string
  description: string
  sku: string
  images: string[]
  itinerary: { name: string; description?: string }[]
  lowCents: number | null
  highCents: number | null
  offerCount: number
  validUntil?: string | null
  touristTypes?: string[]
  offer?: { name: string; url: string; fromCents: number; validUntil: string } | null
}) {
  const offers =
    a.lowCents != null
      ? clean({
          '@type': 'AggregateOffer',
          priceCurrency: 'USD',
          lowPrice: dollars(a.lowCents),
          highPrice: a.highCents != null ? dollars(a.highCents) : undefined,
          offerCount: a.offerCount,
          availability: 'https://schema.org/InStock',
          priceValidUntil: a.validUntil || undefined,
          url: a.url,
          seller: { '@id': orgId(a.origin) },
          offers: a.offer
            ? [
                {
                  '@type': 'Offer',
                  name: a.offer.name,
                  price: dollars(a.offer.fromCents),
                  priceCurrency: 'USD',
                  priceValidUntil: a.offer.validUntil,
                  url: a.offer.url,
                  availability: 'https://schema.org/InStock',
                },
              ]
            : undefined,
        })
      : undefined
  return clean({
    '@type': ['Product', 'TouristTrip'],
    '@id': `${a.url}#trip`,
    name: a.name,
    description: a.description,
    url: a.url,
    image: a.images,
    sku: a.sku,
    brand: { '@id': orgId(a.origin) },
    provider: { '@id': orgId(a.origin) },
    touristType: a.touristTypes,
    itinerary: a.itinerary.length
      ? {
          '@type': 'ItemList',
          numberOfItems: a.itinerary.length,
          itemListElement: a.itinerary.map((d, i) => clean({ '@type': 'ListItem', position: i + 1, name: d.name, description: d.description })),
        }
      : undefined,
    offers,
  })
}

export const videoNode = (a: { name: string; description: string; thumbnail: string; uploadDate: string; embedUrl: string; pageUrl: string }) => ({
  '@type': 'VideoObject',
  '@id': `${a.pageUrl}#video-${a.embedUrl.split('/').pop()?.split('?')[0]}`,
  name: a.name,
  description: a.description,
  thumbnailUrl: [a.thumbnail],
  uploadDate: a.uploadDate,
  embedUrl: a.embedUrl,
})

export const eventNode = (a: {
  origin: string
  url: string
  name: string
  description: string
  start: string
  end: string
  place: string
  country?: string
  images: string[]
  priceCents: number
  status: string
}) =>
  clean({
    '@type': 'Event',
    '@id': `${a.url}#event`,
    name: a.name,
    description: a.description,
    startDate: a.start,
    endDate: a.end,
    eventStatus: a.status === 'cancelled' ? 'https://schema.org/EventCancelled' : 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: { '@type': 'Place', name: a.place, address: { '@type': 'PostalAddress', addressCountry: a.country || 'KE' } },
    image: a.images,
    organizer: { '@id': orgId(a.origin) },
    offers: {
      '@type': 'Offer',
      url: a.url,
      price: dollars(a.priceCents),
      priceCurrency: 'USD',
      availability: a.status === 'full' ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
    },
  })

export const articleNode = (a: { origin: string; url: string; headline: string; description?: string; image?: string; published?: string | null; modified?: string | null; author?: string; locale: string }) =>
  clean({
    '@type': 'BlogPosting',
    '@id': `${a.url}#article`,
    headline: a.headline,
    description: a.description,
    image: a.image ? [a.image] : undefined,
    datePublished: a.published,
    dateModified: a.modified || a.published,
    inLanguage: a.locale,
    author: a.author ? { '@type': 'Person', name: a.author } : { '@id': orgId(a.origin) },
    publisher: { '@id': orgId(a.origin) },
    mainEntityOfPage: { '@id': `${a.url}#webpage` },
  })

export const itemListNode = (url: string, items: { name: string; url: string }[]) => ({
  '@type': 'ItemList',
  '@id': `${url}#list`,
  numberOfItems: items.length,
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, url: it.url })),
})

export const faqNode = (url: string, items: { question: string; answer: string }[]) =>
  items.length
    ? {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: items.map((q) => ({ '@type': 'Question', name: q.question, acceptedAnswer: { '@type': 'Answer', text: q.answer } })),
      }
    : null

export const offerNode = (a: { origin: string; url: string; name: string; description: string; validFrom?: string | null; validUntil: string; image?: string }) =>
  clean({
    '@type': 'Offer',
    '@id': `${a.url}#offer`,
    name: a.name,
    description: a.description,
    url: a.url,
    image: a.image,
    validFrom: a.validFrom || undefined,
    priceValidUntil: a.validUntil,
    seller: { '@id': orgId(a.origin) },
    availability: 'https://schema.org/InStock',
  })
