'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'

export type TabDef = { key: string; title: string; content: React.ReactNode }

/**
 * Tabs that switch in place. Every panel is rendered in the server HTML (inactive ones are `hidden`),
 * so search engines read all of it. The tab key is kept in the URL hash, and other parts of the page
 * can open a tab with `window.dispatchEvent(new CustomEvent('jt:open-tab', { detail: 'booking' }))`.
 */
export function Tabs({ tabs, label, initial }: { tabs: TabDef[]; label: string; initial?: string }) {
  const first = initial && tabs.some((t) => t.key === initial) ? initial : tabs[0]?.key
  const [active, setActive] = useState(first)
  const listRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  const select = useCallback(
    (key: string, push = true, scroll = false) => {
      if (!tabs.some((t) => t.key === key)) return
      setActive(key)
      if (push) {
        try {
          history.replaceState(null, '', `#${key}`)
        } catch {
          /* ignore */
        }
      }
      if (scroll) wrapRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
    },
    [tabs],
  )

  useEffect(() => {
    const h = window.location.hash.replace('#', '')
    if (h && tabs.some((t) => t.key === h)) setActive(h)
    const onOpen = (e: Event) => select((e as CustomEvent<string>).detail, true, true)
    const onHash = () => {
      const k = window.location.hash.replace('#', '')
      if (tabs.some((t) => t.key === k)) setActive(k)
    }
    window.addEventListener('jt:open-tab', onOpen)
    window.addEventListener('hashchange', onHash)
    return () => {
      window.removeEventListener('jt:open-tab', onOpen)
      window.removeEventListener('hashchange', onHash)
    }
  }, [tabs, select])

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const rtl = document.documentElement.dir === 'rtl'
    let n: number | null = null
    if (e.key === (rtl ? 'ArrowLeft' : 'ArrowRight')) n = (i + 1) % tabs.length
    if (e.key === (rtl ? 'ArrowRight' : 'ArrowLeft')) n = (i - 1 + tabs.length) % tabs.length
    if (e.key === 'Home') n = 0
    if (e.key === 'End') n = tabs.length - 1
    if (n === null) return
    e.preventDefault()
    select(tabs[n].key)
    ;(listRef.current?.querySelectorAll('[role=tab]')[n] as HTMLElement)?.focus()
  }

  if (!tabs.length) return null
  return (
    <div className="jt-tabs" ref={wrapRef}>
      <div className="jt-tabs__bar">
        <div role="tablist" aria-label={label} ref={listRef}>
          {tabs.map((t, i) => (
            <button
              key={t.key}
              role="tab"
              type="button"
              id={`tab-${t.key}`}
              aria-controls={`panel-${t.key}`}
              aria-selected={active === t.key}
              tabIndex={active === t.key ? 0 : -1}
              onClick={() => select(t.key)}
              onKeyDown={(e) => onKey(e, i)}
            >
              {t.title}
            </button>
          ))}
        </div>
      </div>
      {tabs.map((t) => (
        <div key={t.key} role="tabpanel" id={`panel-${t.key}`} aria-labelledby={`tab-${t.key}`} hidden={active !== t.key} className="jt-tabs__panel">
          {t.content}
        </div>
      ))}
    </div>
  )
}

export const openTab = (key: string) => window.dispatchEvent(new CustomEvent('jt:open-tab', { detail: key }))
