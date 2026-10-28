import type { GlobalConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { revalidateGlobalTag } from '@/hooks/revalidateSite'

export const Company: GlobalConfig = {
  slug: 'company',
  access: { read: anyone, update: authenticated },
  admin: { group: 'Site' },
  hooks: { afterChange: [revalidateGlobalTag('company')] },
  fields: [
    { name: 'companyName', type: 'text', required: true, localized: true },
    { name: 'tagline', type: 'text', localized: true },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'phoneNumber', type: 'text', required: true },
    {
      name: 'address',
      type: 'group',
      fields: [
        { name: 'street', type: 'text' },
        { name: 'city', type: 'text' },
        { name: 'region', type: 'text' },
        { name: 'postalCode', type: 'text' },
        { name: 'countryCode', type: 'text', defaultValue: 'KE' },
      ],
    },
    {
      name: 'geo',
      type: 'group',
      fields: [
        { name: 'lat', type: 'number' },
        { name: 'lng', type: 'number' },
      ],
    },
    { name: 'openingHours', type: 'text', localized: true },
    { name: 'credentials', type: 'array', admin: { description: 'Licences, memberships. Empty rows are hidden. Only list real ones.' }, fields: [{ name: 'text', type: 'text', required: true, localized: true }] },
  ],
}
