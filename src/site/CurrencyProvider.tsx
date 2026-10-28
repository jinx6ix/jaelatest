'use client'
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { formatMoney } from '@/lib/pricing'

export type CurrencyInfo = { code: string; rate: number }
type Ctx = { code: string; rate: number; setCode: (c: string) => void; currencies: CurrencyInfo[]; locale: string }
const CurrencyContext = createContext<Ctx | null>(null)
const KEY = 'jt_currency'

export function CurrencyProvider({ currencies, locale, children }: { currencies: CurrencyInfo[]; locale: string; children: React.ReactNode }) {
  const list = currencies.length ? currencies : [{ code: 'USD', rate: 1 }]
  const [code, setCodeState] = useState(list[0].code)

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(KEY)
      if (saved && list.some((c) => c.code === saved)) setCodeState(saved)
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setCode = useCallback((c: string) => {
    setCodeState(c)
    try {
      window.localStorage.setItem(KEY, c)
      window.dispatchEvent(new CustomEvent('jt:currency', { detail: c }))
    } catch {
      /* ignore */
    }
  }, [])

  const value = useMemo(() => ({ code, rate: list.find((c) => c.code === code)?.rate ?? 1, setCode, currencies: list, locale }), [code, setCode, list, locale])
  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext)
  if (!ctx) throw new Error('useCurrency must be used inside CurrencyProvider')
  return ctx
}

/** Shows an amount (US cents) in the visitor's chosen currency. */
export function Money({ cents, className }: { cents: number; className?: string }) {
  const { code, rate, locale } = useCurrency()
  return (
    <span className={className} suppressHydrationWarning>
      {formatMoney(cents, code, rate, locale)}
    </span>
  )
}

export function CurrencySelect({ label, className }: { label: string; className?: string }) {
  const { code, setCode, currencies } = useCurrency()
  if (currencies.length < 2) return null
  return (
    <label className={className}>
      <span className="jt-sr">{label}</span>
      <select value={code} onChange={(e) => setCode(e.target.value)} aria-label={label}>
        {currencies.map((c) => (
          <option key={c.code} value={c.code}>
            {c.code}
          </option>
        ))}
      </select>
    </label>
  )
}
