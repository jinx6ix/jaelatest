'use client'
import React from 'react'
import Link from 'next/link'
import { useI18n } from '@/i18n/client'
import { Money } from './CurrencyProvider'
import { openTab } from './Tabs'
import { IconCheck } from './Icons'

type Props = { fromCents: number | null; wasCents?: number | null; lines: string[]; askHref: string; ctaKey?: 'booking.cta' | 'offer.cta'; note?: string }

export function SideCard({ fromCents, wasCents, lines, askHref, ctaKey = 'booking.cta', note }: Props) {
  const { t } = useI18n()
  return (
    <aside className="jt-side" aria-label={t('side.label')}>
      {fromCents != null && (
        <div className="jt-side__price">
          <small>{t('card.from')}</small>
          <p>
            {wasCents != null && wasCents > fromCents && (
              <s className="jt-was">
                <Money cents={wasCents} />
              </s>
            )}{' '}
            <Money cents={fromCents} className="jt-side__amount" /> <span>{t('card.perPerson')}</span>
          </p>
        </div>
      )}
      {note && <p className="jt-side__note">{note}</p>}
      <button type="button" className="jt-btn jt-btn--brand jt-btn--block" onClick={() => openTab('booking')}>
        {t(ctaKey)}
      </button>
      <Link href={askHref} className="jt-btn jt-btn--line jt-btn--block">
        {t('side.ask')}
      </Link>
      {lines.length > 0 && (
        <ul>
          {lines.map((l, i) => (
            <li key={i}>
              <IconCheck size={15} /> {l}
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}

export function MobileBar({ fromCents, ctaKey = 'booking.cta' }: { fromCents: number | null; ctaKey?: 'booking.cta' | 'offer.cta' }) {
  const { t } = useI18n()
  return (
    <div className="jt-mbar">
      <div>
        {fromCents != null && (
          <>
            <small>{t('card.from')}</small>
            <strong>
              <Money cents={fromCents} />
            </strong>
          </>
        )}
      </div>
      <button type="button" className="jt-btn jt-btn--brand" onClick={() => openTab('booking')}>
        {t(ctaKey)}
      </button>
    </div>
  )
}
