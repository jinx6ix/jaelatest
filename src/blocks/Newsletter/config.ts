import type { Block } from 'payload'

export const NewsletterBlock: Block = {
  slug: 'newsletter',
  interfaceName: 'Newsletter',
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
      localized: true,
    },
  ],
}
