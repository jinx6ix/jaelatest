import type { Payload } from 'payload'
import { getPayload } from 'payload'
import config from '@payload-config'

const run = async () => {
  const payload = await getPayload({ config })
  const pages = await payload.find({
    collection: 'pages',
    limit: 100,
  })

  console.log(`Found ${pages.docs.length} pages:`)
  pages.docs.forEach(page => {
    console.log(`- '${page.title}' (slug: ${page.slug})`)
  })
}

run()
