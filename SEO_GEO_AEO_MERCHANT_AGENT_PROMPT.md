# Prompt for the agent: SEO, GEO, AEO, Google Merchant and "Add as preferred source"

You are working inside the **JaeTravel v2 project** (Payload CMS 3 + Next.js 16 + Postgres). Read this like a recipe. **Everything you need to choose has already been chosen below.** Your job is to build it exactly, check it, and tell me the truth about what you could and could not verify. If something is missing, **stop and ask me** (section 2 lists what I must give you). Never guess an ID, a policy or a fact.

Send back **only new and changed files**, never the whole project.

---

## 0. The goal in plain words

1. Every page on the site (home, tours of all 4 types, offers, join-in departures, vehicles, blog posts, listing pages, gallery, about, contact, policy pages, and any new page an editor adds) has correct SEO: unique title and description, one canonical, correct language links, correct structured data, and a clean entry in the sitemap.
2. Google Search Console, **Page indexing**, shows **zero errors**.
3. These reports in Search Console show **valid items and no errors** (this is the list from my screenshot):
   * **Shopping:** Product snippets, Merchant listings, Merchant opportunities
   * **Enhancements:** Breadcrumbs, Events, Image Metadata, Review snippets, Videos
4. The site is easy for **AI assistants and answer engines** to read, quote and recommend (GEO = generative engine optimisation, AEO = answer engine optimisation).
5. **Google Merchant Center** works with this site: feed, return policy, shipping policy, store-quality widget and customer-reviews opt-in, using the account I already have.
6. **Google Analytics 4**, **Google site verification** and the other tracking from my old site are carried over, with consent.
7. A new **"Add as preferred source"** button sits **next to the WhatsApp button**.

---

## 1. What already exists (extend it, do not rebuild it)

| Thing | Where |
|---|---|
| Metadata builder (title, description, canonical, hreflang, Open Graph, Twitter, robots) | `src/lib/seo.ts` (`buildMetadata`) |
| JSON-LD builders (TravelAgency, WebSite, WebPage, BreadcrumbList, Product+TouristTrip, Event, VideoObject, ImageObject, Article, ItemList, FAQPage, Offer) | `src/lib/schema.ts` and `src/site/JsonLd.tsx` |
| Sitemap with hreflang, images and videos | `src/app/sitemap.ts` |
| `robots.txt`, `llms.txt`, RSS | `src/app/robots.ts`, `src/app/llms.txt/route.ts`, `src/app/rss.xml/route.ts` |
| SEO settings (title suffix, default description, default OG image, canonical origin, FAQ schema switch, Google verification, Merchant on/off) | global **Site settings > SEO** (`src/globals/SiteSettings/index.ts`) |
| Pages, tours, offers, departures, vehicles, posts | `src/app/[locale]/(frontend)/[slug]/page.tsx` and `[slug]/[detail]/page.tsx` |
| WhatsApp button | `src/site/WhatsAppButton.tsx`, styles `.jt-wa` in `src/app/[locale]/(frontend)/site.css` |
| Layout | `src/app/[locale]/(frontend)/layout.tsx` |
| Redirects plugin and `PayloadRedirects` component | already in the template |

Read `CLAUDE.md` and `docs/build/00-OPERATING-RULES.md`, `02-ARCHITECTURE-ZERO-HARDCODING.md` and `03-SEO-SEARCH-CONSOLE.md` first. Nothing is typed in code: IDs, policies and text come from the CMS or from environment variables.

---

## 2. What I must give you before you start (ask for these in your first reply)

I have already given you these. **Use them exactly**:

| Item | Value |
|---|---|
| Site address (canonical host) | `https://www.jaetravel.co.ke` (with `www`) |
| Google site verification token | `KxqG_F7q2oNg53VVm3kfIKzr782vQl7AfAH7Q3X4Ssg` |
| Google Merchant Center ID | `5694347760` |
| Phone and WhatsApp | `+254 726 485 228` |
| Email | `info@jaetravel.co.ke` |
| X (Twitter) handle | `@jaetravelkenya` |
| Business location (old site) | Nairobi, Kenya. Region code `KE-30`. Latitude `-1.286389`, longitude `36.817223` |
| Languages | en, fr, de, it, hi, ar, zh |
| Old site layout | pasted with this prompt (`app/(marketing)/layout.tsx`): it loaded fonts, JSON-LD, hreflang, GTM, GA4 and Ahrefs only after cookie consent, the Subscribe-with-Google (preferred source) scripts, and a cookie banner |

**I still have to give you these. Ask me for each one, and do not continue past a step that needs it:**

1. From my **old project**, copy these files (you must reuse them, not rewrite them from memory): `components/CookieConsent`, `components/DynamicScripts`, `components/GooglePreferredSource`, `components/analytics-tracker`, `_components/BrandShell`, `manifest.json`, the old `robots`, the old sitemap code, and any redirects.
2. The **GA4 measurement ID** (`G-XXXXXXXXXX`), the **GTM container ID** (`GTM-XXXXXXX`) and the **Ahrefs analytics key** (these were loaded by `DynamicScripts`).
3. **Merchant Center details**: how products were supplied before (feed file, API or website markup), my shipping settings and my return settings as they are in Merchant Center now, the exact `POSITION` and `REGION` values I picked for the store-quality widget, and whether the "Customer reviews" program is enabled.
4. **The real return and cancellation policy** and **the real shipping or delivery policy**, in my words. You cannot write these. They are legal text. Until I give them, the policy pages stay as clearly marked drafts and the policy markup stays switched off.
5. From **Google Search Console** (Property: `https://www.jaetravel.co.ke/`): the export of *Page indexing > All known pages* and the list of the old sitemap URLs. You need it to build the redirect map (section 4.A.5).
6. My profile links for `sameAs`: Facebook, Instagram, YouTube, TikTok, LinkedIn, Tripadvisor, Google Business Profile, X, Wikipedia or Wikidata if they exist.

Reply with **10 bullets or fewer** saying what you understood, plus the questions in section 11. Wait for my answers.

---

## 3. Decisions already made (build these, do not re-decide)

| # | Decision | Why |
|---|---|---|
| 1 | **English has no language prefix.** `https://www.jaetravel.co.ke/tours/...` is English. Other languages use `/fr/...`, `/de/...`, `/it/...`, `/hi/...`, `/ar/...`, `/zh/...`. `/en/...` 308-redirects to the same path without `/en`. | My old site had English at the root. Keeping the old addresses keeps my rankings and my indexed pages. The new project currently uses `/en/` everywhere, which would break every old link. |
| 2 | One **canonical host**: `https://www.jaetravel.co.ke`. `http`, the bare domain and `www` variations 301 to it. No trailing slash. Lower case only. | Stops duplicate pages. |
| 3 | **Self-canonical on every indexable page**, including language versions (each language points to itself) with reciprocal `hreflang` for all 7 languages plus `x-default` (= English). | Prevents hreflang errors. |
| 4 | **Structured data is made only by the builders in `src/lib/schema.ts`**, from CMS data, so it always matches what visitors see. No copy and paste JSON-LD in components. | Google penalises markup that does not match the page. |
| 5 | **No fake reviews, ratings, prices, seat counts or policies.** Review and rating markup is switched on only for items that have real, approved, visible reviews. | Protects the site from a manual action. |
| 6 | **Consent Mode v2**: analytics and marketing scripts load only after consent. Default is *denied*. | Required in the EU and Kenya (Data Protection Act). |
| 7 | **AI crawlers: allow search and answer bots, decide on training bots in the admin** (default: allow all). | Citations from assistants are traffic. |
| 8 | **Sitemap index** (`/sitemap.xml`) pointing to separate sitemaps per type. | Easier to diagnose in Search Console. |
| 9 | **Merchant markup and the Merchant feed are controlled by one switch** in Site settings and one policy block (see section 6), so I can turn Merchant off without touching code. | Tours are services (see the honest note in section 6.1). |
| 10 | **Docs to check before you code each part** (specs change): the Google Search Central pages for Product, Merchant listing, Merchant return policy, Shipping policy, Event, VideoObject, Image license metadata, Breadcrumb, Review snippet, FAQ, Article, Organization, and the Merchant Center help pages for product data, feeds, shipping, returns and "Customer reviews". Quote the page and date in your report. | They change. |

---

## 4. Workstream A: Indexing foundation (this is what makes "Page indexing" show zero errors)

### A.1 URL scheme (decision 1 and 2)
* Create `src/proxy.ts` (in Next 16 the old `middleware.ts` is called `proxy.ts`; check `node_modules/next/dist/docs/` for the exact name and API) that:
  1. **Rewrites** a path with no language prefix to the English route internally (`/tours` is served by `/en/tours` inside the app, the address in the browser does not change).
  2. **Redirects (308/301)** `/en` and `/en/...` to the unprefixed address.
  3. Forces the canonical host and https.
* Replace **every** hand-built `` `/${locale}...` `` string in the code with **one helper**: `localePath(locale, path)` (English returns the path unchanged, other languages return `/${locale}${path}`). Find them all with a search for `` `/${locale} `` and `withLocale(`. This includes `resolveLink`, `docPath` users, breadcrumbs, cards, the footer, the sitemap, hreflang, `llms.txt`, RSS, JSON-LD URLs, and the language switcher.
* The Payload admin (`/admin`) and the API (`/api`) stay outside this scheme.

### A.2 Canonical, hreflang, robots meta
* `buildMetadata` outputs: one `rel="canonical"` (self), one `hreflang` link for each language **that has a published translation of that page**, plus `x-default`. If a language has no translation of a page, **do not list it** (this avoids "alternate page" errors and duplicate-content). Add a per-document helper `availableLocales(doc)` to decide.
* Filtered and parameter pages (`?destination=`, `?length=`, `?type=`, `?page=`, `utm_*`, `gclid`, `fbclid`): canonical to the clean address, and `noindex,follow` for filtered listings (already partly done). Never put them in the sitemap.
* Pages that must be `noindex`: `/search`, `/admin`, thank-you and confirmation pages, preview and draft pages, unpublished or expired items. A `noindex` page must **never** appear in a sitemap and must **not** be blocked in `robots.txt` (Google cannot see the `noindex` if it cannot crawl the page).

### A.3 Status codes (these cause most Page-indexing errors)
| Case | Must return |
|---|---|
| Normal page | 200 |
| Old address that moved | **one** 301 to the final address (never a chain of redirects) |
| Wrong URL prefix for a tour | 301 to its right address (already done) |
| Expired offer, past departure, unpublished item | **410** if it was real before, **404** if it never existed. The page must show a helpful message and links, and must **not** return 200 with an error message (that is a *soft 404*) |
| Server error | never. Wrap data fetching so a database error shows an error page with a 503 and `Retry-After`, never a crash |

### A.4 Sitemaps
* `/sitemap.xml` = **sitemap index**. Children: `sitemap-pages.xml`, `sitemap-tours.xml`, `sitemap-offers.xml`, `sitemap-departures.xml`, `sitemap-vehicles.xml`, `sitemap-blog.xml`, `sitemap-images.xml`, `sitemap-videos.xml`. Each under 50,000 URLs and 50 MB.
* Only **canonical, indexable, status 200** URLs. `lastmod` is the real last change date of the content (not "now"). No `priority` or `changefreq` (Google ignores them).
* Each URL lists its `xhtml:link` alternates for the languages that exist.
* `robots.txt` lists the sitemap index. (Details in A.6.)
* Add `IndexNow` pings (Bing, Yandex, Seznam, Naver) in the publish hooks: a key file at `/<key>.txt` and a small `src/lib/indexnow.ts`. Google does not use IndexNow; Google finds changes from the sitemap and from internal links.

### A.5 Redirect map from the old site
* Build the map from the two files I give you (Search Console export and old sitemap). Save it as `content/redirects/legacy-urls.csv` (`from,to,status,note`).
* Load it into the **Redirects** collection (the template's `redirects` plugin) with a seed script. Check that every `from` returns **one hop** to a **200** page. Anything with no match goes to the closest listing page and is reported to me. Report a table: *old URL | new URL | type | needs my decision*.
* Examples to expect: old `/tours/<slug>` for tours that are now budget, accessible or migration tours (redirect already handled by the app), `/blog/...`, `/itinerary-builder`, `/blog/rss.xml`.

### A.6 `robots.txt` (build exactly this, values from the CMS)
```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/
Disallow: /search
Disallow: /*?*utm_
Disallow: /*?*gclid=
Disallow: /*?*fbclid=

# Answer engines and assistants (citations and live answers)
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Claude-SearchBot
Allow: /
User-agent: Claude-User
Allow: /
User-agent: Googlebot
Allow: /
User-agent: Bingbot
Allow: /

# Training crawlers (switch each on or off in Site settings > SEO > AI crawlers; default Allow)
User-agent: GPTBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: CCBot
Allow: /

Sitemap: https://www.jaetravel.co.ke/sitemap.xml
```
Do **not** disallow `/_next/` or the images, CSS and JavaScript (Google needs them to render the page). Generate the file from the CMS (`src/app/robots.ts`) so the training-crawler rows follow the switches.

### A.7 Checklist: every Page-indexing status and its fix
The agent cannot open my Search Console. So it must make sure none of these can be caused by the site, and give me a verification checklist.

| Search Console status | What causes it here | What you build or check |
|---|---|---|
| Server error (5xx) | database down, crash in a page | error boundary, 503 page, health check `/api/health`, no data fetch without try/catch |
| Redirect error / Page with redirect | redirect chains, loops, `/en` redirects | A.1 and A.5: one hop only. Audit script checks |
| Submitted URL not found (404) | URL in sitemap that is unpublished or removed | sitemap only has live items. Audit script crawls every sitemap URL |
| Submitted URL seems to be a soft 404 | thin or empty listing, expired offer returning 200 | A.3. A listing with 0 items returns 200 only if it has real text and links, otherwise 404 |
| Submitted URL marked "noindex" | noindex page in a sitemap | A.2, A.4 |
| Blocked by robots.txt | `Disallow` too wide | A.6 |
| Duplicate without user-selected canonical / Duplicate, Google chose different canonical | no or wrong canonical, trailing slash, `/en/` vs root, parameters | A.1, A.2 |
| Alternate page with proper canonical | normal for language and parameter variants | no action. Tell me it is expected, not an error |
| Crawled, currently not indexed / Discovered, currently not indexed | thin or duplicate content, weak internal links | workstream G (unique answer-first content) and the internal-link rules in G.5 |
| Unauthorized (401) / Forbidden (403) | admin, bot-blocking, rate limit | never rate-limit or block Googlebot. Allow its user agent through |
| hreflang problems (in International targeting) | non-reciprocal links, wrong codes, missing self reference | A.2: each language lists itself and all others, and `x-default` |

---

## 5. Workstream B: Metadata for every page type

* Use `buildMetadata` for **all** routes (including the new policy pages). Add per-document SEO fields where missing: `seo.title`, `seo.description`, `seo.image`, `seo.noindex`, `seo.canonicalOverride` (rare).
* Rules (the admin warns when broken, and `pnpm seo:audit` fails the build):
  * Title 30 to 60 characters, description 120 to 155 characters, **unique across the site**.
  * The brand suffix (` | JaeTravel Expeditions`) is added only when the title stays under 60 characters.
  * One `<h1>` per page. Heading order never skips a level.
* Automatic titles when the editor leaves the field empty:

| Page type | Title pattern | Description pattern |
|---|---|---|
| Tour | `{Tour title}, {N} days from {price}` | summary plus "Book with a local Kenya team" style text built from fields, not typed |
| Offer | `{Offer name}: {badge}` | offer summary and the end date |
| Departure | `{Tour} departing {date}` | seats status and price per seat |
| Vehicle | `{Vehicle name} hire in Kenya` | summary and daily price |
| Listing | `{Section title}` plus count | section text |
| Blog post | the post title | the post description |

* **Open Graph images**: add `opengraph-image` routes using `next/og` (`ImageResponse`), 1200 × 630, brand colours, the tour photo, title and "from $price". One for tours, offers, departures, vehicles and posts, with a fallback to the default OG image. Set `alt`.
* Twitter: `summary_large_image`, site `@jaetravelkenya`.
* `<html lang>` and `dir` per language (already done). Add `geo.region`, `geo.placename`, `geo.position` and `ICBM` meta from Company settings (values in section 2, never typed).
* Favicons and `manifest.webmanifest` from the CMS logo (the old project had `/favicon.ico`, `/apple-touch-icon.png`, `/manifest.json`; port them).

---

## 6. Workstream C and D: Structured data and Google Merchant

### 6.1 An honest note you must repeat to me in your report
Google's Merchant listings, Product snippets and the Merchant Center are designed for **physical goods**. Tours and vehicle hire are **services**. They can be marked up as `Product` and often show in Search Console, but **Google may reject a service feed in Merchant Center or show "limited" items**. So: build the markup and the feed **correctly and fully**, put everything behind the Merchant switch, and add a diagnostics checklist so I can see in Merchant Center what Google accepts. If Google rejects them, I turn the switch off. **Do not hide errors and do not disguise a tour as a physical product.** Also check whether "Google Things to do" or "Travel" feeds are a better fit and tell me (one paragraph).

### 6.2 What to build for each Search Console report

| Report in my screenshot | Built on | Required and recommended fields (all from CMS) | Where |
|---|---|---|---|
| **Product snippets** | `Product` (+ `TouristTrip`) on every tour and vehicle page | `name`, `image` (1200 px wide minimum, several), `description`, `sku`, `brand`, `offers` (see below). `aggregateRating`/`review` **only** with real, approved reviews shown on the page | tour pages, vehicle pages |
| **Merchant listings** | the same `Product`, with a single `Offer` or `AggregateOffer` plus shipping and return data | `offers.price`, `priceCurrency`, `availability`, `itemCondition`, `url`, `priceValidUntil`, `hasMerchantReturnPolicy`, `shippingDetails`, `seller` | tour pages, vehicle pages |
| **Merchant opportunities** | Merchant Center linked to Search Console and the website, with complete policies and a product feed | return policy, shipping policy, contact page, `gtin` or `mpn` or `identifier_exists=no`, accurate price and stock | Merchant Center and the feed (6.4) |
| **Breadcrumbs** | `BreadcrumbList` on **every page except home** | `itemListElement[].position`, `name`, `item` (the last item has no `item`) | all pages (exists; keep it matching the visible breadcrumb) |
| **Events** | `Event` on join-in departures **only** | `name`, `startDate` and `endDate` with a time zone offset (for example `2027-03-14T08:00:00+03:00`), `eventStatus`, `eventAttendanceMode`, `location` (`Place` with a full `address`), `image`, `description`, `organizer`, `offers` (`price`, `priceCurrency`, `availability`, `url`, `validFrom`) | departure pages. Never on private tours. Never for past dates |
| **Image Metadata** | `ImageObject` instead of a bare image URL, with licence information | `contentUrl`, `creator`, `creditText`, `copyrightNotice`, `license` (URL of a licence page), `acquireLicensePage` (URL of a page that says how to license it) | the main image of tours, vehicles, posts, and gallery photos. The Media collection already has `creditText` and `copyrightNotice`; add `creator`, `licenseUrl`, `acquireLicensePageUrl`. Embed the same data as IPTC metadata when processing images |
| **Review snippets** | `Review` and `AggregateRating` inside the `Product` | `reviewRating.ratingValue`, `bestRating`, `author`, `datePublished`, `reviewBody`, `ratingCount` or `reviewCount` | **only when real reviews exist** (6.5) |
| **Videos** | `VideoObject` for every YouTube video | `name`, `description`, `thumbnailUrl`, `uploadDate` (ISO with time zone), `embedUrl`, `duration` if known | tour pages, gallery, posts. Add the video sitemap (A.4) |

### 6.3 The exact JSON-LD for a tour (copy this shape into `tourNode`)
```json
{
  "@context": "https://schema.org",
  "@type": ["Product", "TouristTrip"],
  "@id": "https://www.jaetravel.co.ke/tours/masai-mara-luxury-safari#trip",
  "name": "Masai Mara Luxury Safari",
  "description": "...",
  "image": [
    {
      "@type": "ImageObject",
      "contentUrl": "https://www.jaetravel.co.ke/media/masai-mara-hero-1600.jpg",
      "creator": { "@type": "Organization", "name": "JaeTravel Expeditions" },
      "creditText": "JaeTravel Expeditions",
      "copyrightNotice": "© 2026 JaeTravel Expeditions",
      "license": "https://www.jaetravel.co.ke/image-licence",
      "acquireLicensePage": "https://www.jaetravel.co.ke/contact"
    }
  ],
  "sku": "JT-masai-mara-luxury-safari",
  "brand": { "@type": "Brand", "name": "JaeTravel Expeditions" },
  "offers": {
    "@type": "Offer",
    "url": "https://www.jaetravel.co.ke/tours/masai-mara-luxury-safari",
    "priceCurrency": "USD",
    "price": "3500.00",
    "priceValidUntil": "2027-12-31",
    "availability": "https://schema.org/InStock",
    "itemCondition": "https://schema.org/NewCondition",
    "seller": { "@id": "https://www.jaetravel.co.ke/#org" },
    "hasMerchantReturnPolicy": {
      "@type": "MerchantReturnPolicy",
      "applicableCountry": ["KE", "US", "GB", "DE", "FR", "IT", "AE", "IN", "CN"],
      "returnPolicyCategory": "<FROM POLICY BLOCK: MerchantReturnFiniteReturnWindow | MerchantReturnNotPermitted | MerchantReturnUnlimitedWindow>",
      "merchantReturnDays": "<FROM POLICY BLOCK>",
      "returnFees": "<FROM POLICY BLOCK>",
      "refundType": "<FROM POLICY BLOCK>",
      "merchantReturnLink": "https://www.jaetravel.co.ke/returns-and-cancellations"
    },
    "shippingDetails": {
      "@type": "OfferShippingDetails",
      "<FROM POLICY BLOCK: doesNotShip true for in-person services, or shippingRate and deliveryTime>": ""
    }
  }
}
```
Rules:
* If `offers` has several prices (seasons and group sizes) use `AggregateOffer` with `lowPrice`, `highPrice`, `offerCount`, `priceCurrency`, and keep the visible "from" price equal to `lowPrice`.
* Prices in JSON-LD are the **same number the page shows**, in US dollars, with two decimals.
* The `<FROM POLICY BLOCK>` values come from section 6.6. If the policy block is not filled in or the Merchant switch is off, **leave `hasMerchantReturnPolicy` and `shippingDetails` out completely** (never a half-filled object).
* Reviews (only when real):
```json
"aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "27", "bestRating": "5" },
"review": [{ "@type": "Review", "author": { "@type": "Person", "name": "..." }, "datePublished": "2026-09-02", "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }, "reviewBody": "..." }]
```

### 6.4 The Merchant Center product feed
* Endpoint `GET /merchant-feed.xml` (Google Shopping RSS 2.0, namespace `xmlns:g="http://base.google.com/ns/1.0"`), generated on request and cached 1 hour. One `<item>` per **published** tour and vehicle. Fields:
  `g:id` (= SKU), `g:title`, `g:description` (plain text), `g:link` (canonical address), `g:image_link` (first photo, at least 800 px) and up to 10 `g:additional_image_link`, `g:availability` (`in_stock`), `g:price` (`3500.00 USD`), `g:brand`, `g:condition` (`new`), `g:identifier_exists` (`no`), `g:product_type` (for example `Tours > Disability tours`), `g:google_product_category` (choose from Google's taxonomy file for travel or experiences; **look it up, do not invent a number**), `g:shipping` and `g:return_policy_label` or `g:return_address` **only** if they exist in the policy block, `g:custom_label_0..4` (tour type, destination, duration band, price band, season).
* A feed health page in the admin (`Site > Merchant`) shows: item count, items missing a required field, last generation time. Add `pnpm merchant:validate` that reads the feed and lists problems.
* Tell me how to add the feed in Merchant Center (Products > Feeds > scheduled fetch of the URL above). Do not claim it is added.

### 6.5 Reviews (so "Review snippets" can ever be valid)
* Build the **Reviews** collection that `docs/build/01-BUILD-GUIDE.md` describes: `rating` (1 to 5), `author`, `country`, `date`, `title`, `body`, `target` (tour or vehicle), `source` (`site`, `google`, `tripadvisor`), `verifiedBooking`, `consent`, `status` (`pending`, `approved`, `rejected`). Only `approved` reviews are shown.
* A hook keeps `ratingSummary` (average and count) on each tour and vehicle. A **visible reviews section** on the page shows the reviews that the markup describes (this is required: markup must match visible content).
* **Never** import the ratings and review counts that were in my old data files. I will import real ones later.
* A "Write a review" form (spam-protected) saves as `pending`.
* `Review snippets` markup is emitted **only** when a tour has at least 1 approved review, and `AggregateRating` only when it has at least 3. Never put review markup on the Organization or on pages that are not about that product (self-serving reviews are not eligible).

### 6.6 CMS fields for Merchant (Site settings > Merchant). Build these exactly
| Field | Type | Notes |
|---|---|---|
| `enabled` | checkbox, default **off** | the one switch (decision 9) |
| `merchantId` | text, default `5694347760` | |
| `feedEnabled` | checkbox | |
| `returnPolicy.category` | select: `finite-window`, `not-permitted`, `unlimited-window` | |
| `returnPolicy.days` | number | shown only for `finite-window` |
| `returnPolicy.refundType` | select: `full`, `exchange`, `store-credit` | |
| `returnPolicy.fees` | select: `free`, `customer-pays`, `restocking` | |
| `returnPolicy.method` | select: `by-mail`, `in-store`, `at-kiosk` | optional |
| `returnPolicy.countries` | list of ISO country codes | |
| `returnPolicy.pageSlug` | relationship to a Page | the page that explains it (used for `merchantReturnLink`) |
| `shipping.mode` | select: `does-not-ship` (in-person service), `digital`, `ships` | |
| `shipping.rate`, `shipping.handlingDays`, `shipping.transitDays`, `shipping.countries` | numbers and codes | only for `ships` |
| `shipping.pageSlug` | relationship to a Page | explains delivery of the service |
| `storeQuality.widgetEnabled` | checkbox | |
| `storeQuality.position`, `storeQuality.region` | text | **the exact values from Merchant Center. I will give them.** |
| `customerReviews.optInEnabled` | checkbox, default **off** | see 6.8 |

Also create these **Pages** (seeded as drafts, clearly marked "Draft: replace with the real policy"): `returns-and-cancellations`, `shipping-and-delivery` (explaining how a service is delivered), `privacy-policy`, `terms-and-conditions`, and make sure `contact` shows my address, phone and email. Merchant Center needs contact, return, privacy and terms pages. **Do not invent the policy text. Leave placeholders that I must replace, and keep the markup off until I do.**

### 6.7 Store-quality widget (from my old Merchant setup)
Build a client component `MerchantWidget` that loads the script and starts it. **Do not paste my snippet into the layout.** Use `next/script` with `strategy="afterInteractive"`, and only when `storeQuality.widgetEnabled` is on and consent for marketing is granted:
```tsx
'use client'
import Script from 'next/script'
export function MerchantWidget({ merchantId, position, region }: { merchantId: number; position?: string; region?: string }) {
  return (
    <Script
      id="merchantWidgetScript"
      src="https://www.gstatic.com/shopping/merchant/merchantwidget.js"
      strategy="afterInteractive"
      onLoad={() => {
        // @ts-expect-error global added by the Google script
        window.merchantwidget?.start({ merchant_id: merchantId, position, region })
      }}
    />
  )
}
```
Rules: render it once in the layout; never block rendering; do not place it over the WhatsApp or preferred-source buttons (the widget position is a CMS value; on small screens keep it left and the floating buttons right).

### 6.8 Google Customer Reviews opt-in (the survey)
Build `GoogleCustomerReviewsOptIn` (client component). **It must only run after a real confirmed booking**, because the opt-in needs an order id, the customer's email, the delivery country and an estimated delivery date. For tours, **use the trip end date as the "estimated delivery date"**. An inquiry is not an order, so **do not show it on the inquiry success screen.**
```tsx
'use client'
import { useEffect } from 'react'
type Props = { merchantId: number; orderId: string; email: string; deliveryCountry: string; estimatedDeliveryDate: string; gtins?: string[] }
export function GoogleCustomerReviewsOptIn(p: Props) {
  useEffect(() => {
    const s = document.createElement('script')
    s.src = 'https://apis.google.com/js/platform.js?onload=renderOptIn'
    s.async = true; s.defer = true
    ;(window as any).renderOptIn = () => {
      ;(window as any).gapi.load('surveyoptin', () => {
        ;(window as any).gapi.surveyoptin.render({
          merchant_id: p.merchantId,
          order_id: p.orderId,
          email: p.email,
          delivery_country: p.deliveryCountry,
          estimated_delivery_date: p.estimatedDeliveryDate,
          ...(p.gtins?.length ? { products: p.gtins.map((gtin) => ({ gtin })) } : {}),
        })
      })
    }
    document.body.appendChild(s)
    return () => { s.remove(); delete (window as any).renderOptIn }
  }, [p.merchantId, p.orderId, p.email, p.deliveryCountry, p.estimatedDeliveryDate])
  return null
}
```
* Mount it only on a booking confirmation page `/booking/confirmed?token=...` that is `noindex`, opened from a **signed, expiring token** that the team creates when a booking is confirmed (a small admin action on the Inquiry/Booking record, or a later booking system). Until bookings exist, build the component and the route, keep `customerReviews.optInEnabled` **off**, and tell me what is missing.
* Pass real values only. `estimated_delivery_date` format is `YYYY-MM-DD`. `delivery_country` is a two-letter code. Never put customer data in the URL (use the token and read it server-side).

---

## 7. Workstream E: Analytics and Search Console tags (reuse my old setup)

* **Google site verification**: put the token from section 2 in `Site settings > SEO > googleSiteVerification` and output **both** the `metadata.verification.google` value and an explicit `<meta name="google-site-verification">`. Keep the DNS record as the backup method.
* **Port my old components**: `CookieConsent`, `DynamicScripts`, `analytics-tracker`, `OrderContext` if still needed. Do not rewrite them from memory. Show me a diff of what you changed to fit the new layout, the language provider and the theme.
* **Consent Mode v2.** In `<head>`, before any Google tag, a small inline script sets the defaults to *denied*:
```js
window.dataLayer = window.dataLayer || []
function gtag(){ dataLayer.push(arguments) }
gtag('consent', 'default', {
  ad_storage: 'denied', analytics_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
  functionality_storage: 'granted', security_storage: 'granted', wait_for_update: 500
})
gtag('set', 'url_passthrough', true)
```
  When the visitor accepts, `CookieConsent` calls `gtag('consent','update', {...})` and then loads GTM (`GTM-…`) and GA4 (`G-…`) and the Ahrefs script, as `DynamicScripts` did. Store the choice and respect it on every page load.
* IDs come from environment variables, **not** from code: `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_AHREFS_KEY`. Add them to `.env.example`. Show a warning in the admin if one is empty.
* **Events** (send with `gtag('event', ...)` or the `dataLayer`, after consent only). Use these exact names:

| Event | When | Parameters |
|---|---|---|
| `view_item_list` | a tour list loads | `item_list_name`, `items[]` |
| `select_item` | a tour card is clicked | `items[]` |
| `view_item` | a tour, offer or vehicle page loads | `currency`, `value`, `items[]` (`item_id` = SKU, `item_name`, `item_category` = tour type, `price`) |
| `form_start` | the visitor focuses the first field of the inquiry form | `form_type` |
| `generate_lead` | the inquiry is sent successfully | `currency`, `value` (the estimate), `form_type`, `tour_slug`, `country` |
| `click_whatsapp` | the WhatsApp button | `placement` |
| `click_preferred_source` | the preferred-source button | none |
| `currency_change`, `tab_view`, `hero_slide_view` | as named | `currency`, `tab`, `slide` |

  Mark `generate_lead` as the key conversion event in GA4 (tell me to do this in the GA4 admin). Save UTM values and `gclid` with the inquiry (the `Inquiries` collection already has `sourcePath`; add `utmSource`, `utmMedium`, `utmCampaign`, `gclid`).
* Keep **Vercel Analytics** (`@vercel/analytics`) if the project is hosted on Vercel. It is cookie-free and does not need consent.

---

## 8. Workstream F: "Add as preferred source" next to the WhatsApp button

* **Reuse my old component and scripts.** The old layout loaded two Subscribe-with-Google scripts (`https://news.google.com/swg/js/v1/swg.js` with `data-preferred-sources-control="manual"`, and a `publisher.js` script) and a `GooglePreferredSource` component that calls `addPreferredSource()` when pressed. I will give you the component file. **Copy its logic exactly. Do not write the `addPreferredSource` call from memory.** Load the scripts with `next/script` and `strategy="afterInteractive"` inside the layout body (not by hand in `<head>`).
* Build one container component `src/site/FloatingActions.tsx` that holds **both** buttons, side by side:
  * Desktop (width 1001 px and more): fixed, bottom right, `display:flex; flex-direction:row-reverse; gap:12px`. **WhatsApp is the right-most button and the preferred-source button sits immediately to its left**, same height (48 px), same shadow, same corner radius (pill).
  * Phones and tablets (1000 px and less): both become 48 × 48 px **icon buttons** side by side, above the mobile booking bar (`bottom: calc(86px + env(safe-area-inset-bottom))`), with visible `aria-label`s. WhatsApp stays on the right.
  * Remove `.jt-wa` as a standalone fixed element; reuse its colours through Theme tokens.
* Button text from translations: `floating.preferredSource` = "Add as a preferred source on Google". Icon: a small star or Google "G" drawn as inline SVG (no external image).
* Show it **only when** (a) `Site settings > Google > preferredSource.enabled` is on, **and** (b) the site has at least 1 published blog post (the feature is for news and article results). It loads no Google script until the visitor has granted marketing consent **or** presses the button (press = consent to open Google's dialog). If the script is not ready, the button shows a short "Loading…" state and retries once.
* It must not cover the cookie banner, the Merchant widget, the mobile booking bar or the footer links. Test the stacking order (z-index) at 360, 768, 1024 and 1440 px.
* Track `click_preferred_source` (section 7) after consent.
* Tell me plainly that Google decides whether the feature appears for my site (it is built for news publishers), and that I need to be eligible in Google Publisher Center or have Top Stories visibility. Do not promise a result.

---

## 9. Workstream G: GEO and AEO (be found and quoted by AI assistants and answer boxes)

### G.1 Content fields that make a page quotable (add to Tours, Offers, Vehicles, Destinations if built, Posts and Pages)
| Field | Rules |
|---|---|
| `answerSummary` | 40 to 60 words. The **first thing** after the heading. It answers the main question of the page in plain words (for a tour: what it is, how long, where, who it is for, from what price). Shown visibly in a highlighted box. Auto-draft it from existing fields if empty, and let the editor change it |
| `keyFacts[]` | up to 8 label and value pairs (duration, start point, best months, group size, price from, difficulty, languages, accessibility). Rendered as a definition list (already the "at a glance" grid) and used in the JSON-LD |
| `faq[]` | 4 to 8 real questions with 40 to 80 word answers, written as people ask them ("How much does a 3-day Masai Mara safari cost?"). Rendered visibly. FAQ markup follows the site switch |
| `lastReviewed` | date shown as "Reviewed on {date}" and used for `dateModified` |
| `author` | relationship to a Person (name, role, short bio, photo, profile links). Shown as a byline on posts and guides. `Person` markup with `sameAs` |
| `sources[]` | links to facts that need a source (park fees, seasons). Shown as "Sources" |

### G.2 Page writing rules (enforced by admin hints, and checked by the audit script)
* The page answers its question in the **first two sentences**. Headings that are real questions ("When is the best time to visit the Masai Mara?").
* Short paragraphs (under 90 words), lists and tables for comparisons (seasons, prices, group sizes). Numbers with units and dates.
* Every fact that can change shows a date ("Prices checked 1 November 2026").
* Describe things in full words. Do not rely on images or hover text for facts.
* One topic per page. A topic that has a listing page and a guide page links the two both ways.

### G.3 Machine-readable site map for AI
* Keep `llms.txt` (exists). Make it complete: site summary, the key facts, a link to each tour, offer, vehicle, destination and policy page with a one-line description, the contact details, and the "last updated" date. Generate it from the CMS, cache it 1 hour.
* Add `llms-full.txt`: the full text of every published tour, offer, vehicle, destination and policy page in clean Markdown (title, answer summary, key facts, itinerary, included and excluded, FAQ, price, link). Keep it under 5 MB. Split into `llms-full-<type>.txt` files if larger.
* Add a Markdown version of every page at `<page-address>.md` (for example `/tours/masai-mara-luxury-safari.md`), same content as the HTML page, with a `<link rel="alternate" type="text/markdown" href="…">` on the HTML page. These are easy for assistants to read and quote.
* Keep RSS for the blog at `/blog/rss.xml` (my old site used this address in `alternates.types`).

### G.4 Entity data (so assistants know who we are and trust the facts)
* One consistent **Organization / TravelAgency** record on every page (the `@id` is `https://www.jaetravel.co.ke/#org`): `name`, `legalName`, `url`, `logo` (ImageObject), `image`, `description`, `slogan`, `email`, `telephone`, `address`, `geo`, `areaServed` (Kenya, Tanzania, Uganda, Rwanda), `knowsAbout` (list of destinations and travel types), `knowsLanguage`, `sameAs` (all the links I give you), `contactPoint` (WhatsApp, email, languages, hours), `hasMerchantReturnPolicy` and shipping policy at organisation level **only when the Merchant switch is on and the policies are filled in**, and `aggregateRating` **never** (not eligible and easy to get penalised).
* The **same name, address, phone and email** in the footer, the contact page, the JSON-LD, Google Business Profile and Merchant Center. Give me a checklist of every place to keep identical.
* An **About page** that shows who runs the company, real credentials (leave empty if none), the team and years of experience (only facts I give you), with `Person` and `AboutPage` markup. Add an editorial page "How we plan and price our safaris".
* **Local SEO** (Kenya and the destinations): `TravelAgency` has `geo` and `address`. Give me a Google Business Profile checklist (categories, services, products, photos, Q&A, the same phone and website, a booking link with UTM). Do not create fake reviews.

### G.5 Internal linking (helps indexing and AI understanding)
* Every tour links to: its destination page or filtered list, the matching tour type list, 3 similar tours, any active offer, the booking tab, a related blog post.
* Every blog post links to 2 or more tours or lists, and every tour with a matching post links back to it.
* Breadcrumbs on every page. Footer links to the main lists and policy pages. No page is more than 3 clicks from the home page. No "click here" links: use descriptive text.
* The audit script reports orphan pages (pages with no internal links in).

### G.6 Monitoring for AI visibility
Create `docs/seo/ai-visibility-prompts.md` with 30 real questions people ask (for example "best accessible safari company in Kenya", "how much is a 3 day Masai Mara budget safari", "can wheelchair users go on safari in Kenya"). I will run them monthly in ChatGPT, Gemini, Perplexity, Copilot and Claude and record whether the site is cited. Do not claim any result.

---

## 10. Workstream H: Audit, monitoring and proof

### H.1 `pnpm seo:audit` (build this; run it against a running site)
A script (`scripts/seo-audit.ts`, using `fetch`, `cheerio` and `fast-xml-parser`) that crawls every URL in the sitemap index and **fails with a non-zero exit code** if any of these is true. It prints a table of failures:
* status is not 200, or there is more than one redirect hop;
* the canonical is missing or is not the page itself;
* `noindex` on a sitemap URL, or a `robots.txt` rule blocks a sitemap URL;
* `hreflang` is not reciprocal, lists a missing page, has no `x-default`, or uses a wrong code;
* title or description is missing, outside the length rules, or **duplicated** on another page;
* there is not exactly one `<h1>`, or the heading levels skip;
* a JSON-LD block does not parse, or lacks a required field for its type (use the per-type required fields in 6.2), or its price, name or breadcrumb **does not match the visible page**;
* an image has no `alt`, no `width` and `height`, or is larger than 400 KB without a reason;
* the page has no internal links in (orphan) or links out to a 404;
* `lastmod` is missing or in the future.
Also add `pnpm merchant:validate` (6.4). Add both to the CI notes in the README. Add Playwright tests in `tests/e2e/seo.e2e.spec.ts` for: the `/en` redirect, canonical and hreflang on one page of each type, `robots.txt`, `sitemap.xml`, `llms.txt`, the 410 on an expired offer, the preferred-source button position next to the WhatsApp button at 1440 and 390 px, and that no Google script loads before consent.

### H.2 Manual checks you must give me as a checklist (you cannot do these yourself)
1. **Search Console**: verify the property, submit `https://www.jaetravel.co.ke/sitemap.xml`, use *URL inspection* and *Request indexing* on the home page and one page of each type, then open *Page indexing* and *Enhancements* after 3 to 7 days. Use *Validate fix* for any item that was wrong. Check *International targeting*.
2. **Rich Results Test** (and the Schema Markup Validator): one URL of each type: tour, vehicle, offer, departure, post, listing, home. The pass criteria are: **0 errors**; warnings explained.
3. **Merchant Center**: link it to Search Console and to the website (verify and claim), add the feed, fill the shipping and return settings with the **same values** as the CMS, then read *Diagnostics*. Check the Search Console *Merchant listings* and *Merchant opportunities* reports.
4. **GA4**: use *DebugView* to see `view_item`, `generate_lead`; mark `generate_lead` as a key event; link GA4 to Search Console and Google Ads if used.
5. **Page speed**: PageSpeed Insights mobile for the home page, a tour, a listing. Targets: LCP under 2.5 s, INP under 200 ms, CLS under 0.1.
6. **Bing Webmaster Tools** (import from Search Console) and IndexNow check.

### H.3 What you must report back
* A table: **Requirement | Built | Where (file) | How I tested it | Result | Still needs me**.
* The exact commands you ran (`pnpm typecheck`, `pnpm build`, `pnpm seo:audit`, `pnpm merchant:validate`, the tests) and their **real output**. If you could not run something, say so.
* The redirect table (A.5), the list of pages with missing translations (so `hreflang` is correct), and the list of pages that failed the audit and why.
* **Never say a Search Console or Merchant Center item is "fixed".** You can say "the site now meets the rule and the audit passes". Only I can see the dashboards.

---

## 11. Questions to answer first (ask me, then wait)

1. May I switch English to the **unprefixed** scheme (decision 1)? It changes how every link is built. (Recommended: yes.)
2. Please send the old project files listed in section 2.1 and the IDs in 2.2.
3. Tours are services. Do I want the Merchant feed on at all, or only the page markup? (Recommended: markup and widget on, feed on after Merchant Center confirms it accepts services.)
4. What are my **real return/cancellation** and **shipping/delivery** policies? (Send the text; or the settings from Merchant Center.)
5. The store-quality widget `POSITION` and `REGION` values from Merchant Center.
6. Do I take bookings and payments on the site yet, or only inquiries? (Decides when the customer-reviews opt-in can switch on.)
7. Do I have real reviews to load (Google, Tripadvisor, email)? How many?
8. Is the blog written like news (dated articles) or like guides? (Decides `NewsArticle` or `BlogPosting`, and whether a news sitemap is worth adding.)
9. Allow or block the AI **training** crawlers (`GPTBot`, `ClaudeBot`, `Google-Extended`, `CCBot`)? (Default: allow.)
10. Do I have a Google Business Profile and which social links should go in `sameAs`?

---

## 12. Order of work, and the gates

1. **Plan and questions.** Wait for my answers. **Gate 1.**
2. **A: indexing foundation**: URL scheme and proxy, `localePath` everywhere, canonical and hreflang, robots, sitemap index, redirects, status codes. Run the audit. **Gate 2: I review the redirect table.**
3. **B and C**: metadata, OG images, structured data for all types. Rich Results Test list ready. **Gate 3.**
4. **E and F**: Consent Mode, GA4, GTM, verification, the floating buttons. **Gate 4: I check the button position.**
5. **D**: Merchant policy fields, pages, feed, widget, opt-in (all behind switches).
6. **G**: answer-first fields, `llms-full.txt`, Markdown pages, entity data, internal links.
7. **H**: audit script, tests, manual checklist, final report. **Gate 5.**

For every step send: the changed and new files (paths, then contents), the exact commands and real output, and the table from H.3. A step is not finished while any row says "Partly" or "Failed" without my approval.

---

## 13. Do not do these

* Do not invent IDs, policy text, reviews, ratings, prices, GTINs, Google category numbers or field names. Look them up or ask me.
* Do not paste my Google snippets into the layout. Build the components in sections 6.7 and 6.8 and read IDs from settings.
* Do not load any Google, Ahrefs or marketing script before consent. Do not put review markup on the Organization. Do not mark up content that is not visible on the page.
* Do not block CSS, JavaScript or images in `robots.txt`. Do not put `noindex` pages in a sitemap. Do not create redirect chains.
* Do not rewrite the old `CookieConsent`, `DynamicScripts` or `GooglePreferredSource` from memory.
* Do not claim a dashboard result. Do not change the design, the brand colours or the page content beyond what is needed.
