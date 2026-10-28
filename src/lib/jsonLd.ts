export function buildBreadcrumbJsonLd(items: { name: string; url?: string }[], siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url ? { item: `${siteUrl}${item.url}` } : {}),
    })),
  }
}

export function buildTourJsonLd(tour: any, siteUrl: string, currency: string = 'USD') {
  const cheapest = tour.cheapestPrice || 500
  const highest = tour.highestPrice || 2500

  return {
    '@context': 'https://schema.org',
    '@type': ['Product', 'TouristTrip'],
    name: tour.title,
    description: tour.summary || tour.description,
    image: tour.heroImage?.url ? `${siteUrl}${tour.heroImage.url}` : undefined,
    sku: tour.slug,
    brand: {
      '@type': 'Organization',
      name: 'JaeTravel Expeditions',
    },
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: cheapest,
      highPrice: highest,
      priceCurrency: currency,
      offerCount: tour.pricing?.matrix?.length || 1,
      availability: 'https://schema.org/InStock',
    },
    itinerary: tour.itinerary?.map((day: any, idx: number) => ({
      '@type': 'TouristAttinerary',
      name: day.title,
      description: day.body,
      position: idx + 1,
    })),
  }
}

export function buildImageObject(media: any, siteUrl: string) {
  if (!media) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    contentUrl: media.url ? `${siteUrl}${media.url}` : undefined,
    creator: media.creator ? { '@type': 'Person', name: media.creator } : undefined,
    creditText: media.creditText,
    copyrightNotice: media.copyrightNotice,
  }
}
