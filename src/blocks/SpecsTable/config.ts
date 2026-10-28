import type { Block } from 'payload'

export const SpecsTableBlock: Block = {
  slug: 'specsTable',
  interfaceName: 'SpecsTable',
  fields: [
    {
      name: 'specs',
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
