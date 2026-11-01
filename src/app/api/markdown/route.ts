import { NextResponse, NextRequest } from 'next/server'
import { getPayloadClient, getSiteContext } from '@/lib/site'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const pathname = url.searchParams.get('path') || '/'
  const cleanPath = pathname.replace(/\.md$/, '')
  const slug = cleanPath.split('/').filter(Boolean).pop() || 'home'

  const payload = await getPayloadClient()
  let content = `# JaeTravel Expeditions\n\nPath: ${cleanPath}\n\n`

  try {
    const tourRes = await payload.find({ collection: 'tours', where: { slug: { equals: slug } }, limit: 1 })
    if (tourRes.docs.length > 0) {
      const tour = tourRes.docs[0] as any
      content = `# ${tour.title}\n\n`
      if (tour.summary) content += `> ${tour.summary}\n\n`
      content += `- **Price From**: $${tour.priceFrom || 'On Request'} USD\n`
      content += `- **Duration**: ${tour.durationDays || 'Custom'} days\n\n`
      if (tour.answerSummary) content += `## Overview\n${tour.answerSummary}\n\n`
    } else {
      const postRes = await payload.find({ collection: 'posts', where: { slug: { equals: slug } }, limit: 1 })
      if (postRes.docs.length > 0) {
        const post = postRes.docs[0] as any
        content = `# ${post.title}\n\n${post.excerpt || ''}\n\n`
      } else {
        content = `# JaeTravel Expeditions\n\nWelcome to JaeTravel Expeditions. Explore Kenya safaris, luxury tours, and vehicle hire.\n`
      }
    }
  } catch {
    content = `# JaeTravel Expeditions\n\nContent for ${cleanPath}\n`
  }

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
