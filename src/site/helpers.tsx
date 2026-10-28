import React from 'react'
import { asMedia, mediaSrcSet, mediaUrl } from '@/lib/media'
import type { GalleryImage } from './Gallery'
import type { TFn } from '@/i18n'
import { IconCheck } from './Icons'

export const imgData = (media: unknown, fallbackAlt = ''): GalleryImage | null => {
  const m = asMedia(media)
  if (!m?.url) return null
  const large: any = (m.sizes as any)?.large || (m.sizes as any)?.medium
  return {
    src: large?.url || m.url,
    srcSet: mediaSrcSet(m),
    full: mediaUrl(m, 'xlarge') || m.url,
    width: large?.width || m.width || undefined,
    height: large?.height || m.height || undefined,
    alt: (typeof m.alt === 'string' && m.alt) || fallbackAlt,
  }
}

export function TrustStrip({ items }: { items: string[] }) {
  if (!items.length) return null
  return (
    <ul className="jt-trust">
      {items.map((x, i) => (
        <li key={i}>
          <IconCheck size={15} /> {x}
        </li>
      ))}
    </ul>
  )
}

export function SectionHead({ title, subtitle, action }: { title: string; subtitle?: string | null; action?: React.ReactNode }) {
  return (
    <div className="jt-sechead">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export const paragraphs = (text?: string | null) => (text ? text.split(/\n{1,}/).filter(Boolean) : [])

export const longDate = (iso: string, locale: string) => {
  try {
    return new Intl.DateTimeFormat(locale, { timeZone: 'UTC', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso))
  } catch {
    return iso.slice(0, 10)
  }
}

export const trustLines = (site: any, t: TFn): string[] => {
  const lines: string[] = []
  if (site?.cancellationSummary) lines.push(site.cancellationSummary)
  if (site?.depositSummary) lines.push(site.depositSummary)
  const pay = (site?.paymentMethods || []).map((x: any) => x.text).filter(Boolean)
  if (pay.length) lines.push(t('side.pay', { methods: pay.join(', ') }))
  if (site?.replyTime) lines.push(site.replyTime)
  return lines
}
