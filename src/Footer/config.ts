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
    { name: 'legalLinks', type: 'array', fields: navLinkFields() },
    { name: 'copyright', type: 'text', localized: true, admin: { description: 'Use {year} for the current year.' } },
  ],
  hooks: { afterChange: [revalidateFooter] },
}
