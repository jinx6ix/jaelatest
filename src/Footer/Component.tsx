import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { Logo } from '@/components/Logo/Logo'

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()

  const legalLinks = footerData?.legalLinks || []

  return (
    <footer className="mt-auto border-t border-border bg-black dark:bg-card text-white">
      <div className="container py-8 gap-8 flex flex-col md:flex-row md:justify-between">
        <Link className="flex items-center" href="/">
          <Logo />
        </Link>

        <div className="flex flex-col-reverse items-start md:flex-row gap-4 md:items-center">
          <ThemeSelector />
          <nav className="flex flex-col md:flex-row gap-4">
            {legalLinks.map((item, i) => {
              const href = item.routeKey === 'custom' ? item.url || '/' : `/${item.routeKey}`
              return (
                <Link className="text-white" key={i} href={href}>
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </footer>
  )
}
