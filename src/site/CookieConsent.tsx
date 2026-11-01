'use client'

import { useState, useEffect } from 'react'

export function CookieConsent() {
  const [consent, setConsent] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('jae_cookie_consent')
    if (saved) {
      setConsent(saved)
      applyConsent(saved === 'granted')
    }
  }, [])

  const applyConsent = (granted: boolean) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('consent', 'update', {
        ad_storage: granted ? 'granted' : 'denied',
        analytics_storage: granted ? 'granted' : 'denied',
        ad_user_data: granted ? 'granted' : 'denied',
        ad_personalization: granted ? 'granted' : 'denied',
      })
    }
  }

  const handleAccept = () => {
    localStorage.setItem('jae_cookie_consent', 'granted')
    setConsent('granted')
    applyConsent(true)
    window.dispatchEvent(new Event('jae_consent_updated'))
  }

  const handleReject = () => {
    localStorage.setItem('jae_cookie_consent', 'denied')
    setConsent('denied')
    applyConsent(false)
  }

  if (consent !== null) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      background: '#111827',
      color: '#fff',
      padding: '16px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.3)',
      borderTop: '1px solid rgba(225, 160, 62, 0.3)',
    }} className="md:flex-row md:items-center md:justify-between">
      <div style={{ maxWidth: '800px', fontSize: '14px', lineHeight: 1.5 }}>
        We use cookies and analytics to improve your experience, measure performance, and enable personalized safari recommendations. See our <a href="/privacy-policy" style={{ color: '#E1A03E', textDecoration: 'underline' }}>Privacy Policy</a>.
      </div>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button
          onClick={handleReject}
          style={{ background: 'transparent', border: '1px solid #9CA3AF', color: '#E5E7EB', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}
        >
          Reject Non-Essential
        </button>
        <button
          onClick={handleAccept}
          style={{ background: '#E1A03E', border: 'none', color: '#111827', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}
        >
          Accept All
        </button>
      </div>
    </div>
  )
}
