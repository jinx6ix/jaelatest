import type { Media } from '@/payload-types'

export const asMedia = (m: unknown): Media | null => (m && typeof m === 'object' && 'url' in (m as any) ? (m as Media) : null)

type SizeName = 'thumbnail' | 'square' | 'small' | 'medium' | 'large' | 'xlarge' | 'og'

export const mediaUrl = (m: unknown, size?: SizeName): string | null => {
  const media = asMedia(m)
  if (!media) return null
  const s = size ? (media.sizes as any)?.[size]?.url : null
  return s || media.url || null
}

/** `srcSet` built from the image sizes Payload generated at upload time. */
export const mediaSrcSet = (m: unknown): string | undefined => {
  const media = asMedia(m)
  if (!media?.sizes) return undefined
  const parts: string[] = []
  for (const n of ['small', 'medium', 'large', 'xlarge'] as const) {
    const s: any = (media.sizes as any)[n]
    if (s?.url && s?.width) parts.push(`${s.url} ${s.width}w`)
  }
  return parts.length ? parts.join(', ') : undefined
}

export const absoluteUrl = (origin: string, url?: string | null) => (!url ? '' : /^https?:/.test(url) ? url : `${origin}${url}`)
