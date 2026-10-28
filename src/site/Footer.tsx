import React from 'react'
import Link from 'next/link'
import { cachedGlobal } from '@/lib/globals'
import { resolveLink } from '@/lib/routes'
import type { SiteContext } from '@/lib/site'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { IconPin } from './Icons'
import { makeT } from '@/i18n'

const SOCIAL_LABEL: Record<string, string> = { facebook: 'Facebook', instagram: 'Instagram', youtube: 'YouTube', tiktok: 'TikTok', x: 'X', linkedin: 'LinkedIn', tripadvisor: 'Tripadvisor' }

export async function Footer({ ctx }: { ctx: SiteContext }) {
  const footer: any = await cachedGlobal('footer', ctx.locale, 0)
  const t = makeT(ctx.dict)
  const c: any = ctx.company
  const name = (c?.companyName as string) || 'JaeTravel Expeditions'
  const year = new Date().getFullYear()
  const copyright = ((footer?.copyright as string) || '© {year} {name}').replace('{year}', String(year)).replace('{name}', name)
  const addr = [c?.address?.street, c?.address?.city, c?.address?.region].filter(Boolean).join(', ')
  return (
    <footer className="jt-footer">
      <div className="jt-wrap jt-footer__grid">
        <div className="jt-footer__brand">
          <Link href={`/${ctx.locale}`} className="jt-logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ctx.logoUrl} alt="" width={52} height={52} className="jt-logo__img" loading="lazy" />
            <span className="jt-logo__text">{name.replace(/\s*Expeditions\s*/i, '').trim()}</span>
          </Link>
          {c?.tagline && <p className="jt-footer__tag">{c.tagline}</p>}
          <address>
            {addr && (
              <p>
                <IconPin size={16} /> {addr}
              </p>
            )}
            {ctx.site?.contactEmail && (
              <p>
                <a href={`mailto:${ctx.site.contactEmail}`}>{ctx.site.contactEmail}</a>
              </p>
            )}
            {c?.phoneNumber && (
              <p>
                <a href={`tel:${String(c.phoneNumber).replace(/\s/g, '')}`}>{c.phoneNumber}</a>
              </p>
            )}
          </address>
          {(ctx.site?.social || []).length > 0 && (
            <ul className="jt-footer__social" aria-label={t('footer.social')}>
              {(ctx.site.social || []).map((s: any) => (
                <li key={s.id || s.url}>
                  <a href={s.url} rel="me noopener" target="_blank">
                    {SOCIAL_LABEL[s.platform] || s.platform}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        {(footer?.columns || []).map((col: any, i: number) => (
          <nav key={i} aria-label={col.title}>
            <h2>{col.title}</h2>
            <ul>
              {(col.links || []).map((l: any, k: number) => (
                <li key={k}>
                  <Link href={resolveLink(l, ctx.locale, ctx.routes)}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      {(c?.credentials || []).length > 0 && (
        <div className="jt-wrap jt-footer__creds">
          {(c.credentials || []).map((x: any, i: number) => (
            <span key={i}>{x.text}</span>
          ))}
        </div>
      )}
      <div className="jt-wrap jt-footer__legal">
        <p>{copyright}</p>
        <ul>
          {(footer?.legalLinks || []).map((l: any, i: number) => (
            <li key={i}>
              <Link href={resolveLink(l, ctx.locale, ctx.routes)}>{l.label}</Link>
            </li>
          ))}
        </ul>
        <ThemeSelector />
      </div>
    </footer>
  )
}
