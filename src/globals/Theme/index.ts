import type { Field, GlobalConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { revalidateGlobalTag } from '@/hooks/revalidateSite'

const color = (name: string, defaultValue: string, description?: string): Field => ({
  name,
  type: 'text',
  required: true,
  defaultValue,
  admin: { description: description ? `${description} (hex, for example ${defaultValue})` : `Hex colour, for example ${defaultValue}`, width: '50%' },
  validate: (v: unknown) => (typeof v === 'string' && /^#[0-9a-fA-F]{6}$/.test(v) ? true : 'Use a 6 digit hex colour like #FF7302'),
})

export const Theme: GlobalConfig = {
  slug: 'theme',
  access: { read: anyone, update: authenticated },
  admin: { group: 'Site', description: 'Brand colours and shapes. Every colour on the website comes from here.' },
  hooks: { afterChange: [revalidateGlobalTag('theme')] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Light colours',
          fields: [
            color('brand', '#FF7302', 'Buttons, active tab, highlights'),
            color('onBrand', '#201E1F', 'Text that sits on the brand colour. Use a dark colour: white on orange is hard to read'),
            color('accentText', '#B34A00', 'Small text and links on white'),
            color('sun', '#FFDD00', 'The sun yellow'),
            color('ink', '#201E1F', 'Main text'),
            color('ground', '#FFFFFF', 'Page background'),
            color('surface', '#FFFFFF', 'Cards'),
            color('tint', '#FFF2C2', 'Soft yellow bands'),
            color('line', '#E6D9CB', 'Borders'),
            color('muted', '#56585B', 'Secondary text'),
            color('soft', '#BDB7AE', 'Secondary text on dark areas'),
            color('night', '#201E1F', 'Dark areas, footer'),
            color('onNight', '#F7F2EA', 'Text on dark areas'),
            color('success', '#2E7D4F', 'Ticks'),
            color('danger', '#B3261E', 'Errors and crosses'),
            color('whatsapp', '#25D366', 'WhatsApp button'),
          ],
        },
        {
          label: 'Dark mode',
          fields: [
            color('darkGround', '#151311'),
            color('darkSurface', '#211F1C'),
            color('darkTint', '#1B1917'),
            color('darkInk', '#F5F1EB'),
            color('darkMuted', '#B8B1A7'),
            color('darkLine', '#3A3631'),
            color('darkNight', '#0F0E0D'),
            color('darkAccentText', '#FF9340'),
            color('darkSuccess', '#6CC38E'),
            color('darkDanger', '#FF8A7A'),
          ],
        },
        {
          label: 'Shape',
          fields: [
            { name: 'radiusCard', type: 'text', defaultValue: '16', admin: { description: 'Card corner radius in px' } },
            { name: 'radiusPanel', type: 'text', defaultValue: '22', admin: { description: 'Large panel corner radius in px' } },
            { name: 'popShadow', type: 'text', defaultValue: '6', admin: { description: 'Offset of the bold shadow on the trip finder and booking card, in px. 0 turns it off.' } },
          ],
        },
      ],
    },
  ],
}
