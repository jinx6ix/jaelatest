import type { Block } from 'payload'

export const Itinerary: Block = {
  slug: 'itinerary',
  interfaceName: 'Itinerary',
  fields: [
    {
      name: 'days',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'body',
          type: 'richText',
          required: true,
          localized: true,
        },
        {
          name: 'hotel',
          type: 'relationship',
          relationTo: 'hotels',
        },
        {
          name: 'meals',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Breakfast', value: 'breakfast' },
            { label: 'Lunch', value: 'lunch' },
            { label: 'Dinner', value: 'dinner' },
          ],
        },
      ],
    },
  ],
}
