import dotenv from 'dotenv'
import path from 'path'

dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
  override: true,
})

async function main() {
  const { getPayload } = await import('payload')
  const { default: config } = await import('@payload-config')
  const { seedSite } = await import('./index')

  const payload = await getPayload({ config })
  const fresh = process.argv.includes('--fresh')
  const result = await seedSite(payload, { fresh })
  console.log('[seed] done', JSON.stringify(result))
  process.exit(0)
}

main().catch((err) => {
  console.error('Fatal error in seed:', err)
  if (err?.data?.errors) {
    console.error('Detailed validation errors:', JSON.stringify(err.data.errors, null, 2))
  }
  process.exit(1)
})
