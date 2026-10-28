import type { Block } from 'payload'

export const VideoBlock: Block = {
  slug: 'videoBlock',
  interfaceName: 'VideoBlock',
  fields: [
    {
      name: 'videoUrl',
      type: 'text',
      required: true,
      label: 'Video URL',
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Caption',
    },
  ],
}
