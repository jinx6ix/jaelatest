'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { parsePhoneNumberFromString } from 'libphonenumber-js/min'
import type { CountryCode } from 'libphonenumber-js/min'
import { useI18n } from '@/i18n/client'
import { useCurrency, Money } from './CurrencyProvider'
import { estimate, type GuestTier, type OfferLite, type PriceRow, type SeasonLite } from '@/lib/pricing'
import type { CountryOption } from '@/lib/countries'
import { IconCheck } from './Icons'

export type TourPricing = { id: string | number; title: string; rows: PriceRow[] }
export type InquiryType = 'tour' | 'offer' | 'vehicle' | 'departure' | 'general'

export type InquiryFormProps = {
  type: InquiryType
  countries: CountryOption[]
  refs?: { tourId?: string | number; offerId?: string | number; vehicleId?: string | number; departureId?: string | number }
  seasons?: SeasonLite[]
  tours?: TourPricing[]
  offer?: OfferLite | null
  minLeadDays?: number
  hasPdf?: boolean
  askTravellers?: boolean
  askDate?: boolean
  messageLabelKey?: 'booking.needs' | 'contact.message'
  submitKey?: 'booking.submit' | 'contact.send'
  fixedGuests?: GuestTier | 'more'
  guestOptions?: string[]
  allowMore?: boolean
  formId?: string
  onEstimate?: (e: { seasonId: string | number; guests: GuestTier } | null) => void
}

const todayPlus = (days: number) => {
  const d = new Date()
  d.setDate(d.getDate() + days)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

type Errors = Partial<Record<'name' | 'email' | 'country' | 'phone' | 'date' | 'consent' | 'tour' | 'form', string>>

export function InquiryForm(p: InquiryFormProps) {
  const { t, locale } = useI18n()
  const { code, rate } = useCurrency()
  const formRef = useRef<HTMLFormElement>(null)
  const askTravellers = p.askTravellers ?? ['tour', 'offer', 'departure', 'vehicle'].includes(p.type)
  const askDate = p.askDate ?? ['tour', 'offer', 'vehicle'].includes(p.type)
  const priced = (p.tours?.length ?? 0) > 0 && !!p.seasons?.length && (p.type === 'tour' || p.type === 'offer')

  const [tourId, setTourId] = useState<string>(String(p.refs?.tourId ?? p.tours?.[0]?.id ?? ''))
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [iso, setIso] = useState('')
  const [phone, setPhone] = useState('')
  const [guests, setGuests] = useState<string>(String(p.fixedGuests ?? p.guestOptions?.[0] ?? '2'))
  const [date, setDate] = useState('')
  const [message, setMessage] = useState('')
  const [wantsPdf, setWantsPdf] = useState(false)
  const [consent, setConsent] = useState(false)
  const [website, setWebsite] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [sentSummary, setSentSummary] = useState('')

  const country = p.countries.find((c) => c.iso === iso)
  const [min, setMin] = useState('')
  useEffect(() => setMin(todayPlus(p.minLeadDays ?? 0)), [p.minLeadDays])

  useEffect(() => {
    const onPick = (e: Event) => setDate((e as CustomEvent<string>).detail.slice(0, 10))
    window.addEventListener('jt:pick-date', onPick)
    return () => window.removeEventListener('jt:pick-date', onPick)
  }, [])

  const activeTour = p.tours?.find((x) => String(x.id) === tourId)
  const est = useMemo(() => {
    if (!priced || !date || !activeTour || !p.seasons) return null
    return estimate({ rows: activeTour.rows, seasons: p.seasons, date, guests: guests === 'more' ? 'more' : (Number(guests) as GuestTier), offer: p.offer })
  }, [priced, date, activeTour, guests, p.seasons, p.offer])

  const { onEstimate } = p
  useEffect(() => {
    if (!onEstimate) return
    onEstimate(est && !est.custom ? { seasonId: est.seasonId, guests: Number(guests) as GuestTier } : null)
  }, [est, guests, onEstimate])

  const validate = (): Errors => {
    const e: Errors = {}
    if (!name.trim()) e.name = t('booking.errorRequired')
    if (!/^\S+@\S+\.\S+$/.test(email)) e.email = t('booking.errorEmail')
    if (!iso) e.country = t('booking.errorRequired')
    else {
      const parsed = parsePhoneNumberFromString(phone, iso as CountryCode)
      if (!parsed?.isValid()) e.phone = t('booking.errorPhone')
    }
    if (askDate && !date) e.date = t('booking.errorDate')
    else if (askDate && date < todayPlus(p.minLeadDays ?? 0)) e.date = t('booking.errorDate')
    if (priced && !activeTour) e.tour = t('booking.errorRequired')
    if (!consent) e.consent = t('booking.errorConsent')
    return e
  }

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) {
      const first = Object.keys(e)[0]
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }
    const parsed = parsePhoneNumberFromString(phone, iso as CountryCode)!
    setState('sending')
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: p.type,
          tourId: tourId || undefined,
          offerId: p.refs?.offerId,
          vehicleId: p.refs?.vehicleId,
          departureId: p.refs?.departureId,
          name,
          email,
          phone: parsed.number,
          countryIso: iso,
          guests: askTravellers ? guests : undefined,
          date: askDate ? date : undefined,
          season: est && !est.custom ? est.seasonName : undefined,
          currency: code,
          estimateUsdCents: est && !est.custom ? est.total : undefined,
          message,
          wantsPdf,
          consent,
          website,
          locale,
          sourcePath: window.location.pathname,
        }),
      })
      if (!res.ok) throw new Error('failed')
      const bits = [askTravellers && guests !== 'more' ? t('booking.travellersN', { n: guests }) : null, askDate && date ? date : null, est && !est.custom ? est.seasonName : null].filter(Boolean)
      setSentSummary(bits.join(' · '))
      setState('sent')
    } catch {
      setErrors({ form: t('booking.errorSend') })
      setState('idle')
    }
  }

  if (state === 'sent') {
    return (
      <div className="jt-sent" role="status">
        <span className="jt-sent__icon">
          <IconCheck size={22} />
        </span>
        <h3>{t('booking.sentTitle')}</h3>
        <p>
          {sentSummary && <strong>{sentSummary}</strong>}
          {sentSummary && <br />}
          {t('booking.sentText', { phone: `${country?.dial ?? ''} ${phone.replace(/^0+/, '')}`.trim() })}
        </p>
      </div>
    )
  }

  const fid = p.formId || 'form'
  const err = (k: keyof Errors) => (errors[k] ? <p className="jt-field__err" id={`${fid}-${k}-err`}>{errors[k]}</p> : null)
  const aria = (k: keyof Errors) => ({ 'aria-invalid': !!errors[k], 'aria-describedby': errors[k] ? `${fid}-${k}-err` : undefined })

  return (
    <form className="jt-form" ref={formRef} onSubmit={submit} noValidate id={fid}>
      {p.type === 'offer' && (p.tours?.length ?? 0) > 1 && (
        <div className="jt-field jt-field--full">
          <label htmlFor={`${fid}-tour`}>{t('offer.chooseTour')}</label>
          <select id={`${fid}-tour`} name="tour" value={tourId} onChange={(e) => setTourId(e.target.value)} {...aria('tour')}>
            {p.tours!.map((x) => (
              <option key={x.id} value={String(x.id)}>
                {x.title}
              </option>
            ))}
          </select>
          {err('tour')}
        </div>
      )}
      <div className="jt-field">
        <label htmlFor={`${fid}-name`}>{t('booking.name')}</label>
        <input id={`${fid}-name`} name="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required {...aria('name')} />
        {err('name')}
      </div>
      <div className="jt-field">
        <label htmlFor={`${fid}-email`}>{t('booking.email')}</label>
        <input id={`${fid}-email`} name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required {...aria('email')} />
        {err('email')}
      </div>
      <div className="jt-field">
        <label htmlFor={`${fid}-country`}>{t('booking.country')}</label>
        <select id={`${fid}-country`} name="country" value={iso} onChange={(e) => setIso(e.target.value)} autoComplete="country" required {...aria('country')}>
          <option value="">{t('booking.countryPlaceholder')}</option>
          {p.countries.map((c) => (
            <option key={c.iso} value={c.iso}>
              {c.name} ({c.dial})
            </option>
          ))}
        </select>
        {err('country')}
      </div>
      <div className="jt-field">
        <label htmlFor={`${fid}-phone`}>{t('booking.phone')}</label>
        <div className="jt-phone">
          <span className="jt-phone__code" aria-live="polite">
            {country?.dial ?? '+'}
          </span>
          <input
            id={`${fid}-phone`}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={!iso}
            placeholder={iso ? t('booking.phonePlaceholder') : t('booking.phoneFirst')}
            {...aria('phone')}
          />
        </div>
        {err('phone')}
      </div>
      {askTravellers && (
        <div className="jt-field">
          <label htmlFor={`${fid}-guests`}>{t('booking.travellers')}</label>
          <select id={`${fid}-guests`} name="guests" value={guests} onChange={(e) => setGuests(e.target.value)}>
            {(p.guestOptions || ['2', '4', '6', '8']).map((g) => (
              <option key={g} value={g}>
                {t('booking.travellersN', { n: g })}
              </option>
            ))}
            {(p.allowMore ?? true) && <option value="more">{t('booking.moreThan8')}</option>}
          </select>
        </div>
      )}
      {askDate && (
        <div className="jt-field">
          <label htmlFor={`${fid}-date`}>{t('booking.date')}</label>
          <input id={`${fid}-date`} name="date" type="date" min={min} value={date} onChange={(e) => setDate(e.target.value)} required {...aria('date')} />
          {err('date')}
        </div>
      )}
      {priced && (
        <div className="jt-quote jt-field--full" aria-live="polite">
          {!date && <p>{t('booking.datePrompt')}</p>}
          {date && est?.custom && <p>{t('booking.customQuote')}</p>}
          {date && est && !est.custom && (
            <>
              <p className="jt-quote__season">
                {t('booking.season')}: <strong>{est.seasonName}</strong>
              </p>
              <p className="jt-quote__line">
                {est.was && (
                  <s className="jt-was">
                    <Money cents={est.was.perPerson} />
                  </s>
                )}{' '}
                <Money cents={est.perPerson} className="jt-quote__big" /> <span>{t('booking.perPerson')}</span> × {guests} = <strong><Money cents={est.total} /></strong> <span>{t('booking.total')}</span>
              </p>
              <p className="jt-quote__note">{t('booking.estimateNote')}</p>
            </>
          )}
          {date && !est && <p>{t('booking.noSeason')}</p>}
        </div>
      )}
      <div className="jt-field jt-field--full">
        <label htmlFor={`${fid}-message`}>{t(p.messageLabelKey || 'booking.needs')}</label>
        <textarea id={`${fid}-message`} name="message" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>
      {p.hasPdf && (
        <label className="jt-check jt-field--full">
          <input type="checkbox" checked={wantsPdf} onChange={(e) => setWantsPdf(e.target.checked)} /> {t('booking.pdfCheckbox')}
        </label>
      )}
      <div className="jt-field jt-field--full">
        <label className="jt-check">
          <input type="checkbox" name="consent" checked={consent} onChange={(e) => setConsent(e.target.checked)} {...aria('consent')} /> {t('booking.consent')}
        </label>
        {err('consent')}
      </div>
      <input type="text" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" className="jt-hp" aria-hidden="true" />
      {errors.form && (
        <p className="jt-field__err jt-field--full" role="alert">
          {errors.form}
        </p>
      )}
      <div className="jt-field--full">
        <button type="submit" className="jt-btn jt-btn--brand" disabled={state === 'sending'}>
          {state === 'sending' ? t('booking.sending') : t(p.submitKey || 'booking.submit')}
        </button>
      </div>
    </form>
  )
}
