import type { CollectionConfig } from 'payload'
import { publishedOrAuth } from '@/access/publishedOrAuth'
import { authenticated } from '@/access/authenticated'
import { revalidateCollection, revalidateCollectionDelete } from '@/hooks/revalidateSite'

export const JointDepartures: CollectionConfig = {
  slug: 'joint-departures',
  labels: { singular: 'Join-in departure', plural: 'Join-in departures' },
  access: { read: publishedOrAuth, create: authenticated, update: authenticated, delete: authenticated },
  admin: { useAsTitle: 'slug', group: 'Tours', defaultColumns: ['tour', 'startDate', 'pricePerSeat', 'status', 'published'] },
  hooks: {
    beforeValidate: [
      async ({ data, req }) => {
        if (data && !data.slug && data.tour && data.startDate) {
          const tourId = typeof data.tour === 'object' ? data.tour.id : data.tour
          const tour = await req.payload.findByID({ collection: 'tours', id: tourId, depth: 0, req })
          data.slug = `${tour.slug}-${String(data.startDate).slice(0, 10)}`
        }
        return data
      },
    ],
    afterChange: [revalidateCollection],
    afterDelete: [revalidateCollectionDelete],
  },
  fields: [
    { name: 'tour', type: 'relationship', relationTo: 'tours', required: true },
    { name: 'slug', type: 'text', unique: true, index: true, admin: { position: 'sidebar', description: 'Built from the tour and start date if left empty.' } },
    {
      type: 'row',
      fields: [
        { name: 'published', type: 'checkbox', defaultValue: true, admin: { width: '50%' } },
        { name: 'sample', type: 'checkbox', defaultValue: false, admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'startDate', type: 'date', required: true, admin: { date: { pickerAppearance: 'dayOnly' } } },
        { name: 'endDate', type: 'date', required: true, admin: { date: { pickerAppearance: 'dayOnly' } } },
      ],
    },
    { name: 'pricePerSeat', type: 'number', required: true, min: 0, admin: { description: 'US cents per seat. 56000 = $560.' } },
    { name: 'totalSeats', type: 'number', required: true, min: 1 },
    { name: 'minGuestsToRun', type: 'number', min: 1 },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'open',
      options: [
        { label: 'Open', value: 'open' },
        { label: 'Filling', value: 'filling' },
        { label: 'Guaranteed', value: 'guaranteed' },
        { label: 'Full', value: 'full' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    { name: 'vehicle', type: 'relationship', relationTo: 'vehicles' },
    { name: 'meetingPoint', type: 'text', localized: true },
    { name: 'notes', type: 'textarea', localized: true },
  ],
}
