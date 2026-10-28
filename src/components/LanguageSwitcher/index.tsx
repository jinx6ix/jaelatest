'use client'

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'

const locales = ['en', 'de', 'fr', 'it', 'hi', 'zh', 'ar']

export const LanguageSwitcher = () => {
  const pathname = usePathname()
  const router = useRouter()

  const switchLocale = (newLocale: string) => {
    // Get the current path without the locale prefix
    const pathParts = pathname.split('/')
    // pathParts[0] is empty, pathParts[1] is the current locale
    const newPath = '/' + newLocale + '/' + pathParts.slice(2).join('/')
    router.push(newPath)
  }

  return (
    <div className="flex gap-2 p-2 bg-background border rounded">
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => switchLocale(locale)}
          className="px-2 py-1 text-sm uppercase hover:underline"
        >
          {locale}
        </button>
      ))}
    </div>
  )
}
