import { headers as getHeaders } from 'next/headers'
import { NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { seedSite } from '@/endpoints/seed'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

/**
 * Runs the sample-content seed. Only a logged-in admin can call it (POST).
 * Existing sample documents are updated in place, so running it twice is safe.
 */
export async function POST(request: Request) {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await getHeaders() })
  if (!user) return NextResponse.json({ success: false, error: 'Log in to the admin first.' }, { status: 401 })
  try {
    const fresh = new URL(request.url).searchParams.get('fresh') === '1'
    const result = await seedSite(payload, { fresh })
    return NextResponse.json({ success: true, ...result })
  } catch (error: any) {
    payload.logger.error(error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
