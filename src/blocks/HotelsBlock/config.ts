import type { Block } from 'payload'

export const HotelsBlock: Block = {
  slug: 'hotelsBlock',
  interfaceName: 'HotelsBlock',
  fields: [
    {
      name: 'hotels',
      type: 'array',
      fields: [
        {
          name: 'hotel',
          type: 'relationship',
          relationTo: 'hotels',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
          required: true,
          localized: true,
        },
      ],
    },
  ],
}
