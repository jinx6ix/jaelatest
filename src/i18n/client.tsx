'use client'
import React, { createContext, useContext, useMemo } from 'react'
import { makeT, type TFn } from './index-client'

type Ctx = { t: TFn; locale: string }
const I18nContext = createContext<Ctx | null>(null)

export function I18nProvider({ dict, locale, children }: { dict: Record<string, string>; locale: string; children: React.ReactNode }) {
  const value = useMemo(() => ({ t: makeT(dict), locale }), [dict, locale])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): Ctx {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider')
  return ctx
}
