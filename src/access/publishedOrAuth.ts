import type { Access } from 'payload'

/** Public readers only see documents with `published = true`. Logged-in users see everything. */
export const publishedOrAuth: Access = ({ req: { user } }) => {
  if (user) return true
  return { published: { equals: true } }
}
