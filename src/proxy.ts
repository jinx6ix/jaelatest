import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const LOCALES = ['en', 'de', 'fr', 'it', 'hi', 'zh', 'ar']
const PUBLIC_FILE = /\.(.*)$/

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const host = request.headers.get('host') || ''
  const isProd = host.includes('jaetravel.co.ke') && !host.includes('vercel.app')

  const response = (() => {
    // Skip api, admin, next internals, and static files (except .md)
    if (
      pathname.startsWith('/api') ||
      pathname.startsWith('/admin') ||
      pathname.startsWith('/_next') ||
      pathname.startsWith('/next') ||
      pathname === '/robots.txt' ||
      pathname === '/sitemap.xml' ||
      pathname === '/rss.xml' ||
      pathname === '/llms.txt' ||
      pathname === '/llms-full.txt' ||
      pathname === '/merchant-feed.xml'
    ) {
      return NextResponse.next()
    }

    // Handle markdown alternate requests ending in .md
    if (pathname.endsWith('.md')) {
      const url = request.nextUrl.clone()
      url.pathname = '/api/markdown'
      url.searchParams.set('path', pathname)
      return NextResponse.rewrite(url)
    }

    if (PUBLIC_FILE.test(pathname)) {
      return NextResponse.next()
    }

    // Check if pathname starts with /en
    if (pathname === '/en' || pathname.startsWith('/en/')) {
      const cleanPath = pathname === '/en' ? '/' : pathname.replace(/^\/en/, '')
      const url = request.nextUrl.clone()
      url.pathname = cleanPath
      return NextResponse.redirect(url, 308)
    }

    // Check if pathname already starts with another locale (de, fr, etc.)
    const segments = pathname.split('/')
    const firstSegment = segments[1]

    if (LOCALES.includes(firstSegment)) {
      return NextResponse.next()
    }

    // For clean English URLs without prefix (e.g. /tours, /about, /), rewrite internally to /en/...
    const url = request.nextUrl.clone()
    url.pathname = pathname === '/' ? '/en' : `/en${pathname}`
    return NextResponse.rewrite(url)
  })()

  if (!isProd) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
