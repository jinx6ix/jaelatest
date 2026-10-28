import type { GlobalConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { revalidateGlobalTag } from '@/hooks/revalidateSite'

export const Translations: GlobalConfig = {
  slug: 'translations',
  access: { read: anyone, update: authenticated },
  admin: { group: 'Site', description: 'Small pieces of website text (buttons, labels, messages). Add a row to override the built-in English text or to translate it.' },
  hooks: { afterChange: [revalidateGlobalTag('translations')] },
  fields: [
    {
      name: 'entries',
      type: 'array',
      fields: [
        { name: 'key', type: 'text', required: true, admin: { description: 'For example booking.submit. The full list is in src/i18n/defaults.ts.' } },
        { name: 'value', type: 'text', required: true, localized: true },
      ],
    },
  ],
}
