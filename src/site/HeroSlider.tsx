'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useI18n } from '@/i18n/client'
import { IconArrow, IconArrowLeft, IconPause, IconPlay } from './Icons'
import { ytEmbedUrl } from '@/lib/youtube'

export type HeroSlideData = {
  kind: 'image' | 'youtube'
  image: { src: string; srcSet?: string; width?: number; height?: number; alt: string } | null
  cutout?: { src: string; alt: string } | null
  youtubeId?: string | null
  eyebrow?: string | null
  headlineLines: string[]
  headline: string
  text?: string | null
  tagline?: string | null
  chips?: string[]
  showContact: boolean
  focalPoint: 'left' | 'centre' | 'right'
  scrim: number
  depth: 'none' | 'soft' | 'strong'
  caption?: string | null
  cta?: { label: string; href: string } | null
  cta2?: { label: string; href: string } | null
  duration: number
}

export type ContactInfo = {
  phone: string
  email: string
  website: string
}

export function HeroSlider({
  slides,
  autoplay,
  transition = 'depth-turn',
  tilt = true,
  idleFloat = true,
  contact,
}: {
  slides: HeroSlideData[]
  autoplay: boolean
  transition?: 'depth-turn' | 'cube' | 'fade'
  tilt?: boolean
  idleFloat?: boolean
  contact: ContactInfo
}) {
  const { t } = useI18n()
  const [i, setI] = useState(0)
  const [userPaused, setUserPaused] = useState(false)
  const [hoverPaused, setHoverPaused] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [videoShown, setVideoShown] = useState(false)
  const [videoOk, setVideoOk] = useState(false)

  const containerRef = useRef<HTMLElement | null>(null)
  const startX = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)
  const targetRx = useRef(0)
  const targetRy = useRef(0)
  const currentRx = useRef(0)
  const currentRy = useRef(0)

  const n = slides.length

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onMq = () => setReduced(mq.matches)
    mq.addEventListener?.('change', onMq)

    const coarse = window.matchMedia('(pointer: coarse)').matches
    const conn: any = (navigator as any).connection
    const lite = conn?.saveData || /(^|-)2g$/.test(conn?.effectiveType || '')
    setVideoOk(!mq.matches && !lite && !coarse && window.innerWidth >= 820)

    const onVis = () => setHidden(document.hidden)
    document.addEventListener('visibilitychange', onVis)

    return () => {
      mq.removeEventListener?.('change', onMq)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  // Parallax tilt loop via requestAnimationFrame
  useEffect(() => {
    if (!tilt || reduced) return
    const el = containerRef.current
    if (!el) return

    const updateTilt = () => {
      currentRx.current += (targetRx.current - currentRx.current) * 0.1
      currentRy.current += (targetRy.current - currentRy.current) * 0.1
      el.style.setProperty('--rx', `${currentRx.current.toFixed(2)}deg`)
      el.style.setProperty('--ry', `${currentRy.current.toFixed(2)}deg`)
      rafRef.current = requestAnimationFrame(updateTilt)
    }
    rafRef.current = requestAnimationFrame(updateTilt)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [tilt, reduced])

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!tilt || reduced) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5 // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    targetRx.current = -y * 8 // max ±4 deg
    targetRy.current = x * 12 // max ±6 deg
  }

  const onMouseLeave = () => {
    targetRx.current = 0
    targetRy.current = 0
  }

  const go = useCallback(
    (k: number) => {
      setVideoShown(false)
      setI(((k % n) + n) % n)
    },
    [n]
  )

  const next = useCallback(() => go(i + 1), [go, i])
  const prev = useCallback(() => go(i - 1), [go, i])

  const active = slides[i]
  const wantVideo = videoOk && active.kind === 'youtube' && !!active.youtubeId

  useEffect(() => {
    if (!wantVideo) return
    const id = window.setTimeout(() => setVideoShown(true), 1200)
    return () => window.clearTimeout(id)
  }, [wantVideo, i])

  const running = autoplay && !reduced && !userPaused && !hoverPaused && !hidden && n > 1

  const onKey = (e: React.KeyboardEvent) => {
    const rtl = document.documentElement.dir === 'rtl'
    if (e.key === 'ArrowRight') (rtl ? prev : next)()
    if (e.key === 'ArrowLeft') (rtl ? next : prev)()
  }

  const cleanPhone = contact.phone.replace(/[^+\d]/g, '')

  return (
    <section
      ref={containerRef}
      className={`jt-hero jt-hero--${transition}${idleFloat && !reduced ? ' is-idle' : ''}`}
      role="group"
      aria-roledescription="carousel"
      aria-label={t('hero.label')}
      onKeyDown={onKey}
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => {
        setHoverPaused(false)
        onMouseLeave()
      }}
      onFocus={() => setHoverPaused(true)}
      onBlur={() => setHoverPaused(false)}
      onMouseMove={onMouseMove}
    >
      <div
        className="jt-hero__viewport"
        onPointerDown={(e) => (startX.current = e.clientX)}
        onPointerUp={(e) => {
          if (startX.current == null) return
          const dx = e.clientX - startX.current
          startX.current = null
          if (Math.abs(dx) > 50) (dx < 0 ? next : prev)()
        }}
        onPointerCancel={() => (startX.current = null)}
      >
        <div className="jt-hero__track">
          {slides.map((s, k) => {
            const isActive = k === i
            const isPrev = k === (i - 1 + n) % n
            const isNext = k === (i + 1) % n
            let posClass = ''
            if (isActive) posClass = ' is-active'
            else if (isPrev) posClass = ' is-prev'
            else if (isNext) posClass = ' is-next'

            return (
              <div
                key={k}
                className={`jt-slide jt-slide--focal-${s.focalPoint} jt-slide--depth-${s.depth}${posClass}`}
                role="group"
                aria-roledescription="slide"
                aria-label={t('hero.slideOf', { n: k + 1, total: n })}
                aria-hidden={!isActive}
                style={{ ['--kb' as any]: `${Math.max(s.duration, 6) + 2}s`, '--scrim-opacity': s.scrim / 100 } as any}
              >
                {/* Layer 1: Photo / Video */}
                <div className="jt-slide__layer jt-slide__layer--photo">
                  {s.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={s.image.src}
                      srcSet={s.image.srcSet}
                      sizes="100vw"
                      width={s.image.width}
                      height={s.image.height}
                      alt={isActive ? s.image.alt : ''}
                      loading={k === 0 ? 'eager' : 'lazy'}
                      decoding={k === 0 ? 'sync' : 'async'}
                      {...(k === 0 ? { fetchPriority: 'high' as const } : {})}
                    />
                  )}
                  {isActive && s.kind === 'youtube' && s.youtubeId && videoShown && (
                    <iframe
                      className="jt-slide__video"
                      src={ytEmbedUrl(s.youtubeId, { background: true })}
                      title={s.headline}
                      allow="autoplay; encrypted-media"
                      tabIndex={-1}
                      aria-hidden="true"
                      loading="lazy"
                    />
                  )}
                </div>

                {/* Layer 2: Scrim gradient */}
                <div className="jt-slide__layer jt-slide__layer--scrim" />

                {/* Layer 3: Text content */}
                <div className="jt-wrap jt-slide__layer jt-slide__layer--text">
                  <div className="jt-slide__content">
                    {s.eyebrow && <div className="jt-slide__eyebrow">{s.eyebrow}</div>}

                    <h2 className="jt-slide__headline">
                      {s.headlineLines.map((line, idx) => (
                        <span key={idx} className="jt-slide__line-wrap">
                          <span className="jt-slide__line" style={{ transitionDelay: `${idx * 90}ms` }}>
                            {line}
                          </span>
                        </span>
                      ))}
                    </h2>

                    {s.text && <p className="jt-slide__text">{s.text}</p>}

                    {s.tagline && <p className="jt-slide__tagline">{s.tagline}</p>}

                    {s.chips && s.chips.length > 0 && (
                      <ul className="jt-slide__chips" aria-label="Highlights">
                        {s.chips.map((chip, cIdx) => (
                          <li key={cIdx}>{chip}</li>
                        ))}
                      </ul>
                    )}

                    <div className="jt-slide__cta">
                      {s.cta && (
                        <Link href={s.cta.href} className="jt-btn jt-btn--gold" tabIndex={isActive ? 0 : -1}>
                          {s.cta.label} <IconArrow size={18} />
                        </Link>
                      )}
                      {s.cta2 && (
                        <Link href={s.cta2.href} className="jt-btn jt-btn--ghost-cream" tabIndex={isActive ? 0 : -1}>
                          {s.cta2.label}
                        </Link>
                      )}
                    </div>
                  </div>

                  {s.showContact && (
                    <div className="jt-slide__contact">
                      <a href={`tel:${cleanPhone}`}>
                        <span>WhatsApp / Call:</span> {contact.phone}
                      </a>
                      <a href={`mailto:${contact.email}`}>{contact.email}</a>
                      <a href={`https://${contact.website}`} target="_blank" rel="noopener noreferrer">
                        {contact.website}
                      </a>
                    </div>
                  )}
                </div>

                {/* Layer 4: Optional animal cutout */}
                {s.cutout && (
                  <div className="jt-slide__layer jt-slide__layer--cutout">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.cutout.src} alt={s.cutout.alt} loading="lazy" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {n > 1 && (
        <div className="jt-hero__controls">
          <div className="jt-wrap jt-hero__controls-in">
            <ol className="jt-prog" aria-label={t('hero.choose')}>
              {slides.map((s, k) => (
                <li key={k}>
                  <button type="button" onClick={() => go(k)} aria-label={t('hero.slideN', { n: k + 1 })} aria-current={k === i}>
                    <span className="jt-prog__bar">
                      <span
                        className={`jt-prog__fill${k === i && autoplay && !reduced ? ' is-run' : ''}${k < i ? ' is-done' : ''}`}
                        style={{ animationDuration: `${s.duration}s`, animationPlayState: running ? 'running' : 'paused' }}
                        onAnimationEnd={() => k === i && next()}
                      />
                    </span>
                  </button>
                </li>
              ))}
            </ol>
            <div className="jt-hero__btns">
              <span className="jt-hero__count" aria-hidden="true">
                {String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
              </span>
              {autoplay && !reduced && (
                <button
                  type="button"
                  className="jt-round"
                  onClick={() => setUserPaused(!userPaused)}
                  aria-pressed={userPaused}
                  aria-label={userPaused ? t('hero.play') : t('hero.pause')}
                >
                  {userPaused ? <IconPlay size={16} /> : <IconPause size={16} />}
                </button>
              )}
              <button type="button" className="jt-round" onClick={prev} aria-label={t('hero.prev')}>
                <IconArrowLeft size={18} />
              </button>
              <button type="button" className="jt-round" onClick={next} aria-label={t('hero.next')}>
                <IconArrow size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
      <p className="jt-sr" aria-live="polite">
        {t('hero.slideOf', { n: i + 1, total: n })}
      </p>
    </section>
  )
}
