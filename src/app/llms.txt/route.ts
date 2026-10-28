import { getPayloadClient, getSiteContext, findTours, getActiveOffers, getVehicles } from '@/lib/site'
import { docPath } from '@/lib/routes'

export const dynamic = 'force-dynamic'

/** A plain-text summary of the site for AI assistants and answer engines (https://llmstxt.org). */
export async function GET() {
  const ctx = await getSiteContext('en')
  const { origin, routes } = ctx
  const [tours, offers, vehicles] = await Promise.all([findTours({ locale: 'en' }), getActiveOffers('en'), getVehicles('en')])
  const company: any = ctx.company
  const line = (title: string, path: string, note?: string) => `- [${title}](${origin}/en${path})${note ? `: ${note}` : ''}`
  const body = [
    `# ${company?.companyName || ctx.site?.siteName}`,
    '',
    `> ${company?.tagline ? company.tagline + '. ' : ''}${(ctx.site as any)?.seo?.defaultDescription || 'Private and group safaris in Kenya and East Africa, with accessible options and honest prices.'}`,
    '',
    '## Safaris',
    ...tours.map((t) => line(t.title, docPath(routes, 'tours', t), `${t.durationDays} days. ${t.summary}`)),
    '',
    '## Offers',
    ...offers.map((o) => line(o.name, docPath(routes, 'offers', o), o.summary)),
    '',
    '## Vehicle hire',
    ...vehicles.map((v) => line(v.name, docPath(routes, 'vehicles', v), v.summary || undefined)),
    '',
    '## Contact',
    `- Email: ${ctx.site?.contactEmail}`,
    `- Phone: ${company?.phoneNumber}`,
    `- Website: ${origin}`,
    '',
  ].join('\n')
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } })
}
