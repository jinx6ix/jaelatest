import type { Block } from 'payload'

export const HowItWorksBlock: Block = {
  slug: 'howItWorks',
  interfaceName: 'HowItWorks',
  fields: [
    {
      name: 'steps',
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
          required: false,
          localized: true,
        },
      ],
    },
  ],
}
