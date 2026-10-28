import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'
import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { revalidateCollection } from '@/hooks/revalidateSite'

export const Destinations: CollectionConfig = {
  slug: 'destinations',
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  admin: { useAsTitle: 'name', group: 'Tours' },
  hooks: { afterChange: [revalidateCollection] },
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    slugField({ useAsSlug: 'name' }),
    {
      name: 'country',
      type: 'select',
      options: [
        { label: 'Kenya', value: 'KE' },
        { label: 'Tanzania', value: 'TZ' },
        { label: 'Uganda', value: 'UG' },
        { label: 'Rwanda', value: 'RW' },
        { label: 'Other', value: 'other' },
      ],
    },
    { name: 'description', type: 'textarea', localized: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
  ],
}
