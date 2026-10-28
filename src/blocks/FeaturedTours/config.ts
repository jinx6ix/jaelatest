import type { Block } from 'payload'

export const FeaturedToursBlock: Block = {
  slug: 'featuredTours',
  interfaceName: 'FeaturedTours',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      localized: true,
    },
    {
      name: 'tours',
      type: 'relationship',
      relationTo: 'tours',
      hasMany: true,
      required: false,
      maxRows: 4,
      minRows: 1,
    },
    {
      name: 'viewAllUrl',
      type: 'text',
      localized: true,
    },
  ],
}
