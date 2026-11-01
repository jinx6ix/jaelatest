import type { GlobalConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { revalidateGlobalTag } from '@/hooks/revalidateSite'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: { read: anyone, update: authenticated },
  admin: { group: 'Site' },
  hooks: { afterChange: [revalidateGlobalTag('site-settings')] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            { name: 'siteName', type: 'text', required: true, localized: true },
            { name: 'contactEmail', type: 'email', required: true },
            { name: 'whatsappNumber', type: 'text', required: true, admin: { description: 'Digits only with country code, for example 254700000000' } },
            { name: 'whatsappMessage', type: 'text', localized: true, admin: { description: 'Opening message for WhatsApp chats.' } },
            { name: 'minLeadDays', type: 'number', defaultValue: 2, min: 0, admin: { description: 'Earliest travel date a visitor can pick, in days from today.' } },
            { name: 'replyTime', type: 'text', localized: true, admin: { description: 'For example: We reply within one working day.' } },
          ],
        },
        {
          label: 'Trust and policy',
          fields: [
            { name: 'trust', type: 'array', admin: { description: 'Short reassurance lines. Empty rows are hidden.' }, fields: [{ name: 'text', type: 'text', required: true, localized: true }] },
            { name: 'paymentMethods', type: 'array', admin: { description: 'Leave empty to hide the payment line.' }, fields: [{ name: 'text', type: 'text', required: true }] },
            { name: 'cancellationSummary', type: 'text', localized: true },
            { name: 'depositSummary', type: 'text', localized: true },
          ],
        },
        {
          label: 'Currencies',
          fields: [
            {
              name: 'currencies',
              type: 'array',
              admin: { description: 'The first row is the base currency (rate 1). Rates are units of that currency per 1 US dollar. Update them regularly.' },
              fields: [
                { name: 'code', type: 'text', required: true, admin: { description: 'ISO code, for example USD' } },
                { name: 'rate', type: 'number', required: true, min: 0 },
                { name: 'rateDate', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
              ],
            },
          ],
        },
        {
          label: 'Social',
          fields: [
            {
              name: 'social',
              type: 'array',
              fields: [
                { name: 'platform', type: 'select', required: true, options: ['facebook', 'instagram', 'youtube', 'tiktok', 'x', 'linkedin', 'tripadvisor'] },
                { name: 'url', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          name: 'seo',
          label: 'SEO & Merchant',
          fields: [
            { name: 'titleSuffix', type: 'text', localized: true, defaultValue: 'JaeTravel Expeditions' },
            { name: 'defaultDescription', type: 'textarea', localized: true },
            { name: 'defaultOgImage', type: 'upload', relationTo: 'media' },
            { name: 'canonicalOrigin', type: 'text', admin: { description: 'Full site address used in canonical tags and sitemaps, for example https://jaetravel.co.ke. Leave empty to use NEXT_PUBLIC_SERVER_URL.' } },
            { name: 'enableFaqSchema', type: 'checkbox', defaultValue: true },
            { name: 'googleSiteVerification', type: 'text' },
            { name: 'aiCrawlers', type: 'checkbox', defaultValue: true, admin: { description: 'Allow AI training crawlers (GPTBot, ClaudeBot, Google-Extended, CCBot) in robots.txt' } },
            {
              name: 'preferredSource',
              type: 'group',
              fields: [{ name: 'enabled', type: 'checkbox', defaultValue: false, admin: { description: 'Show Add as preferred source button next to WhatsApp' } }],
            },
            {
              name: 'merchant',
              type: 'group',
              admin: { description: 'Google Merchant Center feed, policies and store quality settings.' },
              fields: [
                { name: 'enabled', type: 'checkbox', defaultValue: false },
                { name: 'merchantId', type: 'text', defaultValue: '5694347760' },
                { name: 'feedEnabled', type: 'checkbox', defaultValue: false },
                {
                  name: 'returnPolicy',
                  type: 'group',
                  fields: [
                    { name: 'category', type: 'select', options: [{ label: 'Finite Return Window', value: 'finite-window' }, { label: 'Not Permitted', value: 'not-permitted' }, { label: 'Unlimited Window', value: 'unlimited-window' }] },
                    { name: 'days', type: 'number', admin: { condition: (_, s) => s?.category === 'finite-window' } },
                    { name: 'refundType', type: 'select', options: ['full', 'exchange', 'store-credit'] },
                    { name: 'fees', type: 'select', options: ['free', 'customer-pays', 'restocking'] },
                    { name: 'method', type: 'select', options: ['by-mail', 'in-store', 'at-kiosk'] },
                    { name: 'countries', type: 'text', admin: { description: 'Comma-separated ISO country codes, e.g. KE, US, GB' } },
                    { name: 'pageSlug', type: 'relationship', relationTo: 'pages' },
                  ],
                },
                {
                  name: 'shipping',
                  type: 'group',
                  fields: [
                    { name: 'mode', type: 'select', options: [{ label: 'Does not ship (In-person service)', value: 'does-not-ship' }, { label: 'Digital', value: 'digital' }, { label: 'Ships', value: 'ships' }] },
                    { name: 'rate', type: 'number', admin: { condition: (_, s) => s?.mode === 'ships' } },
                    { name: 'handlingDays', type: 'number', admin: { condition: (_, s) => s?.mode === 'ships' } },
                    { name: 'transitDays', type: 'number', admin: { condition: (_, s) => s?.mode === 'ships' } },
                    { name: 'countries', type: 'text', admin: { condition: (_, s) => s?.mode === 'ships' } },
                    { name: 'pageSlug', type: 'relationship', relationTo: 'pages' },
                  ],
                },
                {
                  name: 'storeQuality',
                  type: 'group',
                  fields: [
                    { name: 'widgetEnabled', type: 'checkbox', defaultValue: false },
                    { name: 'position', type: 'text' },
                    { name: 'region', type: 'text' },
                  ],
                },
                {
                  name: 'customerReviews',
                  type: 'group',
                  fields: [{ name: 'optInEnabled', type: 'checkbox', defaultValue: false }],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
