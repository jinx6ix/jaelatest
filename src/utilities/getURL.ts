import canUseDOM from './canUseDOM'

export const getServerSideURL = () => {
  const url = (
    process.env.NEXT_PUBLIC_SERVER_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000')
  ).replace(/\/$/, '')

  if (process.env.NODE_ENV === 'production' && process.env.VERCEL === '1' && (url.includes('localhost') || url.includes('127.0.0.1'))) {
    console.error('ERROR: Production server URL cannot be localhost or 127.0.0.1. Set NEXT_PUBLIC_SERVER_URL or VERCEL_PROJECT_PRODUCTION_URL.')
    if (typeof window === 'undefined') {
      throw new Error('Production server URL is misconfigured (localhost).')
    }
  }

  return url
}

export const getClientSideURL = () => {
  if (canUseDOM) {
    const protocol = window.location.protocol
    const domain = window.location.hostname
    const port = window.location.port

    return `${protocol}//${domain}${port ? `:${port}` : ''}`
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }

  return process.env.NEXT_PUBLIC_SERVER_URL || ''
}

export async function isProductionHost(): Promise<boolean> {
  try {
    const { headers } = await import('next/headers')
    const h = await headers()
    const host = h.get('host') || ''
    // Real domain is jaetravel.co.ke (or www.jaetravel.co.ke)
    if (host.includes('jaetravel.co.ke')) {
      return true
    }
  } catch {}

  if (process.env.NODE_ENV === 'production' && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    // If running on production deployment and production url is set
    return true
  }

  return false
}
