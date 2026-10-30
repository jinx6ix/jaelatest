'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const items = data?.items || []

  return (
    <nav className="flex gap-3 items-center">
      {items.map((item, i) => {
        const href = item.routeKey === 'custom' ? item.url || '/' : `/${item.routeKey}`
        return (
          <Link
            key={i}
            href={href}
            className="text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded px-2 py-1 transition-colors"
          >
            {item.label}
          </Link>
        )
      })}
      <Link href="/search" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded p-1">
        <span className="sr-only">Search</span>
        <SearchIcon className="w-5 text-primary" aria-hidden="true" />
      </Link>
      <LanguageSwitcher />
    </nav>
  )
}
