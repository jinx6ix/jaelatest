import type { Block } from 'payload'

export const GroupDiscountTableBlock: Block = {
  slug: 'groupDiscountTable',
  interfaceName: 'GroupDiscountTable',
  fields: [
    {
      name: 'discounts',
      type: 'array',
      fields: [
        {
          name: 'minPeople',
          type: 'number',
          required: true,
        },
        {
          name: 'maxPeople',
          type: 'number',
          required: true,
        },
        {
          name: 'discount',
          type: 'text',
          required: true,
          localized: true,
        },
      ],
    },
  ],
}
