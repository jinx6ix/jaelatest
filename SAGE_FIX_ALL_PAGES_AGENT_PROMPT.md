# Prompt for the agent: fix the SAGE SEO / AEO / GEO report on every page and slug

You are working inside the **JaeTravel v2 project** (Payload CMS 3 + Next.js 16 + Postgres, deployed on Vercel). Read this like a recipe. Everything you must choose has already been chosen. Build exactly what is written, test it on **every page type**, and tell me the truth about what you could and could not check. If something is missing, **stop and ask** (section 12). Never invent a fact, a price, a policy, an author, a review or a number.

Send back **only new and changed files**, never the whole project.

I am attaching a report from the **SAGE SEO/AEO/GEO tool** for `https://jaelatest.vercel.app/` (the home page only). Score **59/100, grade D**. I want **every page and every slug** of the site to pass the same checks, not just the home page.

> This prompt works together with `SEO_GEO_AEO_MERCHANT_AGENT_PROMPT.md` (indexing, Merchant, GA4, preferred-source button). **If the two ever disagree, that other prompt's decisions stand** (English without a language prefix, canonical host `https://www.jaetravel.co.ke`, consent before Google scripts). Do not duplicate work it already covers.

---

## 1. What the report says, and where I think it comes from

You must **verify each cause below yourself** (open the page source, run the commands in section 3) before you change anything. Fix what is true. Report what is not.

| SAGE section | Score | What it found | Likely cause in this project | Fix in |
|---|---|---|---|---|
| Meta and discoverability | 100 | canonical is `http://localhost:3000`; hreflang has no self reference | `NEXT_PUBLIC_SERVER_URL` is not set on Vercel, so every canonical, hreflang, Open Graph URL and sitemap URL points to localhost. **This is the most serious bug.** | 3 |
| Semantic HTML | 61 | **no H1**; text-to-HTML ratio 4%; 275 words; no `<time>` | the hero headline is not rendered as one `<h1>`; the page is mostly markup and images; the home page has little text | 4.1, 4.2, 4.4, 4.9 |
| Structured data | 67 | only TravelAgency, WebSite, WebPage; no FAQPage, BreadcrumbList on inner pages, `sameAs`, `speakable`, `potentialAction`, `datePublished` | schema builders are not used on the home page, social links are empty in the CMS | 4.3 |
| Entity and authority | 20 | no author, no publication date, no privacy or terms links | no `Person`/author data, no `<time>`, no legal pages or footer links | 4.4 |
| Citability | 57 | no definition lists, no tables, no heading IDs | home page has none of these | 4.2, 4.5 |
| Answer targeting | 13 | few question headings, no definition sentences, no how-to list, no comparison table, no Q&A groups | no answer-first content on the home page | 4.2 |
| Voice | 43 | no `speakable`, no FAQPage, only 6% voice-length paragraphs | same | 4.2, 4.3 |
| Accessibility for agents | 87 | 14 elements with `tabindex="-1"`; 4 **empty link labels** | hidden slides and card image links use `tabindex="-1"`; each card has an image-only link with no text | 4.6 |
| Performance and crawlability | 54 | **20 images with no width or height** (`/api/media/file/11.jpeg`); 2 images over 500 KB (2.6 and 2.9 MB PNG); total images 5.3 MB; 0% modern formats; 1 render-blocking script | the SQL-imported media rows have no width or height; huge PNG originals; `<img>` served as JPEG and PNG; a script without `async` or `defer` | 4.7 |
| Agent interactivity (WebMCP) | 19 | no WebMCP tools; a form with missing labels | not built yet | 4.8 |
| Machine readability / URL | 85 / 71 | robots, llms.txt and X-Robots checks were skipped; no `<link rel="sitemap">`; 0% modern image formats | permissions in the tool; sitemap link not in the head | 4.9 |
| Keyword density | 0 | only 32 words counted | main content has almost no real text | 4.2 |
| AI View | 88 | missing H1; 4 empty link labels | same as above | 4.1, 4.6 |

Also note: the hero text on the deployed site reads **"WHERE THE HERDCROSSES"**. The headline lines are glued together with **no space between them**. That is a bug (search engines and assistants read "HERDCROSSES"). Fix it in 4.1.

**Targets** (what I will measure when I re-run SAGE on one URL of every page type): overall **90 or more**, every section **85 or more**, **H1 present**, **no empty links**, **no `localhost` anywhere in the HTML**. Do not chase 100 by hiding things or by faking content.

---

## 2. Rules for everything below

1. **Nothing typed in code**: copy, IDs, links and colours come from the CMS or environment variables (see `CLAUDE.md`).
2. **Every fix applies to all page types** (section 5 is the full list). A fix that only works on the home page is not finished.
3. **No invented facts.** You may write drafts of general explanatory text (what a join-in safari is, how seasons work). Mark every draft `Draft: needs my approval` in the CMS and never publish it as final. Specific facts (prices, durations, policies, parks, numbers, awards, years) come only from the CMS data I already gave you.
4. **No fake reviews, ratings, authors or credentials.** If there is no author, leave the author out (the organisation is the author).
5. **Truthful reporting.** Never write "fixed" about a SAGE score or a Search Console item. Write "the site now meets the rule and the audit passes".

---

## 3. Phase 0: production correctness (do this FIRST, it breaks everything else)

### 3.1 The localhost bug
1. Find where the site address comes from: `getServerSideURL()` in `src/utilities/getURL.ts` and `canonicalOrigin` in Site settings. Today the deployed site returns `http://localhost:3000`.
2. **Fix in code**: resolve the origin in this order: (1) `Site settings > SEO > canonicalOrigin`; (2) `NEXT_PUBLIC_SERVER_URL`; (3) on Vercel, `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` for the production environment and `https://${process.env.VERCEL_URL}` for previews; (4) only in development, `http://localhost:3000`.
3. **Guard**: in production (`NODE_ENV === 'production'`), if the final origin contains `localhost` or `127.0.0.1`, **log an error and fail the build** (`next build` must stop with a clear message). Add the same check to the audit script (section 9).
4. **Tell me** to set `NEXT_PUBLIC_SERVER_URL=https://www.jaetravel.co.ke` in the Vercel project (Production), and `NEXT_PUBLIC_SERVER_URL` for the preview to its own address. Update `.env.example`.

### 3.2 Keep the staging site out of Google
`jaelatest.vercel.app` is a test address. If it is indexed it will compete with the real site and create duplicate-content errors.
* A helper `isProductionHost()` is true only for the real domain (`www.jaetravel.co.ke`, from the origin setting).
* On any other host: the `robots.txt` is `User-agent: *` / `Disallow: /`, every page has `<meta name="robots" content="noindex,nofollow">` and the response header `X-Robots-Tag: noindex, nofollow`, and the sitemap returns 404.
* On the production host all of that is off.
* Add a test that proves both behaviours.

---

## 4. The fixes (apply to every page type in section 5)

### 4.1 One H1 on every page, and clean headings

**Rule: exactly one `<h1>` per page, present in the server-rendered HTML (view-source), never added by JavaScript.**

* **Hero** (`src/site/HeroSlider.tsx` and the new hero code): slide 1's headline is the page's `<h1>`. Build the headline from the CMS `headlineLines` array like this, with real separators so the text reads correctly:
```tsx
<h1 className="jt-slide__title">
  {lines.map((line, i) => (
    <span key={i} className="jt-line">{line}{i < lines.length - 1 ? ' ' : ''}</span>
  ))}
</h1>
```
  (a normal space between the line spans; the visual line break is done with CSS `display:block` on `.jt-line`, so the plain text is still "WHERE THE HERD CROSSES"). Other slides use `<p role="heading" aria-level="2">`, as now. If the hero is **not** the first block on a page, the first text heading on the page is the `<h1>`.
* **Every other page type** renders its own `<h1>` from the document title (tour title, offer name, listing title, post title, page header block). The `pageHeader` block is the only place a page `<h1>` is made by a block. Blocks never create a second `<h1>`. Add a runtime guard in development that warns if a page renders 0 or 2 `<h1>`.
* **Heading levels never skip.** Section blocks use `<h2>`, their items `<h3>`. Cards use `<h3>`. The footer column titles are `<h2>` (they are real sections) or are changed to `<p>` if the audit says the outline is wrong.
* **Heading IDs for deep links.** Add a helper `slugifyHeading(text)` and give every `<h2>` and `<h3>` an `id` (unique on the page, ASCII, lower case). Show a small **"On this page"** list of anchor links at the top of tour pages, posts and long pages (3 or more `<h2>`s). Keep the tab hash links (`#itinerary`, `#booking`) working.

### 4.2 Content depth and answer-first content (fixes: thin content, no answer targeting, no definitions, no tables, no voice)

**4.2.1 Minimums (checked by the audit script)**

| Page type | Visible words in `<main>` (minimum) |
|---|---|
| Home | 700 |
| Listing pages (`/tours`, `/disability-tours`, `/budget-tours`, `/migration-tours`, `/join-in-tours`, `/offers`, `/vehicle-hire`, `/blog`, `/gallery`) | 350 plus the cards |
| Tour, offer, departure, vehicle detail | 450 |
| Blog post | 600 |
| About, contact, policy pages | 300 |

Words in hidden tabs count (they are in the HTML), words in alt text and menus do not. A page below its minimum is listed in the audit as **thin**, and the CMS shows an editor warning on save.

**4.2.2 CMS fields (add to Tours, Offers, Vehicles, Posts, Pages, Destinations)**
`answerSummary` (40 to 60 words), `keyFacts[]` (label and value, up to 8), `faq[]` (question and answer, 4 to 8), `howTo` (title and ordered steps), `comparison` (a table with 3 or more columns, optional), `lastReviewed` (date), `author` (relationship, optional). Create the migration, types and import map.

**4.2.3 Render rules (components, not per-page hand work)**
* **Answer box**: the first thing after the `<h1>`. A `<p data-speakable>` of 40 to 60 words that answers the page's main question in plain words, starting with a **definition sentence** ("The Masai Mara Classic is a 4-day private safari in Kenya for …"). If the editor leaves it empty, **build it deterministically from the CMS data** with a template function (no AI calls, no invented facts) and mark it `auto`:
  `{Title} is a {N}-day {tour type} safari in {destination} for {pace/group size when known}. It includes {first 3 included items}. Prices start from {cheapest price} per person.`
  Provide the template for each page type in `src/lib/answerSummary.ts`, with unit tests.
* **Question headings**: every FAQ item is an `<h3>` (or `<summary>` inside `<details>`) written as a real question, followed by a **40 to 60 word** answer paragraph. Add a visible FAQ section to every page type (minimum 4 questions). Group related questions together (this is the "People also ask" pattern).
* **How-to list**: a heading "How to book {thing}" followed by an ordered list `<ol>` of 3 to 6 steps. Site-wide default steps come from Site settings (`howBookingWorks`), so one editor change updates every page.
* **Definition list**: key facts render as `<dl><dt><dd>` (tours already do; add to vehicles, offers, departures and listing pages).
* **Comparison tables**: `<table>` with `<caption>`, `<th scope>` and at least 3 columns and 3 rows. Required on: the home page ("Safari types compared": private, join-in, budget, accessible, migration: duration, group size, price from, best for), listing pages (the tours listed, with price from, days, type), tours (the season price table, already exists), vehicles (rates).
* **Paragraph length for voice**: body paragraphs of 25 to 60 words. The audit reports the percentage of paragraphs in that range (target 60% or more of body paragraphs).
* **Reading ease**: aim for Flesch 60 or more on generated and template text (short sentences, common words). Report the score per page.

**4.2.4 The home page (CMS blocks, seeded as drafts for me to approve)**
Add these blocks to the home page after the existing ones, using the existing block types (`richSection`, `faqSection`, `valueProps`, `statsStrip` only with real numbers) plus two new blocks: `comparisonTable` and `howToSteps`.
1. "Why travel with a local team" (`richSection`, 120 words)
2. "Safari types compared" (`comparisonTable`)
3. "How to book a safari with us" (`howToSteps`, `<ol>`)
4. "When is the best time to go?" (`richSection` with a season table)
5. "Questions travellers ask" (`faqSection`, 6 questions, 40 to 60 word answers)
6. "From our blog" (exists)
Draft text only from facts in the CMS (seasons, tour types, prices, group sizes). Anything else is marked `Draft: needs my approval`.

**4.2.5 Thin-page backfill at scale (94 tours imported from files)**
Write `scripts/backfill-answer-fields.ts`: for every tour, offer and vehicle with empty `answerSummary` and `keyFacts`, fill them from the data with the deterministic templates (4.2.3). Never overwrite what an editor wrote. Write `reports/thin-pages.csv` listing every page below its word minimum and what is missing, so I can decide where to write more.

### 4.3 Structured data on every page (fixes: schema, voice, entity)

Extend `src/lib/schema.ts` and the page components. **One JSON-LD graph per page, built only from CMS data and matching the visible page.**

| Page type | Types to emit |
|---|---|
| Every page | `TravelAgency` (organisation, with `sameAs`, `logo`, `contactPoint`, `areaServed`, `knowsAbout`), `WebSite` (with `potentialAction`), `WebPage` (with `datePublished`, `dateModified`, `inLanguage`, `speakable`) |
| Every page except home | `BreadcrumbList` matching the visible breadcrumb |
| Home | the three above, plus `FAQPage` (if the FAQ block is visible), `ItemList` of the featured tours, `HowTo` for the booking steps (if the steps are visible) |
| Listing pages | `CollectionPage` + `ItemList` (all listed items with `name` and `url`) + `FAQPage` |
| Tour, vehicle | `Product` (+ `TouristTrip` for tours) with offers, `ImageObject`s, `VideoObject`s, `FAQPage`, `HowTo` (booking steps) |
| Offer | `Offer` and the linked tours, `FAQPage` |
| Departure | `Event` |
| Post | `BlogPosting` (or `NewsArticle`, see the other prompt) with `author` (`Person`), `datePublished`, `dateModified`, `FAQPage` when present |
| About | `AboutPage`, `Person` entries for the team (only real people I give you) |
| Contact | `ContactPage` |

Details:
* `WebSite.potentialAction`:
```json
"potentialAction": { "@type": "SearchAction", "target": { "@type": "EntryPoint", "urlTemplate": "https://www.jaetravel.co.ke/search?q={search_term_string}" }, "query-input": "required name=search_term_string" }
```
  Check the `/search` page really answers `?q=`.
* `speakable`, on `WebPage`:
```json
"speakable": { "@type": "SpeakableSpecification", "cssSelector": ["h1", "[data-speakable]"] }
```
  and put `data-speakable` on the answer box and on the first FAQ answer only.
* `sameAs`: fill from `Site settings > Social` (Facebook, Instagram, YouTube, TikTok, X, LinkedIn, Tripadvisor, Google Business Profile). **I must give you the real links; leave the field out until then.**
* `datePublished` and `dateModified` from the CMS (`createdAt` or `publishedAt`, `updatedAt` or `lastReviewed`), ISO with time zone.
* `FAQPage` is emitted only when the same questions are visible on the page, and the Site-settings switch is on.
* **Do not** add `aggregateRating` or `Review` without real approved reviews (see the other prompt, section 6.5).
* **RDFa**: the tool flags `property="og:..."` meta tags as RDFa. That is the normal Open Graph markup. Ignore it, and mention it in your report as a false positive. Do not add real RDFa.

### 4.4 Dates, authors and legal pages (fixes: no author, no date, no privacy or terms links)

* **Dates**: show `Updated {date}` on every page type, inside `<time datetime="YYYY-MM-DD">`. Use `<time>` for every date you display: offer end dates, departure dates, post dates, "reviewed on" dates. A helper component `<DateTime value format />` renders it.
* **Authors**: build an `Authors` collection (name, role, short bio, photo, profile links) or reuse Users. Posts and guides show a byline with the author's name and photo, linked to an author page `/authors/{slug}` (indexable, `ProfilePage` + `Person` markup). Tours show "Planned by the JaeTravel team" and `lastReviewed`. **No author is shown unless I have provided a real one.**
* **Legal pages**: create the pages `privacy-policy`, `terms-and-conditions`, `returns-and-cancellations`, `shipping-and-delivery` (service delivery) as **drafts with clear placeholders**. **You cannot write these legal texts. I will give them.** Add them to `Footer > Legal links` in the seed so the privacy and terms links exist on every page. The text stays `Draft` and the pages stay `noindex` until I publish my own words.
* Link the **About** and **Contact** pages in the header and the footer (already done; keep it).

### 4.5 Internal links, breadcrumbs, anchors, navigation

* Breadcrumbs on every page except home (exists; keep; use `<ol>` in a `<nav aria-label="Breadcrumb">`).
* Add the "On this page" list (4.1) and heading IDs.
* Every tour links to its destination or filtered list, its tour type list, three similar tours, an active offer, and a related post. Every post links to two or more tours or lists. **No page may be an orphan** (audit rule).
* Link text is always descriptive. No "click here", no "read more" alone: use "Read more about {title}" (visually hidden part allowed).

### 4.6 Accessibility for agents (fixes: tabindex -1, empty link labels, form labels)

* **Empty link labels (the 4 in the report):** each card has an image-only link (`<a class="jt-card__media" aria-hidden tabindex="-1">`). **Remove these anchors.** Make the card image a plain `<div>` and keep one text link per card (the title link) whose `::after` covers the whole card, as now. Same for offer cards, destination cards (give the destination card a visible text label link), vehicle cards and post cards. The audit rule: **no `<a>` without text, `aria-label` or an `<img alt>` child with non-empty alt.**
* **`tabindex="-1"` (the 14 elements):** do not use `tabindex="-1"` on links and buttons in hidden slides. Put the **`inert` attribute** on each inactive slide (`<div class="jt-slide" inert={k !== i}>`), plus `aria-hidden`. `inert` removes the whole subtree from the tab order and the accessibility tree. Remove every other `tabindex="-1"` on controls (except modal focus targets, where it is correct). Keep the pause, previous, next and dot buttons reachable with the keyboard.
* **Forms** (trip finder, filter form, inquiry form, contact form, search): every control has a `<label for>` or an `aria-label`, a `name`, a correct `type`, a stable `id`, and `autocomplete` where it applies. Every `<form>` has an `aria-label`. Submit buttons have visible text. The report names the form posting to `/tours`: it is the home trip finder; give it `aria-label`, `id`, and an `id` on each select with matching `for`.
* Keep: `lang`, skip link, landmarks, alt text. Decorative images use `alt=""` only when they sit inside a link or card that has its own text. Informative images (hero, tour photos, gallery) have real alt text from Media.

### 4.7 Images, speed and crawlability (fixes: no width/height, heavy images, no modern formats, render blocking)

**A. Width and height on every image (the 20 images in the report)**
* The images named `/api/media/file/11.jpeg` and the others come from the **SQL import**: those media rows have no width, height or generated sizes. Write `scripts/backfill-media.ts` (run with `pnpm media:backfill`):
  1. For every `media` row with no `width` or no `sizes`: find the file (a local path in `public/`, the Payload upload folder, or a remote URL), read it with `sharp`, and **re-save it through the Payload local API** (`payload.update({ collection: 'media', id, filePath, data })`) so Payload stores the file, the width and height, the file size, and **regenerates the sizes** (small, medium, large, xlarge, og).
  2. Before saving, **resize anything wider than 2400 px** and **compress**: JPEG quality 78 (mozjpeg), PNG photos converted to JPEG or WebP (photos must never stay PNG). Report the bytes saved per file.
  3. For images hosted elsewhere (imagekit), download once, process the same way, and update the tour and vehicle references.
  4. Print a table: *id | file | before (px, KB) | after (px, KB) | status*. Run it again safely (skip finished rows).
* **Rule in the code:** `<Img>` must always output `width` and `height` (from the media row, or from the size variant). If a row has none, log a warning and fall back to the aspect ratio of the container so layout does not shift. The audit fails any `<img>` without both attributes.

**B. Modern formats (AVIF and WebP)**
Use **`next/image`** for all content images, with this configuration in `next.config.ts` (Vercel serves the best format automatically):
```ts
images: {
  formats: ['image/avif', 'image/webp'],
  minimumCacheTTL: 31536000,
  qualities: [60, 75, 85],
  localPatterns: [{ pathname: '/api/media/file/**' }, { pathname: '/brand/**' }],
  remotePatterns: [{ protocol: 'https', hostname: 'ik.imagekit.io' }],
}
```
Replace the hand-made `<img srcSet>` in `src/site/Img.tsx`, `HeroSlider.tsx`, `Gallery.tsx` and the cards with `next/image` (`width`, `height`, `sizes`, `quality={75}`; `priority` only for the first hero image and the first tour page image). Keep the aspect-ratio boxes so nothing shifts. Check that the hero `<img>` still has `fetchpriority="high"`.

**C. Weight budgets (checked by the audit, measured on the built page with the real image requests)**
| Page | Images loaded before scrolling (mobile) | Total images on the page |
|---|---|---|
| Home | 350 KB or less | 1.5 MB or less |
| Listing | 500 KB or less | 2 MB or less |
| Tour detail | 350 KB or less | 1.5 MB or less |
No single image over 250 KB after optimisation (the hero may be 350 KB). The two images in the report (`DSC00186-5-900x1199.png`, 2615 KB, and `DSC00287-1-900x1199.png`, 2858 KB) must be re-saved as optimised JPEG or WebP through the backfill.

**D. Lazy loading and the hero**
Only the first hero image and the first image above the fold are eager. Everything else `loading="lazy"` and `decoding="async"`. Slides 2 to 5 of the hero load their image only when they are about to show (preload the next slide's image after the first has painted).

**E. The render-blocking script**
The report lists `/_next/static/immutable/chunks/0c0hxoamwjsbw.js`. Next normally loads scripts with `async`. Open the rendered HTML (`curl`), find every `<script src>` without `async` or `defer` and without `type="module"`, and fix its cause (a custom script in the layout, a plugin, the analytics loader). Third-party scripts use `next/script` with `afterInteractive` or `lazyOnload`. Report what it was.

**F. Fonts and text-to-HTML ratio**
* Fonts: `next/font` with `display: 'swap'` (already). Confirm in the built CSS. Preload only the weights used above the fold.
* **Text-to-HTML ratio 4% is very low.** Raise it with the content in 4.2 and by cutting markup:
  1. Pass **IDs and small values** to client components, not whole documents (the hero receives the full slide data once as HTML and again as page data).
  2. Replace the inline SVG icon repeated in every card with one **SVG sprite** (`<svg><symbol>` in the layout and `<use href="#icon">` in the cards).
  3. Remove inline `style` attributes that CSS can do, and cut `srcset` to 3 candidates.
  Report ratio per page (visible text bytes divided by HTML bytes). **Target 12% or more on content pages.**
* Keep the DOM small (under 1,500 elements on the home page).

### 4.8 Machine readability and discovery

* Confirm these return 200 with the right type on the production host: `/robots.txt`, `/sitemap.xml` (and the child sitemaps), `/llms.txt`, `/llms-full.txt`, `/rss.xml`, `/blog/rss.xml`. Add `/blog/rss.xml` (the old address) pointing at the same feed.
* In the `<head>` of **every page** add: `<link rel="sitemap" type="application/xml" href="/sitemap.xml">`, `<link rel="alternate" type="application/rss+xml" href="/blog/rss.xml">`, and (once the other prompt's Markdown pages exist) `<link rel="alternate" type="text/markdown" href="…md">`.
* **hreflang self reference**: the `hreflang` entry for the page's own language must be **identical** to the canonical URL. List only languages that really have a translation. Include `x-default` (English).
* Add `<time>` and the dates in 4.4 so freshness is visible to assistants.
* Make sure the AI-crawler rules in `robots.txt` match the other prompt (allow search and answer bots).

### 4.9 Voice readiness

Covered by: `speakable` (4.3), `FAQPage` (4.3), 25 to 60 word paragraphs and Flesch 60 or more (4.2). Add a **"Quick answer" line** to every listing page ("We offer {N} safaris from {price}. The most popular is {title}.") built from CMS data, marked `data-speakable`.

### 4.10 Agent interactivity (WebMCP)

WebMCP lets browser AI agents use a page's tools. It is new, so **feature-detect everything and add no polyfill unless a stable one exists**. Read the current WebMCP / Chrome documentation first and quote the page and date in your report.
* **Declarative:** add the `toolname`, `tooldescription` and `toolparamdescription` attributes to the forms: trip finder (`search_safaris`), filter form (`filter_tours`), inquiry forms (`request_quote`), site search (`site_search`). Each field keeps its label, `name`, `type` and `id`.
* **Imperative:** one small client module `src/site/webmcp.ts`, loaded once in the layout with `next/script`, `lazyOnload`:
```ts
if ('modelContext' in navigator) {
  navigator.modelContext.registerTool({
    name: 'search_safaris',
    description: 'Find JaeTravel safaris by destination, length and type. Returns titles, prices and links.',
    inputSchema: { type: 'object', properties: { destination: { type: 'string' }, length: { enum: ['short', 'mid', 'long'] }, type: { enum: ['standard', 'accessible', 'budget', 'migration'] } } },
    async execute(args) { /* call a read-only API route, return JSON */ },
  })
  // also: get_tour({ slug }), estimate_price({ slug, date, travellers, currency }), navigate({ section }), site_search({ query })
}
```
* The tools are **read-only** except `request_quote`, which must **pre-fill the form and ask the human to press send**. An agent must never create an inquiry by itself. Add a read-only JSON API (`/api/agent/tours`, `/api/agent/estimate`) with rate limiting. Record nothing personal.
* The tool names and descriptions come from translations, not typed strings.

---

## 5. Every page type, and what must be true (the full matrix)

For each row the audit script runs the checks in section 9 on **every URL of that type** (all 94 tours, all offers, all departures, all vehicles, all posts, all listings, all pages, in all languages that exist).

| Page type | Example address | H1 from | Answer box | FAQ (min) | Table | `<ol>` how-to | JSON-LD (beyond the common three) | Breadcrumb |
|---|---|---|---|---|---|---|---|---|
| Home | `/` | hero slide 1 | yes | 6 | safari types compared | yes | `FAQPage`, `ItemList`, `HowTo` | no |
| Tours list | `/tours` | page header | yes | 4 | tours table | optional | `CollectionPage`, `ItemList`, `FAQPage` | yes |
| Tour-type lists | `/disability-tours`, `/budget-tours`, `/migration-tours` | page header | yes | 4 | tours table | optional | same | yes |
| Tour (all 4 types) | `/tours/{slug}`, `/budget-tours/{slug}`, `/disability-tours/{slug}`, `/migration-tours/{slug}` | tour title | yes | 4 | season prices | yes | `Product`+`TouristTrip`, `FAQPage`, `VideoObject`, `HowTo` | yes |
| Offers list / offer | `/offers`, `/offers/{slug}` | title | yes | 3 | eligible tours | yes | `Offer` | yes |
| Join-in list / departure | `/join-in-tours`, `/join-in-tours/{slug}` | title | yes | 3 | dates and status | yes | `Event` (departure) | yes |
| Vehicle hire list / vehicle | `/vehicle-hire`, `/vehicle-hire/{slug}` | title | yes | 4 | rates, specs | yes | `Product` / `Service` | yes |
| Blog list / post | `/blog`, `/blog/{slug}` | title | yes | 3 | optional | optional | `BlogPosting`, `FAQPage` | yes |
| Gallery | `/gallery` | page header | yes | 3 | no | no | `CollectionPage`, `ImageObject`s, `VideoObject`s | yes |
| About | `/about` | page header | yes | 4 | no | no | `AboutPage`, `Person` | yes |
| Contact | `/contact` | page header | yes | 4 | no | yes | `ContactPage` | yes |
| Itinerary builder | `/itinerary-builder` | page header | yes | 3 | no | yes | `WebPage` | yes |
| Policy pages | `/privacy-policy` etc. | page header | no | no | no | no | `WebPage` | yes |
| Search, 404, thank-you, preview | `/search` | page | no | no | no | no | none | no, and `noindex` |

Every row also needs: canonical, self-referencing hreflang, `<time>`, no empty links, images with width and height, no `localhost`.

---

## 6. CMS and migration

* New and changed fields: section 4.2.2, `howBookingWorks` in Site settings, Authors, the two new blocks (`comparisonTable`, `howToSteps`), `seo` fields where missing.
* Run: `pnpm payload migrate:create sage_fixes`, `pnpm generate:types`, `pnpm generate:importmap`.
* Update the seed so a fresh install has the new home blocks (as drafts needing approval), the legal pages as drafts and the footer legal links.
* Admin hints: the SEO tab on every document shows live checks (word count, answer box length, FAQ count, image alt) with green and red marks.

---

## 7. Where to work (probable files)

`src/utilities/getURL.ts`, `src/lib/seo.ts`, `src/lib/schema.ts`, `src/lib/answerSummary.ts` (new), `src/site/HeroSlider.tsx`, `src/site/Img.tsx`, `src/site/Cards.tsx`, `src/site/blocks.tsx`, `src/site/TourPage.tsx`, `src/site/OfferPage.tsx`, `src/site/DetailPages.tsx`, `src/site/Listing.tsx`, `src/site/Gallery.tsx`, `src/site/Header*.tsx`, `src/site/Footer.tsx`, `src/site/webmcp.ts` (new), `src/blocks/site/configs.ts`, `src/collections/*`, `src/app/[locale]/(frontend)/layout.tsx`, `src/app/robots.ts`, `src/app/sitemap.ts`, `next.config.ts`, `scripts/backfill-media.ts` (new), `scripts/backfill-answer-fields.ts` (new), `scripts/seo-audit.ts` (new), `src/endpoints/seed/*`, `tests/*`.

---

## 8. Order of work and gates

1. **Questions and plan** (section 12). Wait. **Gate 1.**
2. **Phase 0** (section 3): origin and staging. Run the audit. **Gate 2.**
3. **Images and speed** (4.7): backfill, `next/image`, budgets. Send the before and after table. **Gate 3.**
4. **Semantics and links** (4.1, 4.5, 4.6): H1, headings, empty links, `inert`, forms.
5. **Content and schema** (4.2, 4.3, 4.4, 4.9): fields, templates, blocks, JSON-LD, dates, authors, legal drafts. **Gate 4: I read the draft text.**
6. **WebMCP and discovery** (4.8, 4.10).
7. **Audit, tests, report.** **Gate 5.**

---

## 9. The audit script (`pnpm seo:audit`): SAGE-style checks on every URL

Build `scripts/seo-audit.ts` (use `fetch`, `cheerio`, `fast-xml-parser`, `sharp` for sizes). It reads the sitemap index, requests **every** URL (also the languages that exist), and writes `reports/seo-audit.json` and a readable table grouped by page type. **Exit code 1 if any hard rule fails.**

| Rule | Hard fail | Warn |
|---|---|---|
| status 200, no redirect chain | any other | |
| `localhost` or `127.0.0.1` anywhere in the HTML | yes | |
| staging host is `noindex`, production host is indexable | yes | |
| canonical present, absolute, self, on the production host | yes | |
| self-referencing hreflang equals canonical; `x-default` present; reciprocal | yes | |
| exactly one `<h1>` in the raw HTML | yes | |
| heading levels do not skip | | yes |
| title 30 to 60 chars, description 120 to 155, both unique across the site | length yes, duplicate yes | |
| visible words in `<main>` at or above the minimum (4.2.1) | | yes (thin list) |
| answer box 40 to 60 words with `data-speakable` | | yes |
| FAQ count at or above the minimum; each answer 40 to 60 words | | yes |
| at least one `<time datetime>` | yes | |
| text-to-HTML ratio at or above 12% (content pages) | | yes |
| paragraphs of 25 to 60 words at or above 60% | | yes |
| Flesch reading ease at or above 60 | | yes |
| JSON-LD parses; required fields per type (section 4.3 table); price, name, breadcrumb match the visible page | yes | |
| `WebSite.potentialAction`, `speakable`, `sameAs` present (when social links exist) | | yes |
| every `<a>` has text, `aria-label` or an image with alt | yes | |
| no `tabindex="-1"` on `a` or `button` outside dialogs | yes | |
| every form control has a label, `name` and `id`; every form has an accessible name | yes | |
| every `<img>` has `alt` (empty only inside a text link or card), `width`, `height` | yes | |
| image bytes: single image 250 KB, page budgets in 4.7 C | yes | |
| image format served is AVIF or WebP (request with `Accept: image/avif,image/webp`) | yes | |
| every `<script src>` has `async`, `defer` or `type="module"` | | yes |
| `<link rel="sitemap">` present | yes | |
| page has at least 3 internal links in (no orphan), no link to a 404 | yes | |
| heading `id`s present and unique; "On this page" list on long pages | | yes |
| `robots.txt`, `sitemap.xml`, `llms.txt` return 200 on the production host | yes | |

Add Playwright tests (`tests/e2e/sage.e2e.spec.ts`) for: one H1 on one page of each type, no `localhost` in the HTML, the staging host is `noindex`, no empty links, the inactive hero slides are `inert`, the first hero image has dimensions and priority, `/blog/rss.xml` works, the inquiry form has labels.

---

## 10. What you must report back (every step)

* The list of changed and new files (paths, then contents), the migration, and the exact commands you ran with their **real output**: `pnpm typecheck`, `pnpm build`, `pnpm seo:audit`, `pnpm media:backfill`, the tests. If you could not run something, say so.
* A table: **SAGE finding | Rule | What I built | Files | How I tested | Result**. Use the rows of section 1.
* The audit result **per page type**: number of URLs checked, number failing, top 3 reasons.
* The thin-pages report, the media backfill table (before and after bytes), and the list of drafts that need my approval.
* Honest notes: false positives (Open Graph "RDFa"), anything you could not verify, anything that needs me.

---

## 11. What only I can do (you cannot)

1. Set `NEXT_PUBLIC_SERVER_URL` on Vercel and deploy.
2. Re-run SAGE on one URL of every page type **with the extra permission** so the `robots.txt`, `llms.txt` and `X-Robots-Tag` checks run, and send you the new report.
3. Approve the draft text, give the legal text, the social links, the real author details.
4. Check Search Console after 3 to 7 days (see the other prompt).

---

## 12. Questions to answer first (ask me, then wait)

1. Is the production address `https://www.jaetravel.co.ke`, and may the Vercel test address be `noindex` and blocked? (Recommended: yes.)
2. Do I have real **social profile links** and a **Google Business Profile** for `sameAs`? Please send them.
3. Is there a real **author or team member** to show (name, role, photo, short bio)? If not, pages show the organisation only.
4. Please send the **privacy policy**, **terms**, **return and cancellation** and **delivery** texts, or tell me they are not ready (the pages stay hidden drafts).
5. May the **home-page and listing-page draft text** be written by you from the CMS data, with every draft marked for my approval? (Recommended: yes.)
6. May I switch all images to `next/image` (served by Vercel's image optimisation)? It is the simplest way to serve AVIF and WebP. Check my Vercel plan's image-optimisation limit before choosing. If it is too small, the alternative is to generate WebP and AVIF variants at upload. (Recommended: `next/image`.)
7. Is the WebMCP work wanted now, or after the rest? (It is new; the score gain is small. Recommended: last.)

---

## 13. Do not do these

* Do not invent facts, reviews, ratings, authors, awards, years or prices. Do not publish drafts.
* Do not add a second `<h1>`. Do not create the `<h1>` with JavaScript.
* Do not hide text to raise word counts, stuff keywords, or add schema for content that is not visible.
* Do not leave `localhost` anywhere in production HTML, sitemaps, feeds or `llms.txt`.
* Do not use `tabindex="-1"` to hide slides. Use `inert`.
* Do not ship PNG photos. Do not serve an image without width and height.
* Do not index the staging site.
* Do not claim a score or a Search Console result. Report what the audit proved.
