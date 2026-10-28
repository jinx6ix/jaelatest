
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables before importing Payload config.
dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
  override: true,
})

const run = async () => {
  // Import Payload modules only after loading .env.
  const { getPayload } = await import('payload')
  const { default: payloadConfig } = await import('@payload-config')
  const { seedAll } = await import('./index')

  console.log('--- Debug ---')
  console.log('PAYLOAD_SECRET loaded:', Boolean(process.env.PAYLOAD_SECRET))
  console.log('DATABASE_URL loaded:', Boolean(process.env.DATABASE_URL))
  console.log('CWD:', process.cwd())
  console.log('--- End Debug ---')

  if (!process.env.PAYLOAD_SECRET) {
    throw new Error('PAYLOAD_SECRET is missing from the root .env file.')
  }

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is missing from the root .env file.')
  }

  console.log('--- Initializing Payload ---')

  const payload = await getPayload({
    config: payloadConfig,
  })

  console.log('--- Payload Initialized ---')
  console.log('--- Calling seedAll ---')

  await seedAll(payload)

  console.log('--- seedAll Finished ---')
}

run().catch((err) => {
  console.error('Fatal error in seed runner:', err)

if (err?.data?.errors) {
  console.error(
    'Detailed validation errors:',
    JSON.stringify(err.data.errors, null, 2),
  )
}
  process.exit(1)
})
