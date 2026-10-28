import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  access: { create: () => false, read: authenticated, update: authenticated, delete: authenticated },
  admin: { useAsTitle: 'name', group: 'Sales', defaultColumns: ['name', 'type', 'travelDate', 'status', 'createdAt'] },
  fields: [
    { name: 'type', type: 'select', required: true, options: ['tour', 'offer', 'vehicle', 'departure', 'general'] },
    { name: 'status', type: 'select', defaultValue: 'new', options: ['new', 'contacted', 'quoted', 'won', 'lost'] },
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text', admin: { description: 'International format (E.164).' } },
    { name: 'countryIso', type: 'text' },
    { name: 'tour', type: 'relationship', relationTo: 'tours' },
    { name: 'offer', type: 'relationship', relationTo: 'offers' },
    { name: 'vehicle', type: 'relationship', relationTo: 'vehicles' },
    { name: 'departure', type: 'relationship', relationTo: 'joint-departures' },
    { name: 'guests', type: 'text' },
    { name: 'travelDate', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
    { name: 'season', type: 'text' },
    { name: 'currency', type: 'text' },
    { name: 'estimateUsdCents', type: 'number' },
    { name: 'message', type: 'textarea' },
    { name: 'wantsPdf', type: 'checkbox' },
    { name: 'consent', type: 'checkbox' },
    { name: 'sourcePath', type: 'text' },
    { name: 'locale', type: 'text' },
  ],
}
