import type { Block } from 'payload'

export const WhatToExpectBlock: Block = {
  slug: 'whatToExpect',
  interfaceName: 'WhatToExpect',
  fields: [
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'description',
          type: 'richText',
          required: true,
          localized: true,
        },
      ],
    },
  ],
}
