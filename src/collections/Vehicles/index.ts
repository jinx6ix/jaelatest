import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'
import { publishedOrAuth } from '@/access/publishedOrAuth'
import { authenticated } from '@/access/authenticated'
import { revalidateCollection, revalidateCollectionDelete } from '@/hooks/revalidateSite'

export const Vehicles: CollectionConfig = {
  slug: 'vehicles',
  access: { read: publishedOrAuth, create: authenticated, update: authenticated, delete: authenticated },
  admin: { useAsTitle: 'name', group: 'Vehicle hire', defaultColumns: ['name', 'type', 'seats', 'published'] },
  hooks: { afterChange: [revalidateCollection], afterDelete: [revalidateCollectionDelete] },
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    slugField({ useAsSlug: 'name' }),
    {
      type: 'row',
      fields: [
        { name: 'published', type: 'checkbox', defaultValue: true, admin: { width: '50%' } },
        { name: 'sample', type: 'checkbox', defaultValue: false, admin: { width: '50%' } },
      ],
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Land Cruiser', value: 'land-cruiser' },
        { label: 'Extended Land Cruiser', value: 'extended-land-cruiser' },
        { label: 'Safari Van', value: 'safari-van' },
        { label: 'Rooftop Camper', value: 'rooftop-camper' },
        { label: 'Accessible', value: 'accessible' },
        { label: 'Transfer', value: 'transfer' },
      ],
    },
    { name: 'seats', type: 'number', required: true, min: 1 },
    { name: 'summary', type: 'textarea', localized: true },
    { name: 'description', type: 'textarea', localized: true },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'gallery', type: 'array', fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }] },
    { name: 'features', type: 'array', fields: [{ name: 'text', type: 'text', required: true, localized: true }] },
    {
      name: 'specs',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        { name: 'value', type: 'text', required: true, localized: true },
      ],
    },
    {
      name: 'rates',
      type: 'array',
      admin: { description: 'Indicative rates. Prices in US cents.' },
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        { name: 'priceCents', type: 'number', required: true, min: 0 },
        { name: 'unit', type: 'text', localized: true },
      ],
    },
    { name: 'accessible', type: 'checkbox', defaultValue: false, admin: { description: 'Wheelchair lift or ramp fitted.' } },
  ],
}
