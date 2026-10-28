import type { CollectionConfig } from 'payload'

export const FxRates: CollectionConfig = {
  slug: 'fx-rates',
  admin: {
    useAsTitle: 'date',
    group: 'Commerce',
    defaultColumns: ['date', 'base'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'date',
      type: 'date',
      required: true,
    },
    {
      name: 'base',
      type: 'text',
      required: true,
      defaultValue: 'USD',
    },
    {
      name: 'rates',
      type: 'json',
      required: true,
    },
  ],
}
