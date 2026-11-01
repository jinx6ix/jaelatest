import { getSiteContext } from '@/lib/site'

export async function pingIndexNow(urls: string[]) {
  try {
    const ctx = await getSiteContext('en')
    const host = new URL(ctx.origin).hostname
    const key = (ctx.site?.seo as any)?.googleSiteVerification || 'jaetravel-indexnow-key'
    const keyLocation = `${ctx.origin}/${key}.txt`

    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host,
        key,
        keyLocation,
        urlList: urls,
      }),
    })
    return res.ok
  } catch {
    return false
  }
}
