import type { Metadata } from 'next'
import { LOCALES } from './routes'
import type { SiteContext } from './site'
import { absoluteUrl, mediaUrl } from './media'

export const OG_LOCALE: Record<string, string> = { en: 'en_GB', de: 'de_DE', fr: 'fr_FR', it: 'it_IT', hi: 'hi_IN', zh: 'zh_CN', ar: 'ar_AR' }

export const pageUrl = (ctx: Pick<SiteContext, 'origin'>, locale: string, path: string) => locale === 'en' ? `${ctx.origin}${path === '/' ? '' : path}` : `${ctx.origin}/${locale}${path === '/' ? '' : path}`

export type MetaArgs = {
  ctx: SiteContext
  path: string
  title: string
  description?: string | null
  image?: unknown
  type?: 'website' | 'article'
  noindex?: boolean
  publishedTime?: string | null
  modifiedTime?: string | null
  /** Skip the " | Brand" suffix (home page, long titles). */
  bareTitle?: boolean
}

export function buildMetadata(a: MetaArgs): Metadata {
  const { ctx, path } = a
  const locale = ctx.locale
  const suffix = (ctx.site?.seo?.titleSuffix as string) || ctx.site?.siteName || 'JaeTravel'
  // Keep titles near 60 characters: the brand suffix is dropped when it would make the title too long.
  const withSuffix = `${a.title} | ${suffix}`
  const title = a.bareTitle || a.title.toLowerCase().includes(suffix.toLowerCase()) || withSuffix.length > 64 ? a.title : withSuffix
  const description = a.description || (ctx.site?.seo?.defaultDescription as string) || undefined
  const canonical = pageUrl(ctx, locale, path)
  const ogImage = absoluteUrl(ctx.origin, mediaUrl(a.image, 'og') || mediaUrl(a.image) || mediaUrl(ctx.site?.seo?.defaultOgImage, 'og') || ctx.logoUrl)
  const languages: Record<string, string> = {}
  for (const l of LOCALES) languages[l] = pageUrl(ctx, l, path)
  languages['x-default'] = pageUrl(ctx, 'en', path)
  return {
    metadataBase: new URL(ctx.origin),
    title: { absolute: title },
    description,
    alternates: { canonical, languages },
    robots: a.noindex
      ? { index: false, follow: true }
      : { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
    openGraph: {
      type: a.type || 'website',
      url: canonical,
      title,
      description,
      siteName: ctx.site?.siteName,
      locale: OG_LOCALE[locale] || 'en_GB',
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: a.title }] : undefined,
      ...(a.type === 'article' ? { publishedTime: a.publishedTime || undefined, modifiedTime: a.modifiedTime || undefined } : {}),
    },
    twitter: { card: 'summary_large_image', title, description, images: ogImage ? [ogImage] : undefined },
    verification: ctx.site?.seo?.googleSiteVerification ? { google: ctx.site.seo.googleSiteVerification } : undefined,
  }
}
