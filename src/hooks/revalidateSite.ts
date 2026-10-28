import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

const safe = (fn: () => void) => {
  try {
    fn()
  } catch {
    // Not running inside a Next.js request (for example the seed script): nothing to revalidate.
  }
}

export const revalidateCollection: CollectionAfterChangeHook = ({ doc, req: { context } }) => {
  if (!context?.disableRevalidate) safe(() => revalidatePath('/', 'layout'))
  return doc
}

export const revalidateCollectionDelete: CollectionAfterDeleteHook = ({ doc, req: { context } }) => {
  if (!context?.disableRevalidate) safe(() => revalidatePath('/', 'layout'))
  return doc
}

export const revalidateGlobalTag =
  (slug: string): GlobalAfterChangeHook =>
  ({ doc, req: { context } }) => {
    if (!context?.disableRevalidate) {
      safe(() => {
        revalidateTag(`global_${slug}`, 'max')
        revalidatePath('/', 'layout')
      })
    }
    return doc
  }
