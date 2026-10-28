'use client'
import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { CurrencySelect } from './CurrencyProvider'
import { IconChevron, IconClose, IconMenu, IconSearch, IconArrow } from './Icons'
import { useI18n } from '@/i18n/client'

export type NavItem = { label: string; href: string; children: { label: string; href: string; description?: string }[] }

const LANGS: Record<string, string> = { en: 'English', de: 'Deutsch', fr: 'Français', it: 'Italiano', hi: 'हिन्दी', zh: '中文', ar: 'العربية' }

export function HeaderClient({ items, cta, logoUrl, siteName, home, searchHref }: { items: NavItem[]; cta: { label: string; href: string } | null; logoUrl: string; siteName: string; home: string; searchHref: string }) {
  const { t, locale } = useI18n()
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState<number | null>(null)
  const [mobile, setMobile] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setOpen(null)
    setMobile(false)
  }, [pathname])

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(null)
        setMobile(false)
      }
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('jt-lock', mobile)
  }, [mobile])

  const isActive = (href: string) => (href === home ? pathname === home : pathname === href || pathname.startsWith(href + '/'))

  const switchLocale = (next: string) => {
    const parts = pathname.split('/')
    parts[1] = next
    router.push(parts.join('/') || `/${next}`)
  }

  return (
    <header className="jt-header">
      <div className="jt-wrap jt-header__bar">
        <Link href={home} className="jt-logo" aria-label={`${siteName} – ${t('nav.home')}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoUrl} alt="" width={46} height={46} className="jt-logo__img" fetchPriority="high" />
          <span className="jt-logo__text">{siteName.replace(/\s*Expeditions\s*/i, '').trim() || siteName}</span>
        </Link>

        <nav ref={navRef} className="jt-nav" aria-label={t('nav.main')}>
          <ul>
            {items.map((it, i) => {
              const hasKids = it.children.length > 0
              return (
                <li key={i} className={`jt-nav__item${open === i ? ' is-open' : ''}`} onMouseEnter={() => hasKids && setOpen(i)} onMouseLeave={() => hasKids && setOpen(null)}>
                  <Link href={it.href} className={isActive(it.href) ? 'is-active' : undefined} aria-current={isActive(it.href) ? 'page' : undefined}>
                    {it.label}
                  </Link>
                  {hasKids && (
                    <>
                      <button type="button" className="jt-nav__toggle" aria-expanded={open === i} aria-label={`${it.label}: ${t('nav.submenu')}`} onClick={() => setOpen(open === i ? null : i)}>
                        <IconChevron size={16} />
                      </button>
                      <div className="jt-drop" role="group" aria-label={it.label}>
                        <ul>
                          {it.children.map((c, k) => (
                            <li key={k}>
                              <Link href={c.href}>
                                <strong>{c.label}</strong>
                                {c.description && <small>{c.description}</small>}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="jt-header__tools">
          <CurrencySelect label={t('currency.label')} className="jt-select" />
          <label className="jt-select">
            <span className="jt-sr">{t('nav.language')}</span>
            <select value={locale} onChange={(e) => switchLocale(e.target.value)} aria-label={t('nav.language')}>
              {Object.entries(LANGS).map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <Link href={searchHref} className="jt-iconbtn" aria-label={t('nav.search')}>
            <IconSearch size={20} />
          </Link>
          {cta && (
            <Link href={cta.href} className="jt-btn jt-btn--dark jt-header__cta">
              {cta.label}
            </Link>
          )}
          <button type="button" className="jt-iconbtn jt-burger" aria-expanded={mobile} aria-controls="jt-mobile" aria-label={mobile ? t('nav.close') : t('nav.menu')} onClick={() => setMobile(!mobile)}>
            {mobile ? <IconClose size={24} /> : <IconMenu size={24} />}
          </button>
        </div>
      </div>

      <div id="jt-mobile" className={`jt-mobile${mobile ? ' is-open' : ''}`} hidden={!mobile}>
        <div className="jt-wrap">
          <ul>
            {items.map((it, i) => (
              <li key={i}>
                {it.children.length ? (
                  <details>
                    <summary>
                      {it.label}
                      <IconChevron size={18} />
                    </summary>
                    <ul>
                      <li>
                        <Link href={it.href}>{it.label}</Link>
                      </li>
                      {it.children.map((c, k) => (
                        <li key={k}>
                          <Link href={c.href}>{c.label}</Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : (
                  <Link href={it.href}>{it.label}</Link>
                )}
              </li>
            ))}
          </ul>
          {cta && (
            <Link href={cta.href} className="jt-btn jt-btn--dark jt-mobile__cta">
              {cta.label} <IconArrow size={18} />
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
