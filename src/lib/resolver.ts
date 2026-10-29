import { withLocale } from './routes'

export function resolveHref(documentOrRef: any, locale: string = 'en'): string {
  if (!documentOrRef) return withLocale(locale, '/')

  if (typeof documentOrRef === 'string') {
    const path = documentOrRef.startsWith('/') ? documentOrRef : '/' + documentOrRef
    return withLocale(locale, path)
  }

  const { relationTo, value } = typeof documentOrRef === 'object' && 'relationTo' in documentOrRef ? documentOrRef : { relationTo: 'tours', value: documentOrRef }
  const doc = typeof value === 'object' ? value : {}
  const slug = doc.slug || ''

  switch (relationTo) {
    case 'tours': {
      const variant = doc.template?.variant || doc.variant || 'standard'
      let prefix = 'tours'
      if (variant === 'budget') prefix = 'budget-tours'
      if (variant === 'accessible') prefix = 'disability-tours'
      return withLocale(locale, `/${prefix}/${slug}`)
    }
    case 'offers':
      return withLocale(locale, `/offers/${slug}`)
    case 'joint-departures':
      return withLocale(locale, `/joint-safaris/${slug}`)
    case 'vehicles':
      return withLocale(locale, `/vehicle-hire/${slug}`)
    case 'pages':
      return withLocale(locale, slug === 'home' || !slug ? '/' : `/${slug}`)
    default:
      return withLocale(locale, `/${slug}`)
  }
}

export function getSimilarTours(currentTour: any, allTours: any[] = [], limit: number = 3): any[] {
  const variant = currentTour?.template?.variant || 'standard'
  const filtered = allTours.filter((t) => t.id !== currentTour.id)

  if (variant === 'budget') {
    const budgetTours = filtered.filter((t) => (t.template?.variant || t.variant) === 'budget')
    const standardTours = filtered.filter((t) => (t.template?.variant || t.variant) === 'standard')
    return [...budgetTours, ...standardTours].slice(0, limit)
  }

  if (variant === 'accessible') {
    const accessibleTours = filtered.filter((t) => (t.template?.variant || t.variant) === 'accessible')
    const others = filtered.filter((t) => (t.template?.variant || t.variant) !== 'accessible')
    return [...accessibleTours, ...others].slice(0, limit)
  }

  return filtered.slice(0, limit)
}
