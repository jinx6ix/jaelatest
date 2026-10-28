import type { Block } from 'payload'

export const SeatMapBlock: Block = {
  slug: 'seatMap',
  interfaceName: 'SeatMap',
  fields: [
    {
      name: 'imageUrl',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
      localized: true,
    },
  ],
}
