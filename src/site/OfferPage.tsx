import React from 'react'
import type { Offer, Tour } from '@/payload-types'
import type { SiteContext } from '@/lib/site'
import { getActiveOffers, getSeasons } from '@/lib/site'
import { makeT } from '@/i18n'
import { buildCountryList } from '@/lib/countries'
import { applyDiscount, cheapestFrom, discountLabel } from '@/lib/pricing'
import { docPath, withLocale } from '@/lib/routes'
import { absoluteUrl } from '@/lib/media'
import { breadcrumbNode, graph, offerNode, webPageNode } from '@/lib/schema'
import { Breadcrumbs } from './Breadcrumbs'
import { Img } from './Img'
import { JsonLd } from './JsonLd'
import { Tabs, type TabDef } from './Tabs'
import { BookingPanel } from './BookingPanel'
import { SideCard, MobileBar } from './SideCard'
import { OfferCard, TourCard, priceRowsOf, fmtDate } from './Cards'
import { Money } from './CurrencyProvider'
import { SectionHead, TrustStrip, imgData, paragraphs, trustLines } from './helpers'
import { IconCheck, IconTag } from './Icons'
import { baseOrg, getTemplateFor, offerLite } from './TourPage'

const DEFAULT_TABS = ['details', 'eligible', 'terms', 'booking']

export async function OfferPage({ ctx, offer }: { ctx: SiteContext; offer: Offer }) {
  const { locale, routes, site, origin } = ctx
  const t = makeT(ctx.dict)
  const [seasons, template, others] = await Promise.all([getSeasons(locale), getTemplateFor('offer'), getActiveOffers(locale, { limit: 4 })])
  const tours = (offer.appliesTo || []).filter((x): x is Tour => typeof x === 'object' && x !== null)
  const lite = offerLite(offer)
  const path = docPath(routes, 'offers', offer)
  const url = `${origin}/${locale}${path}`
  const crumbs = [{ name: t('breadcrumb.home'), href: `/${locale}` }, { name: routes.offers.label, href: withLocale(locale, `/${routes.offers.prefix}`) }, { name: offer.name }]
  const label = offer.badgeText || (discountLabel(lite) ? t('offer.discountOff', { amount: discountLabel(lite) as string }) : t('offer.addedValue'))
  const fromBase = tours.length ? Math.min(...tours.map((x) => cheapestFrom(priceRowsOf(x)) ?? Infinity)) : null
  const from = fromBase != null && Number.isFinite(fromBase) ? applyDiscount(fromBase, lite) : null
  const was = fromBase != null && Number.isFinite(fromBase) ? fromBase : null
  const daysLeft = Math.ceil((new Date(offer.validUntil).getTime() - Date.now()) / 86400000)

  const cfg: any[] = (template?.tabs?.length ? template.tabs : DEFAULT_TABS.map((key) => ({ key, enabled: true }))).filter((x: any) => x.enabled !== false)
  const content: Record<string, React.ReactNode> = {}
  const how = (offer.howItWorks || []).map((h: any) => h.text).filter(Boolean)
  if (offer.description || how.length)
    content.details = (
      <div>
        <h2>{t('tabs.details')}</h2>
        {paragraphs(offer.description).map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        {how.length > 0 && (
          <>
            <h3>{t('offer.how')}</h3>
            <ol className="jt-steps">
              {how.map((x: string, i: number) => (
                <li key={i}>{x}</li>
              ))}
            </ol>
          </>
        )}
      </div>
    )
  if (tours.length)
    content.eligible = (
      <div>
        <h2>{t('tabs.eligible')}</h2>
        <div className="jt-grid jt-grid--2">
          {tours.map((x) => {
            const base = cheapestFrom(priceRowsOf(x))
            return (
              <div key={x.id} className="jt-eligible">
                <TourCard tour={x} routes={routes} locale={locale} t={t} />
                {base != null && (
                  <p className="jt-eligible__price">
                    <s className="jt-was">
                      <Money cents={base} />
                    </s>{' '}
                    <strong>
                      <Money cents={applyDiscount(base, lite)} />
                    </strong>{' '}
                    <span>{t('card.perPerson')}</span>
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  if (offer.terms || site?.cancellationSummary)
    content.terms = (
      <div>
        <h2>{t('tabs.terms')}</h2>
        {paragraphs(offer.terms).map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        {site?.cancellationSummary && <p>{site.cancellationSummary}</p>}
      </div>
    )
  if (tours.length && seasons.length)
    content.booking = (
      <BookingPanel
        rows={[]}
        seasons={seasons}
        departures={[]}
        heading={t('offer.bookTitle')}
        formProps={{
          type: 'offer',
          countries: buildCountryList(locale),
          refs: { offerId: offer.id, tourId: tours[0].id },
          seasons,
          tours: tours.map((x) => ({ id: x.id, title: x.title, rows: priceRowsOf(x) })),
          offer: lite,
          minLeadDays: site?.minLeadDays ?? 2,
          formId: 'offer-form',
        }}
      />
    )
  const tabs: TabDef[] = cfg.filter((c) => content[c.key]).map((c) => ({ key: c.key, title: c.title || t(`tabs.${c.key}` as any), content: content[c.key] }))
  const heroImg = imgData(offer.heroImage, offer.name)
  const nodes = [
    baseOrg(ctx),
    webPageNode({ url, name: offer.name, description: offer.summary, locale, origin, image: heroImg ? absoluteUrl(origin, heroImg.full) : undefined, modified: offer.updatedAt }),
    breadcrumbNode(url, crumbs.map((c, i) => ({ name: c.name, url: i < crumbs.length - 1 ? `${origin}${c.href}` : undefined }))),
    offerNode({ origin, url, name: offer.name, description: offer.summary, validFrom: offer.validFrom?.slice(0, 10), validUntil: offer.validUntil.slice(0, 10), image: heroImg ? absoluteUrl(origin, heroImg.full) : undefined }),
  ]
  const others2 = others.filter((o) => o.id !== offer.id).slice(0, 3)

  return (
    <article className="jt-tour jt-offerpage">
      <JsonLd data={graph(...nodes)} />
      <div className="jt-wrap">
        <Breadcrumbs items={crumbs} label={t('breadcrumb.label')} />
        <header className="jt-head">
          <div>
            <p className="jt-badge jt-badge--lg">
              <IconTag size={16} /> {label}
            </p>
            <h1>{offer.name}</h1>
            <p className="jt-head__lead">{offer.summary}</p>
            <dl className="jt-glance">
              <div>
                <dt>{t('offer.bookBy')}</dt>
                <dd>
                  {fmtDate(offer.validUntil, locale)}
                  {daysLeft <= 14 && daysLeft >= 0 && <strong className="jt-soon"> · {t('offer.endsSoon')}</strong>}
                </dd>
              </div>
              {offer.travelFrom && offer.travelUntil && (
                <div>
                  <dt>{t('offer.travelPeriod')}</dt>
                  <dd>
                    {fmtDate(offer.travelFrom, locale)} – {fmtDate(offer.travelUntil, locale)}
                  </dd>
                </div>
              )}
              {offer.minGuests && (
                <div>
                  <dt>{t('offer.minGuests')}</dt>
                  <dd>{offer.minGuests}</dd>
                </div>
              )}
              <div>
                <dt>{t('offer.applies')}</dt>
                <dd>{t('offer.appliesN', { n: tours.length })}</dd>
              </div>
            </dl>
          </div>
          <div className="jt-head__img">{heroImg && <Img media={offer.heroImage} alt={offer.name} sizes="(min-width:1000px) 45vw, 100vw" priority />}</div>
        </header>
        <TrustStrip items={(site?.trust || []).map((x: any) => x.text).filter(Boolean)} />
        <div className="jt-layout">
          <div className="jt-main">{tabs.length > 0 && <Tabs tabs={tabs} label={t('tabs.aria')} initial="details" />}</div>
          <div className="jt-sidecol">
            <SideCard fromCents={from} wasCents={was} lines={trustLines(site, t)} askHref={withLocale(locale, `/contact?offer=${offer.slug}`)} ctaKey="offer.cta" note={t('offer.validUntil', { date: fmtDate(offer.validUntil, locale) })} />
          </div>
        </div>
      </div>
      {others2.length > 0 && (
        <section className="jt-section jt-section--tint">
          <div className="jt-wrap">
            <SectionHead title={t('offer.more')} />
            <div className="jt-grid jt-grid--3">
              {others2.map((o) => (
                <OfferCard key={o.id} offer={o} routes={routes} locale={locale} t={t} />
              ))}
            </div>
          </div>
        </section>
      )}
      <MobileBar fromCents={from} ctaKey="offer.cta" />
    </article>
  )
}
