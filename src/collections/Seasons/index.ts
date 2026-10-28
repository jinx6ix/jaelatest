import type { CollectionConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { revalidateCollection } from '@/hooks/revalidateSite'

export const Seasons: CollectionConfig = {
  slug: 'seasons',
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  admin: {
    useAsTitle: 'name',
    group: 'Tours',
    description: 'Every day of the year must belong to exactly one season. A season may run over the new year (for example 1 Nov to 28 Feb).',
    defaultColumns: ['name', 'startMonth', 'startDay', 'endMonth', 'endDay', 'sortOrder'],
  },
  hooks: { afterChange: [revalidateCollection] },
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    {
      type: 'row',
      fields: [
        { name: 'startMonth', type: 'number', required: true, min: 1, max: 12 },
        { name: 'startDay', type: 'number', required: true, min: 1, max: 31 },
        { name: 'endMonth', type: 'number', required: true, min: 1, max: 12 },
        { name: 'endDay', type: 'number', required: true, min: 1, max: 31 },
      ],
    },
    { name: 'sortOrder', type: 'number', defaultValue: 0, admin: { description: 'Column order in the price table. Low first is usual.' } },
  ],
}
