import type { Payload } from 'payload'

export const slugify = (s: string) => s.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')

const textNode = (text: string) => ({ type: 'text', text, detail: 0, format: 0, mode: 'normal', style: '', version: 1 })
const para = (text: string) => ({ type: 'paragraph', children: [textNode(text)], direction: 'ltr', format: '', indent: 0, textFormat: 0, version: 1 })
const heading = (text: string, tag = 'h2') => ({ type: 'heading', tag, children: [textNode(text)], direction: 'ltr', format: '', indent: 0, version: 1 })

/** Builds Lexical rich text from plain strings. A string starting with "## " becomes a heading. */
export const lexical = (items: string[]) => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: items.map((i) => (i.startsWith('## ') ? heading(i.slice(3)) : para(i))),
  },
})

export const ctx = { disableRevalidate: true }

/** Create the document, or update it when one with the same key already exists. */
export async function upsert(payload: Payload, collection: string, where: Record<string, any>, data: Record<string, any>) {
  const found = await payload.find({ collection: collection as any, where, limit: 1, depth: 0, overrideAccess: true, locale: 'en', draft: false })
  if (found.docs[0]) {
    return payload.update({ collection: collection as any, id: found.docs[0].id, data, overrideAccess: true, context: ctx, locale: 'en' } as any) as Promise<any>
  }
  return payload.create({ collection: collection as any, data, overrideAccess: true, context: ctx, locale: 'en' } as any) as Promise<any>
}

export const addDays = (days: number, from = new Date()) => {
  const d = new Date(from)
  d.setUTCHours(0, 0, 0, 0)
  d.setUTCDate(d.getUTCDate() + days)
  return d
}
export const iso = (d: Date) => d.toISOString()
