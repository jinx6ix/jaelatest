const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.jaetravel.co.ke'

async function runAudit() {
  console.log(`Starting SEO audit against ${SITE_URL}...`)
  let errors = 0

  try {
    const sitemapRes = await fetch(`${SITE_URL}/sitemap.xml`)
    if (!sitemapRes.ok) {
      console.error(`❌ Failed to fetch sitemap.xml: status ${sitemapRes.status}`)
      process.exit(1)
    }

    const xmlText = await sitemapRes.text()
    const locMatches = xmlText.match(/<loc>(.*?)<\/loc>/g) || []
    const subSitemaps = locMatches.map(m => m.replace(/<\/?loc>/g, ''))

    const urls: string[] = []
    for (const sm of subSitemaps) {
      try {
        const subRes = await fetch(sm)
        const subText = await subRes.text()
        const subLocs = subText.match(/<loc>(.*?)<\/loc>/g) || []
        for (const l of subLocs) {
          urls.push(l.replace(/<\/?loc>/g, ''))
        }
      } catch {
        // Ignore sub-sitemap fetch error if any
      }
    }

    console.log(`Found ${urls.length} URLs across sitemaps. Auditing sample...`)

    const sampleUrls = urls.slice(0, 15)
    for (const u of sampleUrls) {
      try {
        const res = await fetch(u, { redirect: 'manual' })
        if (res.status !== 200) {
          console.error(`❌ URL ${u} returned status ${res.status}`)
          errors++
        } else {
          console.log(`✓ OK: ${u}`)
        }
      } catch (err: any) {
        console.error(`❌ Error fetching ${u}: ${err.message}`)
        errors++
      }
    }

    // Check robots.txt
    const robotsRes = await fetch(`${SITE_URL}/robots.txt`)
    if (!robotsRes.ok) {
      console.error(`❌ robots.txt failed with status ${robotsRes.status}`)
      errors++
    } else {
      console.log(`✓ robots.txt is reachable`)
    }

    // Check llms.txt
    const llmsRes = await fetch(`${SITE_URL}/llms.txt`)
    if (!llmsRes.ok) {
      console.error(`❌ llms.txt failed with status ${llmsRes.status}`)
      errors++
    } else {
      console.log(`✓ llms.txt is reachable`)
    }

    if (errors > 0) {
      console.error(`\nSEO Audit completed with ${errors} errors.`)
      process.exit(1)
    } else {
      console.log(`\n🎉 SEO Audit passed successfully with 0 errors!`)
      process.exit(0)
    }
  } catch (e: any) {
    console.error(`Audit crashed: ${e.message}`)
    process.exit(1)
  }
}

runAudit()
