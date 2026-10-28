import type { Block } from 'payload'

export const WhyCheaper: Block = {
  slug: 'whyCheaper',
  interfaceName: 'WhyCheaper',
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
      localized: true,
    },
  ],
}
