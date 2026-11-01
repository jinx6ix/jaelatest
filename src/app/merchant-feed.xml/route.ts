import { NextResponse } from 'next/server'
import { getPayloadClient, getSiteContext } from '@/lib/site'
import { docPath } from '@/lib/routes'
import { mediaUrl } from '@/lib/media'

export const dynamic = 'force-dynamic'

export async function GET() {
  const ctx = await getSiteContext('en')
  const payload = await getPayloadClient()
  const { origin, routes } = ctx

  const tours = await payload.find({ collection: 'tours', where: { published: { equals: true } }, limit: 500, pagination: false, depth: 1, overrideAccess: true })
  const vehicles = await payload.find({ collection: 'vehicles', where: { published: { equals: true } }, limit: 200, pagination: false, depth: 1, overrideAccess: true })

  let itemsXml = ''

  for (const tour of tours.docs as any[]) {
    const link = `${origin}${docPath(routes, 'tours', tour)}`
    const id = `JT-TOUR-${tour.id}`
    const title = escapeXml(tour.title)
    const description = escapeXml(tour.summary || tour.title)
    const img = mediaUrl(tour.heroImage, 'xlarge')
    const imageUrl = img ? (img.startsWith('http') ? img : `${origin}${img}`) : ''
    const price = tour.priceFrom ? `${Number(tour.priceFrom).toFixed(2)} USD` : '1000.00 USD'
    const productType = escapeXml('Tours & Safaris > Kenya Safaris')

    itemsXml += `
    <item>
      <g:id>${id}</g:id>
      <title>${title}</title>
      <description>${description}</description>
      <link>${link}</link>
      ${imageUrl ? `<g:image_link>${imageUrl}</g:image_link>` : ''}
      <g:availability>in_stock</g:availability>
      <g:price>${price}</g:price>
      <g:brand>JaeTravel Expeditions</g:brand>
      <g:condition>new</g:condition>
      <g:identifier_exists>no</g:identifier_exists>
      <g:product_type>${productType}</g:product_type>
      <g:google_product_category>6606</g:google_product_category>
    </item>`
  }

  for (const v of vehicles.docs as any[]) {
    const link = `${origin}${docPath(routes, 'vehicles', v)}`
    const id = `JT-VEHICLE-${v.id}`
    const title = escapeXml(v.name)
    const description = escapeXml(v.summary || v.name)
    const img = mediaUrl(v.image, 'xlarge')
    const imageUrl = img ? (img.startsWith('http') ? img : `${origin}${img}`) : ''
    const price = v.pricePerDay ? `${Number(v.pricePerDay).toFixed(2)} USD` : '200.00 USD'
    const productType = escapeXml('Vehicle Hire > Safari Vehicles')

    itemsXml += `
    <item>
      <g:id>${id}</g:id>
      <title>${title}</title>
      <description>${description}</description>
      <link>${link}</link>
      ${imageUrl ? `<g:image_link>${imageUrl}</g:image_link>` : ''}
      <g:availability>in_stock</g:availability>
      <g:price>${price}</g:price>
      <g:brand>JaeTravel Expeditions</g:brand>
      <g:condition>new</g:condition>
      <g:identifier_exists>no</g:identifier_exists>
      <g:product_type>${productType}</g:product_type>
      <g:google_product_category>6606</g:google_product_category>
    </item>`
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>JaeTravel Expeditions Product Feed</title>
    <link>${origin}</link>
    <description>Safari tours and vehicle hire in Kenya</description>
    ${itemsXml}
  </channel>
</rss>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}

function escapeXml(str: string) {
  if (!str) return ''
  return str.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '&': return '&amp;'
      case '\'': return '&apos;'
      case '"': return '&quot;'
      default: return c
    }
  })
}
