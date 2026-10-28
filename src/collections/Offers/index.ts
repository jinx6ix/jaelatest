import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'
import { publishedOrAuth } from '@/access/publishedOrAuth'
import { authenticated } from '@/access/authenticated'
import { revalidateCollection, revalidateCollectionDelete } from '@/hooks/revalidateSite'

export const Offers: CollectionConfig = {
  slug: 'offers',
  access: { read: publishedOrAuth, create: authenticated, update: authenticated, delete: authenticated },
  admin: { useAsTitle: 'name', group: 'Tours', defaultColumns: ['name', 'type', 'validUntil', 'published'] },
  hooks: { afterChange: [revalidateCollection], afterDelete: [revalidateCollectionDelete] },
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    slugField({ useAsSlug: 'name' }),
    {
      type: 'row',
      fields: [
        { name: 'published', type: 'checkbox', defaultValue: true, admin: { width: '33%' } },
        { name: 'featured', type: 'checkbox', defaultValue: false, admin: { width: '33%' } },
        { name: 'sample', type: 'checkbox', defaultValue: false, admin: { width: '33%' } },
      ],
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Early bird', value: 'early-bird' },
        { label: 'Seasonal', value: 'seasonal' },
        { label: 'Last minute', value: 'last-minute' },
        { label: 'Group discount', value: 'group' },
        { label: 'Added value', value: 'added-value' },
      ],
    },
    { name: 'badgeText', type: 'text', localized: true, admin: { description: 'Short badge, for example "10% off". Leave empty to build it from the discount.' } },
    { name: 'summary', type: 'textarea', required: true, localized: true, maxLength: 320 },
    { name: 'description', type: 'textarea', localized: true },
    { name: 'heroImage', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'discountType',
      type: 'select',
      required: true,
      defaultValue: 'percent',
      options: [
        { label: 'Percent off', value: 'percent' },
        { label: 'Fixed amount off per person (cents)', value: 'fixed' },
        { label: 'No price change (added value)', value: 'none' },
      ],
    },
    { name: 'discountValue', type: 'number', min: 0, admin: { description: 'Percent: 10 = 10%. Fixed: cents, 5000 = $50 per person.' } },
    { name: 'appliesTo', type: 'relationship', relationTo: 'tours', hasMany: true, required: true },
    { name: 'validFrom', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
    { name: 'validUntil', type: 'date', required: true, admin: { date: { pickerAppearance: 'dayOnly' }, description: 'Last day to book. Expired offers disappear automatically.' } },
    { name: 'travelFrom', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
    { name: 'travelUntil', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
    { name: 'minGuests', type: 'number', min: 1 },
    { name: 'howItWorks', type: 'array', fields: [{ name: 'text', type: 'text', required: true, localized: true }] },
    { name: 'terms', type: 'textarea', localized: true },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', localized: true },
        { name: 'description', type: 'textarea', localized: true },
        { name: 'noindex', type: 'checkbox', defaultValue: false },
      ],
    },
  ],
}
