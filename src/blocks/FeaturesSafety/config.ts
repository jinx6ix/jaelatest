import type { Block } from 'payload'

export const FeaturesSafetyBlock: Block = {
  slug: 'featuresSafety',
  interfaceName: 'FeaturesSafety',
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
          type: 'text',
          required: true,
          localized: true,
        },
      ],
    },
  ],
}
