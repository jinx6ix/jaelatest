import React from 'react'
import Link from 'next/link'
import type { SiteContext } from '@/lib/site'
import { findTours, getActiveOffers, getDestinations, getGalleryItems, getPosts, getUpcomingDepartures, getVehicles } from '@/lib/site'
import { makeT } from '@/i18n'
import { resolveLink, withLocale } from '@/lib/routes'
import { buildCountryList } from '@/lib/countries'
import { parseYouTubeId, ytThumbnail, ytWatchUrl } from '@/lib/youtube'
import { mediaUrl, mediaSrcSet, asMedia } from '@/lib/media'
import { faqNode, graph } from '@/lib/schema'
import RichText from '@/components/RichText'
import { RenderBlocks as RenderLegacyBlocks } from '@/blocks/RenderBlocks'
import { HeroSlider, type HeroSlideData } from './HeroSlider'
import { DepartureRow, DestinationCard, OfferCard, PostCard, TourCard, VehicleCard } from './Cards'
import { Img } from './Img'
import { JsonLd } from './JsonLd'
import { SectionHead, imgData } from './helpers'
import { ICONS, IconArrow, IconWhatsApp } from './Icons'
import { InquiryForm } from './InquiryForm'
import { MediaGalleryClient, type MediaItem } from './Gallery'

type B = { ctx: SiteContext; block: any }

const linkOf = (l: any, ctx: SiteContext) => (l?.label ? { label: l.label as string, href: resolveLink(l, ctx.locale, ctx.routes) } : null)

/* ------------------------------------------------------------------ home */
export async function HomeHeroBlock({ ctx, block }: B) {
  const slides: HeroSlideData[] = (block.slides || []).map((s: any) => {
    const img = imgData(s.image, s.headline)
    const yt = s.kind === 'youtube' ? parseYouTubeId(s.youtubeUrl) : null
    return {
      kind: yt ? 'youtube' : 'image',
      image: img ? { src: img.full, srcSet: mediaSrcSet(s.image), width: img.width, height: img.height, alt: img.alt || s.headline } : null,
      youtubeId: yt,
      headline: s.headline,
      text: s.text,
      caption: s.caption,
      cta: linkOf(s.cta, ctx),
      cta2: linkOf(s.secondaryCta, ctx),
      duration: s.durationSeconds || block.autoplaySeconds || 7,
    }
  })
  if (!slides.length) return null
  return <HeroSlider slides={slides} autoplay={(block.autoplaySeconds ?? 7) > 0} />
}

export async function TripFinderBlock({ ctx }: B) {
  const t = makeT(ctx.dict)
  const dests = await getDestinations(ctx.locale)
  return (
    <div className="jt-wrap jt-finderwrap">
      <form className="jt-finder" method="get" action={withLocale(ctx.locale, `/${ctx.routes.tours.prefix}`)} role="search" aria-label={t('finder.label')}>
        <label>
          <span>{t('finder.destination')}</span>
          <select name="destination" defaultValue="">
            <option value="">{t('finder.any')}</option>
            {dests.map((d) => (
              <option key={d.id} value={d.slug || ''}>
                {d.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>{t('finder.length')}</span>
          <select name="length" defaultValue="">
            <option value="">{t('finder.anyLength')}</option>
            <option value="short">{t('finder.len.short')}</option>
            <option value="mid">{t('finder.len.mid')}</option>
            <option value="long">{t('finder.len.long')}</option>
          </select>
        </label>
        <label>
          <span>{t('finder.needs')}</span>
          <select name="type" defaultValue="">
            <option value="">{t('finder.standard')}</option>
            <option value="accessible">{t('finder.wheelchair')}</option>
            <option value="budget">{t('variant.budget')}</option>
            <option value="migration">{t('variant.migration')}</option>
          </select>
        </label>
        <button className="jt-btn jt-btn--brand" type="submit">
          {t('finder.submit')} <IconArrow size={18} />
        </button>
      </form>
    </div>
  )
}

export async function WaysToTravelBlock({ ctx, block }: B) {
  return (
    <section className="jt-section">
      <div className="jt-wrap">
        <SectionHead title={block.title} subtitle={block.subtitle} />
        <div className="jt-ways">
          {(block.tiles || []).map((tile: any, i: number) => {
            const Icon = ICONS[tile.icon || 'compass'] || ICONS.compass
            const href = resolveLink(tile.link, ctx.locale, ctx.routes)
            return (
              <Link key={i} href={href} className={`jt-way jt-way--${tile.tone || 'brand'}`}>
                <span className="jt-way__icon">
                  <Icon size={30} />
                </span>
                <h3>{tile.title}</h3>
                {tile.text && <p>{tile.text}</p>}
                <span className="jt-way__go">
                  {tile.link?.label} <IconArrow size={16} />
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export async function ToursRailBlock({ ctx, block }: B) {
  const t = makeT(ctx.dict)
  const limit = block.limit || 4
  const tours =
    block.source === 'manual'
      ? await findTours({ locale: ctx.locale, ids: (block.tours || []).map((x: any) => (typeof x === 'object' ? x.id : x)), limit })
      : block.source === 'variant' && block.variant
        ? await findTours({ locale: ctx.locale, variants: [block.variant], limit })
        : await findTours({ locale: ctx.locale, featured: true, limit })
  if (!tours.length) return null
  const all = linkOf(block.viewAll, ctx)
  return (
    <section className="jt-section jt-section--tint">
      <div className="jt-wrap">
        <SectionHead
          title={block.title}
          subtitle={block.subtitle}
          action={
            all && (
              <Link href={all.href} className="jt-btn jt-btn--line">
                {all.label}
              </Link>
            )
          }
        />
        <div className="jt-grid jt-grid--4">
          {tours.slice(0, limit).map((x) => (
            <TourCard key={x.id} tour={x} routes={ctx.routes} locale={ctx.locale} t={t} />
          ))}
        </div>
      </div>
    </section>
  )
}

export async function DeparturesBandBlock({ ctx, block }: B) {
  const t = makeT(ctx.dict)
  const deps = await getUpcomingDepartures(ctx.locale, { limit: block.limit || 4 })
  if (!deps.length) return null
  return (
    <section className="jt-section jt-band">
      <div className="jt-wrap">
        <SectionHead
          title={block.title}
          subtitle={block.subtitle}
          action={
            <Link href={withLocale(ctx.locale, `/${ctx.routes.joinInTours.prefix}`)} className="jt-btn jt-btn--dark">
              {t('home.viewAllDepartures')}
            </Link>
          }
        />
        <ul className="jt-deplist jt-deplist--band">
          {deps.map((d) => (
            <DepartureRow key={d.id} dep={d} routes={ctx.routes} locale={ctx.locale} t={t} />
          ))}
        </ul>
      </div>
    </section>
  )
}

export async function OffersRailBlock({ ctx, block }: B) {
  const t = makeT(ctx.dict)
  const offers = await getActiveOffers(ctx.locale, { limit: block.limit || 3 })
  if (!offers.length) return null
  const all = linkOf(block.viewAll, ctx)
  return (
    <section className="jt-section">
      <div className="jt-wrap">
        <SectionHead
          title={block.title}
          action={
            all && (
              <Link href={all.href} className="jt-btn jt-btn--line">
                {all.label}
              </Link>
            )
          }
        />
        <div className="jt-grid jt-grid--3">
          {offers.slice(0, block.limit || 3).map((o) => (
            <OfferCard key={o.id} offer={o} routes={ctx.routes} locale={ctx.locale} t={t} />
          ))}
        </div>
      </div>
    </section>
  )
}

export async function DestinationsRailBlock({ ctx, block }: B) {
  const t = makeT(ctx.dict)
  const dests = (await getDestinations(ctx.locale)).filter((d) => d.image)
  if (!dests.length) return null
  return (
    <section className="jt-section">
      <div className="jt-wrap">
        <SectionHead title={block.title} subtitle={block.subtitle} />
        <div className="jt-dests">
          {dests.map((d) => (
            <DestinationCard key={d.id} dest={d} locale={ctx.locale} routes={ctx.routes} t={t} />
          ))}
        </div>
      </div>
    </section>
  )
}

export async function ValuePropsBlock({ block }: B) {
  return (
    <section className="jt-section jt-section--tint">
      <div className="jt-wrap jt-why">
        <div>
          <h2>{block.title}</h2>
          {block.text && <p>{block.text}</p>}
        </div>
        <div className="jt-facts">
          {(block.items || []).map((it: any, i: number) => (
            <div key={i}>
              <h3>{it.title}</h3>
              <p>{it.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export async function CtaBannerBlock({ ctx, block }: B) {
  const cta = linkOf(block.cta, ctx)
  return (
    <section className="jt-section">
      <div className="jt-wrap">
        <div className="jt-cta">
          <div>
            <h2>{block.title}</h2>
            {block.text && <p>{block.text}</p>}
          </div>
          {cta && (
            <Link href={cta.href} className="jt-btn jt-btn--dark">
              {cta.label} <IconArrow size={18} />
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}

export async function BlogRailBlock({ ctx, block }: B) {
  const posts = await getPosts(ctx.locale, block.limit || 3)
  if (!posts.length) return null
  const t = makeT(ctx.dict)
  return (
    <section className="jt-section">
      <div className="jt-wrap">
        <SectionHead
          title={block.title}
          action={
            <Link href={withLocale(ctx.locale, `/${ctx.routes.blog.prefix}`)} className="jt-btn jt-btn--line">
              {t('home.allPosts')}
            </Link>
          }
        />
        <div className="jt-grid jt-grid--3">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} routes={ctx.routes} locale={ctx.locale} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ generic pages */
export async function PageHeaderBlock({ ctx, block }: B) {
  const t = makeT(ctx.dict)
  return (
    <section className="jt-pagehead">
      <div className="jt-wrap">
        <nav aria-label={t('breadcrumb.label')} className="jt-crumbs">
          <ol>
            <li>
              <Link href={`/${ctx.locale}`}>{t('breadcrumb.home')}</Link>
            </li>
            <li>
              <span aria-current="page">{block.title}</span>
            </li>
          </ol>
        </nav>
        <h1>{block.title}</h1>
        {block.text && <p>{block.text}</p>}
      </div>
    </section>
  )
}

export async function RichSectionBlock({ block }: B) {
  const img = imgData(block.image, block.title || '')
  return (
    <section className="jt-section">
      <div className={`jt-wrap jt-split${img ? '' : ' jt-split--single'}${block.imageSide === 'left' ? ' jt-split--rev' : ''}`}>
        <div className="jt-prose">
          {block.title && <h2>{block.title}</h2>}
          {block.content && <RichText data={block.content} enableGutter={false} />}
        </div>
        {img && (
          <div className="jt-split__img">
            <Img media={block.image} alt={img.alt} sizes="(min-width:900px) 45vw, 100vw" />
          </div>
        )}
      </div>
    </section>
  )
}

export async function StatsStripBlock({ block }: B) {
  return (
    <section className="jt-stats">
      <div className="jt-wrap">
        <dl>
          {(block.items || []).map((s: any, i: number) => (
            <div key={i}>
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

export async function FaqSectionBlock({ ctx, block }: B) {
  const items = (block.items || []).map((q: any) => ({ question: q.question, answer: q.answer }))
  return (
    <section className="jt-section jt-section--tint">
      <div className="jt-wrap jt-wrap--narrow">
        <h2>{block.title}</h2>
        {items.map((q: any, i: number) => (
          <details key={i} className="jt-acc">
            <summary>{q.question}</summary>
            <div className="jt-acc__body">
              <p>{q.answer}</p>
            </div>
          </details>
        ))}
        {ctx.site?.seo?.enableFaqSchema !== false && <JsonLd data={graph(faqNode(`${ctx.origin}/${ctx.locale}`, items))} />}
      </div>
    </section>
  )
}

export async function ContactSectionBlock({ ctx, block }: B) {
  const t = makeT(ctx.dict)
  const c: any = ctx.company
  const number = String(ctx.site?.whatsappNumber || '').replace(/\D/g, '')
  const addr = [c?.address?.street, c?.address?.city, c?.address?.region].filter(Boolean).join(', ')
  return (
    <section className="jt-section">
      <div className="jt-wrap jt-contact">
        <div>
          <h2>{block.title}</h2>
          {block.text && <p>{block.text}</p>}
          <ul className="jt-contact__list">
            {ctx.site?.contactEmail && (
              <li>
                <strong>{t('contact.email')}</strong> <a href={`mailto:${ctx.site.contactEmail}`}>{ctx.site.contactEmail}</a>
              </li>
            )}
            {c?.phoneNumber && (
              <li>
                <strong>{t('contact.phone')}</strong> <a href={`tel:${String(c.phoneNumber).replace(/\s/g, '')}`}>{c.phoneNumber}</a>
              </li>
            )}
            {addr && (
              <li>
                <strong>{t('contact.address')}</strong> {addr}
              </li>
            )}
            {c?.openingHours && (
              <li>
                <strong>{t('contact.hours')}</strong> {c.openingHours}
              </li>
            )}
          </ul>
          {number && (
            <a className="jt-btn jt-btn--wa" href={`https://wa.me/${number}`} target="_blank" rel="noopener">
              <IconWhatsApp size={20} /> {t('whatsapp.cta')}
            </a>
          )}
        </div>
        <div className="jt-formcard">
          <h3>{t('contact.formTitle')}</h3>
          <InquiryForm type="general" countries={buildCountryList(ctx.locale)} minLeadDays={0} askDate={false} askTravellers={false} messageLabelKey="contact.message" submitKey="contact.send" formId="contact-form" />
        </div>
      </div>
    </section>
  )
}

export async function VehicleGridBlock({ ctx, block }: B) {
  const t = makeT(ctx.dict)
  const vs = await getVehicles(ctx.locale)
  if (!vs.length) return null
  return (
    <section className="jt-section">
      <div className="jt-wrap">
        {block.title && <SectionHead title={block.title} />}
        <div className="jt-grid jt-grid--3">
          {vs.map((v) => (
            <VehicleCard key={v.id} v={v} routes={ctx.routes} locale={ctx.locale} t={t} />
          ))}
        </div>
      </div>
    </section>
  )
}

export async function MediaGalleryBlock({ ctx, block }: B) {
  const t = makeT(ctx.dict)
  const items = await getGalleryItems(ctx.locale)
  const data: MediaItem[] = items
    .map((it): MediaItem | null => {
      const img = imgData(it.image, it.title)
      if (!img) return null
      if (it.type === 'video') {
        const id = parseYouTubeId(it.youtubeUrl)
        if (!id) return null
        return { kind: 'video', title: it.title, caption: it.caption, image: img, video: { id, title: it.title, description: it.caption, poster: ytThumbnail(id), watchUrl: ytWatchUrl(id) } }
      }
      return { kind: 'photo', title: it.title, caption: it.caption, image: img }
    })
    .filter(Boolean) as MediaItem[]
  return (
    <section className="jt-section">
      <div className="jt-wrap">
        {block.title && <SectionHead title={block.title} />}
        {data.length ? <MediaGalleryClient items={data} /> : <p className="jt-empty">{t('gallery.empty')}</p>}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ renderer */
const MAP: Record<string, (p: B) => Promise<React.ReactNode> | React.ReactNode> = {
  homeHero: HomeHeroBlock,
  tripFinder: TripFinderBlock,
  waysToTravel: WaysToTravelBlock,
  toursRail: ToursRailBlock,
  departuresBand: DeparturesBandBlock,
  offersRail: OffersRailBlock,
  destinationsRail: DestinationsRailBlock,
  valueProps: ValuePropsBlock,
  ctaBanner: CtaBannerBlock,
  blogRail: BlogRailBlock,
  pageHeader: PageHeaderBlock,
  richSection: RichSectionBlock,
  statsStrip: StatsStripBlock,
  faqSection: FaqSectionBlock,
  contactSection: ContactSectionBlock,
  vehicleGrid: VehicleGridBlock,
  mediaGallery: MediaGalleryBlock,
}

export function RenderSiteBlocks({ blocks, ctx }: { blocks: any[]; ctx: SiteContext }) {
  if (!blocks?.length) return null
  return (
    <>
      {blocks.map((block, i) => {
        const C = MAP[block.blockType]
        if (C) {
          const Comp = C as any
          return <Comp key={block.id || i} ctx={ctx} block={block} />
        }
        return <RenderLegacyBlocks key={block.id || i} blocks={[block]} />
      })}
    </>
  )
}
