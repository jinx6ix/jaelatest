import type { Block } from 'payload'

export const SimilarItems: Block = {
  slug: 'similarItems',
  interfaceName: 'SimilarItems',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'tours',
      type: 'relationship',
      relationTo: 'tours',
      hasMany: true,
      required: true,
    },
  ],
}
