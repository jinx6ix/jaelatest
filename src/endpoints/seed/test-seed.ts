import type { Payload } from 'payload'
import { getPayload } from 'payload'
import config from '@payload-config'
import { seedAboutPage } from './about'

const run = async () => {
  const payload = await getPayload({ config })

  console.log('Running About Page seed...')
  try {
    await seedAboutPage(payload)
    console.log('About Page seeded!')
  } catch (err) {
    console.error('Error seeding About Page:', err)
  }
}

run()
