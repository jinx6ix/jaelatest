'use client'

import { useState } from 'react'
import Script from 'next/script'

export function FloatingActions({ whatsappNumber, whatsappMessage, preferredSourceEnabled }: { whatsappNumber: string; whatsappMessage?: string; preferredSourceEnabled?: boolean }) {
  const [loadingPreferred, setLoadingPreferred] = useState(false)

  const handlePreferredSource = () => {
    setLoadingPreferred(true)
    const swg = (window as any).googleswg || (window as any).SWG
    if (swg && typeof swg.addPreferredSource === 'function') {
      swg.addPreferredSource().catch(() => {}).finally(() => setLoadingPreferred(false))
    } else {
      // Retry or trigger fallback
      setTimeout(() => {
        const swgRetry = (window as any).googleswg || (window as any).SWG
        if (swgRetry && typeof swgRetry.addPreferredSource === 'function') {
          swgRetry.addPreferredSource()
        }
        setLoadingPreferred(false)
      }, 1500)
    }
  }

  const cleanNumber = whatsappNumber?.replace(/\D/g, '') || '254726485228'
  const waUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(whatsappMessage || 'Hello JaeTravel, I would like to inquire about a safari.')}`

  return (
    <>
      {preferredSourceEnabled && (
        <Script
          id="swg-script"
          src="https://news.google.com/swg/js/v1/swg.js"
          data-preferred-sources-control="manual"
          strategy="afterInteractive"
        />
      )}

      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 999,
        display: 'flex',
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: '12px',
      }}>
        {/* WhatsApp Button */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#25D366',
            color: '#FFFFFF',
            borderRadius: '50px',
            padding: '12px 20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '15px',
            transition: 'transform 0.2s',
          }}
        >
          <svg style={{ width: '24px', height: '24px', fill: 'currentColor', marginRight: '8px' }} viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
          </svg>
          <span className="hidden sm:inline">WhatsApp</span>
        </a>

        {/* Preferred Source Button */}
        {preferredSourceEnabled && (
          <button
            onClick={handlePreferredSource}
            disabled={loadingPreferred}
            aria-label="Add as a preferred source on Google"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#FFFFFF',
              color: '#111827',
              border: '1px solid #D1D5DB',
              borderRadius: '50px',
              padding: '12px 20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '15px',
              transition: 'transform 0.2s',
            }}
          >
            <svg style={{ width: '20px', height: '20px', marginRight: '8px' }} viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.95H1.2v3.15C3.16 21.39 7.23 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.25c-.25-.72-.38-1.49-.38-2.25s.13-1.53.38-2.25V6.6H1.2C.44 8.14 0 9.87 0 12s.44 3.86 1.2 5.4l4.08-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.16 2.61 1.2 6.6l4.08 3.15c.95-2.84 3.6-4.95 6.72-4.95z"/>
            </svg>
            <span className="hidden sm:inline">{loadingPreferred ? 'Loading...' : 'Preferred Source'}</span>
          </button>
        )}
      </div>
    </>
  )
}
