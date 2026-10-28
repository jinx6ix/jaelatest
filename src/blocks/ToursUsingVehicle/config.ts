import type { Block } from 'payload'

export const ToursUsingVehicleBlock: Block = {
  slug: 'toursUsingVehicle',
  interfaceName: 'ToursUsingVehicle',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'tours',
      type: 'relationship',
      relationTo: 'tours',
      hasMany: true,
      required: true,
    },
  ],
}
