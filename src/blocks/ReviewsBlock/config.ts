import type { Block } from 'payload'

export const ReviewsBlock: Block = {
  slug: 'reviewsBlock',
  interfaceName: 'ReviewsBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'reviews',
      type: 'relationship',
      relationTo: 'tours', // Use 'tours' as placeholder or 'pages' until review collection is added
      label: 'Reviews',
    },
  ],
}
