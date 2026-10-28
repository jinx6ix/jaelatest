import type { Block } from 'payload'

export const AuthorBoxBlock: Block = {
  slug: 'authorBox',
  interfaceName: 'AuthorBox',
  fields: [
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'bio',
      type: 'text',
      localized: true,
    },
  ],
}
