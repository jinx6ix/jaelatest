import type { GlobalConfig } from 'payload'
import { navLinkFields } from '@/fields/navLink'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: { read: () => true },
  admin: { group: 'Site' },
  fields: [
    {
      name: 'items',
      type: 'array',
      maxRows: 8,
      admin: { initCollapsed: true, description: 'Main menu. Add sub items under a parent to make a dropdown.' },
      fields: [
        ...navLinkFields(),
        { name: 'children', type: 'array', maxRows: 8, fields: navLinkFields({ description: true }) },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      label: 'Button on the right',
      fields: navLinkFields(),
    },
  ],
  hooks: { afterChange: [revalidateHeader] },
}
