import path from 'node:path'
import fs from 'node:fs'
import type { Payload } from 'payload'
import { addDays, ctx, iso, lexical, slugify, upsert } from './helpers'
import { BEST_TIME, DESTINATIONS, FAQ, HOTELS, POSTS, TOURS, VEHICLES } from './content'

const MEDIA_DIR = path.resolve(process.cwd(), 'content/media')
const BRAND_DIR = path.resolve(process.cwd(), 'content/brand')

const ALT: Record<string, string> = {
  'mara-sunset': 'Acacia trees and wildebeest silhouetted against a Masai Mara sunset (sample artwork)',
  'amboseli-elephants': 'Elephants walking below a snow-capped Mount Kilimanjaro (sample artwork)',
  'nakuru-giraffes': 'Three giraffes and acacia trees at sunset (sample artwork)',
  'camp-night': 'Tents and a campfire under a starry sky (sample artwork)',
  'migration-river': 'Wildebeest herds gathering at a river (sample artwork)',
  'gorilla-forest': 'A gorilla in misty green forest (sample artwork)',
  'coast-dhow': 'Dhow boats on a calm sea off the Kenya coast (sample artwork)',
  'vehicle-landcruiser': 'A safari Land Cruiser with a pop-up roof (sample artwork)',
  'vehicle-van': 'A safari van with a pop-up roof (sample artwork)',
  'vehicle-accessible': 'A safari vehicle with a wheelchair ramp and the wheelchair access symbol (sample artwork)',
  'lions-savanna': 'A lion silhouetted on the savanna at sunset (sample artwork)',
  'balloons-mara': 'Hot air balloons floating over the Masai Mara (sample artwork)',
  'mount-kenya': 'Mount Kenya rising above forest (sample artwork)',
  'samburu-reticulated': 'An elephant and an antelope in dry northern country (sample artwork)',
}

const log = (m: string) => console.log(`[seed] ${m}`)

export async function seedSite(payload: Payload, opts: { fresh?: boolean } = {}) {
  const counts: Record<string, number> = {}
  const bump = (k: string) => (counts[k] = (counts[k] || 0) + 1)

  if (opts.fresh) {
    for (const collection of ['tours', 'offers', 'joint-departures', 'vehicles', 'gallery-items'] as const) {
      await payload.delete({ collection, where: { sample: { equals: true } }, overrideAccess: true, context: ctx } as any)
    }
    log('removed previous sample content')
  }

  /* ---------------------------------------------------------------- media */
  const media: Record<string, number | string> = {}
  const uploadMedia = async (name: string, file: string, alt: string, creditText = 'JaeTravel (sample artwork)') => {
    // Payload may add a suffix (-1, -2) when a file name is already on disk, so match on the base name.
    const base = path.basename(file).replace(/\.[a-z]+$/i, '')
    const found = await payload.find({ collection: 'media', where: { filename: { like: base } }, limit: 1, depth: 0, overrideAccess: true })
    if (found.docs[0]) {
      media[name] = found.docs[0].id
      return
    }
    const doc = await payload.create({ collection: 'media', data: { alt, creditText }, filePath: file, overrideAccess: true, context: ctx, locale: 'en' } as any)
    media[name] = doc.id
    bump('media')
  }
  for (const f of fs.readdirSync(MEDIA_DIR).filter((x) => x.endsWith('.jpg'))) {
    const name = f.replace('.jpg', '')
    await uploadMedia(name, path.join(MEDIA_DIR, f), ALT[name] || `${name} (sample artwork)`)
  }
  await uploadMedia('logo', path.join(BRAND_DIR, 'logo.jpg'), 'JaeTravel Expeditions logo: an elephant, a plane and acacia trees on an orange sunset', 'JaeTravel Expeditions')
  const M = (k: string) => media[k] as any
  log(`media ready (${Object.keys(media).length})`)

  /* ---------------------------------------------------------------- globals */
  const g = (slug: string, data: any) => payload.updateGlobal({ slug, data, overrideAccess: true, context: ctx, locale: 'en' } as any)
  await g('theme', {})
  await g('routes', {
    routes: [
      { key: 'tours', prefix: 'tours', breadcrumbLabel: 'Safaris' },
      { key: 'disabilityTours', prefix: 'disability-tours', breadcrumbLabel: 'Disability tours' },
      { key: 'budgetTours', prefix: 'budget-tours', breadcrumbLabel: 'Budget tours' },
      { key: 'migrationTours', prefix: 'migration-tours', breadcrumbLabel: 'Migration tours' },
      { key: 'joinInTours', prefix: 'join-in-tours', breadcrumbLabel: 'Join-in tours' },
      { key: 'offers', prefix: 'offers', breadcrumbLabel: 'Offers' },
      { key: 'vehicleHire', prefix: 'vehicle-hire', breadcrumbLabel: 'Vehicle hire' },
      { key: 'blog', prefix: 'blog', breadcrumbLabel: 'Blog' },
      { key: 'gallery', prefix: 'gallery', breadcrumbLabel: 'Gallery' },
    ],
  })
  await g('translations', { entries: [] })
  const rateDate = iso(addDays(0))
  await g('site-settings', {
    siteName: 'JaeTravel Expeditions',
    contactEmail: 'info@jaetravel.co.ke',
    whatsappNumber: '254700000000',
    whatsappMessage: 'Hello JaeTravel, I would like to plan a safari.',
    minLeadDays: 2,
    replyTime: 'We reply within one working day.',
    trust: [{ text: 'Local Kenyan safari team' }, { text: 'Prices shown per person in your currency' }, { text: 'Accessible options on request' }],
    paymentMethods: [],
    currencies: [
      { code: 'USD', rate: 1, rateDate },
      { code: 'KES', rate: 129, rateDate },
      { code: 'EUR', rate: 0.92, rateDate },
      { code: 'GBP', rate: 0.79, rateDate },
    ],
    social: [],
    seo: {
      titleSuffix: 'JaeTravel Expeditions',
      defaultDescription: 'Private and group safaris in Kenya and East Africa, with accessible options, budget camping and honest prices. Planned by a local team.',
      defaultOgImage: M('mara-sunset'),
      enableFaqSchema: true,
      merchant: { enabled: false },
    },
  })
  await g('company', {
    companyName: 'JaeTravel Expeditions',
    tagline: 'Where the world meets the wild',
    logo: M('logo'),
    phoneNumber: '+254 700 000 000',
    address: { countryCode: 'KE' },
    credentials: [],
  })
  const link = (label: string, routeKey: string, url?: string) => ({ label, routeKey, ...(url ? { url } : {}) })
  await g('header', {
    items: [
      link('Home', 'home'),
      {
        ...link('Tours', 'tours'),
        children: [
          { ...link('Disability tours', 'disabilityTours'), description: 'Adapted vehicles and step-free stays' },
          { ...link('Offers', 'offers'), description: 'Current deals and early-booking savings' },
          { ...link('Migration tours', 'migrationTours'), description: 'Follow the herds and the river crossings' },
          { ...link('Budget tours', 'budgetTours'), description: 'Camping and shared vehicles' },
          { ...link('Join-in tours', 'joinInTours'), description: 'Book one seat on a group departure' },
        ],
      },
      link('Vehicle hire', 'vehicleHire'),
      link('About', 'custom', '/about'),
      {
        ...link('Blog', 'blog'),
        children: [
          { ...link('Blog posts', 'blog'), description: 'Travel advice and stories' },
          { ...link('Photo and video gallery', 'gallery'), description: 'East Africa in pictures and film' },
        ],
      },
      link('Contact', 'custom', '/contact'),
    ],
    cta: link('Build your own itinerary', 'custom', '/itinerary-builder'),
  })
  await g('footer', {
    columns: [
      { title: 'Safaris', links: [link('All safaris', 'tours'), link('Disability tours', 'disabilityTours'), link('Budget tours', 'budgetTours'), link('Migration tours', 'migrationTours'), link('Join-in tours', 'joinInTours'), link('Offers', 'offers')] },
      { title: 'Plan your trip', links: [link('Vehicle hire', 'vehicleHire'), link('Build your own itinerary', 'custom', '/itinerary-builder'), link('Photo and video gallery', 'gallery'), link('Blog', 'blog')] },
      { title: 'Company', links: [link('About us', 'custom', '/about'), link('Contact', 'custom', '/contact')] },
    ],
    legalLinks: [],
    copyright: '© {year} {name}. All rights reserved.',
  })
  log('globals saved')

  /* ---------------------------------------------------------------- seasons, destinations, hotels, vehicles, templates */
  const seasonData = [
    { name: 'Low season', startMonth: 3, startDay: 1, endMonth: 6, endDay: 30, sortOrder: 1 },
    { name: 'High season', startMonth: 11, startDay: 1, endMonth: 2, endDay: 29, sortOrder: 2 },
    { name: 'Peak season', startMonth: 7, startDay: 1, endMonth: 10, endDay: 31, sortOrder: 3 },
  ]
  const seasons: any[] = []
  for (const s of seasonData) seasons.push(await upsert(payload, 'seasons', { name: { equals: s.name } }, s))
  const mult = [1, 1.13, 1.29]

  const dest: Record<string, any> = {}
  for (const d of DESTINATIONS) dest[d.name] = await upsert(payload, 'destinations', { slug: { equals: slugify(d.name) } }, { name: d.name, slug: slugify(d.name), country: d.country, description: d.description, image: M(d.image) })

  const hotels: Record<string, any> = {}
  for (const h of HOTELS) hotels[h.name] = await upsert(payload, 'hotels', { name: { equals: h.name } }, { ...h, image: M('mara-sunset') })

  const vehicles: Record<string, any> = {}
  for (const v of VEHICLES) {
    vehicles[v.name] = await upsert(payload, 'vehicles', { slug: { equals: slugify(v.name) } }, {
      name: v.name, slug: slugify(v.name), published: true, sample: true, type: v.type, seats: v.seats, summary: v.summary,
      description: `${v.summary} Sample description: replace with the real vehicle details. All vehicles come with a professional driver-guide.`,
      heroImage: M(v.image), accessible: v.accessible,
      features: v.features.map((text) => ({ text })), specs: v.specs.map(([label, value]) => ({ label, value })), rates: v.rates.map(([label, priceCents, unit]) => ({ label, priceCents, unit })),
    })
    bump('vehicles')
  }

  const sectionSets: Record<string, string[]> = {
    standard: ['facts', 'highlights', 'offerBanner', 'tabs', 'bestTime', 'faq', 'similar'],
    budget: ['facts', 'highlights', 'whyCheaper', 'tabs', 'bestTime', 'faq', 'similar'],
    accessible: ['facts', 'highlights', 'accessibility', 'tabs', 'bestTime', 'faq', 'similar'],
    migration: ['facts', 'highlights', 'offerBanner', 'tabs', 'bestTime', 'faq', 'similar'],
  }
  const tabsStd = ['itinerary', 'booking', 'inclusions', 'exclusions', 'gallery', 'videos']
  const templates: Record<string, any> = {}
  for (const v of ['standard', 'budget', 'accessible', 'migration']) {
    templates[v] = await upsert(payload, 'templates', { variant: { equals: v } }, {
      name: `${v[0].toUpperCase()}${v.slice(1)} tour`, variant: v,
      sections: sectionSets[v].map((key) => ({ key, enabled: true })),
      tabs: tabsStd.map((key) => ({ key, enabled: true })),
    })
  }
  templates.offer = await upsert(payload, 'templates', { variant: { equals: 'offer' } }, { name: 'Offer', variant: 'offer', sections: [], tabs: ['details', 'eligible', 'terms', 'booking'].map((key) => ({ key, enabled: true })) })
  log('seasons, destinations, vehicles and templates saved')

  /* ---------------------------------------------------------------- tours */
  const round5 = (n: number) => Math.round(n / 5) * 5
  const tours: Record<string, any> = {}
  for (const t of TOURS) {
    const matrix = seasons.map((s, i) => {
      const p = (f: number) => round5(t.base * f * mult[i]) * 100
      return { season: s.id, p2: p(1), p4: p(0.87), p6: p(0.79), p8: p(0.74) }
    })
    const hotelNames = Object.keys(hotels)
    const doc = await upsert(payload, 'tours', { slug: { equals: slugify(t.title) } }, {
      title: t.title, slug: slugify(t.title), published: true, featured: !!t.featured, sample: true,
      template: templates[t.variant].id, destination: dest[t.destination].id, durationDays: t.days, summary: t.summary,
      heroImage: M(t.image),
      highlights: t.highlights.map((text) => ({ text })),
      facts: { startPoint: t.start, endPoint: t.end, pace: t.pace, groupSizeMin: 1, groupSizeMax: 8, guideLanguages: 'English' },
      itinerary: t.itinerary.map(([title, body], i) => ({
        title, body, meals: ['breakfast', 'lunch', 'dinner'], driveTime: i === 0 || i === t.itinerary.length - 1 ? 'About 5 hours with stops' : undefined,
        hotel: i < t.itinerary.length - 1 ? hotels[hotelNames[(t.destination === 'Amboseli' ? 2 : t.destination.includes('Nakuru') ? 3 : 0) + (t.variant === 'accessible' ? 1 : 0)]]?.id : undefined,
        mobilityLevel: t.variant === 'accessible' ? 'assisted' : undefined,
      })),
      included: t.included.map((text) => ({ text })), excluded: t.excluded.map((text) => ({ text })),
      pricing: { matrix },
      gallery: [t.image, ...t.gallery].map((k) => ({ image: M(k), caption: ALT[k]?.replace(' (sample artwork)', '') })),
      whyCheaper: t.whyCheaper,
      accessibility: t.accessibility ? { summary: t.accessibility.summary, features: t.accessibility.features.map((text) => ({ text })), vehicle: t.accessibility.vehicle ? vehicles[t.accessibility.vehicle]?.id : undefined } : undefined,
      bestTime: BEST_TIME.map(([months, conditions, priceLevel]) => ({ months, conditions, priceLevel })),
      faq: FAQ[t.variant].map(([question, answer]) => ({ question, answer })),
      seo: {},
    })
    tours[t.title] = doc
    bump('tours')
  }
  for (const t of TOURS) {
    if (!t.related?.length) continue
    await payload.update({ collection: 'tours', id: tours[t.title].id, data: { relatedTours: t.related.map((r) => tours[r]?.id).filter(Boolean) }, overrideAccess: true, context: ctx } as any)
  }
  log(`${TOURS.length} tours saved`)

  /* ---------------------------------------------------------------- offers and departures */
  const offerDefs = [
    { name: 'Early Bird 2027', type: 'early-bird', badge: '10% off', summary: 'Book a private safari early and save 10% on selected 2027 departures.', description: 'Reserve your dates early and we take 10% off the price per person on the safaris listed here. Sample offer: replace with your real terms.', discountType: 'percent', value: 10, until: 120, travelFrom: '2027-03-01', travelUntil: '2027-12-15', minGuests: 2, applies: ['Masai Mara Classic Safari', 'Amboseli and Tsavo Safari', 'Samburu Wildlife Safari', 'Great Migration Mara River Safari'], image: 'balloons-mara', how: ['Choose a safari and your travel date', 'Send your request before the offer ends', 'We confirm the discounted price in your quote'] },
    { name: 'Green Season Special', type: 'seasonal', badge: 'Added value', summary: 'Travel in the green season and get an extra night at the lodge.', description: 'The long rains bring lush landscapes, fewer vehicles and the lowest rates. Sample offer: replace with your real terms.', discountType: 'none', value: 0, until: 70, travelFrom: '2027-03-01', travelUntil: '2027-06-30', minGuests: 2, applies: ['Masai Mara Classic Safari', 'Nakuru and Naivasha Camping Safari', 'Budget Masai Mara Camping Safari'], image: 'camp-night', how: ['Pick a safari and a date between March and June', 'Tell us when you send your request', 'We add the extra night to your quote'] },
    { name: 'Group Booking Saving', type: 'group', badge: '5% off', summary: 'Travelling with 6 or more? Save 5% on the price per person.', description: 'Good for families and friends travelling together. Sample offer: replace with your real terms.', discountType: 'percent', value: 5, until: 200, minGuests: 6, applies: ['Masai Mara Classic Safari', 'Amboseli and Tsavo Safari', 'Accessible Masai Mara Safari'], image: 'vehicle-landcruiser', how: ['Choose a safari for 6 or 8 travellers', 'Send your request', 'We apply the saving in your quote'] },
  ]
  for (const o of offerDefs) {
    await upsert(payload, 'offers', { slug: { equals: slugify(o.name) } }, {
      name: o.name, slug: slugify(o.name), published: true, sample: true, featured: true, type: o.type, badgeText: o.badge, summary: o.summary, description: o.description,
      heroImage: M(o.image), discountType: o.discountType, discountValue: o.value, appliesTo: o.applies.map((a) => tours[a].id),
      validUntil: iso(addDays(o.until)), travelFrom: o.travelFrom ? `${o.travelFrom}T00:00:00.000Z` : undefined, travelUntil: o.travelUntil ? `${o.travelUntil}T00:00:00.000Z` : undefined, minGuests: o.minGuests,
      howItWorks: o.how.map((text) => ({ text })), terms: 'Sample terms. Subject to availability. Cannot be combined with other offers. Replace with your real terms.',
    })
    bump('offers')
  }
  const depDefs = [
    ['Masai Mara Classic Safari', 21, 3, 'open', 'Safari Land Cruiser'], ['Masai Mara Classic Safari', 49, 3, 'filling', 'Safari Land Cruiser'], ['Masai Mara Classic Safari', 84, 3, 'guaranteed', 'Safari Van'],
    ['Nakuru and Naivasha Camping Safari', 35, 2, 'open', 'Safari Van'], ['Amboseli and Tsavo Safari', 63, 4, 'open', 'Safari Land Cruiser'], ['Great Migration Mara River Safari', 260, 4, 'open', 'Extended Land Cruiser'],
  ] as const
  for (const [title, inDays, len, status, veh] of depDefs) {
    const t = tours[title]
    const start = addDays(inDays)
    const base = TOURS.find((x) => x.title === title)!.base
    await upsert(payload, 'joint-departures', { slug: { equals: `${t.slug}-${iso(start).slice(0, 10)}` } }, {
      tour: t.id, slug: `${t.slug}-${iso(start).slice(0, 10)}`, published: true, sample: true, startDate: iso(start), endDate: iso(addDays(inDays + len)),
      pricePerSeat: round5(base * 0.74 * mult[inDays > 200 ? 2 : inDays > 80 ? 1 : 0]) * 100, totalSeats: 6, minGuestsToRun: 3, status,
      vehicle: vehicles[veh].id, meetingPoint: 'Nairobi (exact pick-up point confirmed after booking)', notes: 'Sample departure. Replace with your real dates and prices.',
    })
    bump('joint-departures')
  }
  log('offers and departures saved')

  /* ---------------------------------------------------------------- gallery */
  const galleryDefs: [string, string, string][] = [
    ['Sunset over the Masai Mara', 'mara-sunset', 'Masai Mara'], ['Elephants below Kilimanjaro', 'amboseli-elephants', 'Amboseli'], ['Giraffes at the lakes', 'nakuru-giraffes', 'Lakes Nakuru and Naivasha'],
    ['Camp under the stars', 'camp-night', 'Masai Mara'], ['Herds at the river', 'migration-river', 'Masai Mara'], ['Lion at dusk', 'lions-savanna', 'Masai Mara'],
    ['Balloons over the plains', 'balloons-mara', 'Masai Mara'], ['Mount Kenya morning', 'mount-kenya', 'Mount Kenya'], ['Dhows on the coast', 'coast-dhow', 'Kenya Coast'], ['Northern wildlife', 'samburu-reticulated', 'Samburu'],
  ]
  for (const [i, [title, key, d]] of galleryDefs.entries()) {
    await upsert(payload, 'gallery-items', { title: { equals: title } }, { title, type: 'photo', image: M(key), caption: `${ALT[key]?.replace(' (sample artwork)', '')}.`, destination: dest[d].id, published: true, sample: true, sort: i })
    bump('gallery-items')
  }

  /* ---------------------------------------------------------------- blog */
  for (const p of POSTS) {
    await upsert(payload, 'posts', { slug: { equals: slugify(p.title) } }, {
      title: p.title, slug: slugify(p.title), heroImage: M(p.image), content: lexical(p.body), publishedAt: iso(addDays(p.days)), _status: 'published',
      meta: { title: p.title, description: p.description, image: M(p.image) },
    })
    bump('posts')
  }
  log('gallery and blog saved')

  /* ---------------------------------------------------------------- pages */
  const l = (label: string, routeKey: string, url?: string) => ({ label, routeKey, ...(url ? { url } : {}) })
  const page = (title: string, slug: string, layout: any[], meta?: { title?: string; description?: string; image?: any }) =>
    upsert(payload, 'pages', { slug: { equals: slug } }, { title, slug, _status: 'published', hero: { type: 'none' }, layout, meta: meta || {}, publishedAt: iso(addDays(-1)) })

  await page('Home', 'home', [
    {
      blockType: 'homeHero', autoplaySeconds: 7,
      slides: [
        { kind: 'image', image: M('mara-sunset'), caption: 'Masai Mara', headline: 'Kenya and East Africa, planned by people who live here', text: 'Private and group safaris for every budget, with accessible routes, vehicles and lodges for travellers with disabilities.', cta: l('Browse safaris', 'tours'), secondaryCta: l('Build your own trip', 'custom', '/itinerary-builder') },
        { kind: 'image', image: M('amboseli-elephants'), caption: 'Amboseli', headline: 'Elephants under Kilimanjaro', text: 'Slow, close game drives with a private driver-guide and room to take your time.', cta: l('See Amboseli safaris', 'custom', '/tours?destination=amboseli') },
        { kind: 'image', image: M('migration-river'), caption: 'Great Migration', headline: 'Be there when the herds cross', text: 'Migration safaris timed for the Masai Mara, with extra days at the river.', cta: l('See migration tours', 'migrationTours') },
        { kind: 'image', image: M('vehicle-accessible'), caption: 'Accessible safaris', headline: 'Safaris built around your access needs', text: 'Adapted vehicles, step-free stays where available and a guide trained to help.', cta: l('See disability tours', 'disabilityTours') },
      ],
    },
    { blockType: 'tripFinder' },
    {
      blockType: 'waysToTravel', title: 'Three ways to travel with us', subtitle: 'Pick the route that fits your budget and your access needs. Every safari can be adjusted before you pay.',
      tiles: [
        { title: 'Accessible safaris', text: 'Adapted vehicles, step-free stays where available and guides trained to assist.', tone: 'sun', icon: 'wheelchair', link: l('See disability tours', 'disabilityTours') },
        { title: 'Budget safaris', text: 'Camping and shared vehicles with honest prices.', tone: 'brand', icon: 'wallet', link: l('See budget tours', 'budgetTours') },
        { title: 'Great Migration', text: 'Time your safari with the herds and the Mara River.', tone: 'ink', icon: 'herd', link: l('See migration tours', 'migrationTours') },
      ],
    },
    { blockType: 'toursRail', title: 'Popular safaris', subtitle: 'Our most requested trips, with prices per person.', source: 'featured', limit: 4, viewAll: l('View all safaris', 'tours') },
    { blockType: 'departuresBand', title: 'Join a group departure', subtitle: 'Book a single seat on a fixed-date safari and share the vehicle and the cost.', limit: 4 },
    { blockType: 'offersRail', title: 'Current offers', limit: 3, viewAll: l('All offers', 'offers') },
    { blockType: 'destinationsRail', title: 'Where we take you', subtitle: 'Six regions of Kenya, each with its own wildlife and character.' },
    {
      blockType: 'valueProps', title: 'Local operators, not a middleman', text: 'We plan the routes, choose the lodges and answer your messages ourselves, from the first question to the last transfer.',
      items: [
        { title: 'Prices you can see', text: 'Seasonal prices for 2, 4, 6 or 8 travellers on every safari page, in your currency.' },
        { title: 'Access checked with you', text: 'We confirm vehicles, rooms and pace with you before you pay, not after.' },
        { title: 'One team from enquiry to return', text: 'The same people handle your booking, your invoice and your guide.' },
      ],
    },
    { blockType: 'blogRail', title: 'From the blog', limit: 3 },
    { blockType: 'ctaBanner', title: 'Not quite right? Build your own itinerary.', text: 'Tell us what you want to see and when. We will shape a safari around it.', cta: l('Start planning', 'custom', '/itinerary-builder') },
  ], { title: 'Safaris in Kenya and East Africa | JaeTravel Expeditions', description: 'Private and group safaris in Kenya and East Africa, with accessible options, budget camping and honest prices. Planned by a local team.', image: M('mara-sunset') })

  await page('About', 'about', [
    { blockType: 'pageHeader', title: 'About JaeTravel Expeditions', text: 'A Kenya-based safari team that plans every trip ourselves, from the first message to the last transfer.' },
    { blockType: 'richSection', title: 'Who we are', imageSide: 'right', image: M('lions-savanna'), content: lexical(['JaeTravel Expeditions plans private and group safaris in Kenya and East Africa. We are a small team and we answer your messages ourselves.', 'We care about two things: honest prices and trips that work for the people on them, including travellers with disabilities. That is why we confirm vehicles, rooms and pace with you before you pay.', 'This is sample text. Replace it with your own story, your team and what makes your safaris different.']) },
    { blockType: 'valueProps', title: 'What you can expect', text: 'Plain answers, clear prices and a team you can reach.', items: [{ title: 'Clear prices', text: 'Seasonal prices for each group size, shown before you ask.' }, { title: 'Real access details', text: 'We tell you exactly what a vehicle or a room offers.' }, { title: 'Local knowledge', text: 'Guides who know the parks and the people.' }] },
    { blockType: 'ctaBanner', title: 'Ready to plan your safari?', text: 'Send us your dates and what matters most to you.', cta: l('Contact us', 'custom', '/contact') },
  ], { description: 'Meet the Kenya-based team behind JaeTravel Expeditions: private and group safaris, accessible travel and honest prices.' })

  await page('Contact', 'contact', [
    { blockType: 'pageHeader', title: 'Contact us', text: 'Tell us where and when you want to go, and anything we should know. We reply within one working day.' },
    { blockType: 'contactSection', title: 'Talk to the team', text: 'Message us on WhatsApp for the fastest reply, or use the form.' },
    { blockType: 'faqSection', title: 'Before you write', items: [{ question: 'How soon will I get a reply?', answer: 'We reply within one working day, usually sooner.' }, { question: 'Can you plan a trip that is not on the website?', answer: 'Yes. Most of our safaris can be changed, and we plan custom trips every week.' }] },
  ], { description: 'Contact JaeTravel Expeditions by email, phone or WhatsApp, or send a message to plan your safari.' })

  await page('Itinerary builder', 'itinerary-builder', [
    { blockType: 'pageHeader', title: 'Build your own itinerary', text: 'Our interactive itinerary builder is on its way.' },
    { blockType: 'richSection', content: lexical(['While we finish it, tell us what you would like to see, when you want to travel and how many people are coming. We will send you a draft itinerary and a price.']) },
    { blockType: 'ctaBanner', title: 'Plan it with us now', text: 'Send your ideas and we will take it from there.', cta: l('Contact us', 'custom', '/contact') },
  ], { description: 'Build your own safari itinerary with JaeTravel Expeditions. Our interactive builder is coming soon; contact us to plan your trip now.' })

  const listing = (title: string, slug: string, text: string, extra: any[] = [], faqItems?: [string, string][]) =>
    page(title, slug, [
      { blockType: 'pageHeader', title, text },
      ...extra,
      ...(faqItems ? [{ blockType: 'faqSection', title: 'Common questions', items: faqItems.map(([question, answer]) => ({ question, answer })) }] : []),
    ], { description: text })

  await listing('Safaris in Kenya and East Africa', 'tours', 'Private and group safaris planned by a local team. Filter by destination, length or type, or tell us what you want and we will plan it.', [], FAQ.standard)
  await listing('Disability tours', 'disability-tours', 'Safaris with adapted vehicles, step-free stays where available and guides trained to assist. We confirm every access detail with you before you book.', [], FAQ.accessible)
  await listing('Budget tours', 'budget-tours', 'Camping and shared vehicles with honest prices. The same parks and guides, with simpler comforts.', [], FAQ.budget)
  await listing('Migration tours', 'migration-tours', 'Time your Masai Mara safari with the wildebeest herds and the Mara River crossings.', [], FAQ.migration)
  await listing('Join-in tours', 'join-in-tours', 'Book a single seat on a fixed-date safari and share the vehicle and the cost with other travellers.', [], [['How does a join-in safari work?', 'You book one or more seats on a set departure. The route and dates are fixed and the vehicle is shared.'], ['Can I join as a solo traveller?', 'Yes. Many guests travel alone on join-in departures.']])
  await listing('Offers', 'offers', 'Current deals and early-booking savings on our safaris.')
  await listing('Blog', 'blog', 'Travel advice, wildlife news and stories from the field.')
  await listing('Vehicle hire', 'vehicle-hire', 'Safari Land Cruisers, vans and accessible vehicles with an experienced driver-guide.', [{ blockType: 'vehicleGrid' }], [['Do vehicles come with a driver?', 'Yes. Every vehicle comes with a professional driver-guide.'], ['Can you provide a vehicle for a wheelchair user?', 'We have an adapted vehicle. Send us your dates and needs and we will confirm the details.']])
  await listing('Gallery', 'gallery', 'See East Africa in photographs and film. Add your own YouTube videos in the admin under Content > Gallery items.', [{ blockType: 'mediaGallery' }])
  log('pages saved')

  return { counts }
}

export const seedAll = seedSite
