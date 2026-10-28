import type { Block } from 'payload'

export const CtaBandBlock: Block = {
  slug: 'ctaBand',
  interfaceName: 'CtaBand',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'buttonText',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'url',
      type: 'text',
      required: true, // Should be resolved via resolveHref
    },
  ],
}
