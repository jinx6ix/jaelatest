import { NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { z } from 'zod'
import { parsePhoneNumberFromString } from 'libphonenumber-js/min'
import type { CountryCode } from 'libphonenumber-js/min'
import { notifyInquiry } from '@/lib/notify'

export const dynamic = 'force-dynamic'

const id = z.union([z.string(), z.number()]).optional()
const schema = z.object({
  type: z.enum(['tour', 'offer', 'vehicle', 'departure', 'general']),
  tourId: id,
  offerId: id,
  vehicleId: id,
  departureId: id,
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(6).max(24),
  countryIso: z.string().length(2),
  guests: z.string().max(10).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  season: z.string().max(80).optional(),
  currency: z.string().max(6).optional(),
  estimateUsdCents: z.number().int().nonnegative().optional(),
  message: z.string().max(4000).optional(),
  wantsPdf: z.boolean().optional(),
  consent: z.literal(true),
  website: z.string().max(200).optional(),
  locale: z.string().max(5).optional(),
  sourcePath: z.string().max(300).optional(),
})

// Simple in-memory limiter: 6 requests per IP per 10 minutes. Replace with a shared store (Redis or the database) when running several servers.
const hits = new Map<string, number[]>()
const limited = (ip: string) => {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > 6
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (limited(ip)) return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 })
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ ok: false, error: 'invalid' }, { status: 422 })
  const d = parsed.data
  if (d.website) return NextResponse.json({ ok: true }) // honeypot: pretend success
  const phone = parsePhoneNumberFromString(d.phone, d.countryIso as CountryCode)
  if (!phone?.isValid()) return NextResponse.json({ ok: false, error: 'phone' }, { status: 422 })

  const payload = await getPayload({ config: configPromise })
  const doc = await payload.create({
    collection: 'inquiries',
    overrideAccess: true,
    data: {
      type: d.type,
      name: d.name,
      email: d.email,
      phone: phone.number,
      countryIso: d.countryIso,
      tour: d.tourId as any,
      offer: d.offerId as any,
      vehicle: d.vehicleId as any,
      departure: d.departureId as any,
      guests: d.guests,
      travelDate: d.date ? `${d.date}T00:00:00.000Z` : undefined,
      season: d.season,
      currency: d.currency,
      estimateUsdCents: d.estimateUsdCents,
      message: d.message,
      wantsPdf: d.wantsPdf,
      consent: true,
      sourcePath: d.sourcePath,
      locale: d.locale,
    },
  })
  notifyInquiry(payload, doc).catch(() => undefined)
  return NextResponse.json({ ok: true })
}
