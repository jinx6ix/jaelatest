'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

export function DynamicScripts({ gaId, gtmId, ahrefsKey }: { gaId?: string; gtmId?: string; ahrefsKey?: string }) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const checkConsent = () => {
      const consent = localStorage.getItem('jae_cookie_consent')
      if (consent === 'granted') {
        setLoaded(true)
      }
    }
    checkConsent()
    window.addEventListener('jae_consent_updated', checkConsent)
    return () => window.removeEventListener('jae_consent_updated', checkConsent)
  }, [])

  if (!loaded) return null

  return (
    <>
      {gtmId && (
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='&l='?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');
            `,
          }}
        />
      )}
      {gaId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script
            id="ga-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `,
            }}
          />
        </>
      )}
      {ahrefsKey && (
        <Script
          id="ahrefs-analytics"
          src="https://analytics.ahrefs.com/analytics.js"
          data-key={ahrefsKey}
          strategy="afterInteractive"
          async
        />
      )}
    </>
  )
}
