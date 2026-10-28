import type { CollectionConfig } from 'payload'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'author',
    group: 'Commerce',
    defaultColumns: ['author', 'rating', 'status', 'date', 'target'],
  },
  access: {
    read: () => true,
    create: () => true,
  },
  fields: [
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
    },
    {
      name: 'author',
      type: 'text',
      required: true,
    },
    {
      name: 'country',
      type: 'text',
      required: true,
    },
    {
      name: 'date',
      type: 'date',
      required: true,
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
    },
    {
      name: 'targetType',
      type: 'select',
      required: true,
      options: [
        { label: 'Tour', value: 'tour' },
        { label: 'Vehicle', value: 'vehicle' },
      ],
      defaultValue: 'tour',
    },
    {
      name: 'tour',
      type: 'relationship',
      relationTo: 'tours',
      admin: {
        condition: (data) => data?.targetType === 'tour',
      },
    },
    {
      name: 'source',
      type: 'text',
      defaultValue: 'Direct',
    },
    {
      name: 'verifiedBooking',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'consent',
      type: 'checkbox',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
    },
  ],
}
