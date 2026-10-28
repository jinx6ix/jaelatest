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
          <Link key={i} href={href} className="text-foreground hover:text-primary">
            {item.label}
          </Link>
        )
      })}
      <Link href="/search">
        <span className="sr-only">Search</span>
        <SearchIcon className="w-5 text-primary" />
      </Link>
      <LanguageSwitcher />
    </nav>
  )
}
