import React from 'react'
import Link from 'next/link'
import type { JointDeparture, Post, Tour, Vehicle } from '@/payload-types'
import type { SiteContext } from '@/lib/site'
import { getPosts } from '@/lib/site'
import { makeT } from '@/i18n'
import { buildCountryList } from '@/lib/countries'
import { docPath, withLocale } from '@/lib/routes'
import { absoluteUrl } from '@/lib/media'
import { articleNode, breadcrumbNode, eventNode, graph, webPageNode } from '@/lib/schema'
import RichText from '@/components/RichText'
import { Breadcrumbs } from './Breadcrumbs'
import { Img } from './Img'
import { JsonLd } from './JsonLd'
import { InquiryForm } from './InquiryForm'
import { Money } from './CurrencyProvider'
import { GalleryGrid } from './Gallery'
import { PostCard, fmtDate, variantOf } from './Cards'
import { SectionHead, imgData, longDate, paragraphs } from './helpers'
import { baseOrg } from './TourPage'
import { IconCalendar, IconCheck, IconPin } from './Icons'

/* ------------------------------------------------------------------ join-in departure */
export async function DeparturePage({ ctx, dep }: { ctx: SiteContext; dep: JointDeparture }) {
  const { locale, routes, site, origin } = ctx
  const t = makeT(ctx.dict)
  const tour = typeof dep.tour === 'object' ? (dep.tour as Tour) : null
  if (!tour) return null
  const url = `${origin}/${locale}${docPath(routes, 'joint-departures', dep)}`
  const tourPath = withLocale(locale, docPath(routes, 'tours', tour))
  const crumbs = [
    { name: t('breadcrumb.home'), href: `/${locale}` },
    { name: routes.joinInTours.label, href: withLocale(locale, `/${routes.joinInTours.prefix}`) },
    { name: `${tour.title} · ${fmtDate(dep.startDate, locale)}` },
  ]
  const veh = typeof dep.vehicle === 'object' ? (dep.vehicle as Vehicle) : null
  const dest: any = typeof tour.destination === 'object' ? tour.destination : null
  const seats = Math.min(dep.totalSeats || 6, 8)
  const hero = imgData(tour.heroImage, tour.title)
  const nodes = [
    baseOrg(ctx),
    webPageNode({ url, name: `${tour.title}: ${fmtDate(dep.startDate, locale)}`, description: tour.summary, locale, origin, modified: dep.updatedAt }),
    breadcrumbNode(url, crumbs.map((c, i) => ({ name: c.name, url: i < crumbs.length - 1 ? `${origin}${c.href}` : undefined }))),
    eventNode({
      origin,
      url,
      name: `${tour.title} (${t('departure.groupLabel')})`,
      description: tour.summary,
      start: dep.startDate.slice(0, 10),
      end: dep.endDate.slice(0, 10),
      place: dest?.name || 'Kenya',
      country: dest?.country && dest.country !== 'other' ? dest.country : 'KE',
      images: hero ? [absoluteUrl(origin, hero.full)] : [],
      priceCents: dep.pricePerSeat,
      status: dep.status,
    }),
  ]
  return (
    <article className="jt-tour">
      <JsonLd data={graph(...nodes)} />
      <div className="jt-wrap">
        <Breadcrumbs items={crumbs} label={t('breadcrumb.label')} />
        <header className="jt-head">
          <div>
            <p className="jt-badge jt-badge--lg">
              <IconCalendar size={16} /> {t('departure.groupLabel')}
            </p>
            <h1>{tour.title}</h1>
            <p className="jt-head__lead">
              {longDate(dep.startDate, locale)} – {longDate(dep.endDate, locale)}
            </p>
            <dl className="jt-glance">
              <div>
                <dt>{t('departure.pricePerSeat')}</dt>
                <dd>
                  <Money cents={dep.pricePerSeat} />
                </dd>
              </div>
              <div>
                <dt>{t('departure.status')}</dt>
                <dd>
                  <span className={`jt-status jt-status--${dep.status}`}>{t(`status.${dep.status}` as any)}</span>
                </dd>
              </div>
              {veh && (
                <div>
                  <dt>{t('departure.vehicle')}</dt>
                  <dd>{veh.name}</dd>
                </div>
              )}
              {dep.meetingPoint && (
                <div>
                  <dt>{t('departure.meeting')}</dt>
                  <dd>
                    <IconPin size={14} /> {dep.meetingPoint}
                  </dd>
                </div>
              )}
            </dl>
            {dep.notes && paragraphs(dep.notes).map((p, i) => <p key={i}>{p}</p>)}
            <p className="jt-actions">
              <Link href={tourPath} className="jt-btn jt-btn--line">
                {t('departure.fullItinerary')}
              </Link>
            </p>
          </div>
          <div className="jt-head__img">{hero && <Img media={tour.heroImage} alt={tour.title} sizes="(min-width:1000px) 45vw, 100vw" priority />}</div>
        </header>
        <section className="jt-block jt-formcard">
          <h2>{t('departure.reserve')}</h2>
          <p>{t('departure.reserveText')}</p>
          <InquiryForm
            type="departure"
            countries={buildCountryList(locale)}
            refs={{ departureId: dep.id, tourId: tour.id }}
            minLeadDays={0}
            askDate={false}
            guestOptions={Array.from({ length: seats }, (_, i) => String(i + 1))}
            allowMore={false}
            formId="departure-form"
          />
        </section>
      </div>
    </article>
  )
}

/* ------------------------------------------------------------------ vehicle */
export async function VehiclePage({ ctx, v }: { ctx: SiteContext; v: Vehicle }) {
  const { locale, routes, site, origin } = ctx
  const t = makeT(ctx.dict)
  const url = `${origin}/${locale}${docPath(routes, 'vehicles', v)}`
  const crumbs = [{ name: t('breadcrumb.home'), href: `/${locale}` }, { name: routes.vehicleHire.label, href: withLocale(locale, `/${routes.vehicleHire.prefix}`) }, { name: v.name }]
  const gallery = (v.gallery || []).map((g: any) => imgData(g.image, v.name)).filter(Boolean) as any[]
  const hero = imgData(v.heroImage, v.name)
  const nodes = [
    baseOrg(ctx),
    webPageNode({ url, name: v.name, description: v.summary || undefined, locale, origin, image: hero ? absoluteUrl(origin, hero.full) : undefined, modified: v.updatedAt }),
    breadcrumbNode(url, crumbs.map((c, i) => ({ name: c.name, url: i < crumbs.length - 1 ? `${origin}${c.href}` : undefined }))),
    { '@type': 'Service', '@id': `${url}#service`, name: v.name, description: v.summary || v.description, serviceType: 'Safari vehicle hire', provider: { '@id': `${origin}/#org` }, areaServed: 'KE', image: hero ? absoluteUrl(origin, hero.full) : undefined },
  ]
  return (
    <article className="jt-tour">
      <JsonLd data={graph(...nodes)} />
      <div className="jt-wrap">
        <Breadcrumbs items={crumbs} label={t('breadcrumb.label')} />
        <header className="jt-head">
          <div>
            <h1>{v.name}</h1>
            <ul className="jt-badges">
              <li>{t('vehicle.seats', { n: v.seats })}</li>
              {v.accessible && <li className="is-acc">{t('variant.accessible')}</li>}
            </ul>
            {v.summary && <p className="jt-head__lead">{v.summary}</p>}
          </div>
          <div className="jt-head__img">{hero && <Img media={v.heroImage} alt={v.name} sizes="(min-width:1000px) 45vw, 100vw" priority />}</div>
        </header>
        <div className="jt-layout jt-layout--single">
          <div className="jt-main">
            {v.description && (
              <section className="jt-block">
                {paragraphs(v.description).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </section>
            )}
            {(v.features || []).length > 0 && (
              <section className="jt-block">
                <h2>{t('vehicle.features')}</h2>
                <ul className="jt-list jt-list--yes">
                  {v.features!.map((f: any, i: number) => (
                    <li key={i}>
                      <IconCheck size={16} />
                      <span>{f.text}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {(v.specs || []).length > 0 && (
              <section className="jt-block">
                <h2>{t('vehicle.specs')}</h2>
                <div className="jt-tablewrap">
                  <table className="jt-table jt-table--simple">
                    <tbody>
                      {v.specs!.map((s: any, i: number) => (
                        <tr key={i}>
                          <th scope="row">{s.label}</th>
                          <td>{s.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
            {(v.rates || []).length > 0 && (
              <section className="jt-block">
                <h2>{t('vehicle.rates')}</h2>
                <div className="jt-tablewrap">
                  <table className="jt-table jt-table--simple">
                    <tbody>
                      {v.rates!.map((r: any, i: number) => (
                        <tr key={i}>
                          <th scope="row">{r.label}</th>
                          <td>
                            <Money cents={r.priceCents} /> {r.unit && <small>/ {r.unit}</small>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="jt-note">{t('vehicle.ratesNote')}</p>
              </section>
            )}
            {gallery.length > 0 && (
              <section className="jt-block">
                <h2>{t('tabs.gallery')}</h2>
                <GalleryGrid images={gallery} />
              </section>
            )}
            <section className="jt-block jt-formcard">
              <h2>{t('vehicle.requestTitle')}</h2>
              <InquiryForm type="vehicle" countries={buildCountryList(locale)} refs={{ vehicleId: v.id }} minLeadDays={site?.minLeadDays ?? 2} guestOptions={['1', '2', '3', '4', '5', '6', '7', '8']} allowMore={false} formId="vehicle-form" />
            </section>
          </div>
        </div>
      </div>
    </article>
  )
}

/* ------------------------------------------------------------------ blog post */
export async function PostPage({ ctx, post }: { ctx: SiteContext; post: Post }) {
  const { locale, routes, origin } = ctx
  const t = makeT(ctx.dict)
  const url = `${origin}/${locale}${docPath(routes, 'posts', post)}`
  const crumbs = [{ name: t('breadcrumb.home'), href: `/${locale}` }, { name: routes.blog.label, href: withLocale(locale, `/${routes.blog.prefix}`) }, { name: post.title }]
  const hero = imgData(post.heroImage, post.title)
  const author = (post.populatedAuthors || [])[0]?.name
  const related = (post.relatedPosts || []).filter((r): r is Post => typeof r === 'object' && r !== null)
  const more = related.length ? related : (await getPosts(locale, 4)).filter((p) => p.id !== post.id).slice(0, 3)
  const nodes = [
    baseOrg(ctx),
    webPageNode({ url, name: post.title, description: (post.meta as any)?.description, locale, origin, image: hero ? absoluteUrl(origin, hero.full) : undefined, modified: post.updatedAt, type: 'WebPage' }),
    breadcrumbNode(url, crumbs.map((c, i) => ({ name: c.name, url: i < crumbs.length - 1 ? `${origin}${c.href}` : undefined }))),
    articleNode({ origin, url, headline: post.title, description: (post.meta as any)?.description, image: hero ? absoluteUrl(origin, hero.full) : undefined, published: post.publishedAt, modified: post.updatedAt, author: author || undefined, locale }),
  ]
  return (
    <article className="jt-post">
      <JsonLd data={graph(...nodes)} />
      <div className="jt-wrap jt-wrap--narrow">
        <Breadcrumbs items={crumbs} label={t('breadcrumb.label')} />
        <header className="jt-post__head">
          <h1>{post.title}</h1>
          <p className="jt-post__meta">
            {post.publishedAt && <time dateTime={post.publishedAt}>{longDate(post.publishedAt, locale)}</time>}
            {author && <span> · {t('post.by', { name: author })}</span>}
          </p>
        </header>
        {hero && (
          <div className="jt-post__hero">
            <Img media={post.heroImage} alt={post.title} sizes="(min-width:900px) 800px, 100vw" priority />
          </div>
        )}
        <div className="jt-prose">{post.content && <RichText data={post.content} enableGutter={false} />}</div>
      </div>
      {more.length > 0 && (
        <section className="jt-section jt-section--tint">
          <div className="jt-wrap">
            <SectionHead title={t('post.more')} />
            <div className="jt-grid jt-grid--3">
              {more.map((p) => (
                <PostCard key={p.id} post={p} routes={routes} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  )
}
