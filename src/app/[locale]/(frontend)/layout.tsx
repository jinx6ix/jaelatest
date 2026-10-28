import type { Metadata } from 'next'
import { Figtree, Montserrat } from 'next/font/google'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import React from 'react'

import { cn } from '@/utilities/ui'
import { AdminBar } from '@/components/AdminBar'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { getSiteContext } from '@/lib/site'
import { LOCALES } from '@/lib/routes'
import { makeT } from '@/i18n'
import { I18nProvider } from '@/i18n/client'
import { CurrencyProvider } from '@/site/CurrencyProvider'
import { ThemeStyle } from '@/site/ThemeStyle'
import { Header } from '@/site/Header'
import { Footer } from '@/site/Footer'
import { WhatsAppButton } from '@/site/WhatsAppButton'
import { buildMetadata } from '@/lib/seo'

import './globals.css'
import './site.css'

const display = Montserrat({ subsets: ['latin', 'latin-ext'], weight: ['600', '700', '800'], style: ['normal', 'italic'], variable: '--font-display', display: 'swap' })
const body = Figtree({ subsets: ['latin', 'latin-ext'], weight: ['400', '500', '600'], variable: '--font-body', display: 'swap' })

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> }

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params
  if (!(LOCALES as readonly string[]).includes(locale)) notFound()
  const { isEnabled } = await draftMode()
  const ctx = await getSiteContext(locale)
  const t = makeT(ctx.dict)
  const currencies = ((ctx.site as any)?.currencies || []).map((c: any) => ({ code: c.code, rate: c.rate }))

  return (
    <html className={cn(display.variable, body.variable)} lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <head>
        <InitTheme />
        <ThemeStyle theme={ctx.theme} />
        <meta name="theme-color" content={(ctx.theme as any)?.brand || '#FF7302'} />
      </head>
      <body className="jt-body">
        <a href="#main" className="jt-skip">
          {t('nav.skip')}
        </a>
        <Providers>
          <I18nProvider dict={ctx.dict} locale={locale}>
            <CurrencyProvider currencies={currencies} locale={locale}>
              <AdminBar adminBarProps={{ preview: isEnabled }} />
              <Header ctx={ctx} />
              <main id="main">{children}</main>
              <Footer ctx={ctx} />
              <WhatsAppButton ctx={ctx} />
            </CurrencyProvider>
          </I18nProvider>
        </Providers>
      </body>
    </html>
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const ctx = await getSiteContext(locale)
  return {
    ...buildMetadata({ ctx, path: '/', title: ctx.site?.siteName || 'JaeTravel Expeditions', bareTitle: true }),
    icons: { icon: '/brand/icon.png', apple: '/brand/apple-touch-icon.png' },
    manifest: undefined,
  }
}
