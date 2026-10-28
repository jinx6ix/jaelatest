/**
 * Pure pricing helpers. Used by the server pages, the booking form (in the browser) and the schema builders,
 * so every number on the site agrees. All money is integer US cents.
 */
export type GuestTier = 2 | 4 | 6 | 8
export const GUEST_TIERS: GuestTier[] = [2, 4, 6, 8]

export type SeasonLite = {
  id: string | number
  name: string
  startMonth: number
  startDay: number
  endMonth: number
  endDay: number
  sortOrder?: number | null
}

export type PriceRow = { seasonId: string | number; p2: number; p4: number; p6: number; p8: number }

export type OfferLite = {
  id: string | number
  discountType: 'percent' | 'fixed' | 'none'
  discountValue?: number | null
  validFrom?: string | null
  validUntil: string
  minGuests?: number | null
  travelFrom?: string | null
  travelUntil?: string | null
}

const md = (m: number, d: number) => m * 100 + d

/** Which season a date falls in. Handles seasons that run over the new year. */
export function seasonForDate(date: Date | string, seasons: SeasonLite[]): SeasonLite | null {
  const d = typeof date === 'string' ? new Date(date + (date.length === 10 ? 'T00:00:00' : '')) : date
  if (Number.isNaN(d.getTime())) return null
  const v = md(d.getMonth() + 1, d.getDate())
  for (const s of seasons) {
    const a = md(s.startMonth, s.startDay)
    const b = md(s.endMonth, s.endDay)
    const inside = a <= b ? v >= a && v <= b : v >= a || v <= b
    if (inside) return s
  }
  return null
}

/** Checks that every day of a leap year belongs to exactly one season. Returns a list of problems. */
export function checkSeasonCoverage(seasons: SeasonLite[]): string[] {
  const problems: string[] = []
  const counts = new Map<string, number>()
  for (let m = 1; m <= 12; m++) {
    const days = new Date(2024, m, 0).getDate()
    for (let day = 1; day <= days; day++) {
      const hits = seasons.filter((s) => {
        const a = md(s.startMonth, s.startDay)
        const b = md(s.endMonth, s.endDay)
        const v = md(m, day)
        return a <= b ? v >= a && v <= b : v >= a || v <= b
      }).length
      if (hits !== 1) counts.set(`${m}/${day}`, hits)
    }
  }
  if (counts.size) {
    const first = [...counts.entries()].slice(0, 5).map(([k, n]) => `${k} (${n === 0 ? 'no season' : n + ' seasons'})`)
    problems.push(`${counts.size} day(s) are not covered exactly once, for example ${first.join(', ')}`)
  }
  return problems
}

export const perPerson = (row: PriceRow | undefined, guests: GuestTier): number | null => {
  if (!row) return null
  return row[`p${guests}` as 'p2' | 'p4' | 'p6' | 'p8']
}

export const cheapestFrom = (rows: PriceRow[]): number | null => {
  const all = rows.flatMap((r) => [r.p2, r.p4, r.p6, r.p8]).filter((n) => typeof n === 'number' && n > 0)
  return all.length ? Math.min(...all) : null
}

export const highestPrice = (rows: PriceRow[]): number | null => {
  const all = rows.flatMap((r) => [r.p2, r.p4, r.p6, r.p8]).filter((n) => typeof n === 'number' && n > 0)
  return all.length ? Math.max(...all) : null
}

export function offerIsActive(offer: Pick<OfferLite, 'validFrom' | 'validUntil'>, now: Date = new Date()): boolean {
  const end = new Date(offer.validUntil)
  end.setHours(23, 59, 59, 999)
  if (now > end) return false
  if (offer.validFrom && now < new Date(offer.validFrom)) return false
  return true
}

export function applyDiscount(cents: number, offer?: Pick<OfferLite, 'discountType' | 'discountValue'> | null): number {
  if (!offer || offer.discountType === 'none' || !offer.discountValue) return cents
  if (offer.discountType === 'percent') return Math.max(0, Math.round(cents * (1 - offer.discountValue / 100)))
  return Math.max(0, cents - offer.discountValue)
}

export type Estimate =
  | { custom: true }
  | {
      custom?: false
      seasonId: string | number
      seasonName: string
      perPerson: number
      total: number
      was?: { perPerson: number; total: number }
    }

export function estimate(args: {
  rows: PriceRow[]
  seasons: SeasonLite[]
  date: string
  guests: GuestTier | 'more'
  offer?: OfferLite | null
}): Estimate | null {
  const { rows, seasons, date, guests, offer } = args
  if (guests === 'more') return { custom: true }
  const season = seasonForDate(date, seasons)
  if (!season) return null
  const row = rows.find((r) => String(r.seasonId) === String(season.id))
  const base = perPerson(row, guests)
  if (base == null) return null
  const eligible =
    offer &&
    offerIsActive(offer) &&
    (!offer.minGuests || guests >= offer.minGuests) &&
    (!offer.travelFrom || date >= offer.travelFrom.slice(0, 10)) &&
    (!offer.travelUntil || date <= offer.travelUntil.slice(0, 10))
  const now = eligible ? applyDiscount(base, offer) : base
  return {
    seasonId: season.id,
    seasonName: season.name,
    perPerson: now,
    total: now * guests,
    ...(eligible && now !== base ? { was: { perPerson: base, total: base * guests } } : {}),
  }
}

/** Fx: rates are "units of currency per 1 USD". */
export const convert = (usdCents: number, rate: number) => Math.round(usdCents * rate)

export function formatMoney(usdCents: number, currency = 'USD', rate = 1, locale = 'en'): string {
  const value = (usdCents * rate) / 100
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0, currencyDisplay: 'narrowSymbol' }).format(
      Math.round(value),
    )
  } catch {
    return `${currency} ${Math.round(value).toLocaleString('en')}`
  }
}

export const discountLabel = (offer: Pick<OfferLite, 'discountType' | 'discountValue'>, currency = 'USD', rate = 1, locale = 'en') => {
  if (!offer.discountValue || offer.discountType === 'none') return null
  return offer.discountType === 'percent' ? `${offer.discountValue}%` : formatMoney(offer.discountValue, currency, rate, locale)
}
