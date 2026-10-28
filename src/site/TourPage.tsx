import React from 'react'
import Link from 'next/link'
import type { Offer, Tour } from '@/payload-types'
import type { SiteContext } from '@/lib/site'
import {
  getActiveOffers,
  getPayloadClient,
  getSeasons,
  getUpcomingDepartures,
  findTours,
} from '@/lib/site'
import { makeT } from '@/i18n'
import { buildCountryList } from '@/lib/countries'
import {
  cheapestFrom,
  highestPrice,
  discountLabel,
  applyDiscount,
  type OfferLite,
} from '@/lib/pricing'
import { docPath, withLocale } from '@/lib/routes'
import { asMedia, absoluteUrl, mediaUrl } from '@/lib/media'
import { parseYouTubeId, ytEmbedUrl, ytThumbnail, ytWatchUrl } from '@/lib/youtube'
import {
  breadcrumbNode,
  faqNode,
  graph,
  imageNode,
  organizationNode,
  tourNode,
  videoNode,
  webPageNode,
} from '@/lib/schema'
import { Breadcrumbs } from './Breadcrumbs'
import { Img } from './Img'
import { JsonLd } from './JsonLd'
import { Tabs, type TabDef } from './Tabs'
import { BookingPanel } from './BookingPanel'
import { SideCard, MobileBar } from './SideCard'
import { GalleryGrid, VideoList, type VideoData } from './Gallery'
import { TourCard, priceRowsOf, variantOf, fmtDate } from './Cards'
import { SectionHead, TrustStrip, imgData, longDate, paragraphs, trustLines } from './helpers'
import { IconCheck, IconWheelchair, IconX, IconTag, IconClock, IconPin } from './Icons'

export const offerLite = (o: Offer): OfferLite => ({
  id: o.id,
  discountType: o.discountType as any,
  discountValue: o.discountValue,
  validFrom: o.validFrom,
  validUntil: o.validUntil,
  minGuests: o.minGuests,
  travelFrom: o.travelFrom,
  travelUntil: o.travelUntil,
})

export const baseOrg = (ctx: SiteContext) =>
  organizationNode({
    origin: ctx.origin,
    name: (ctx.company?.companyName as string) || 'JaeTravel Expeditions',
    logo: absoluteUrl(ctx.origin, ctx.logoUrl),
    email: ctx.site?.contactEmail,
    telephone: ctx.company?.phoneNumber,
    tagline: ctx.company?.tagline || undefined,
    address: ctx.company?.address as any,
    geo: ctx.company?.geo as any,
    sameAs: (ctx.site?.social || []).map((s: any) => s.url),
    areaServed: ['KE', 'TZ', 'UG', 'RW'],
    openingHours: ctx.company?.openingHours || undefined,
  })

const DEFAULT_SECTIONS = [
  'facts',
  'highlights',
  'tabs',
  'whyCheaper',
  'accessibility',
  'bestTime',
  'faq',
  'similar',
]
const DEFAULT_TABS = ['itinerary', 'booking', 'inclusions', 'exclusions', 'gallery', 'videos']

export async function getTemplateFor(variant: string) {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'templates',
    where: { variant: { equals: variant } },
    limit: 1,
    depth: 0,
  })
  return res.docs[0] || null
}

export async function TourPage({ ctx, tour }: { ctx: SiteContext; tour: Tour }) {
  const { locale, routes, site, origin } = ctx
  const t = makeT(ctx.dict)
  const template: any = typeof tour.template === 'object' ? tour.template : null
  const variant = variantOf(tour)
  const [seasons, departures, offers] = await Promise.all([
    getSeasons(locale),
    getUpcomingDepartures(locale, { tourId: tour.id, limit: 6 }),
    getActiveOffers(locale, { tourId: tour.id, limit: 1 }),
  ])
  const offer = offers[0] || null
  const rows = priceRowsOf(tour)
  const from = cheapestFrom(rows)
  const countries = buildCountryList(locale)
  const url = `${origin}/${locale}${docPath(routes, 'tours', tour)}`
  const path = docPath(routes, 'tours', tour)
  const routeKeyLabel =
    routes[
      variant === 'accessible'
        ? 'disabilityTours'
        : variant === 'budget'
          ? 'budgetTours'
          : variant === 'migration'
            ? 'migrationTours'
            : 'tours'
    ]
  const crumbs = [
    { name: t('breadcrumb.home'), href: `/${locale}` },
    { name: routeKeyLabel.label, href: withLocale(locale, `/${routeKeyLabel.prefix}`) },
    { name: tour.title },
  ]
  const dest: any = typeof tour.destination === 'object' ? tour.destination : null
  const sections: { key: string; enabled?: boolean; title?: string | null }[] = (
    template?.sections?.length
      ? template.sections
      : DEFAULT_SECTIONS.map((key) => ({ key, enabled: true }))
  ).filter((s: any) => s.enabled !== false)
  const tabCfg: { key: string; enabled?: boolean; title?: string | null }[] = (
    template?.tabs?.length ? template.tabs : DEFAULT_TABS.map((key) => ({ key, enabled: true }))
  ).filter((x: any) => x.enabled !== false)

  // ---- tabs ----
  const days: any[] = tour.itinerary || []
  const included = (tour.included || []).map((x: any) => x.text).filter(Boolean)
  const excluded = (tour.excluded || []).map((x: any) => x.text).filter(Boolean)
  const gallery = (tour.gallery || [])
    .map((g: any) => ({ ...imgData(g.image, g.caption || tour.title)!, caption: g.caption }))
    .filter((g: any) => g?.src)
  const videos: VideoData[] = (tour.videos || [])
    .map((v: any) => {
      const id = parseYouTubeId(v.youtubeUrl)
      return id
        ? {
            id,
            title: v.title,
            description: v.description,
            poster: ytThumbnail(id),
            watchUrl: ytWatchUrl(id),
            uploadDate: v.uploadDate,
          }
        : null
    })
    .filter(Boolean) as any[]
  const pdf = mediaUrl(tour.itineraryPdf)

  const tabContent: Record<string, React.ReactNode> = {}
  if (days.length)
    tabContent.itinerary = (
      <div>
        <h2>{t('tabs.itinerary')}</h2>
        {days.map((d, i) => {
          const hotel = typeof d.hotel === 'object' ? d.hotel : null
          return (
            <details key={d.id || i} open={i === 0} className="jt-acc">
              <summary>
                <span>{t('itinerary.day', { n: i + 1 })}</span> {d.title}
              </summary>
              <div className="jt-acc__body">
                {paragraphs(d.body).map((p, k) => (
                  <p key={k}>{p}</p>
                ))}
                <ul className="jt-daymeta">
                  {d.driveTime && (
                    <li>
                      <IconClock size={14} /> {d.driveTime}
                    </li>
                  )}
                  {hotel?.name && (
                    <li>
                      <IconPin size={14} /> {hotel.name}
                    </li>
                  )}
                  {(d.meals || []).length > 0 && (
                    <li>{(d.meals as string[]).map((m) => t(`meal.${m}` as any)).join(', ')}</li>
                  )}
                  {variant === 'accessible' && d.mobilityLevel && (
                    <li>
                      <IconWheelchair size={14} /> {t(`mobility.${d.mobilityLevel}` as any)}
                    </li>
                  )}
                </ul>
              </div>
            </details>
          )
        })}
        <p className="jt-actions">
          {pdf && (
            <a className="jt-btn jt-btn--line" href={pdf} download>
              {t('itinerary.download')}
            </a>
          )}
          <Link
            className="jt-btn jt-btn--line"
            href={withLocale(locale, `/itinerary-builder?tour=${tour.slug}`)}
          >
            {t('itinerary.customise')}
          </Link>
        </p>
      </div>
    )
  if (rows.length)
    tabContent.booking = (
      <BookingPanel
        rows={rows}
        seasons={seasons}
        departures={departures.map((d) => ({
          id: d.id,
          start: d.startDate,
          end: d.endDate,
          status: d.status,
          priceCents: d.pricePerSeat,
          href: withLocale(locale, docPath(routes, 'joint-departures', d)),
        }))}
        formProps={{
          type: 'tour',
          countries,
          refs: { tourId: tour.id },
          seasons,
          tours: [{ id: tour.id, title: tour.title, rows }],
          offer: offer ? offerLite(offer) : null,
          minLeadDays: site?.minLeadDays ?? 2,
          hasPdf: !!pdf,
          formId: 'booking-form',
        }}
      />
    )
  if (included.length)
    tabContent.inclusions = (
      <div>
        <h2>{t('inclusions.title')}</h2>
        <ul className="jt-list jt-list--yes">
          {included.map((x: string, i: number) => (
            <li key={i}>
              <IconCheck size={16} />
              <span>{x}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  if (excluded.length)
    tabContent.exclusions = (
      <div>
        <h2>{t('exclusions.title')}</h2>
        <ul className="jt-list jt-list--no">
          {excluded.map((x: string, i: number) => (
            <li key={i}>
              <IconX size={16} />
              <span>{x}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  if (gallery.length)
    tabContent.gallery = (
      <div>
        <h2>{t('tabs.gallery')}</h2>
        <GalleryGrid images={gallery} />
      </div>
    )
  if (videos.length)
    tabContent.videos = (
      <div>
        <h2>{t('tabs.videos')}</h2>
        <VideoList videos={videos} />
      </div>
    )
  const tabs: TabDef[] = tabCfg
    .filter((c) => tabContent[c.key])
    .map((c) => ({
      key: c.key,
      title: c.title || t(`tabs.${c.key}` as any),
      content: tabContent[c.key],
    }))

  // ---- sections ----
  const facts: [string, string][] = []
  facts.push([
    t('facts.duration'),
    t('facts.durationValue', {
      days: tour.durationDays,
      nights: Math.max(tour.durationDays - 1, 0),
    }),
  ])
  const f: any = tour.facts || {}
  if (f.startPoint || f.endPoint)
    facts.push([
      t('facts.startsEnds'),
      [f.startPoint, f.endPoint]
        .filter(Boolean)
        .filter((v, i, a) => a.indexOf(v) === i)
        .join(' → '),
    ])
  if (f.groupSizeMin || f.groupSizeMax)
    facts.push([t('facts.groupSize'), [f.groupSizeMin, f.groupSizeMax].filter(Boolean).join(' – ')])
  if (f.pace) facts.push([t('facts.pace'), t(`pace.${f.pace}` as any)])
  if (tour.bestTime?.[0])
    facts.push([
      t('facts.bestTime'),
      tour.bestTime
        .map((b: any) => b.months)
        .slice(0, 2)
        .join(', '),
    ])
  if (f.guideLanguages) facts.push([t('facts.language'), f.guideLanguages])

  const faq = (tour.faq || []).map((q: any) => ({ question: q.question, answer: q.answer }))
  const similarIds = (tour.relatedTours || []).map((r: any) => (typeof r === 'object' ? r.id : r))
  let similar: Tour[] = []
  const wantsSimilar = sections.some((s) => s.key === 'similar')
  if (wantsSimilar) {
    similar = similarIds.length ? await findTours({ locale, ids: similarIds, limit: 3 }) : []
    if (similar.length < 3) {
      const more = await findTours({
        locale,
        variants: variant === 'standard' ? null : [variant as any],
        excludeId: tour.id,
        limit: 6,
      })
      for (const m of more)
        if (similar.length < 3 && m.id !== tour.id && !similar.find((s) => s.id === m.id))
          similar.push(m)
    }
    if (similar.length < 3) {
      const any = await findTours({ locale, excludeId: tour.id, limit: 6 })
      for (const m of any)
        if (similar.length < 3 && !similar.find((s) => s.id === m.id)) similar.push(m)
    }
  }

  const renderSection = (s: { key: string; title?: string | null }): React.ReactNode => {
    switch (s.key) {
      case 'facts':
        return (
          <dl className="jt-glance" key="facts">
            {facts.map(([k, v], i) => (
              <div key={i}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        )
      case 'highlights':
        return (tour.highlights || []).length ? (
          <section key="highlights" className="jt-block">
            <h2>{s.title || t('highlights.title')}</h2>
            <ul className="jt-list jt-list--yes">
              {tour.highlights!.map((h: any, i: number) => (
                <li key={i}>
                  <IconCheck size={16} />
                  <span>{h.text}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null
      case 'offerBanner':
        return offer ? (
          <Link
            key="offer"
            href={withLocale(locale, docPath(routes, 'offers', offer))}
            className="jt-offerbar"
          >
            <IconTag size={18} />
            <span>
              <strong>{offer.name}</strong> ·{' '}
              {t('offer.validUntil', { date: fmtDate(offer.validUntil, locale) })}
            </span>
          </Link>
        ) : null
      case 'tabs':
        return tabs.length ? (
          <Tabs
            key="tabs"
            tabs={tabs}
            label={t('tabs.aria')}
            initial={tabs.find((x) => x.key === 'itinerary')?.key}
          />
        ) : null
      case 'whyCheaper':
        return tour.whyCheaper ? (
          <section key="why" className="jt-block jt-note-box">
            <h2>{s.title || t('why.cheaper')}</h2>
            <p>{tour.whyCheaper}</p>
          </section>
        ) : null
      case 'accessibility': {
        const a: any = tour.accessibility
        if (!a?.summary && !(a?.features || []).length) return null
        return (
          <section key="access" className="jt-block jt-access">
            <h2>
              <IconWheelchair size={22} /> {s.title || t('access.title')}
            </h2>
            {a.summary && <p>{a.summary}</p>}
            {(a.features || []).length > 0 && (
              <ul className="jt-list jt-list--yes">
                {a.features.map((x: any, i: number) => (
                  <li key={i}>
                    <IconCheck size={16} />
                    <span>{x.text}</span>
                  </li>
                ))}
              </ul>
            )}
            {typeof a.vehicle === 'object' && a.vehicle && (
              <p>
                <Link href={withLocale(locale, docPath(routes, 'vehicles', a.vehicle))}>
                  {a.vehicle.name}
                </Link>
              </p>
            )}
          </section>
        )
      }
      case 'bestTime':
        return (tour.bestTime || []).length ? (
          <section key="best" className="jt-block">
            <h2>{s.title || t('bestTime.title', { place: dest?.name || tour.title })}</h2>
            <div className="jt-tablewrap">
              <table className="jt-table jt-table--simple">
                <thead>
                  <tr>
                    <th scope="col">{t('bestTime.months')}</th>
                    <th scope="col">{t('bestTime.conditions')}</th>
                    <th scope="col">{t('bestTime.prices')}</th>
                  </tr>
                </thead>
                <tbody>
                  {tour.bestTime!.map((b: any, i: number) => (
                    <tr key={i}>
                      <th scope="row">{b.months}</th>
                      <td>{b.conditions}</td>
                      <td>{b.priceLevel}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null
      case 'faq':
        return faq.length ? (
          <section key="faq" className="jt-block">
            <h2>{s.title || t('faq.title')}</h2>
            {faq.map((q, i) => (
              <details key={i} className="jt-acc">
                <summary>{q.question}</summary>
                <div className="jt-acc__body">
                  <p>{q.answer}</p>
                </div>
              </details>
            ))}
          </section>
        ) : null
      default:
        return null
    }
  }

  const heroImg = imgData(tour.heroImage, tour.title)
  const sideLines = trustLines(site, t)
  const mainSections = sections.filter((s) => s.key !== 'similar')
  const trust = (site?.trust || []).map((x: any) => x.text).filter(Boolean)

  // ---- structured data ----
  const images = [heroImg?.full, ...gallery.slice(0, 5).map((g: any) => g.full)]
    .filter(Boolean)
    .map((u) => absoluteUrl(origin, u as string))
  const desc = (tour.seo as any)?.description || tour.summary
  const nodes = [
    baseOrg(ctx),
    webPageNode({
      url,
      name: tour.title,
      description: desc,
      locale,
      origin,
      image: images[0],
      modified: tour.updatedAt,
    }),
    breadcrumbNode(
      url,
      crumbs.map((c, i) => ({
        name: c.name,
        url: i < crumbs.length - 1 ? `${origin}${c.href}` : undefined,
      })),
    ),
    tourNode({
      origin,
      url,
      name: tour.title,
      description: tour.summary,
      sku: `JT-${tour.slug}`,
      images,
      itinerary: days.map((d, i) => ({
        name: `${t('itinerary.day', { n: i + 1 })}: ${d.title}`,
        description: paragraphs(d.body)[0],
      })),
      lowCents: from,
      highCents: highestPrice(rows),
      offerCount: rows.length * 4,
      validUntil: tour.pricing?.validUntil ? String(tour.pricing.validUntil).slice(0, 10) : null,
      touristTypes:
        variant === 'accessible'
          ? ['Travellers who use wheelchairs', 'Travellers with limited mobility']
          : undefined,
      offer:
        offer && from != null
          ? {
              name: offer.name,
              url: `${origin}/${locale}${docPath(routes, 'offers', offer)}`,
              fromCents: applyDiscount(from, offerLite(offer)),
              validUntil: String(offer.validUntil).slice(0, 10),
            }
          : null,
    }),
    heroImg
      ? imageNode({
          url: absoluteUrl(origin, heroImg.full),
          caption: tour.title,
          creditText: (asMedia(tour.heroImage) as any)?.creditText,
          copyright: (asMedia(tour.heroImage) as any)?.copyrightNotice,
          width: heroImg.width,
          height: heroImg.height,
          origin,
        })
      : null,
    ...videos.map((v: any) =>
      videoNode({
        name: v.title,
        description: v.description || tour.summary,
        thumbnail: v.poster,
        uploadDate: (v.uploadDate || tour.createdAt).slice(0, 10),
        embedUrl: ytEmbedUrl(v.id).split('?')[0],
        pageUrl: url,
      }),
    ),
    site?.seo?.enableFaqSchema !== false ? faqNode(url, faq) : null,
  ]

  return (
    <article className="jt-tour">
      <JsonLd data={graph(...nodes)} />
      <div className="jt-wrap">
        <Breadcrumbs items={crumbs} label={t('breadcrumb.label')} />
        <header className="jt-head">
          <div>
            <h1>{tour.title}</h1>
            <ul className="jt-badges">
              <li>{t('card.days', { n: tour.durationDays })}</li>
              {dest?.name && <li>{dest.name}</li>}
              {variant === 'accessible' && (
                <li className="is-acc">
                  <IconWheelchair size={14} /> {t('variant.accessible')}
                </li>
              )}
              {variant === 'budget' && <li>{t('variant.budget')}</li>}
              {variant === 'migration' && <li>{t('variant.migration')}</li>}
            </ul>
            <p className="jt-head__lead">{tour.summary}</p>
            <p className="jt-head__upd">
              {t('page.updated', { date: longDate(tour.updatedAt, locale) })}
            </p>
          </div>
          <div className="jt-head__img">
            {heroImg && (
              <Img
                media={tour.heroImage}
                alt={tour.title}
                sizes="(min-width:1000px) 45vw, 100vw"
                priority
              />
            )}
          </div>
        </header>
        <TrustStrip items={trust} />
        <div className="jt-layout">
          <div className="jt-main">
            {offer &&
              !sections.some((s) => s.key === 'offerBanner') &&
              renderSection({ key: 'offerBanner' })}
            {mainSections.map((s) => renderSection(s))}
          </div>
          <div className="jt-sidecol">
            <SideCard
              fromCents={from}
              lines={sideLines}
              askHref={withLocale(locale, `/contact?tour=${tour.slug}`)}
            />
          </div>
        </div>
      </div>
      {similar.length > 0 && (
        <section className="jt-section jt-section--tint">
          <div className="jt-wrap">
            <SectionHead
              title={sections.find((s) => s.key === 'similar')?.title || t('similar.title')}
            />
            <div className="jt-grid jt-grid--3">
              {similar.slice(0, 3).map((s) => (
                <TourCard key={s.id} tour={s} routes={routes} locale={locale} t={t} />
              ))}
            </div>
          </div>
        </section>
      )}
      <MobileBar fromCents={from} />
    </article>
  )
}
