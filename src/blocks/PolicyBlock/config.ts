import type { Block } from 'payload'

export const PolicyBlockComponent: Block = {
  slug: 'policyBlock',
  interfaceName: 'PolicyBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      localized: true,
    },
  ],
}
