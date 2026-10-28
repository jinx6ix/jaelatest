import React from 'react'
import { asMedia, mediaSrcSet } from '@/lib/media'

type Props = {
  media: unknown
  alt?: string
  sizes?: string
  priority?: boolean
  className?: string
  ratio?: string
  style?: React.CSSProperties
}

/**
 * Responsive image built from the sizes Payload generated. Width and height are always set so there is no layout shift.
 * `priority` marks the image that is the largest paint on the page (eager, high priority).
 */
export function Img({ media, alt, sizes = '100vw', priority, className, style }: Props) {
  const m = asMedia(media)
  if (!m?.url) return null
  const large: any = (m.sizes as any)?.large || (m.sizes as any)?.medium
  const src = large?.url || m.url
  const w = large?.width || m.width || undefined
  const h = large?.height || m.height || undefined
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      srcSet={mediaSrcSet(m)}
      sizes={sizes}
      width={w || undefined}
      height={h || undefined}
      alt={alt ?? (typeof m.alt === 'string' ? m.alt : '') ?? ''}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      {...(priority ? { fetchPriority: 'high' as const } : {})}
      className={className}
      style={style}
    />
  )
}
