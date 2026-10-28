import type { Block } from 'payload'

export const AccessibilitySection: Block = {
  slug: 'accessibilitySection',
  interfaceName: 'AccessibilitySection',
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
      localized: true,
    },
  ],
}
