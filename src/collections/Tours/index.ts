import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'
import { publishedOrAuth } from '@/access/publishedOrAuth'
import { authenticated } from '@/access/authenticated'
import { revalidateCollection, revalidateCollectionDelete } from '@/hooks/revalidateSite'

export const Tours: CollectionConfig = {
  slug: 'tours',
  access: { read: publishedOrAuth, create: authenticated, update: authenticated, delete: authenticated },
  admin: { useAsTitle: 'title', group: 'Tours', defaultColumns: ['title', 'template', 'destination', 'durationDays', 'published'] },
  hooks: { afterChange: [revalidateCollection], afterDelete: [revalidateCollectionDelete] },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    slugField({ useAsSlug: 'title' }),
    {
      type: 'row',
      fields: [
        { name: 'published', type: 'checkbox', defaultValue: true, admin: { width: '33%' } },
        { name: 'featured', type: 'checkbox', defaultValue: false, admin: { width: '33%' } },
        { name: 'sample', type: 'checkbox', defaultValue: false, admin: { width: '33%', description: 'Sample content. Replace before launch.' } },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Overview',
          fields: [
            {
              name: 'template',
              type: 'relationship',
              relationTo: 'templates',
              required: true,
              admin: { description: 'The template decides the page layout, tabs and URL prefix (standard, budget, accessible, migration).' },
            },
            { name: 'destination', type: 'relationship', relationTo: 'destinations', required: true },
            { name: 'categories', type: 'relationship', relationTo: 'categories', hasMany: true },
            { name: 'durationDays', type: 'number', required: true, min: 1 },
            { name: 'summary', type: 'textarea', required: true, localized: true, maxLength: 320 },
            { name: 'description', type: 'richText', localized: true },
            { name: 'heroImage', type: 'upload', relationTo: 'media', required: true },
            {
              name: 'highlights',
              type: 'array',
              fields: [{ name: 'text', type: 'text', required: true, localized: true }],
            },
            {
              name: 'facts',
              type: 'group',
              fields: [
                { name: 'startPoint', type: 'text', localized: true },
                { name: 'endPoint', type: 'text', localized: true },
                {
                  name: 'pace',
                  type: 'select',
                  options: [
                    { label: 'Easy', value: 'easy' },
                    { label: 'Moderate', value: 'moderate' },
                    { label: 'Active', value: 'active' },
                  ],
                },
                { name: 'groupSizeMin', type: 'number' },
                { name: 'groupSizeMax', type: 'number' },
                { name: 'guideLanguages', type: 'text', localized: true },
              ],
            },
          ],
        },
        {
          label: 'Itinerary',
          fields: [
            {
              name: 'itinerary',
              type: 'array',
              fields: [
                { name: 'title', type: 'text', required: true, localized: true },
                { name: 'body', type: 'textarea', required: true, localized: true },
                { name: 'hotel', type: 'relationship', relationTo: 'hotels' },
                { name: 'meals', type: 'select', hasMany: true, options: ['breakfast', 'lunch', 'dinner'] },
                { name: 'driveTime', type: 'text', localized: true },
                {
                  name: 'mobilityLevel',
                  type: 'select',
                  options: [
                    { label: 'Fully step-free', value: 'step-free' },
                    { label: 'Some assistance needed', value: 'assisted' },
                    { label: 'Not suitable for wheelchair users', value: 'not-suitable' },
                  ],
                },
              ],
            },
            { name: 'itineraryPdf', type: 'upload', relationTo: 'media' },
          ],
        },
        {
          label: 'Inclusions',
          fields: [
            { name: 'included', type: 'array', fields: [{ name: 'text', type: 'text', required: true, localized: true }] },
            { name: 'excluded', type: 'array', fields: [{ name: 'text', type: 'text', required: true, localized: true }] },
          ],
        },
        {
          label: 'Pricing',
          fields: [
            {
              name: 'pricing',
              type: 'group',
              admin: { description: 'All prices are per person in US dollars, stored in cents (76000 = $760).' },
              fields: [
                {
                  name: 'matrix',
                  type: 'array',
                  fields: [
                    { name: 'season', type: 'relationship', relationTo: 'seasons', required: true },
                    {
                      type: 'row',
                      fields: [
                        { name: 'p2', type: 'number', required: true, min: 0, label: '2 travellers' },
                        { name: 'p4', type: 'number', required: true, min: 0, label: '4 travellers' },
                        { name: 'p6', type: 'number', required: true, min: 0, label: '6 travellers' },
                        { name: 'p8', type: 'number', required: true, min: 0, label: '8 travellers' },
                      ],
                    },
                  ],
                },
                { name: 'validUntil', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
              ],
            },
          ],
        },
        {
          label: 'Media',
          fields: [
            {
              name: 'gallery',
              type: 'array',
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media', required: true },
                { name: 'caption', type: 'text', localized: true },
              ],
            },
            {
              name: 'videos',
              type: 'array',
              admin: { description: 'Paste a YouTube link. The player only loads when a visitor presses play.' },
              fields: [
                { name: 'youtubeUrl', type: 'text', required: true },
                { name: 'title', type: 'text', required: true, localized: true },
                { name: 'description', type: 'textarea', localized: true },
                { name: 'uploadDate', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
              ],
            },
          ],
        },
        {
          label: 'More',
          fields: [
            { name: 'whyCheaper', type: 'textarea', localized: true, admin: { description: 'Budget tours: explain what is shared or simplified.' } },
            {
              name: 'accessibility',
              type: 'group',
              fields: [
                { name: 'summary', type: 'textarea', localized: true },
                { name: 'features', type: 'array', fields: [{ name: 'text', type: 'text', required: true, localized: true }] },
                { name: 'vehicle', type: 'relationship', relationTo: 'vehicles' },
              ],
            },
            {
              name: 'bestTime',
              type: 'array',
              fields: [
                { name: 'months', type: 'text', required: true, localized: true },
                { name: 'conditions', type: 'text', required: true, localized: true },
                { name: 'priceLevel', type: 'text', localized: true },
              ],
            },
            {
              name: 'faq',
              type: 'array',
              fields: [
                { name: 'question', type: 'text', required: true, localized: true },
                { name: 'answer', type: 'textarea', required: true, localized: true },
              ],
            },
            { name: 'relatedTours', type: 'relationship', relationTo: 'tours', hasMany: true },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'seo',
              type: 'group',
              fields: [
                { name: 'title', type: 'text', localized: true, admin: { description: 'About 60 characters. Leave empty to build one from the title and price.' } },
                { name: 'description', type: 'textarea', localized: true, admin: { description: 'About 150 to 160 characters.' } },
                { name: 'image', type: 'upload', relationTo: 'media' },
                { name: 'noindex', type: 'checkbox', defaultValue: false },
              ],
            },
          ],
        },
      ],
    },
  ],
}
