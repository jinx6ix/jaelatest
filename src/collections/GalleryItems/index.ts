import type { CollectionConfig } from 'payload'
import { publishedOrAuth } from '@/access/publishedOrAuth'
import { authenticated } from '@/access/authenticated'
import { revalidateCollection, revalidateCollectionDelete } from '@/hooks/revalidateSite'

export const GalleryItems: CollectionConfig = {
  slug: 'gallery-items',
  labels: { singular: 'Gallery item', plural: 'Gallery items' },
  access: { read: publishedOrAuth, create: authenticated, update: authenticated, delete: authenticated },
  admin: { useAsTitle: 'title', group: 'Content', defaultColumns: ['title', 'type', 'destination', 'published'] },
  hooks: { afterChange: [revalidateCollection], afterDelete: [revalidateCollectionDelete] },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    {
      type: 'row',
      fields: [
        { name: 'type', type: 'select', required: true, defaultValue: 'photo', options: [{ label: 'Photo', value: 'photo' }, { label: 'Video (YouTube)', value: 'video' }], admin: { width: '34%' } },
        { name: 'published', type: 'checkbox', defaultValue: true, admin: { width: '33%' } },
        { name: 'sample', type: 'checkbox', defaultValue: false, admin: { width: '33%' } },
      ],
    },
    { name: 'image', type: 'upload', relationTo: 'media', required: true, admin: { description: 'The photo, or the poster image for a video.' } },
    {
      name: 'youtubeUrl',
      type: 'text',
      admin: { description: 'Paste the YouTube link.', condition: (_, s) => s?.type === 'video' },
      validate: (value: unknown, { siblingData }: { siblingData: any }) =>
        siblingData?.type === 'video' && !value ? 'A YouTube link is required for videos.' : true,
    },
    { name: 'caption', type: 'textarea', localized: true },
    { name: 'destination', type: 'relationship', relationTo: 'destinations' },
    { name: 'sort', type: 'number', defaultValue: 0 },
  ],
}
