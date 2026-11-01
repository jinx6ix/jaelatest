import { NextResponse } from 'next/server'
import { getPayloadClient, getSiteContext } from '@/lib/site'
import { docPath } from '@/lib/routes'

export const dynamic = 'force-dynamic'

export async function GET() {
  const ctx = await getSiteContext('en')
  const payload = await getPayloadClient()
  const { origin, routes } = ctx

  const tours = await payload.find({ collection: 'tours', where: { published: { equals: true } }, limit: 500, pagination: false, depth: 1, overrideAccess: true })
  const offers = await payload.find({ collection: 'offers', where: { published: { equals: true } }, limit: 200, pagination: false, depth: 0, overrideAccess: true })
  const vehicles = await payload.find({ collection: 'vehicles', where: { published: { equals: true } }, limit: 100, pagination: false, depth: 0, overrideAccess: true })
  const posts = await payload.find({ collection: 'posts', where: { _status: { equals: 'published' } }, limit: 200, pagination: false, depth: 0, overrideAccess: true })

  let content = `# JaeTravel Expeditions - Full LLM Knowledge Base\n\n`
  content += `Origin: ${origin}\nContact: ${ctx.site?.contactEmail || 'info@jaetravel.co.ke'}\nWhatsApp: ${ctx.company?.phoneNumber || '+254 726 485 228'}\n\n`

  content += `## Tours & Safaris\n\n`
  for (const tour of tours.docs as any[]) {
    const link = `${origin}${docPath(routes, 'tours', tour)}`
    content += `### ${tour.title}\n`
    content += `- **URL**: ${link}\n`
    content += `- **Price From**: ${tour.priceFrom ? `$${tour.priceFrom} USD` : 'On request'}\n`
    content += `- **Duration**: ${tour.durationDays ? `${tour.durationDays} days` : 'Custom'}\n`
    if (tour.summary) content += `- **Summary**: ${tour.summary}\n`
    if (tour.answerSummary) content += `- **Answer Summary**: ${tour.answerSummary}\n`
    content += `\n`
  }

  content += `## Special Offers\n\n`
  for (const o of offers.docs as any[]) {
    const link = `${origin}${docPath(routes, 'offers', o)}`
    content += `### ${o.name}\n`
    content += `- **URL**: ${link}\n`
    if (o.summary) content += `- **Summary**: ${o.summary}\n`
    content += `\n`
  }

  content += `## Vehicle Hire\n\n`
  for (const v of vehicles.docs as any[]) {
    const link = `${origin}${docPath(routes, 'vehicles', v)}`
    content += `### ${v.name}\n`
    content += `- **URL**: ${link}\n`
    if (v.summary) content += `- **Summary**: ${v.summary}\n`
    content += `\n`
  }

  content += `## Blog & Guides\n\n`
  for (const p of posts.docs as any[]) {
    const link = `${origin}${docPath(routes, 'posts', p)}`
    content += `### ${p.title}\n`
    content += `- **URL**: ${link}\n`
    if (p.excerpt) content += `- **Excerpt**: ${p.excerpt}\n`
    content += `\n`
  }

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
