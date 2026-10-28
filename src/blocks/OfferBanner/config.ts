import type { Block } from 'payload'

export const OfferBanner: Block = {
  slug: 'offerBanner',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'link',
      type: 'relationship',
      relationTo: 'pages',
    },
    {
      name: 'backgroundColor',
      type: 'select',
      options: [
        { label: 'Gold', value: 'gold' },
        { label: 'Primary', value: 'primary' },
        { label: 'Background', value: 'background' },
      ],
    },
  ],
}
