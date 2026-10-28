'use client'
import React, { useCallback, useState } from 'react'
import Link from 'next/link'
import { useI18n } from '@/i18n/client'
import { Money } from './CurrencyProvider'
import { InquiryForm, type InquiryFormProps } from './InquiryForm'
import { GUEST_TIERS, type GuestTier, type PriceRow, type SeasonLite } from '@/lib/pricing'
import { IconCalendar } from './Icons'

export type PanelDeparture = { id: string | number; start: string; end: string; status: string; priceCents: number; href: string }

const rangeText = (s: SeasonLite, locale: string) => {
  try {
    const f = new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' })
    return `${f.format(new Date(2024, s.startMonth - 1, s.startDay))} – ${f.format(new Date(2024, s.endMonth - 1, s.endDay))}`
  } catch {
    return ''
  }
}

export function BookingPanel({
  rows,
  seasons,
  departures,
  formProps,
  heading,
}: {
  rows: PriceRow[]
  seasons: SeasonLite[]
  departures: PanelDeparture[]
  formProps: InquiryFormProps
  heading?: string
}) {
  const { t, locale } = useI18n()
  const [sel, setSel] = useState<{ seasonId: string | number; guests: GuestTier } | null>(null)
  const onEstimate = useCallback((e: { seasonId: string | number; guests: GuestTier } | null) => setSel(e), [])
  const fmt = (iso: string) => {
    try {
      return new Intl.DateTimeFormat(locale, { timeZone: 'UTC', day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso))
    } catch {
      return iso.slice(0, 10)
    }
  }
  const pick = (iso: string) => {
    window.dispatchEvent(new CustomEvent('jt:pick-date', { detail: iso }))
    document.getElementById(formProps.formId || 'form')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <div className="jt-booking">
      <h2>{heading || t('booking.title')}</h2>
      {rows.length > 0 && (
        <>
          <div className="jt-tablewrap">
            <table className="jt-table">
              <caption className="jt-sr">{t('booking.priceTableCaption')}</caption>
              <thead>
                <tr>
                  <th scope="col">{t('booking.travellers')}</th>
                  {seasons.map((s) => (
                    <th scope="col" key={s.id}>
                      {s.name}
                      <small>{rangeText(s, locale)}</small>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {GUEST_TIERS.map((g) => (
                  <tr key={g}>
                    <th scope="row">{t('booking.travellersN', { n: g })}</th>
                    {seasons.map((s) => {
                      const row = rows.find((r) => String(r.seasonId) === String(s.id))
                      const selected = sel && String(sel.seasonId) === String(s.id) && sel.guests === g
                      return (
                        <td key={s.id} className={selected ? 'is-sel' : undefined}>
                          {row ? <Money cents={row[`p${g}` as 'p2' | 'p4' | 'p6' | 'p8']} /> : '–'}
                          {selected && <span className="jt-sr"> ({t('booking.yourPrice')})</span>}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="jt-note">{t('booking.perPersonNote')}</p>
        </>
      )}

      {departures.length > 0 && (
        <>
          <h3>{t('booking.nextDepartures')}</h3>
          <ul className="jt-deplist">
            {departures.map((d) => (
              <li key={d.id} className="jt-dep">
                <span className="jt-dep__date">
                  <IconCalendar size={16} /> <strong>{fmt(d.start)}</strong> – {fmt(d.end)}
                </span>
                <span className={`jt-status jt-status--${d.status}`}>{t(`status.${d.status}` as any)}</span>
                <span className="jt-dep__price"><Money cents={d.priceCents} /></span>
                <button type="button" className="jt-btn jt-btn--line jt-btn--sm" onClick={() => pick(d.start)}>
                  {t('booking.pickDate')}
                </button>
                <Link href={d.href} className="jt-link-sm">
                  {t('booking.details')}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      <InquiryForm {...formProps} onEstimate={onEstimate} />
    </div>
  )
}
