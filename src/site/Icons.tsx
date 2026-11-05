import React from 'react'

type P = { size?: number; className?: string; title?: string }
const base = (size = 24) => ({ width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true })

export const IconChevron = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="m6 9 6 6 6-6" /></svg>
)
export const IconArrow = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
)
export const IconArrowLeft = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
)
export const IconMenu = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
)
export const IconClose = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="M6 6l12 12M18 6 6 18" /></svg>
)
export const IconSearch = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
)
export const IconPlay = ({ size, className }: P) => (
  <svg {...base(size)} className={className} fill="currentColor" stroke="none"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" /></svg>
)
export const IconPause = ({ size, className }: P) => (
  <svg {...base(size)} className={className} fill="currentColor" stroke="none"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
)
export const IconCheck = ({ size, className }: P) => (
  <svg {...base(size)} className={className} strokeWidth={3}><path d="m5 12.5 4.5 4.5L19 7" /></svg>
)
export const IconX = ({ size, className }: P) => (
  <svg {...base(size)} className={className} strokeWidth={3}><path d="M6 6l12 12M18 6 6 18" /></svg>
)
export const IconPin = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>
)
export const IconClock = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
)
export const IconCalendar = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M8 3v4M16 3v4M3.5 10h17" /></svg>
)
export const IconWhatsApp = ({ size, className }: P) => (
  <svg {...base(size)} className={className} fill="currentColor" stroke="none"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.8 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1a15 15 0 0 1-5.6-3.5 11 11 0 0 1-2.4-3.5c-.4-1-.1-2 .4-2.7.2-.3.6-.5.9-.5h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6-.4.5c-.1.2-.2.3 0 .6.5.9 1.4 1.8 2.4 2.3.4.2.7.3.9.1l.7-.9c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.4.1.3.1.8-.1 1.4Z" /></svg>
)
export const IconWheelchair = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><circle cx="13" cy="4.5" r="2" /><path d="M13 8v6h5l2 5M13 11h4" /><path d="M10.5 12.5a5 5 0 1 0 5.8 7" /></svg>
)
export const IconWallet = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18v3" /><rect x="3" y="8" width="18" height="12" rx="2.5" /><circle cx="16.5" cy="14" r="1.2" /></svg>
)
export const IconCompass = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" /></svg>
)
export const IconHerd = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="M3 18c1-4 3-6 6-6h6c3 0 5 2 6 6" /><path d="M6 12V8l2 2M18 12V8l-2 2" /><path d="M8 18v2M16 18v2" /></svg>
)
export const IconUsers = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6" /><circle cx="17" cy="9" r="2.4" /><path d="M16.5 14.2c2.6.2 4.5 2.2 4.5 5.3" /></svg>
)
export const IconGift = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><rect x="3.5" y="9" width="17" height="11" rx="1.5" /><path d="M3 9h18v3.5H3zM12 9v11M12 9c-2-3.5-5.5-3-5.5-1S9 9 12 9Zm0 0c2-3.5 5.5-3 5.5-1S15 9 12 9Z" /></svg>
)
export const IconTag = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="M3 12V4h8l10 10-8 8L3 12Z" /><circle cx="7.5" cy="8.5" r="1.3" /></svg>
)

export const ICONS: Record<string, React.FC<P>> = {
  wheelchair: IconWheelchair,
  wallet: IconWallet,
  compass: IconCompass,
  herd: IconHerd,
  users: IconUsers,
  gift: IconGift,
}

export const IconFacebook = ({ size, className }: P) => (
  <svg {...base(size)} className={className} fill="currentColor" stroke="none"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
)
export const IconInstagram = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
)
export const IconYoutube = ({ size, className }: P) => (
  <svg {...base(size)} className={className} fill="currentColor" stroke="none"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.56 49.56 0 0 1-16.2 0A2 2 0 0 1 2.5 17M10 15l5-3-5-3z"/></svg>
)
export const IconTiktok = ({ size, className }: P) => (
  <svg {...base(size)} className={className} fill="currentColor" stroke="none"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
)
export const IconTwitterX = ({ size, className }: P) => (
  <svg {...base(size)} className={className} fill="currentColor" stroke="none"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
)
export const IconLinkedin = ({ size, className }: P) => (
  <svg {...base(size)} className={className} fill="currentColor" stroke="none"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
)
export const IconTripadvisor = ({ size, className }: P) => (
  <svg {...base(size)} className={className} fill="currentColor" stroke="none"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 15a5 5 0 1 1 5-5 5 5 0 0 1-5 5zm0-8a3 3 0 1 0 3 3 3 3 0 0 0-3-3 z"/></svg>
)

export const SOCIAL_ICONS: Record<string, React.FC<P>> = {
  facebook: IconFacebook,
  instagram: IconInstagram,
  youtube: IconYoutube,
  tiktok: IconTiktok,
  x: IconTwitterX,
  linkedin: IconLinkedin,
  tripadvisor: IconTripadvisor,
}
