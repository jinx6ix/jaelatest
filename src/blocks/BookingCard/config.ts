import type { Block } from 'payload'

export const BookingCard: Block = {
  slug: 'bookingCard',
  interfaceName: 'BookingCard',
  fields: [
    {
      name: 'mode',
      type: 'select',
      defaultValue: 'tour',
      options: [
        { label: 'Tour', value: 'tour' },
        { label: 'Vehicle', value: 'vehicle' },
        { label: 'Joint Departure', value: 'joint' },
      ],
      required: true,
    },
    {
      name: 'reference',
      type: 'relationship',
      relationTo: 'tours', // Set a default or valid collection
      label: 'Reference (Generic)',
      hidden: true, // Hide because we use specific fields
    },
    {
      name: 'tour',
      type: 'relationship',
      relationTo: 'tours',
      admin: {
        condition: (_, { data }) => data?.mode === 'tour',
      },
    },
    {
      name: 'vehicle',
      type: 'relationship',
      relationTo: 'vehicles',
      admin: {
        condition: (_, { data }) => data?.mode === 'vehicle',
      },
    },
    {
      name: 'jointDeparture',
      type: 'relationship',
      relationTo: 'joint-departures',
      admin: {
        condition: (_, { data }) => data?.mode === 'joint',
      },
    },
    {
      name: 'ctaText',
      type: 'text',
      localized: true,
      defaultValue: 'Book Now',
    },
  ],
}
