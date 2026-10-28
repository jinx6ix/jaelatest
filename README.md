# JaeTravel Expeditions website

Payload CMS 3 + Next.js 16 + Postgres. A fast, search-friendly safari website with a CMS the team can run without a developer.

* Bright orange brand theme taken from the logo, light and dark mode
* Hero slider with sliding animation, Ken Burns zoom, swipe, keyboard, pause button, and **YouTube video slides**
* Tours with in-page tabs (Itinerary, Inclusions, Exclusions, Booking, Gallery, Videos) that switch without loading another page
* Four tour types, each on its own URL: `/tours`, `/disability-tours`, `/budget-tours`, `/migration-tours`
* Join-in group departures, offers with real expiry dates, vehicle hire, blog, photo and video gallery, contact
* Booking form: country first (dial code appears), then phone, travellers and date. **The season and price come from the date.** Live currency switcher
* Seven languages (en, de, fr, it, hi, zh, ar with right-to-left) with English fallback
* Technical SEO: canonical and hreflang, rich results (JSON-LD), sitemap with images and videos, `llms.txt`, RSS, breadcrumbs

## Quick start

```bash
cp .env.example .env        # set DATABASE_URL (Postgres) and PAYLOAD_SECRET
pnpm install
pnpm dev                    # http://localhost:3000 (redirects to /en)
```

1. Open `http://localhost:3000/admin` and create the first admin user.
2. Load the sample content: `pnpm seed` (safe to run again, it updates instead of duplicating). `pnpm seed:fresh` removes the old sample tours, offers, departures, vehicles and gallery items first.
3. Visit `http://localhost:3000/en`.

The sample photos are illustrations drawn by `scripts/generate-sample-media.mjs`. Replace them with real photographs in the admin.

> **Use a new, empty database for this version.** The data model changed a lot (tours now have slugs, templates, price matrices and more). Pointing it at a database created by the previous version would make Payload try to rewrite tables. Keep the old database as a backup.

### Production

```bash
pnpm build
pnpm payload migrate        # creates all tables on an EMPTY database, run once per deployment
pnpm start
```

Development (`pnpm dev`) pushes the schema to the database automatically. Production uses the migration in `src/migrations`, which was generated from the current schema and tested on an empty database. Do not run `pnpm dev` and `pnpm start` against the same database: Payload will ask whether to discard the dev changes. After you change a collection or global, run `pnpm payload migrate:create <name>` and commit the new migration.

Set these in production: `DATABASE_URL`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL` (your real site address, for example `https://jaetravel.co.ke`), `CRON_SECRET`, `PREVIEW_SECRET`. Optional: `INQUIRY_NOTIFY_EMAIL`.

## What you can change in the admin (no code)

| I want to... | Go to |
|---|---|
| Change colours, corner radius, shadow | Site > Theme |
| Change the menu and the orange button | Site > Header |
| Change footer columns | Site > Footer |
| Change a URL prefix, for example `budget-tours` | Site > Routes (add a redirect from the old URL) |
| Change button text or translate it | Site > Translations (full list in `src/i18n/defaults.ts`) |
| Change phone, WhatsApp, email, trust lines, currencies and rates, social links, SEO defaults | Site > Site settings and Company |
| Add a tour | Tours > Tours. Pick a **template**: Standard, Budget, Accessible or Migration. The template decides the page sections, tab order and URL |
| Hide or reorder tabs and sections | Tours > Templates |
| Set season dates | Tours > Seasons. Every day must belong to exactly one season |
| Add prices | On the tour, Pricing tab. Money is in cents (76000 = $760) per person for 2, 4, 6 and 8 travellers, for each season |
| Add a **YouTube video** to a tour | On the tour, Media tab > Videos, paste the link |
| Add a **YouTube video** to the hero | Pages > Home > Hero slider > slide, set Kind to "YouTube video", paste the link. Keep the image: it is the poster and the fallback on phones, slow connections and for people who prefer reduced motion |
| Add videos to the gallery | Content > Gallery items, Type "Video (YouTube)" |
| Add an offer | Tours > Offers. It disappears on its own after its last booking date |
| Add a join-in departure | Tours > Join-in departures |
| See quote requests | Sales > Inquiries |

## How the site is organised

```
src/site/            all visual components (header, hero slider, tabs, booking form, cards, pages)
src/site/blocks.tsx  page blocks used by the home page and other Pages
src/lib/             pricing and seasons, routes, SEO metadata, JSON-LD builders, data queries
src/i18n/            built-in English text + the translations helper
src/collections/     Tours, Templates, Offers, JointDepartures, Vehicles, GalleryItems, Inquiries...
src/globals/         Theme, Routes, Translations, SiteSettings, Company (Header and Footer in src/Header, src/Footer)
src/endpoints/seed/  sample content and the seed runner
src/migrations/      database migrations
content/             sample artwork and the logo used by the seed
design/              design boards (home-v2.html and tour-page-v2.html are the approved designs)
docs/build/          the build rules and plan, plus JAETRAVEL_V2_AGENT_PROMPT.md
```

URL map: `src/lib/routes.ts` holds the defaults. A single catch-all route (`[slug]` and `[slug]/[detail]`) reads the Routes global, so changing a prefix needs no code change.

## SEO: what is done, and what only you can do

Done in code:
* One `<h1>` per page, semantic landmarks, breadcrumbs, skip link
* Unique title and description per page, canonical, hreflang for all 7 languages plus `x-default`, Open Graph and Twitter cards, `max-image-preview:large`
* JSON-LD built from CMS data only: `TravelAgency`, `WebSite`, `WebPage`, `BreadcrumbList`, `Product` + `TouristTrip` with `AggregateOffer` (prices match the visible table), `VideoObject` (YouTube), `Event` (join-in departures only), `Offer`, `BlogPosting`, `ItemList`, `FAQPage`, `ImageObject` with credit and copyright
* `sitemap.xml` with hreflang alternates, image and video entries. Expired offers, past departures and `noindex` pages are left out. `robots.txt`, `llms.txt`, `rss.xml`
* Hero image preloaded as the largest paint, every image has width and height, lazy loading below the fold, YouTube only loads on click (or after the poster paints on the hero)
* Filtered listing URLs are `noindex`; the wrong URL prefix for a tour 301-redirects to the right one; old `/posts/...` URLs redirect to `/blog/...`
* Reviews and ratings markup is **not** emitted, because there are no real reviews yet. Never add made-up ones
* Google Merchant markup is switched off, because tours and vehicle hire are services, not products

Needs you:
* Replace sample text, prices, dates and artwork with real ones. Give every photo alt text in Media
* Set the real site address in `NEXT_PUBLIC_SERVER_URL` or Site settings > SEO > Canonical origin, and choose one of `www` or no `www`
* Verify the site in Google Search Console and submit `/sitemap.xml`. Add `googleSiteVerification` in Site settings
* Check the Rich Results Test on a tour page, and the Events report for join-in departures
* Link a Google Business Profile and add it to `sameAs` through Site settings > Social
* Ranking depends on content, links and time. This project gives you a strong technical base; it cannot promise a position

## Known limits

* **Not yet reviewed in a browser by the developer who wrote this.** Types, production build, every page's HTML, the sitemap, the inquiry API and the pricing logic were all run and checked. The visual look, animations and client-side behaviour (tabs, slider, form) need your eyes. Playwright tests are in `tests/e2e`.
* The seeded Join-in departures show a status word, not seat numbers: seat counts need a reservation system, which is not built.
* "Build your own itinerary" is a placeholder page that points to Contact.
* No email provider is set up: quote requests are saved in the admin (Sales > Inquiries). Add a mail adapter in `payload.config.ts` and the notification in `src/lib/notify.ts` starts working.
* The inquiry rate limit is in memory. Use a shared store if you run more than one server.
* Fonts (Montserrat, Figtree) are downloaded from Google when you build.
* The `/search` page and some older page blocks still use the original template styling.
* The original template's ESLint configuration fails to load. It was like that before and is unchanged.
* Pages are rendered on request and sent with a 5 minute shared-cache header (`next.config.ts`). Remove that header if you do not want CDN caching.
