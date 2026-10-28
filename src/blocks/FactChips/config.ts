import type { Block } from 'payload'

export const FactChips: Block = {
  slug: 'factChips',
  interfaceName: 'FactChips',
  fields: [
    {
      name: 'facts',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'value',
          type: 'text',
          required: true,
          localized: true,
        },
      ],
    },
  ],
}
