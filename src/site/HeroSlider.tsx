'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useI18n } from '@/i18n/client'
import { IconArrow, IconArrowLeft, IconPause, IconPlay } from './Icons'
import { ytEmbedUrl } from '@/lib/youtube'

export type HeroSlideData = {
  kind: 'image' | 'youtube'
  image: { src: string; srcSet?: string; width?: number; height?: number; alt: string } | null
  youtubeId?: string | null
  headline: string
  text?: string | null
  caption?: string | null
  cta?: { label: string; href: string } | null
  cta2?: { label: string; href: string } | null
  duration: number
}

export function HeroSlider({ slides, autoplay }: { slides: HeroSlideData[]; autoplay: boolean }) {
  const { t } = useI18n()
  const [i, setI] = useState(0)
  const [userPaused, setUserPaused] = useState(false)
  const [hoverPaused, setHoverPaused] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [videoOk, setVideoOk] = useState(false)
  const [videoShown, setVideoShown] = useState(false)
  const startX = useRef<number | null>(null)
  const n = slides.length

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onMq = () => setReduced(mq.matches)
    mq.addEventListener?.('change', onMq)
    const conn: any = (navigator as any).connection
    const lite = conn?.saveData || /(^|-)2g$/.test(conn?.effectiveType || '')
    setVideoOk(!mq.matches && !lite && window.innerWidth >= 820)
    const onVis = () => setHidden(document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      mq.removeEventListener?.('change', onMq)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  const go = useCallback((k: number) => {
    setVideoShown(false)
    setI(((k % n) + n) % n)
  }, [n])
  const next = useCallback(() => go(i + 1), [go, i])
  const prev = useCallback(() => go(i - 1), [go, i])

  // Video loads only after the poster has painted, and only for the slide that is showing.
  const active = slides[i]
  const wantVideo = videoOk && active.kind === 'youtube' && !!active.youtubeId
  useEffect(() => {
    if (!wantVideo) return
    const id = window.setTimeout(() => setVideoShown(true), 1400)
    return () => window.clearTimeout(id)
  }, [wantVideo, i])

  const running = autoplay && !reduced && !userPaused && !hoverPaused && !hidden && n > 1

  const onKey = (e: React.KeyboardEvent) => {
    const rtl = document.documentElement.dir === 'rtl'
    if (e.key === 'ArrowRight') (rtl ? prev : next)()
    if (e.key === 'ArrowLeft') (rtl ? next : prev)()
  }

  return (
    <section
      className="jt-hero"
      role="group"
      aria-roledescription="carousel"
      aria-label={t('hero.label')}
      onKeyDown={onKey}
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
      onFocus={() => setHoverPaused(true)}
      onBlur={() => setHoverPaused(false)}
    >
      <div
        className="jt-hero__viewport"
        onPointerDown={(e) => (startX.current = e.clientX)}
        onPointerUp={(e) => {
          if (startX.current == null) return
          const dx = e.clientX - startX.current
          startX.current = null
          if (Math.abs(dx) > 60) (dx < 0 ? next : prev)()
        }}
        onPointerCancel={() => (startX.current = null)}
      >
        <div className="jt-hero__track" style={{ transform: `translate3d(${-i * 100}%,0,0)` }}>
          {slides.map((s, k) => (
            <div
              key={k}
              className={`jt-slide${k === i ? ' is-active' : ''}`}
              role="group"
              aria-roledescription="slide"
              aria-label={t('hero.slideOf', { n: k + 1, total: n })}
              aria-hidden={k !== i}
              style={{ ['--kb' as any]: `${Math.max(s.duration, 6) + 2}s` }}
            >
              <div className="jt-slide__media">
                {s.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={s.image.src}
                    srcSet={s.image.srcSet}
                    sizes="100vw"
                    width={s.image.width}
                    height={s.image.height}
                    alt={k === i ? s.image.alt : ''}
                    loading={k === 0 ? 'eager' : 'lazy'}
                    decoding={k === 0 ? 'sync' : 'async'}
                    {...(k === 0 ? { fetchPriority: 'high' as const } : {})}
                  />
                )}
                {k === i && s.kind === 'youtube' && s.youtubeId && videoShown && (
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
              <div className="jt-slide__scrim" />
              <div className="jt-wrap jt-slide__inner">
                {s.caption && <p className="jt-slide__caption">{s.caption}</p>}
                {k === 0 ? <h1 className="jt-slide__title">{s.headline}</h1> : <p className="jt-slide__title" role="heading" aria-level={2}>{s.headline}</p>}
                {s.text && <p className="jt-slide__text">{s.text}</p>}
                <div className="jt-slide__cta">
                  {s.cta && (
                    <Link href={s.cta.href} className="jt-btn jt-btn--brand" tabIndex={k === i ? 0 : -1}>
                      {s.cta.label} <IconArrow size={18} />
                    </Link>
                  )}
                  {s.cta2 && (
                    <Link href={s.cta2.href} className="jt-btn jt-btn--ghost-light" tabIndex={k === i ? 0 : -1}>
                      {s.cta2.label}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
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
                <button type="button" className="jt-round" onClick={() => setUserPaused(!userPaused)} aria-pressed={userPaused} aria-label={userPaused ? t('hero.play') : t('hero.pause')}>
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
