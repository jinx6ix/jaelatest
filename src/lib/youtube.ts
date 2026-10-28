/** Accepts a YouTube link in any common shape (or a bare 11 character id) and returns the video id. */
export function parseYouTubeId(input?: string | null): string | null {
  if (!input) return null
  const value = input.trim()
  if (/^[A-Za-z0-9_-]{11}$/.test(value)) return value
  try {
    const url = new URL(value)
    const host = url.hostname.replace(/^www\./, '')
    if (host === 'youtu.be') return url.pathname.slice(1).split('/')[0] || null
    if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
      const v = url.searchParams.get('v')
      if (v) return v
      const m = url.pathname.match(/^\/(embed|shorts|live|v)\/([A-Za-z0-9_-]{11})/)
      if (m) return m[2]
    }
  } catch {
    /* not a URL */
  }
  return null
}

export const ytThumbnail = (id: string, quality: 'hq' | 'maxres' = 'hq') =>
  `https://i.ytimg.com/vi/${id}/${quality === 'maxres' ? 'maxresdefault' : 'hqdefault'}.jpg`

export const ytWatchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`

export const ytEmbedUrl = (id: string, opts: { autoplay?: boolean; background?: boolean } = {}) => {
  const p = new URLSearchParams({ rel: '0', modestbranding: '1', playsinline: '1' })
  if (opts.autoplay) p.set('autoplay', '1')
  if (opts.background) {
    p.set('autoplay', '1')
    p.set('mute', '1')
    p.set('controls', '0')
    p.set('loop', '1')
    p.set('playlist', id)
    p.set('disablekb', '1')
    p.set('iv_load_policy', '3')
  }
  return `https://www.youtube-nocookie.com/embed/${id}?${p.toString()}`
}
