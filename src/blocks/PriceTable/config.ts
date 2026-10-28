import type { Block } from 'payload'

export const PriceTableBlock: Block = {
  slug: 'priceTable',
  interfaceName: 'PriceTable',
  fields: [
    {
      name: 'tableData',
      type: 'array',
      fields: [
        {
          name: 'row',
          type: 'array',
          fields: [
            {
              name: 'cell',
              type: 'text',
              localized: true,
            },
          ],
        },
      ],
    },
  ],
}
