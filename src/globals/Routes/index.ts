import type { GlobalConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { revalidateGlobalTag } from '@/hooks/revalidateSite'
import { ROUTE_KEY_OPTIONS } from '@/fields/navLink'

export const Routes: GlobalConfig = {
  slug: 'routes',
  access: { read: anyone, update: authenticated },
  admin: { group: 'Site', description: 'The first part of each URL. Change a prefix here and every link and sitemap entry follows. Old URLs need a redirect.' },
  hooks: { afterChange: [revalidateGlobalTag('routes')] },
  fields: [
    {
      name: 'routes',
      type: 'array',
      fields: [
        { name: 'key', type: 'select', required: true, options: ROUTE_KEY_OPTIONS.filter((o) => !['custom', 'home'].includes(o.value)) },
        { name: 'prefix', type: 'text', required: true, admin: { description: 'Lowercase letters, numbers and hyphens only, for example budget-tours' }, validate: (v: unknown) => (typeof v === 'string' && /^[a-z0-9-]+$/.test(v) ? true : 'Use lowercase letters, numbers and hyphens.') },
        { name: 'breadcrumbLabel', type: 'text', required: true, localized: true },
      ],
    },
  ],
}
