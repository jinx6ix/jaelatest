# JaeTravel: one-prompt build for the AI agent

Paste this whole file into your agent, or attach it and say: "Execute JAETRAVEL_BUILD_PROMPT.md."

---

## PART 0. WHAT YOU ARE DOING

You are rebuilding jaetravel.co.ke (Kenya-based safari operator, Nairobi) inside this Payload CMS project, so that the finished site reproduces the 9 design boards in `/design`, with every piece of content, navigation, colour, string, URL prefix and page structure editable in Payload (zero hardcoded content).

This prompt works in two stages.

**Stage A (do this now, before any feature work):** create the documentation files listed in PART 1 exactly as written (only the file path is yours to place). They become your permanent memory of the project. Then stop and give the first reply described in PART 2.

**Stage B (after I approve):** build the site phase by phase, following the files you created, until every board is reproduced.

Before Stage A, check that `/design` contains these 9 files (HTML reference markup, optionally PNG screenshots with the same names): `home`, `tour-page`, `vehicle-hire`, `vehicle-detail`, `offers`, `research`, `about`, `joint-safaris`, `joint-departure`. If any is missing, stop and tell me which. Open each one: the HTML is the exact structure, section order, content hierarchy and behaviour to reproduce. Its colours (a placeholder orange palette), fonts, and every `[bracketed]` text are placeholders, not final values.

Rules that apply to this whole prompt:
- Return only new and changed files, with their paths. No zips.
- Never claim you ran, built or tested something you did not.
- If anything here conflicts with itself, with the repo, or with a design, stop and ask. Do not guess.

---

## PART 1. FILES TO CREATE (Stage A)

Create each file below with the exact content between its markers. Create folders as needed.

=== FILE: CLAUDE.md (replace the existing file) ===
# JaeTravel (Payload CMS): read this first, every session
1. Read docs/build/BUILD_STATE.md, then the rows of docs/build/04-DESIGN-MATRIX.md for the current phase.
2. Rules and protocol: docs/build/00-OPERATING-RULES.md. Architecture: 02. SEO: 03. Data and services: 01.
3. The designs in /design are the target. Match section order, content and behaviour.
4. Never hardcode content, colours, URLs or visible strings. Everything is Payload data.
5. Return only new and changed files. Never claim you ran something you did not run.
6. Payload skill: .claude/skills/payload/ (if present).
=== END FILE ===

=== FILE: docs/build/00-OPERATING-RULES.md ===
# Operating rules

## Mission
Rebuild jaetravel.co.ke in this Payload CMS so the site matches the 9 boards in /design, with every piece of content, navigation, colour, string, URL prefix and page structure editable in the admin.

## Sources of truth (priority order)
1. /design boards (HTML, and PNG if present): layout, section order, hierarchy, behaviour. Colours, fonts and [bracketed] text are placeholders. Brackets become CMS fields, Translations keys or computed values.
2. docs/build/04-DESIGN-MATRIX.md: board section to block to data source. This is the checklist.
3. docs/build/01 to 03: data, services, architecture, SEO.
4. The Payload template conventions already in the repo.
If sources conflict: stop and ask.

## Protocol for every phase
1. Read BUILD_STATE.md and the matrix rows. Restate the scope in 10 bullets or fewer.
2. Plan: files to add or change, collection and field changes, migrations, risks. Wait for approval only at the gates below.
3. Implement in small steps. Touch only what the phase needs. Never delete files not named in an approved plan.
4. Self-review each matrix row: section present, same order, every board element present, every value from the CMS, empty optional data hides its section.
5. Verify: pnpm lint, generate:types, generate:importmap, test:int, build, and `pnpm seo:audit` once it exists. Report exact results. State what you could not run.
6. If a browser or screenshot tool exists, render at 1280px and 390px and compare with the board. If not, say so and give me a manual checklist.
7. Update docs/build/BUILD_STATE.md.

## Fidelity rules
- Do not add sections, features or copy that are not on a board without asking. Do not omit board elements without recording a deviation and reason.
- Match order, labels (as Translations keys), states (status chips use text plus a symbol, never colour alone), and responsive behaviour: sticky booking card on desktop becomes a bottom bar with a slide-up form on mobile; tabs scroll on mobile; galleries become swipe carousels.
- Missing optional data hides its section. Never invent reviews, ratings, prices, availability, licences or accessibility claims.
- Variants (standard, budget, accessible, specialty) are Templates in Payload, not code branches.
- One BookingCard component with tour, vehicle and joint modes. Totals always come from the pricing functions.

## Fidelity report (required with every page delivered)
A table, one row per board section: Section | Block or component | Data source | Status (Done, Partial, Missing) | Notes. Then deviations, then what you could not verify. A page is not Done while any row is Partial or Missing.

## Hard rules
- No hardcoded content, hex colours, literal visible strings or literal URL paths in components. Use CMS data, the Theme global, Translations and resolveHref.
- Migrations for every schema change. Baseline first.
- Stop and ask when: sources conflict; an owner decision is needed; a change would delete data or break content; a board element cannot be built as drawn.

## Phases and gates
1 Foundation (GATE: I approve before pages begin; owner decisions answered)
2 Tour page, standard template (GATE: I review on one real tour)
3 Itinerary PDF
4 Vehicles: detail, then hire listing
5 About
6 Home
7 Tour variants (budget, accessible, specialty), routes, redirects (GATE)
8 Joint safaris, bookings, payments (GATE before enabling payments)
9 Offers
10 Research hub and guides
11 Languages and RTL
12 Hardening: accessibility, performance, SEO audit, security, regression (GATE: final review)
Between gates, continue to the next phase without waiting, unless blocked. Each session starts by reading CLAUDE.md and BUILD_STATE.md.

## Definition of done
Every matrix row is Done. Every board is reproduced from CMS data in all 7 languages. A non-developer can create a landing page, reorder or hide sections on a tour page, change colours, nav, copy and URL prefixes in the admin with no code change. The SEO audit passes. No board element is missing or deviating without an approved reason.
=== END FILE ===

=== FILE: docs/build/01-BUILD-GUIDE.md ===
# Build guide: data, services and standards

## 1. Stack and starting point
- Payload 3.90.2, Next 16.3.3, React 19.2.6, @payloadcms/db-postgres, Tailwind 4 with shadcn/ui, Lexical, pnpm, Node >= 20.18.1. Database connected and empty. Nothing from earlier builds is carried over: build everything new inside Payload.
- In Next 16, `params` and `searchParams` are Promises. Await them.
- Route groups: app/(frontend) and app/(payload). Payload REST is at /api/[...slug]. Check for collisions when adding custom routes.
- Template conventions to follow: access helpers in src/access, slugField(), revalidate hooks per collection, getCachedDocument with tags, generatePreviewPath for preview and live preview, generated payload-types.ts.
- Step 0 strip: remove template demo seed content and the dashboard seed button, template branding ("Payload Website Template", @payloadcms), the template e2e test, unused blocks (Banner, Code) and heros. Keep Users, Media, Categories (nested docs), Pages, Posts, Header and Footer globals, and the SEO, redirects, search and form-builder plugins, live preview, drafts, jobs scaffold. List every file you delete.
- Fix stale files: .env.example and docker-compose.yml reference MongoDB and Node 18. Use Postgres and current Node.
- Create a baseline migration before the first schema change. Migrations only afterwards.
- Roles (admin, editor, ops) before any collection with personal data.
- Production media needs cloud storage (S3-compatible, R2 or Vercel Blob). Generated PDFs use the same.
- Localisation (en, de, fr, it, hi, zh, ar, English fallback) is enabled before any data exists. Arabic is RTL: dir on the document and logical CSS properties.

## 2. Data model (all localised text where relevant; money as integer US cents; versions and drafts on public content)
- **Tours**: variant/template relation, categories, destination, featured, summary, description, highlights, durationDays, groupSizes (2,4,6,8), gallery (Media), videos, itinerary days (title, body, hotel, meals, driveTime, mobilityLevel, image), pricing { mode manual, currency, matrix [season, p2, p4, p6, p8], singleSupplement, childDiscount, validUntil }, included, excluded, whyCheaper, accessibility group, whatToExpect group, faq, cancellationPolicy, bestTime, relatedTours, seo, itineraryPdf { file, generatedAt, sourceHash }.
- **Vehicles**: type (land-cruiser, extended-land-cruiser, safari-van, rooftop-camper, accessible, transfer), seats, specs rows, features, safety list, rates (Nairobi day hire, safari per day, airport transfer; length bands 1-3, 4-7, 8+), extras (name, price), gallery, videos, specSheetPdf, relatedTours, accessibility group (lift capacity, wheelchair spaces, transfer assistance, driver training), faq.
- **Hotels**, **Destinations** (nested), **Categories**.
- **Seasons** (named, with month/day ranges, optional per-year overrides), **FxRates**.
- **Offers**: type, target (tour or vehicle), discount (percent or fixed cents), validFrom, validUntil, travel period, destination, terms, featured, active. Was and now prices are computed. Expired or inactive offers never render.
- **Posts** (extended as guides): postType, topic, readTime, reviewedAt, author (Team), featured, relatedTours, relatedGuides, faq.
- **ParkSeasonality** (park, month 1-12, rating peak/good/fair/low, note; unique park+month), **CostGuide** global.
- **Reviews**: rating 1-5, author, country, date, body, target, source, verified-booking ref, consent, moderation status. Only approved reviews render. A hook keeps ratingSummary on the parent.
- **Team**, **Company** (story, stats, address, coordinates -1.286389, 36.817223 as sample, phone, whatsapp, email, hours, credentials, responsibleTourism), **SiteSettings** (contact, WhatsApp number and message templates, trust items, how-it-works steps, default FAQs, enabled currencies, joint-safari rules, social links, policy summaries), **Header**, **Footer**, **Routes**, **Translations**, **Theme**, **SeoSettings**, **Templates** (see doc 02).
- **Clients**, **Inquiries** (type tour/vehicle/joint/general, references, guests, dates, season, currency, USD amount, offer, UTM, consent, notification status), **NewsletterSubscribers**, **WaitlistEntries**.
- **Bookings**, **Payments**, **JointDepartures**, **SeatReservations** (Phase 8).
- Access: public read of published content only. Create, update and delete by role. Inquiries, Clients, Reservations and Payments are never publicly readable.

## 3. Shared services (build once)
- **Data layer**: lib/payload/ modules per domain, Local API in server components, typed mappers, controlled depth, draft support, cache tags, revalidate hooks that also refresh sitemaps.
- **Pricing engine** (pure functions, Vitest): seasonForDate, getTourPriceMatrix (manual mode now; keep the function boundary so computed mode can be added), perPersonPrice, estimateTour, estimateVehicle, applyOffer, convert, formatMoney. More than 8 guests returns custom-quote. All pages, cards, PDFs, schema and inquiries use these functions so numbers agree.
- **Inquiry pipeline**: zod-validated endpoint (type, ids, guests, dates, season, currency, contact, requests, offerId, consent, honeypot), persistent database-backed rate limiting, creates Inquiry and Client, notification adapter interface with email and WhatsApp (stubs until providers are chosen), existing success state pattern, records displayed currency and USD amount.
- **PDFs**: itinerary and spec sheet routes with branded output from the same CMS data, stored in Media with sourceHash and regenerated by a job when data changes. Use @react-pdf/renderer (recommended). Register fonts for Arabic, Hindi and Chinese or those PDFs render as boxes. Serve with Content-Disposition: attachment and descriptive filenames. Full itinerary also exists as HTML on the page.
- **Currency**: base USD, daily FxRates job, cookie remembers choice, show the rate date. Payment amounts follow the provider's supported currency; record both.
- **Internal linking**: getSimilarTours (variant group, then destination, then duration; manual overrides win; budget returns 2 budget + 1 standard; accessible returns accessible first). Link hubs from categories and destinations. Every "how it differs" line is a CMS field.
- **Jobs** (Payload Jobs; use the existing CRON_SECRET guard and a cron trigger if serverless): expireSeatHolds (every minute), refreshFxRates, regenerateItineraryPdf, checkJointCutoffs, sendBalanceReminders, notifyWaitlist.
- **Analytics events**: pdf_download, form_start/submit/success, whatsapp_click, customise_click, currency_change, offer_view/click, seat_reserve_start/success, waitlist_join.

## 4. Joint safaris (Phase 8)
- JointDepartures: tour, start and end date, vehicle (sets capacity), totalSeats, minGuestsToRun, cutoffDays, status (open, guaranteed, full, cancelled, completed), pricePerSeat by accommodation (twin share, single room) in cents, depositPercent, balanceDueDays, pick-up details, driver-guide, published, slug.
- SeatReservations: departure, client, seatCount, accommodation, traveller names (optional), status (held, confirmed, cancelled, refunded), holdExpiresAt, amounts, payment status, link to Booking.
- Seats left are always computed from confirmed and unexpired held reservations. Never store a typed number.
- Holds last holdMinutes. Expired holds are released by the job.
- No overbooking: allocate inside a Postgres transaction with row locking (`SELECT ... FOR UPDATE` on the departure) using Payload's transaction support. Write a test where two simultaneous requests compete for the last seat.
- Confirm seats only after the deposit succeeds. Status becomes guaranteed when confirmed seats reach the minimum, and stays guaranteed even if a guest later cancels (confirm this rule with me). Full when no seats remain, then waitlist.
- If the minimum is not reached by cutoffDays, notify each guest with options (move date, upgrade to private at the price difference, full refund). I approve any cancellation. Never auto-cancel.
- Solo travellers pair same-sex where possible, otherwise pay the single price. Collect pairing data only with consent. Show other guests' countries or languages only for guests who opted in; never names.
- Real seat counts only. No fake countdowns or scarcity.

## 5. Payload admin
- Group collections (Content, Commerce, Operations, Settings), set useAsTitle and default columns, write field descriptions explaining what each field drives on the site.
- Validation: a tour cannot publish without prices for every season and group size, alt text on every image and a title on every itinerary day. Offers need valid dates. Joint departures need vehicle, seats and minimum.
- Preview and live preview for every public collection (extend generatePreviewPath).
- Custom admin views: departure manager (bulk create, seats, reservations, payments, guests), manifest and rooming list export (PDF and CSV), not-filled outcome tool, a "pages needing data" report, and a rich-results readiness panel (doc 03).

## 6. Quality standards
- Accessibility: landmarks, labelled fields with clear errors, keyboard-operable filters, tabs, accordions and seat map (seats exposed as a list with state text), contrast at least 4.5:1 (note: white text on #EA580C is only 3.6:1, so buttons and links use the darker brand token), touch targets at least 44px, visible focus, reduced motion respected.
- Performance: next/image with sizes, lazy-load video and map, no layout shift, LCP under 2.5s on a mid-range phone on slow 4G for the first fold of tour pages.
- Security: server-side validation everywhere, rate limiting, honeypot or invisible CAPTCHA, no secrets in client code, personal data protected by access control.
- Testing: unit (seasons, pricing, offers, currency, seat logic), integration (inquiry endpoint, PDF routes, sitemap, schema), concurrency (last seat, hold expiry, deposit failure), Playwright end to end (tour booking total, PDF download, vehicle request, offer carried into inquiry, joint reservation, waitlist, language switch including Arabic), axe checks, manual checklist with every delivery.

## 7. Owner decisions to raise in your first reply (do not guess)
1. Brand fonts and logo; any secondary colours beyond the Theme defaults.
2. Email provider and WhatsApp channel.
3. Payment providers for card and M-Pesa (Daraja), supported currencies; request-only bookings at launch or online deposits.
4. Media and PDF storage provider; host type (serverless or server).
5. Locale routing: one [locale] segment (recommended) or separate folders.
6. Season names and date ranges.
7. Joint safaris: minimum guests, cutoff days, hold minutes, deposit percent, whether guaranteed persists after cancellations, pairing policy.
8. Real credentials to show, rating sources, cancellation and refund policy.
9. Licensable photos? Embed IPTC? Any physical goods for Merchant listings?
=== END FILE ===

=== FILE: docs/build/02-ARCHITECTURE-ZERO-HARDCODING.md ===
# Architecture: zero hardcoding

Code contains no content: no copy, URLs, colours, images, prices, navigation, policy text or page structure. Code holds only layout and styling logic, block renderers, data fetching, validation and business logic. A non-developer must be able to create a landing page, reorder or hide sections on tour pages, change colours, nav, copy and URL prefixes, entirely in the admin.

## 1. Pages are blocks
Every standalone page is a Pages document made of blocks: Home, About, Offers hub, Research hub, Vehicle hire listing, Joint safaris listing, Contact, policies. Each block is a config.ts (admin fields), a Component.tsx and, for data blocks, a typed query. Block library: Hero, SearchBar, StatsStrip, TrustRow, CategoryTiles, FeaturedTours, FeaturedVehicles, UpcomingDepartures, DestinationTiles, OffersGrid, FeaturedOffer, GuidesGrid, FeaturedGuide, PlanningTools, BestTimeTable, CostTable, Credentials, ServiceCards, TeamGrid, ReviewsBlock, HowItWorks, ValueProps, FaqBlock, SocialFeed, ComparisonTable, PolicyBlock, ContactBlock, CtaBand, LinkHubs, Newsletter, VehicleGrid, DepartureFinder, DepartureFilters, DepartureList, OfferFilters, GuideSearch, AvailabilityForm, RatesTable, GroupDiscountTable, RichText, Media, Form. Query blocks take collection, filters, sort, limit and manual picks from admin fields.

## 2. Detail pages are document plus template
Tours, Vehicles, JointDepartures, Guides and Offers render through the Templates collection: an ordered list of detail blocks (TitleBlock, Gallery, FactChips, StickyTabs, Overview, Itinerary, DownloadBand, PriceMatrix, HowBookingWorks, IncludedExcluded, Hotels, VideoBlock, ReviewsBlock, BestTime, FaqBlock, SimilarItems, LinkHubs, DepartureList, OfferBanner, AccessibilitySection, WhyCheaper, WhatToExpect, SpecsTable, FeaturesSafety, ToursUsingVehicle, SeatMap, PriceTable, PolicyBlock, BookingCard, AuthorBox). Each document has a template relation. Variants (standard, budget, accessible, specialty) are different templates, not code branches. Blocks read the current document from context. Editors reorder, hide and retitle sections without a deploy.

## 3. Routing
One catch-all resolver. A Routes global maps each collection to a URL prefix per locale (tours, vehicle-hire, offers, guides, joint-safaris, vehicles). Resolver order: prefix match then document by slug, else Pages by path. Components never contain path strings: links go through resolveHref(reference). Reserve and validate slugs to prevent clashes. Past departures and expired offers return 410 or redirect to the parent.

## 4. Globals
SiteSettings, Header, Footer, Company, Theme, Routes, Translations, SeoSettings.

## 5. UI strings
Every visible microcopy string (labels, buttons, errors, status words, placeholders, form hints) is a key in the localised Translations global, read with t('key'). A typed key manifest lives in code. The seed writes the English values. Never put literal text in JSX.

## 6. Theme
A Theme global holds colour tokens (brand, accent, ink, ground, line, muted, status colours), radius, button style and font choice from a fixed next/font list. Render it server-side into :root CSS variables. globals.css keeps structural CSS and safe fallbacks only. The admin warns when a text/background pair is below 4.5:1. Initial values: brand (buttons, links) #C2410C with hover #9A3412; accent #EA580C (confirmed from the live site's theme colour); ink #1C1917; ground #FAFAF9; line #E7E5E4; muted #57534E. Fonts: pending my answer (the boards use Bricolage Grotesque and DM Sans as placeholders). Add status tokens for guaranteed, filling, open and full.

## 7. Content seeds the site
A /content folder of JSON and Markdown files plus an importer creates every document: pages, templates, globals, Translations, and sample tours, vehicles, hotels, seasons and offers. Mark all sample content as sample. Provide a bulk import script from a spreadsheet for tours and vehicles. The importer rebuilds the content of the 9 boards from the HTML in /design, replacing [bracketed] placeholders with clearly labelled sample values.

## 8. Guardrails in CI
- ESLint: react/jsx-no-literals (or equivalent) for visible strings in components; no hex colours outside the Theme pipeline; no literal href="/..." paths.
- A test that every Translations manifest key has a default-locale value.
- A test that every block type used by a seeded page or template renders.

## 9. Performance
Block pages stay server-rendered, cached with tags and revalidated on change. Set depth deliberately. No per-block fetching in client components.

Acceptance: create a new landing page, a new template, a tour with sections shown and hidden, a colour change and a URL prefix change, all in the admin, with no code change.
=== END FILE ===

=== FILE: docs/build/03-SEO-SEARCH-CONSOLE.md ===
# Search Console enhancements and indexing

Goal: pages are indexable and every structured-data feature validates in Google Search Console: Enhancements (Breadcrumbs, Events, Image metadata, Review snippets, Videos) and Shopping (Product snippets, Merchant listings, Merchant opportunities).

## Where it lives
All new components are Payload blocks or fields (VideoBlock, ReviewsBlock, Breadcrumb, readiness panel). Styling comes from Theme tokens. JSON-LD is generated only by shared builder functions from mapped CMS data; never hand-written in components or content. SeoSettings holds organisation identity (name, logo, sameAs), enabled schema types per collection, default image creator and credit, and Merchant settings (default OFF).

## CMS fields
- Media: alt (required), creator, creditText, copyrightNotice, licenseUrl and acquireLicensePageUrl (optional). Defaults from Company or SeoSettings.
- Reviews: moderated and approved only, with the rating summary kept on the parent.
- videos on Tours, Vehicles, Guides and VideoBlock: YouTube URL, title, description, thumbnail, uploadDate, duration (all required to publish).
- Per document: seo.noindex, seo.canonicalOverride, seo.structuredOverrides.
- Validation hooks block publishing when required fields for an enabled schema type are missing (strict toggle). The readiness panel lists each type as valid or invalid with the reason.

## Schema by page type
- Every page except Home: BreadcrumbList with a visible breadcrumb. Items have position, name and item URL; the last may omit the URL.
- Tours: ["Product","TouristTrip"] with name, description, images, offers as AggregateOffer (lowPrice, highPrice, priceCurrency, offerCount, url, availability) computed from the price matrix. aggregateRating and review only from approved reviews actually shown on the page. VideoObject when a video exists.
- Vehicles: ["Product","Vehicle"] with offers from rates, approved reviews, videos.
- Joint departures: Event with name, startDate and endDate (ISO 8601 with +03:00), location (Place with name and PostalAddress for the pick-up), image, description, organizer, eventStatus, eventAttendanceMode (OfflineEventAttendanceMode) and offers (price per seat, priceCurrency, url, validFrom, availability from the real seat count). Never emit for past departures. Private tours are not Events.
- Guides: Article or BlogPosting with Person author (Team), datePublished, dateModified, images, videos.
- Home and About: Organization/TravelAgency (name, logo, address, geo, telephone, sameAs). No aggregateRating on Organization or LocalBusiness: Google ignores self-serving reviews.
- Images: ImageObject with contentUrl, creator, creditText, copyrightNotice. Add license and acquireLicensePage only if I confirm photos are licensable. Optionally embed IPTC into files; check the host allows it before promising.
- Videos: VideoObject with name, description, thumbnailUrl (high resolution), uploadDate, embedUrl, duration. The iframe or its embed URL is in the server-rendered HTML (lazy iframe is fine) and the video is visible content. Add a video sitemap.
- FAQPage markup is optional and low priority (FAQ rich results are now limited). Do not add WebSite SearchAction.

## Shopping
- Product snippets: Product needs name plus offers, review or aggregateRating, with complete values (numeric price, priceCurrency, availability, url, priceValidUntil, seller).
- Merchant listings and Merchant opportunities need a Merchant Center account and product data and are built for physical or digital goods. Tours and vehicle hire are services, so Google may not show them. Provide the Merchant settings group (default OFF): Merchant Center ID, return policy, shipping details. When enabled, emit hasMerchantReturnPolicy and shippingDetails only from real policy data and only for physical goods. Never invent shipping or return data for tours or hire. Report this as an owner decision.

## Page indexing validity
- Primary content and JSON-LD are server-rendered in the initial HTML. Status 200. One self-referencing canonical on https://www.jaetravel.co.ke (one www convention, no redirect chains).
- sitemap.xml lists only canonical, indexable 200 URLs for all locales, accurate lastmod, plus image and video sitemaps. robots.txt allows pages and media. noindex on admin, preview, drafts, search results, thank-you pages and filter combinations without their own category page.
- hreflang reciprocal across the 7 locales plus x-default. Expired offers and past departures: 410 or redirect to the parent.
- Key images are real <img> elements with crawlable src and alt. No orphan pages.

## Verification
Add `pnpm seo:audit`: crawl the sitemap, and for every URL check status, canonical, noindex, hreflang reciprocity, and parse each JSON-LD block against the required properties for its type. Output a report and fail CI on errors. Playwright tests for one page per type. I run Google's Rich Results Test and URL Inspection myself (you cannot), then submit the sitemap and watch each Enhancements and Shopping report after launch.
=== END FILE ===

=== FILE: docs/build/04-DESIGN-MATRIX.md ===
# Design-to-build matrix
Format: Section -> Block or component -> Data source. All text through Translations; all links via resolveHref; all colours via Theme. Reference files are /design/<name>.html.

Global on every page: UtilityBar (phone, email, languages, currencies) from SiteSettings; Header (nav, "Get a quote") from Header global; Footer from Footer global; WhatsAppButton from SiteSettings; Breadcrumb (all pages except Home).

## home (Pages doc, route /)
Hero + SearchBar -> Hero, SearchBar -> block fields; search routes to the tours listing with filters
TrustRow -> TrustRow -> SiteSettings.trust (hide items without data)
Kind-of-safari tiles -> CategoryTiles -> Categories
Popular safaris (4) -> FeaturedTours -> Tours.featured
Why JaeTravel -> ValueProps -> block fields
Destinations -> DestinationTiles -> Destinations
Build-your-own-itinerary band -> CtaBand -> block fields
Vehicle hire teaser (3) -> FeaturedVehicles -> Vehicles.featured
Joint departures teaser (3) -> UpcomingDepartures -> JointDepartures (open, future)
Reviews -> ReviewsBlock -> Reviews (approved)
How it works -> HowItWorks -> SiteSettings.steps
Journal and socials (4) -> SocialFeed -> social posts
Closing CTA -> CtaBand

## tour-page (Tours doc + Template: standard, budget, accessible, specialty)
Title block (H1, summary, Download PDF, Request) -> TitleBlock -> Tour fields
Gallery (1 large + 4 small, lightbox, swipe on mobile) -> Gallery -> Tour.gallery
Fact chips + trust row -> FactChips, TrustRow
Sticky tabs -> StickyTabs -> Template section order
Overview + highlights + contextual internal links -> Overview -> Tour.description, highlights
Accessibility section (accessible template) -> AccessibilitySection -> Tour.accessibility
Itinerary (collapsible days, first open) -> Itinerary -> Tour.itinerary
Download band -> DownloadBand -> Tour.itineraryPdf
Price matrix (seasons x 2/4/6/8, currency pills, per person/vehicle toggle, notes) -> PriceMatrix -> Tour.pricing, Seasons, FxRates
How booking works + cancellation -> HowBookingWorks -> SiteSettings
Included / not included -> IncludedExcluded -> Tour fields
Hotels -> Hotels -> itinerary hotels
Video -> VideoBlock -> Tour.videos
Reviews -> ReviewsBlock
Best time (3 cards with links) -> BestTime -> Tour.bestTime, ParkSeasonality
FAQ -> FaqBlock -> Tour.faq
Similar safaris (3) -> SimilarItems -> linking function
Link hubs -> LinkHubs
Next joint departures (3) -> DepartureList (compact)
Offer banner -> OfferBanner -> Offers
Budget template: price table under title, "Why it's cheaper" -> WhyCheaper -> Tour.whyCheaper
Specialty template: "What to expect" -> WhatToExpect
Booking card, tour mode (guests incl. more than 8 = custom quote, season auto from date, date, contact, PDF checkbox, live total, customise link, matching price cell highlighted) -> BookingCard
Mobile: bottom bar with slide-up form

## vehicle-hire (Pages doc)
Hero + availability form (request-only unless real availability exists) -> Hero, AvailabilityForm
Trust strip -> TrustRow
Filter chips + sort + vehicle grid (filters in URL) -> VehicleGrid -> Vehicles.type
Rates comparison table -> RatesTable -> Vehicles.rates
Why hire (4 cards) -> ValueProps
FAQ, SEO text, link hub, CTA -> FaqBlock, RichText, LinkHubs, CtaBand

## vehicle-detail (Vehicles doc + Template, also accessible vehicles)
Title + spec sheet PDF -> TitleBlock
Gallery, spec chips -> Gallery, FactChips
About + best for, specs table, features and safety -> Overview, SpecsTable, FeaturesSafety
Rates by hire type and length -> RatesTable
Accessibility details (accessible only) -> AccessibilitySection
Tours using this vehicle -> ToursUsingVehicle -> Vehicle.relatedTours
Reviews + FAQ
Booking card, vehicle mode (pick-up, drop-off, dates, driver, extras, live estimate) -> BookingCard
Similar vehicles -> SimilarItems

## offers (Pages doc)
Hero, filters (type, destination, month in URL) -> Hero, OfferFilters
Featured offer -> FeaturedOffer
Offer grid (badge, was/now, validity) -> OffersGrid -> active unexpired Offers
Group discount table -> GroupDiscountTable
How offers work -> HowItWorks
Email signup -> Newsletter
Terms FAQ, CTA

## research (Pages doc + Guides template)
Hero + search, topic chips -> Hero, GuideSearch
Planning tools (4) -> PlanningTools
Featured guide, latest guides + pagination -> FeaturedGuide, GuidesGrid -> Posts (guide)
Best time table (word per cell, "No data" when empty) -> BestTimeTable -> ParkSeasonality
Cost table -> CostTable -> CostGuide
Destination guides, accessible cluster -> DestinationTiles, LinkHubs
FAQ, author box, CTA -> FaqBlock, AuthorBox -> Team
Guide page: title, author, reviewed date, table of contents, body, related tours, FAQ, sticky quote card -> Guide template

## about (Pages doc)
Hero, stats strip (each hidden if empty) -> Hero, StatsStrip -> Company
Our story -> RichText
What we do -> ServiceCards
Credentials (only with data) -> Credentials -> Company.credentials
Fleet teaser -> FeaturedVehicles
Team grid -> TeamGrid -> Team
Responsible tourism -> RichText
Reviews -> ReviewsBlock
Contact block (address, hours, lazy map, message form) -> ContactBlock -> Company, inquiry endpoint
CTA

## joint-safaris (Pages doc)
Hero + departure finder -> Hero, DepartureFinder
How it works (4 steps) -> HowItWorks
Filter chips + status legend (text plus symbol) -> DepartureFilters
Departure list (live seats, progress bar, status, from-price, waitlist when full) -> DepartureList -> JointDepartures
Joint vs private table -> ComparisonTable
Not-filled policy (from the same fields as the logic) -> PolicyBlock
FAQ, CTA

## joint-departure (JointDepartures doc + Template)
Title, gallery, status and fact chips -> TitleBlock, Gallery
Seat map (list semantics, live) -> SeatMap -> SeatReservations
Itinerary -> Itinerary -> linked Tour
Price per seat (twin/single) -> PriceTable
Included, policy, FAQ, more departures -> IncludedExcluded, PolicyBlock, FaqBlock, DepartureList
Booking card, joint mode (seats limited to availability, accommodation, lead traveller, live total and deposit, hold timer, share on WhatsApp, private-safari link) -> BookingCard
=== END FILE ===

=== FILE: docs/build/BUILD_STATE.md ===
# Build state
Last updated: (date)
Current phase: Stage A complete, awaiting approval for Phase 1

## Matrix status
(one line per board section: Done / Partial / Blocked, with notes)

## Deviations from the boards (each needs a reason and my approval)

## Decisions received

## Open questions

## Unverified items

## Next step
=== END FILE ===

---

## PART 2. YOUR FIRST REPLY (do nothing else yet)

After creating the files:
1. List every file you created or replaced.
2. Confirm all 9 design files were found, and note anything unclear in them.
3. Summarise your understanding of the mission and architecture in 10 bullets or fewer.
4. List the owner decisions you need from me (the list is in docs/build/01-BUILD-GUIDE.md, section 7).
5. Propose the Phase 1 plan: files, collections, migrations, risks. Then wait for my approval.

## PART 3. STAGE B (after I approve)

Follow docs/build/00-OPERATING-RULES.md. Build Phases 1 to 12 in order. At the end of every phase, deliver the fidelity report and update docs/build/BUILD_STATE.md. In a new session, begin by reading CLAUDE.md and BUILD_STATE.md and continue from there.
