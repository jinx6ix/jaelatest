import type { CollectionConfig } from 'payload'

export const Countries: CollectionConfig = {
  slug: 'countries',
  admin: {
    useAsTitle: 'name',
    group: 'Settings',
    defaultColumns: ['name', 'iso2', 'dialCode', 'popular', 'sortOrder'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'iso2',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'ISO 3166-1 alpha-2 code e.g. KE, TZ, US',
      },
    },
    {
      name: 'dialCode',
      type: 'text',
      required: true,
      admin: {
        description: 'Phone dial code e.g. +254, +1',
      },
    },
    {
      name: 'popular',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show at the top of dropdowns (Kenya, Tanzania, Uganda, Rwanda, UK, USA, Germany)',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 100,
    },
  ],
}
