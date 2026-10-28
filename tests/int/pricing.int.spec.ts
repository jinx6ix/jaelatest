import { describe, expect, it } from 'vitest'
import { applyDiscount, checkSeasonCoverage, cheapestFrom, estimate, offerIsActive, seasonForDate } from '@/lib/pricing'
import { parseYouTubeId } from '@/lib/youtube'
import { resolveLink, tourRouteKey, ROUTE_DEFAULTS } from '@/lib/routes'

const seasons = [
  { id: 1, name: 'Low', startMonth: 3, startDay: 1, endMonth: 6, endDay: 30 },
  { id: 2, name: 'High', startMonth: 11, startDay: 1, endMonth: 2, endDay: 29 },
  { id: 3, name: 'Peak', startMonth: 7, startDay: 1, endMonth: 10, endDay: 31 },
]
const rows = [
  { seasonId: 1, p2: 76000, p4: 66000, p6: 60000, p8: 56000 },
  { seasonId: 2, p2: 86000, p4: 74000, p6: 67000, p8: 63000 },
  { seasonId: 3, p2: 98000, p4: 85000, p6: 78000, p8: 73000 },
]

describe('seasonForDate', () => {
  it('handles a season that runs over the new year', () => {
    expect(seasonForDate('2026-12-31', seasons)?.name).toBe('High')
    expect(seasonForDate('2027-01-01', seasons)?.name).toBe('High')
    expect(seasonForDate('2028-02-29', seasons)?.name).toBe('High')
  })
  it('respects the boundaries', () => {
    expect(seasonForDate('2027-03-01', seasons)?.name).toBe('Low')
    expect(seasonForDate('2027-06-30', seasons)?.name).toBe('Low')
    expect(seasonForDate('2027-07-01', seasons)?.name).toBe('Peak')
    expect(seasonForDate('2027-10-31', seasons)?.name).toBe('Peak')
    expect(seasonForDate('2026-11-01', seasons)?.name).toBe('High')
  })
  it('finds gaps and overlaps', () => {
    expect(checkSeasonCoverage(seasons)).toEqual([])
    expect(checkSeasonCoverage(seasons.slice(0, 2)).length).toBeGreaterThan(0)
    expect(checkSeasonCoverage([...seasons, { id: 4, name: 'Extra', startMonth: 5, startDay: 1, endMonth: 5, endDay: 10 }]).length).toBeGreaterThan(0)
  })
})

describe('estimate', () => {
  it('prices by season and group size', () => {
    const e: any = estimate({ rows, seasons, date: '2027-08-10', guests: 4 })
    expect(e.perPerson).toBe(85000)
    expect(e.total).toBe(340000)
    expect(e.seasonName).toBe('Peak')
  })
  it('applies an active offer and keeps the original price as "was"', () => {
    const e: any = estimate({ rows, seasons, date: '2027-04-10', guests: 2, offer: { id: 1, discountType: 'percent', discountValue: 10, validUntil: '2099-01-01' } })
    expect(e.perPerson).toBe(68400)
    expect(e.was.perPerson).toBe(76000)
  })
  it('ignores expired offers and offers below the minimum group size', () => {
    const expired: any = estimate({ rows, seasons, date: '2027-04-10', guests: 2, offer: { id: 1, discountType: 'percent', discountValue: 10, validUntil: '2020-01-01' } })
    expect(expired.was).toBeUndefined()
    const small: any = estimate({ rows, seasons, date: '2027-04-10', guests: 2, offer: { id: 1, discountType: 'percent', discountValue: 5, validUntil: '2099-01-01', minGuests: 6 } })
    expect(small.was).toBeUndefined()
  })
  it('returns a custom quote for more than 8 travellers', () => {
    expect((estimate({ rows, seasons, date: '2027-04-10', guests: 'more' }) as any).custom).toBe(true)
  })
  it('finds the lowest price and applies fixed discounts', () => {
    expect(cheapestFrom(rows)).toBe(56000)
    expect(applyDiscount(76000, { discountType: 'fixed', discountValue: 5000 })).toBe(71000)
    expect(offerIsActive({ validUntil: '2020-01-01' })).toBe(false)
  })
})

describe('youtube and routes', () => {
  it('reads every common YouTube link shape', () => {
    for (const u of ['https://youtu.be/dQw4w9WgXcQ', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=5', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://www.youtube.com/shorts/dQw4w9WgXcQ', 'dQw4w9WgXcQ']) {
      expect(parseYouTubeId(u)).toBe('dQw4w9WgXcQ')
    }
    expect(parseYouTubeId('https://example.com')).toBeNull()
  })
  it('sends each tour type to its own URL prefix', () => {
    expect(tourRouteKey('accessible')).toBe('disabilityTours')
    expect(tourRouteKey('budget')).toBe('budgetTours')
    expect(tourRouteKey('migration')).toBe('migrationTours')
    expect(tourRouteKey('standard')).toBe('tours')
  })
  it('resolves links with the locale', () => {
    expect(resolveLink({ routeKey: 'budgetTours' }, 'en', ROUTE_DEFAULTS as any)).toBe('/en/budget-tours')
    expect(resolveLink({ routeKey: 'custom', url: '/about' }, 'de', ROUTE_DEFAULTS as any)).toBe('/de/about')
    expect(resolveLink({ routeKey: 'home' }, 'fr', ROUTE_DEFAULTS as any)).toBe('/fr')
  })
})
