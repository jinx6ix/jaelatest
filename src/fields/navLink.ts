import type { Field } from 'payload'

export const ROUTE_KEY_OPTIONS = [
  { label: 'Custom URL', value: 'custom' },
  { label: 'Home', value: 'home' },
  { label: 'All tours', value: 'tours' },
  { label: 'Disability tours', value: 'disabilityTours' },
  { label: 'Budget tours', value: 'budgetTours' },
  { label: 'Migration tours', value: 'migrationTours' },
  { label: 'Join-in tours', value: 'joinInTours' },
  { label: 'Offers', value: 'offers' },
  { label: 'Vehicle hire', value: 'vehicleHire' },
  { label: 'Blog', value: 'blog' },
  { label: 'Photo and video gallery', value: 'gallery' },
]

/** Fields for a link that points at a route key (resolved through the Routes global) or a custom URL. */
export const navLinkFields = (opts: { description?: boolean; optional?: boolean } = {}): Field[] => [
  { name: 'label', type: 'text', required: !opts.optional, localized: true },
  {
    name: 'routeKey',
    type: 'select',
    required: !opts.optional,
    defaultValue: 'custom',
    options: ROUTE_KEY_OPTIONS,
    admin: { description: 'Pick a built-in route, or choose Custom URL.' },
  },
  {
    name: 'url',
    type: 'text',
    admin: {
      description: 'Used when Route is "Custom URL". Start with / for a page on this site (e.g. /about).',
      condition: (_, siblingData) => siblingData?.routeKey === 'custom',
    },
  },
  ...(opts.description
    ? ([{ name: 'description', type: 'text', localized: true }] as Field[])
    : []),
]
