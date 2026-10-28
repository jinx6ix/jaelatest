import React from 'react'
import { cachedGlobal } from '@/lib/globals'
import { resolveLink } from '@/lib/routes'
import type { SiteContext } from '@/lib/site'
import { HeaderClient, type NavItem } from './HeaderClient'

export async function Header({ ctx }: { ctx: SiteContext }) {
  const header: any = await cachedGlobal('header', ctx.locale, 0)
  const items: NavItem[] = (header?.items || []).map((it: any) => ({
    label: it.label,
    href: resolveLink(it, ctx.locale, ctx.routes),
    children: (it.children || []).map((c: any) => ({ label: c.label, href: resolveLink(c, ctx.locale, ctx.routes), description: c.description || undefined })),
  }))
  const cta = header?.cta?.label ? { label: header.cta.label as string, href: resolveLink(header.cta, ctx.locale, ctx.routes) } : null
  return (
    <HeaderClient
      items={items}
      cta={cta}
      logoUrl={ctx.logoUrl}
      siteName={(ctx.company?.companyName as string) || (ctx.site?.siteName as string) || 'JaeTravel'}
      home={`/${ctx.locale}`}
      searchHref={`/${ctx.locale}/search`}
    />
  )
}
