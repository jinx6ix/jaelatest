import type { Block } from 'payload'

export const PriceMatrixBlock: Block = {
  slug: 'priceMatrix',
  interfaceName: 'PriceMatrix',
  fields: [
    {
      name: 'mode',
      type: 'select',
      defaultValue: 'manual',
      options: [
        { label: 'Manual', value: 'manual' },
      ],
      required: true,
    },
    {
      name: 'currency',
      type: 'text',
      required: true,
      defaultValue: 'USD',
    },
    {
      name: 'validUntil',
      type: 'date',
    },
  ],
}
