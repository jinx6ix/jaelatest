import type { GlobalConfig } from 'payload'
import { navLinkFields } from '@/fields/navLink'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: { read: () => true },
  admin: { group: 'Site' },
  fields: [
    {
      name: 'columns',
      type: 'array',
      maxRows: 4,
      admin: { initCollapsed: true },
      fields: [
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'links', type: 'array', fields: navLinkFields() },
      ],
    },
    {
      name: 'partners',
      type: 'array',
      admin: { description: 'Official Partners & Affiliations (e.g. Kenya Wildlife Service, Tourism Authority Kenya)' },
      fields: [
        { name: 'name', type: 'text', required: true, localized: true },
        { name: 'logo', type: 'upload', relationTo: 'media', required: true },
        { name: 'url', type: 'text' },
      ],
    },
    {
      name: 'reviews',
      type: 'array',
      admin: { description: 'Customer Reviews & Widgets (e.g. SafariGo, SafariBookings, TripAdvisor)' },
      fields: [
        { name: 'name', type: 'text', required: true, localized: true },
        { name: 'logo', type: 'upload', relationTo: 'media', required: true },
        { name: 'url', type: 'text' },
      ],
    },
    { name: 'legalLinks', type: 'array', fields: navLinkFields() },
    { name: 'copyright', type: 'text', localized: true, admin: { description: 'Use {year} for the current year.' } },
  ],
  hooks: { afterChange: [revalidateFooter] },
}
