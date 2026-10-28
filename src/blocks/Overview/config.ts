import type { Block } from 'payload'

export const Overview: Block = {
  slug: 'overview',
  interfaceName: 'Overview',
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
      localized: true,
    },
  ],
}
