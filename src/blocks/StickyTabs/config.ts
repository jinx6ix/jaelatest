import type { Block } from 'payload'

export const StickyTabs: Block = {
  slug: 'stickyTabs',
  interfaceName: 'StickyTabs',
  fields: [
    {
      name: 'tabs',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
        },
      ],
    },
  ],
}
