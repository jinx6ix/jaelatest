import React from 'react'
import type { Theme } from '@/payload-types'

const px = (n: number | string | null | undefined, d: number) => {
  if (typeof n === 'number') return `${n}px`
  if (typeof n === 'string') {
    const trimmed = n.trim()
    if (!trimmed) return `${d}px`
    const parsed = parseFloat(trimmed)
    return isNaN(parsed) ? `${d}px` : trimmed.endsWith('px') ? trimmed : `${parsed}px`
  }
  return `${d}px`
}

/** Turns the Theme global into CSS variables. Rendered once in the page head. */
export function ThemeStyle({ theme }: { theme: Theme }) {
  const t: any = theme || {}
  const light = `:root{--jt-brand:${t.brand || '#FF7302'};--jt-on-brand:${t.onBrand || '#201E1F'};--jt-accent:${t.accentText || '#B34A00'};--jt-sun:${t.sun || '#FFDD00'};--jt-ink:${t.ink || '#201E1F'};--jt-ground:${t.ground || '#FFFFFF'};--jt-surface:${t.surface || '#FFFFFF'};--jt-tint:${t.tint || '#FFF2C2'};--jt-line:${t.line || '#E6D9CB'};--jt-muted:${t.muted || '#56585B'};--jt-soft:${t.soft || '#BDB7AE'};--jt-night:${t.night || '#201E1F'};--jt-on-night:${t.onNight || '#F7F2EA'};--jt-ok:${t.success || '#2E7D4F'};--jt-no:${t.danger || '#B3261E'};--jt-wa:${t.whatsapp || '#25D366'};--jt-r-card:${px(t.radiusCard, 16)};--jt-r-panel:${px(t.radiusPanel, 22)};--jt-pop:${px(t.popShadow, 6)}}`
  return <style id="jt-theme" dangerouslySetInnerHTML={{ __html: light }} />
}
