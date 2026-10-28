'use client'
import React, { useEffect, useRef, useState } from 'react'
import { useI18n } from '@/i18n/client'
import { IconArrow, IconArrowLeft, IconClose, IconPlay } from './Icons'
import { ytEmbedUrl } from '@/lib/youtube'

export type GalleryImage = { src: string; srcSet?: string; full: string; width?: number; height?: number; alt: string; caption?: string | null }

export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const { t } = useI18n()
  const ref = useRef<HTMLDialogElement>(null)
  const [cur, setCur] = useState(0)
  const open = (i: number) => {
    setCur(i)
    ref.current?.showModal()
  }
  const step = (d: number) => setCur((c) => (c + d + images.length) % images.length)
  useEffect(() => {
    const dlg = ref.current
    if (!dlg) return
    const onKey = (e: KeyboardEvent) => {
      if (!dlg.open) return
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length])
  if (!images.length) return null
  const img = images[cur]
  return (
    <>
      <ul className="jt-gal">
        {images.map((im, i) => (
          <li key={i}>
            <button type="button" onClick={() => open(i)} aria-label={`${t('gallery.open')}: ${im.alt}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={im.src} srcSet={im.srcSet} sizes="(min-width:900px) 33vw, 50vw" width={im.width} height={im.height} alt={im.alt} loading="lazy" decoding="async" />
            </button>
          </li>
        ))}
      </ul>
      <dialog ref={ref} className="jt-lightbox" aria-label={img.alt} onClick={(e) => e.target === ref.current && ref.current?.close()}>
        <div className="jt-lightbox__in">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img.full} alt={img.alt} />
          <p>{img.caption || img.alt}</p>
          <div className="jt-lightbox__btns">
            <button type="button" className="jt-round" onClick={() => step(-1)} aria-label={t('hero.prev')}>
              <IconArrowLeft size={18} />
            </button>
            <button type="button" className="jt-round" onClick={() => step(1)} aria-label={t('hero.next')}>
              <IconArrow size={18} />
            </button>
            <button type="button" className="jt-round" onClick={() => ref.current?.close()} aria-label={t('gallery.close')}>
              <IconClose size={18} />
            </button>
          </div>
        </div>
      </dialog>
    </>
  )
}

export type VideoData = { id: string; title: string; description?: string | null; poster: string; watchUrl: string }

/** Shows a poster. The YouTube player is only loaded after the visitor presses play. */
export function YouTubePlayer({ video, className }: { video: VideoData; className?: string }) {
  const { t } = useI18n()
  const [on, setOn] = useState(false)
  return (
    <div className={`jt-video${className ? ' ' + className : ''}`}>
      {on ? (
        <iframe src={ytEmbedUrl(video.id, { autoplay: true })} title={video.title} allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen />
      ) : (
        <button type="button" onClick={() => setOn(true)} aria-label={`${t('videos.play')}: ${video.title}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={video.poster} alt="" loading="lazy" decoding="async" width={480} height={360} />
          <span className="jt-video__play">
            <IconPlay size={28} />
          </span>
          <span className="jt-video__title">{video.title}</span>
        </button>
      )}
    </div>
  )
}

export function VideoList({ videos }: { videos: VideoData[] }) {
  const { t } = useI18n()
  return (
    <ul className="jt-videos">
      {videos.map((v) => (
        <li key={v.id}>
          <YouTubePlayer video={v} />
          {v.description && <p>{v.description}</p>}
          <a href={v.watchUrl} target="_blank" rel="noopener" className="jt-link-sm">
            {t('videos.watchOn')}
          </a>
        </li>
      ))}
    </ul>
  )
}

export type MediaItem = { kind: 'photo' | 'video'; title: string; caption?: string | null; image: GalleryImage; video?: VideoData }

export function MediaGalleryClient({ items }: { items: MediaItem[] }) {
  const { t } = useI18n()
  const [filter, setFilter] = useState<'all' | 'photo' | 'video'>('all')
  const [playing, setPlaying] = useState<VideoData | null>(null)
  const ref = useRef<HTMLDialogElement>(null)
  const photos = items.filter((i) => i.kind === 'photo')
  const [lb, setLb] = useState(0)
  const lbRef = useRef<HTMLDialogElement>(null)
  const shown = items.filter((i) => filter === 'all' || i.kind === filter)
  const hasVideos = items.some((i) => i.kind === 'video')

  const openItem = (it: MediaItem) => {
    if (it.kind === 'video' && it.video) {
      setPlaying(it.video)
      ref.current?.showModal()
    } else {
      setLb(photos.indexOf(it))
      lbRef.current?.showModal()
    }
  }
  const step = (d: number) => setLb((c) => (c + d + photos.length) % photos.length)
  const cur = photos[lb]

  return (
    <div className="jt-mg">
      {hasVideos && (
        <div className="jt-filters" role="group" aria-label={t('gallery.filter')}>
          {(['all', 'photo', 'video'] as const).map((f) => (
            <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)}>
              {t(`gallery.${f}` as any)}
            </button>
          ))}
        </div>
      )}
      <ul className="jt-gal jt-gal--masonry">
        {shown.map((it, i) => (
          <li key={i}>
            <button type="button" onClick={() => openItem(it)} aria-label={`${it.kind === 'video' ? t('videos.play') : t('gallery.open')}: ${it.title}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.image.src} srcSet={it.image.srcSet} sizes="(min-width:900px) 33vw, 50vw" width={it.image.width} height={it.image.height} alt={it.image.alt} loading="lazy" decoding="async" />
              {it.kind === 'video' && (
                <span className="jt-video__play">
                  <IconPlay size={26} />
                </span>
              )}
              <span className="jt-gal__cap">{it.title}</span>
            </button>
          </li>
        ))}
      </ul>
      <dialog ref={ref} className="jt-lightbox jt-lightbox--video" aria-label={playing?.title} onClose={() => setPlaying(null)} onClick={(e) => e.target === ref.current && ref.current?.close()}>
        <div className="jt-lightbox__in">
          {playing && <iframe src={ytEmbedUrl(playing.id, { autoplay: true })} title={playing.title} allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen />}
          <button type="button" className="jt-round jt-lightbox__x" onClick={() => ref.current?.close()} aria-label={t('gallery.close')}>
            <IconClose size={18} />
          </button>
        </div>
      </dialog>
      <dialog ref={lbRef} className="jt-lightbox" aria-label={cur?.image.alt} onClick={(e) => e.target === lbRef.current && lbRef.current?.close()}>
        {cur && (
          <div className="jt-lightbox__in">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cur.image.full} alt={cur.image.alt} />
            <p>{cur.caption || cur.title}</p>
            <div className="jt-lightbox__btns">
              <button type="button" className="jt-round" onClick={() => step(-1)} aria-label={t('hero.prev')}>
                <IconArrowLeft size={18} />
              </button>
              <button type="button" className="jt-round" onClick={() => step(1)} aria-label={t('hero.next')}>
                <IconArrow size={18} />
              </button>
              <button type="button" className="jt-round" onClick={() => lbRef.current?.close()} aria-label={t('gallery.close')}>
                <IconClose size={18} />
              </button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  )
}
