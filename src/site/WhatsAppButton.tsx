import React from 'react'
import { IconWhatsApp } from './Icons'
import type { SiteContext } from '@/lib/site'
import { makeT } from '@/i18n'

export function WhatsAppButton({ ctx }: { ctx: SiteContext }) {
  const number = String(ctx.site?.whatsappNumber || '').replace(/\D/g, '')
  if (!number) return null
  const t = makeT(ctx.dict)
  const text = (ctx.site as any)?.whatsappMessage ? `?text=${encodeURIComponent((ctx.site as any).whatsappMessage)}` : ''
  return (
    <a className="jt-wa" href={`https://wa.me/${number}${text}`} target="_blank" rel="noopener" aria-label={t('whatsapp.cta')}>
      <IconWhatsApp size={22} />
      <span>{t('whatsapp.cta')}</span>
    </a>
  )
}
