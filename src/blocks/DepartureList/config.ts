import type { Block } from 'payload'

export const DepartureList: Block = {
  slug: 'departureList',
  interfaceName: 'DepartureList',
  fields: [
    {
      name: 'showUpcoming',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
