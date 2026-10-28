import React from 'react'
import Link from 'next/link'
import type { Destination, JointDeparture, Offer, Post, Tour, Vehicle } from '@/payload-types'
import { Img } from './Img'
import { Money } from './CurrencyProvider'
import { IconArrow, IconCalendar, IconClock, IconPin, IconTag, IconWheelchair } from './Icons'
import { cheapestFrom, applyDiscount, offerIsActive, discountLabel, type PriceRow } from '@/lib/pricing'
import { docPath, type RoutesMap } from '@/lib/routes'
import type { TFn } from '@/i18n'
import { asMedia } from '@/lib/media'

export const priceRowsOf = (tour: Tour): PriceRow[] =>
  (tour.pricing?.matrix || []).map((r) => ({
    seasonId: typeof r.season === 'object' ? (r.season as any).id : (r.season as any),
    p2: r.p2,
    p4: r.p4,
    p6: r.p6,
    p8: r.p8,
  }))

export const variantOf = (tour: Tour): string => (typeof tour.template === 'object' ? (tour.template as any)?.variant : 'standard') || 'standard'

const fmtDate = (iso: string, locale: string, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }) => {
  try {
    return new Intl.DateTimeFormat(locale, { timeZone: 'UTC', ...opts }).format(new Date(iso))
  } catch {
    return iso.slice(0, 10)
  }
}
export { fmtDate }

export function TourCard({ tour, routes, locale, t, priority }: { tour: Tour; routes: RoutesMap; locale: string; t: TFn; priority?: boolean }) {
  const from = cheapestFrom(priceRowsOf(tour))
  const variant = variantOf(tour)
  const dest = typeof tour.destination === 'object' ? (tour.destination as Destination).name : ''
  const href = `/${locale}${docPath(routes, 'tours', tour)}`
  return (
    <article className="jt-card">
      <Link href={href} className="jt-card__media" tabIndex={-1} aria-hidden="true">
        <Img media={tour.heroImage} alt="" sizes="(min-width:1100px) 25vw, (min-width:700px) 50vw, 100vw" priority={priority} />
        {variant !== 'standard' && variant !== 'specialty' && (
          <span className="jt-chip">
            {variant === 'accessible' && <IconWheelchair size={14} />}
            {t(`variant.${variant}` as any)}
          </span>
        )}
      </Link>
      <div className="jt-card__body">
        <p className="jt-card__meta">
          <span>
            <IconClock size={14} /> {t('card.days', { n: tour.durationDays })}
          </span>
          {dest && (
            <span>
              <IconPin size={14} /> {dest}
            </span>
          )}
        </p>
        <h3>
          <Link href={href}>{tour.title}</Link>
        </h3>
        <p className="jt-card__text">{tour.summary}</p>
        {from != null && (
          <p className="jt-card__price">
            <span>{t('card.from')}</span> <Money cents={from} className="jt-card__amount" /> <span>{t('card.perPerson')}</span>
          </p>
        )}
      </div>
    </article>
  )
}

export function OfferCard({ offer, routes, locale, t }: { offer: Offer; routes: RoutesMap; locale: string; t: TFn }) {
  const href = `/${locale}${docPath(routes, 'offers', offer)}`
  const label = offer.badgeText || (discountLabel(offer as any) ? t('offer.discountOff', { amount: discountLabel(offer as any) as string }) : t('offer.addedValue'))
  const daysLeft = Math.ceil((new Date(offer.validUntil).getTime() - Date.now()) / 86400000)
  return (
    <article className="jt-offer">
      <Link href={href} className="jt-offer__media" tabIndex={-1} aria-hidden="true">
        <Img media={offer.heroImage} alt="" sizes="(min-width:1100px) 33vw, 100vw" />
        <span className="jt-badge">
          <IconTag size={14} /> {label}
        </span>
      </Link>
      <div className="jt-offer__body">
        <h3>
          <Link href={href}>{offer.name}</Link>
        </h3>
        <p>{offer.summary}</p>
        <p className="jt-offer__valid">
          <IconCalendar size={14} /> {t('offer.validUntil', { date: fmtDate(offer.validUntil, locale) })}
          {daysLeft <= 14 && daysLeft >= 0 && <strong> · {t('offer.endsSoon')}</strong>}
        </p>
      </div>
    </article>
  )
}

export function DepartureRow({ dep, routes, locale, t }: { dep: JointDeparture; routes: RoutesMap; locale: string; t: TFn }) {
  const tour = typeof dep.tour === 'object' ? (dep.tour as Tour) : null
  const href = `/${locale}${docPath(routes, 'joint-departures', dep)}`
  return (
    <li className="jt-dep">
      <div className="jt-dep__main">
        <Link href={href}>
          <strong>{tour?.title}</strong>
        </Link>
        <small>{t('card.days', { n: tour?.durationDays ?? '' })}</small>
      </div>
      <div className="jt-dep__date">
        <IconCalendar size={16} />
        <span>
          {fmtDate(dep.startDate, locale)} – {fmtDate(dep.endDate, locale)}
        </span>
      </div>
      <div className="jt-dep__status">
        <span className={`jt-status jt-status--${dep.status}`}>{t(`status.${dep.status}` as any)}</span>
      </div>
      <div className="jt-dep__price">
        <span>{t('card.from')}</span> <Money cents={dep.pricePerSeat} />
      </div>
      <Link href={href} className="jt-btn jt-btn--dark jt-btn--sm">
        {t('departure.book')}
      </Link>
    </li>
  )
}

export function DestinationCard({ dest, locale, routes, t }: { dest: Destination; locale: string; routes: RoutesMap; t: TFn }) {
  const href = `/${locale}/${routes.tours.prefix}?destination=${dest.slug}`
  return (
    <Link href={href} className="jt-dest">
      <Img media={dest.image} alt="" sizes="(min-width:1100px) 25vw, 50vw" />
      <span className="jt-dest__label">
        <strong>{dest.name}</strong>
        <small>
          {t('destination.explore')} <IconArrow size={14} />
        </small>
      </span>
    </Link>
  )
}

export function PostCard({ post, routes, locale }: { post: Post; routes: RoutesMap; locale: string }) {
  const href = `/${locale}${docPath(routes, 'posts', post)}`
  return (
    <article className="jt-card jt-card--post">
      <Link href={href} className="jt-card__media" tabIndex={-1} aria-hidden="true">
        <Img media={post.heroImage} alt="" sizes="(min-width:1100px) 33vw, 100vw" />
      </Link>
      <div className="jt-card__body">
        {post.publishedAt && <p className="jt-card__meta">{fmtDate(post.publishedAt, locale)}</p>}
        <h3>
          <Link href={href}>{post.title}</Link>
        </h3>
        {(post.meta as any)?.description && <p className="jt-card__text">{(post.meta as any).description}</p>}
      </div>
    </article>
  )
}

export function VehicleCard({ v, routes, locale, t }: { v: Vehicle; routes: RoutesMap; locale: string; t: TFn }) {
  const href = `/${locale}${docPath(routes, 'vehicles', v)}`
  return (
    <article className="jt-card">
      <Link href={href} className="jt-card__media" tabIndex={-1} aria-hidden="true">
        <Img media={v.heroImage} alt="" sizes="(min-width:1100px) 33vw, 100vw" />
        {v.accessible && (
          <span className="jt-chip">
            <IconWheelchair size={14} /> {t('variant.accessible')}
          </span>
        )}
      </Link>
      <div className="jt-card__body">
        <p className="jt-card__meta">{t('vehicle.seats', { n: v.seats })}</p>
        <h3>
          <Link href={href}>{v.name}</Link>
        </h3>
        {v.summary && <p className="jt-card__text">{v.summary}</p>}
      </div>
    </article>
  )
}

export { applyDiscount, offerIsActive, asMedia }
