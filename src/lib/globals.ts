import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

/** Reads a global in a given language and caches it until the global changes (tag `global_<slug>`). */
export const cachedGlobal = (slug: string, locale: string, depth = 1): Promise<any> =>
  unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })
      return payload.findGlobal({ slug: slug as any, depth, locale: locale as any })
    },
    ['global', slug, locale, String(depth)],
    { tags: [`global_${slug}`] },
  )()
