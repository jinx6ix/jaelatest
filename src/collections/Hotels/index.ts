import type { CollectionConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'

export const Hotels: CollectionConfig = {
  slug: 'hotels',
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  admin: { useAsTitle: 'name', group: 'Tours' },
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    { name: 'location', type: 'text', localized: true },
    { name: 'stars', type: 'number', min: 1, max: 5 },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'stepFree', type: 'checkbox', defaultValue: false, admin: { description: 'Step-free rooms and paths confirmed.' } },
  ],
}
