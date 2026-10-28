import type { Block } from 'payload'

export const IncludedExcluded: Block = {
  slug: 'includedExcluded',
  interfaceName: 'IncludedExcluded',
  fields: [
    {
      name: 'included',
      type: 'array',
      label: 'Included',
      required: true,
      fields: [
        {
          name: 'item',
          type: 'text',
          required: true,
          localized: true,
        },
      ],
    },
    {
      name: 'excluded',
      type: 'array',
      label: 'Excluded',
      required: true,
      fields: [
        {
          name: 'item',
          type: 'text',
          required: true,
          localized: true,
        },
      ],
    },
  ],
}
