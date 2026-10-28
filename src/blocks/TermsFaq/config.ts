import type { Block } from 'payload'

export const TermsFAQBlock: Block = {
  slug: 'termsFaq',
  interfaceName: 'TermsFaq',
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
      localized: true,
    },
  ],
}
