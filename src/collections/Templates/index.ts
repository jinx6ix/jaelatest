import type { CollectionConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { revalidateCollection } from '@/hooks/revalidateSite'

const SECTION_OPTIONS = [
  'facts',
  'highlights',
  'tabs',
  'whyCheaper',
  'accessibility',
  'bestTime',
  'reviews',
  'faq',
  'similar',
  'departures',
  'offerBanner',
].map((value) => ({ label: value, value }))

const TAB_OPTIONS = ['itinerary', 'inclusions', 'exclusions', 'booking', 'gallery', 'videos', 'details', 'eligible', 'terms'].map(
  (value) => ({ label: value, value }),
)

export const Templates: CollectionConfig = {
  slug: 'templates',
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  admin: { useAsTitle: 'name', group: 'Tours', description: 'A template is the page recipe for a kind of tour: which sections and which tabs, in which order.' },
  hooks: { afterChange: [revalidateCollection] },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'variant',
      type: 'select',
      required: true,
      options: [
        { label: 'Standard (/tours)', value: 'standard' },
        { label: 'Budget (/budget-tours)', value: 'budget' },
        { label: 'Accessible (/disability-tours)', value: 'accessible' },
        { label: 'Migration (/migration-tours)', value: 'migration' },
        { label: 'Specialty (/tours)', value: 'specialty' },
        { label: 'Offer (/offers)', value: 'offer' },
      ],
    },
    {
      name: 'sections',
      type: 'array',
      admin: { description: 'Page sections in display order. Untick Enabled to hide one.' },
      fields: [
        { name: 'key', type: 'select', required: true, options: SECTION_OPTIONS },
        { name: 'enabled', type: 'checkbox', defaultValue: true },
        { name: 'title', type: 'text', localized: true, admin: { description: 'Optional heading override.' } },
      ],
    },
    {
      name: 'tabs',
      type: 'array',
      admin: { description: 'Tabs in display order. A tab with no content never shows.' },
      fields: [
        { name: 'key', type: 'select', required: true, options: TAB_OPTIONS },
        { name: 'enabled', type: 'checkbox', defaultValue: true },
        { name: 'title', type: 'text', localized: true, admin: { description: 'Optional label override.' } },
      ],
    },
  ],
}
