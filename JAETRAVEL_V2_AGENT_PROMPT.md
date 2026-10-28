# JaeTravel v2: build prompt for the agent (read slowly, do it in order)

You are building new pages inside an **existing Payload CMS project** (the `jae` repo). Read this like a recipe. Do step 1, then step 2, then step 3. Never skip ahead. If something is unclear, **stop and ask me**. Do not guess.

---

## PART 0. What to do before you write any code

1. Open `CLAUDE.md`. Then read, in this order: `docs/build/BUILD_STATE.md`, `docs/build/00-OPERATING-RULES.md`, `02-ARCHITECTURE-ZERO-HARDCODING.md`, `01-BUILD-GUIDE.md`, `03-SEO-SEARCH-CONSOLE.md`, `04-DESIGN-MATRIX.md`.
2. This is **not the Next.js you know**. Before writing Next code, read the guide in `node_modules/next/dist/docs/`. In Next 16, `params` and `searchParams` are Promises. Await them.
3. Add the two new design boards that come with this prompt into `/design`:
   - `design/home-v2.html` (the new homepage)
   - `design/tour-page-v2.html` (the new detail page with in-page tabs; it is the target for tours, budget tours, disability tours; offers reuse its layout, see Part 9)
   Open both in a browser and look at them at 1280px wide and 390px wide before you plan anything.
4. Reply to me with **10 bullets or fewer** saying what you understood. Then list the questions from Part 13 that you cannot answer yourself. Wait for my answers only at the gates in Part 12.

### What changed since the old boards (important)
- The brand is now the **orange of the JaeTravel logo**, not the old placeholder colours. In the v2 boards the colours and fonts are **real**, not placeholders. Everything is still stored in the Theme global (never in code).
- The URLs are now: `/` (home), `/tours/[slug]`, `/budget-tours/[slug]`, `/disability-tours/[slug]`, `/offers/[slug]`.
- Detail pages have **tabs that switch in place**: Itinerary, Inclusions, Exclusions, Booking, Gallery, Videos. No page reload.
- The home hero has an **animated image carousel**.
- The booking form picks the **country first** (so the dial code appears), then the phone number, then number of travellers, then the date. The **season and price come from the date**.

Record these as "Decisions received" in `BUILD_STATE.md`, update the `home` and `tour-page` rows in `04-DESIGN-MATRIX.md`, and add an `offer-detail` row (Part 9). The old boards `home.html` and `tour-page.html` stay in the repo but are superseded.

---

## PART 1. The golden rules (like for a baby)

1. **Nothing typed in code.** No words, no colours, no links, no prices inside components. Words come from Translations. Colours come from the Theme global. Links come from `resolveHref()`. Numbers come from the pricing functions. If you type a visible word in JSX, you did it wrong.
2. **Empty means hidden.** If a section has no data (no videos, no reviews, no gallery), the section and its tab disappear. Never show an empty box.
3. **Never invent facts.** No fake reviews, no fake ratings, no fake "only 2 seats left", no fake prices, no made-up certificates. Seat numbers are always computed from real reservations.
4. **Variants are Templates, not `if` statements.** Standard, budget and accessible tours use the same code and different Template documents.
5. **One piece of code for one job.** One BookingCard, one price engine, one JSON-LD builder, one carousel.
6. **Small steps.** Change only what the step needs. Never delete a file that is not named in an approved plan. List every file you add, change or delete.
7. **Tell the truth.** Never say you ran something you did not run. Print the exact command and result. If you cannot run a thing, say so.
8. **Only send me new and changed files.** Do not send the whole project zip.
9. **Stop and ask** when: two sources disagree, I must decide something, a change would delete data, or something in a board cannot be built.

---

## PART 2. Words you must know

- **Collection**: a list of documents (Tours, Offers, Seasons...). Defined in `src/collections`.
- **Global**: one single document (Theme, Header, SiteSettings...). Defined in `src/globals`.
- **Block**: a section of a page with its own admin fields (`config.ts`) and its own display (`Component.tsx`). Defined in `src/blocks`.
- **Template**: a document in the `templates` collection holding an **ordered list of blocks**. A tour points to one Template. That is how standard, budget and accessible pages differ.
- **Slug**: the last part of a URL (`masai-mara-classic`).
- **Locale**: a language (`en, de, fr, it, hi, zh, ar`). Arabic is right-to-left.
- **Token**: a named value like `brand` or `ink` stored in the Theme global and turned into a CSS variable.
- **Translations key**: a named piece of text like `tabs.itinerary`, with one value per language.

---

## PART 3. What already exists in the repo (I checked) and what is missing

**Exists:** Payload 3, Next 16, Postgres, Tailwind 4, localisation (7 locales), collections `Pages, Posts, Media, Categories, Users, Tours, Vehicles, Seasons, Offers, Hotels, JointDepartures, Destinations, Templates`; globals `Header, Footer, SiteSettings, Company, Theme`; many detail blocks in `src/blocks` (TitleBlock, Gallery, FactChips, StickyTabs, Overview, Itinerary, PriceMatrix, IncludedExcluded, HotelsBlock, VideoBlock, BestTime, FaqBlock, SimilarItems, LinkHubs, DepartureList, OfferBanner, AccessibilitySection, WhyCheaper, WhatToExpect, BookingCard, TrustRow, CategoryTiles, FeaturedTours, CtaBand, HowItWorks, ReviewsBlock and more); a Form block that already has a `Country` field; seed code in `src/endpoints/seed`; a `[locale]/(frontend)/[slug]` page route. `BUILD_STATE.md` says Phase 2 (tour page) is in progress.

**Thin or missing (you will build or extend these):**
- `Theme` global has only 2 colours. Needs the full token set (Part 4).
- No `Translations`, `Routes`, `SeoSettings`, `FxRates` globals or collections. No `Countries`, `Reviews`, `Inquiries`, `Clients`, `SeatReservations` collections.
- `Offers` has only name, type, two dates. Needs slug, discount, targets, terms, image and more (Part 9).
- `StickyTabs` block only stores tab titles. It must become real in-page tabs holding blocks (Part 6).
- `JointDepartures` has tour, dates, price, seats, status. It has no vehicle, minimum guests or reservations yet.
- No block exists yet for: **HeroCarousel**, **SearchBar** (trip finder), **OffersGrid**, **ValueProps**, **UpcomingDepartures** (use or extend `DepartureList`).
- No frontend routes for `/tours/[slug]`, `/budget-tours/[slug]`, `/disability-tours/[slug]`, `/offers/[slug]`.
- Money is a plain `number`. Make it **integer US cents** everywhere (doc 01).

Run `pnpm generate:types` after every schema change. Create a **baseline migration first**, then one migration per schema change. Never edit the database by hand.

---

## PART 4. Foundation step A: brand, theme, fonts, logo

### 4.1 Theme global: fields and starting values
Extend the Theme global to hold these tokens. These are the real values taken from the logo file.

| Token | Value | Used for |
|---|---|---|
| brand | `#FF7302` | button backgrounds, active tab, highlights, selected price cell |
| onBrand | `#201E1F` | text **on** orange. **Never use white on orange** (only about 2.9:1) |
| accentText | `#B34A00` | small text and links on white (passes 4.5:1) |
| sun | `#FFDD00` | the yellow of the sun, panel and glow |
| ink | `#201E1F` | main text, dark surfaces |
| ground | `#FFFFFF` | page background |
| tint | `#FFF2C2` | soft yellow bands, offer cards, trust strip |
| line | `#E6D9CB` | borders |
| muted | `#56585B` | secondary text |
| soft | `#BDB7AE` | secondary text on dark surfaces |
| night | `#201E1F` | footer, dark bars |
| success | `#2E7D4F` | ticks |
| danger | `#B3261E` | crosses, errors |
| whatsapp | `#25D366` | WhatsApp button (text `#06311A`) |

Also store: **dark-mode overrides** for ground `#151311`, surface `#211F1C`, tint `#1B1917`, ink `#F5F1EB`, muted `#B8B1A7`, line `#3A3631`, night `#0F0E0D`, accentText `#FF9340`, success `#6CC38E`, danger `#FF8A7A`; **radius** values (pill `999px`, card `16px`, panel `20px`, form `18px`); a **"pop shadow"** token (`6px 6px 0 ink`) used on the trip finder and the booking card; **status tokens** for guaranteed, filling, open, full (status always shows text plus a symbol, never colour alone).
Render the tokens server-side into `:root` CSS variables (and a dark block for `prefers-color-scheme: dark` plus a manual `[data-theme]` switch). Map them into Tailwind 4 with `@theme inline`. `globals.css` keeps structure and safe fallbacks only. The admin must warn when a text/background pair is under 4.5:1.

### 4.2 Fonts
Display font: **Montserrat** (weights 600, 700, 800, and **italic 800**). Body font: **Figtree** (400, 500, 600). Load with `next/font`. The Theme global has a font select from a fixed list; seed it with these two. The hero headline is **italic 800** (it echoes the logo wordmark); other headings are upright. Keep body lines under about 70 characters wide.

### 4.3 Logo
The logo is a round orange badge (elephant, plane, acacia, "Jae Travel Expeditions", tagline "Where the world meets the wild"). I will place the file at `content/brand/logo.jpg`. Upload it to Media via the seed and point `Company.logo` at it. In the header and footer show the logo as a **44px circle with a 2px white ring** beside the wordmark "JaeTravel" in italic 800. The tagline text is a Company field and shows in the footer. **Do not paste the logo as base64 into CSS** (the boards did that only to be self-contained).

### 4.4 Translations global (build it now, everything depends on it)
Create a localised `Translations` global: an array of `{ key, value }` (value localised, key unique). Add a typed manifest file `src/i18n/keys.ts` listing every key with its English default. Write `t('key')` for server and client use. The seed writes the English values. Add a test: every manifest key has a value in the default locale. Add the ESLint rule `react/jsx-no-literals` for visible text.

Keys needed for these pages (English defaults):

- nav and global: `nav.safaris` Safaris, `nav.budget` Budget, `nav.accessible` Accessible, `nav.offers` Offers, `nav.groups` Group departures, `nav.vehicleHire` Vehicle hire, `nav.getQuote` Get a quote, `currency.label` Currency, `whatsapp.cta` WhatsApp us
- breadcrumb: `breadcrumb.home` Home
- hero and finder: `hero.browse` Browse safaris, `hero.build` Build your own trip, `hero.pause` Pause, `hero.play` Play, `hero.slideN` Show slide {n}, `finder.destination` Destination, `finder.any` Anywhere in East Africa, `finder.length` Trip length, `finder.anyLength` Any length, `finder.group` Travelling as, `finder.needs` Needs, `finder.standard` Standard, `finder.wheelchair` Wheelchair accessible, `finder.mobility` Mobility support, `finder.submit` Find safaris
- home sections: `home.ways.title` Three ways to travel with us, `home.popular.title` Popular safaris, `home.viewAll` View all safaris, `home.joint.title` Join a group departure, `home.offers.title` Current offers, `home.allOffers` All offers, `home.why.title`, `home.builder.cta`
- cards: `card.from` From, `card.perPerson` per person, `card.days` {n} days
- tabs: `tabs.itinerary` Itinerary, `tabs.inclusions` Inclusions, `tabs.exclusions` Exclusions, `tabs.booking` Booking, `tabs.gallery` Gallery, `tabs.videos` Videos, `tabs.details` Details, `tabs.eligible` Eligible tours, `tabs.terms` Terms, `tabs.aria` Tour details
- itinerary and downloads: `itinerary.day` Day {n}, `itinerary.download` Download itinerary PDF, `itinerary.customise` Customise this tour
- lists: `inclusions.title` What's included, `exclusions.title` What's not included
- booking form: `booking.title` Prices and booking, `booking.perPersonNote`, `booking.name` Full name, `booking.email` Email, `booking.country` Country, `booking.countryPlaceholder` Select your country, `booking.phone` WhatsApp or phone number, `booking.phoneFirst` Select country first, `booking.travellers` Number of travellers, `booking.travellersN` {n} travellers, `booking.moreThan8` More than 8 (custom quote), `booking.date` Intended travel date, `booking.datePrompt` Choose your travel date to see the price, `booking.season` Season, `booking.perPerson`, `booking.total`, `booking.estimateNote`, `booking.needs` Access or dietary needs, `booking.pdfCheckbox`, `booking.consent`, `booking.submit` Request a quote, `booking.success`, `booking.errorRequired`, `booking.errorPhone`, `booking.errorDate`, `booking.nextDepartures` Next group departures, `booking.pickDate` Pick date, `booking.cta` Check dates and book
- facts: `facts.duration`, `facts.startsEnds`, `facts.groupSize`, `facts.pace`, `facts.bestTime`, `facts.language`, `highlights.title`
- sections: `bestTime.title`, `access.title`, `reviews.title`, `reviews.empty`, `reviews.write`, `faq.title`, `similar.title`, `videos.consent`, `gallery.close`
- status words: `status.open`, `status.filling`, `status.guaranteed`, `status.full`, `seatsLeft` {n} seats left
- offers: `offer.validUntil` Book by {date}, `offer.travelPeriod`, `offer.was`, `offer.now`, `offer.endsSoon`, `offer.expired`, `offer.applies`, `offer.discountPercent` {n}% off, `offer.addedValue`
- trust: items come from SiteSettings.trust (not keys)

---

## PART 5. Foundation step B: Routes, slugs and URLs

Create a **Routes global**. Each row: `{ collection, templateVariant (optional), prefix (localised), breadcrumbLabel (localised) }`. Seed rows:

| collection | variant | prefix | breadcrumb label |
|---|---|---|---|
| tours | standard (and specialty) | `tours` | Safaris |
| tours | budget | `budget-tours` | Budget safaris |
| tours | accessible | `disability-tours` | Accessible safaris |
| offers | n/a | `offers` | Offers |
| joint-departures | n/a | `joint-safaris` | Group departures |
| vehicles | n/a | `vehicle-hire` | Vehicle hire |

Add a `variant` select (`standard, budget, accessible, specialty`) to the **Templates** collection. A tour's **canonical URL** is the prefix of its Template's variant plus its slug. Rules:
- Slugs are unique across **all** tours, so one tour is never reachable under two prefixes. If someone visits the wrong prefix for an existing tour, **301 redirect** to the canonical one.
- `resolveHref(reference)` is the only way to build links. Components never contain path strings.
- Reserve slugs that clash with page paths (`tours`, `offers`, `admin`, `api`, and so on) and validate in the admin.
- Resolver order (doc 02): prefix match then document by slug, else Pages by path. Keep the existing `[locale]` segment.
- Expired offers and past departures return **410** or redirect to the parent.
- Breadcrumb: `Home / {Routes label} / {document title}` rendered visibly on every page except home.

**Open decision (flag, then proceed with this default):** doc 02 originally said variants share one `tours` prefix. I have now decided each variant has its own prefix as above. Record it.

---

## PART 6. Foundation step C: data model changes

Do these with migrations. Keep existing fields; add what is missing. Everything visible is localised where it is text.

**Seasons** (collection exists). Seed sample: Peak (1 Jul to 31 Oct), High (1 Nov to 28/29 Feb, this one **wraps over the new year**), Low (1 Mar to 30 Jun). Add a validation hook: every day of the year is covered by **exactly one** season (no gaps, no overlaps, February 29 handled). Season names and dates are an open owner decision; the seed is **sample** only.

**Tours**: add `slug` (unique), `sample` checkbox, `heroImage` (Media), `startPoint`/`endPoint` text, `pace` select, `groupSizeMin/Max`, `guideLanguages` (text array), `trust` override (optional), `similarOverrides` (relationship array), `accessibility` already exists (extend per Part 8), `whyCheaper` exists. `pricing.matrix` rows already hold season + p2, p4, p6, p8: store as **integer cents per person**. A tour cannot publish unless every season has all four prices (validation hook), every gallery image has alt text and every itinerary day has a title.

**Media**: `alt` (required), `creator`, `creditText`, `copyrightNotice`, optional `licenseUrl`, `acquireLicensePageUrl`, `focalPoint`.

**Countries** (new collection, seeded): `name` (localised), `iso2`, `dialCode`, `sortOrder`, `popular` flag. Seed the full ISO list using `libphonenumber-js` metadata (add the dependency). Put Kenya, Tanzania, Uganda, Rwanda, UK, USA, Germany first via `popular`.

**Offers**: add `slug`, `summary`, `heroImage`, `badgeText`, `discountType` (percent | fixed | none), `discountValue`, `appliesTo` (relationship to tours and/or vehicles, plus optional destination and category), `travelFrom`, `travelUntil`, `description` (rich text), `howItWorks` (array), `terms` (rich text), `featured`, `active`, `minGuests`, `seo`. Expired (`validUntil` in the past) or inactive offers never render and never appear in lists or sitemaps.

**SiteSettings**: add `trust` (array: text, icon optional), `paymentMethods` (array of text; empty hides the line), `minLeadDays` (number), `defaultCurrency`, `enabledCurrencies`, `whatsappMessageTemplates`, `howBookingWorks` steps, `cancellationSummary` (localised text). **Company**: `logo`, `tagline`, `email`, `address`, `credentials` (hide if empty).

**JointDepartures**: add `slug`, `vehicle`, `minGuestsToRun`, `cutoffDays`, `published`. **SeatReservations** is Phase 8. **Until it exists, never show a seat number.** Show date, from-price and a status word only.

**Reviews** (new collection, moderated): rating, author, country, date, body, target (tour/vehicle), source, `verifiedBooking`, consent, `status`. Only `approved` reviews render, and a hook keeps `ratingSummary` on the parent. Never seed fake approved reviews. The reviews area shows its empty state until real ones exist.

**Inquiries / Clients** (new, never publicly readable): type, references, guests, dates, season, currency, USD amount (cents), offer, phone (E.164) and country (iso2), UTM, consent, notification status. Roles `admin, editor, ops` exist before this ships.

**FxRates**: base USD, rate date. Seed **sample** rates, mark them sample. A job refreshes them daily (existing jobs scaffold).

---

## PART 7. Shared services (build once, test with Vitest)

Put in `src/lib/` as pure functions. Every page, card, PDF, schema block and inquiry **must** call these so all numbers agree.

```
seasonForDate(date, seasons)            -> season   // handles wrap over new year and Feb 29
getTourPriceMatrix(tour)                -> rows of { season, p2, p4, p6, p8 } in cents
perPersonPrice(tour, season, guests)    -> cents    // guests in {2,4,6,8}
estimateTour({tour, date, guests, offer?, currency}) 
                                        -> { season, perPerson, total, was?, now?, currency } | { customQuote: true }
applyOffer(price, offer, today)         -> price after discount, only if offer is active and valid
convert(cents, fromCurrency, toCurrency, rates)
formatMoney(cents, currency, locale)
cheapestFrom(tour)                      -> lowest price in the matrix (for cards and "From")
```
- More than 8 guests returns `customQuote`. The UI then shows the `booking.moreThan8` text and hides the price.
- A date in the past or earlier than today + `minLeadDays` is invalid.
- Also build: `getSimilarTours` (doc 01 rules), `resolveHref`, and `buildTourJsonLd`, `buildBreadcrumbJsonLd`, `buildImageObject` (Part 10).
- **Inquiry endpoint**: zod-validated (type, tour id, guests, date, season, currency, name, email, phone E.164, country iso2, needs, offer id, wantsPdf, consent, honeypot). Database-backed rate limiting. Creates Client + Inquiry. Notification adapter with email and WhatsApp stubs. Records displayed currency and the USD amount.

---

## PART 8. The detail page (tours, budget tours, disability tours)

Target board: `design/tour-page-v2.html`. Route files: one resolver renders the document with its Template. **Do not make three page files.** Server-render everything.

### 8.1 Layout in simple pictures

Desktop (1280px):
```
[ orange top bar: logo | nav | currency ]
Home / Safaris / Masai Mara Classic
[ title + badges + summary + "Updated" date ]   [ hero image ]
[ trust strip on a yellow tint ]
[ at-a-glance grid (6 facts) ]                                  [ STICKY SIDE CARD  ]
[ trip highlights ]                                             [ from $ / book btn ]
[ TABS: Itinerary | Inclusions | Exclusions | Booking | Gallery | Videos ]
[ the open tab's panel ]
[ best time ] [ accessibility box ] [ reviews ] [ FAQ ] [ similar safaris ]
[ footer ]                                                   (WhatsApp button floats)
```
Mobile (390px): side card disappears; a **bottom bar** shows "From $X" and the "Check dates and book" button; that button opens the Booking tab with the form **sliding up**. Tabs scroll sideways. The gallery becomes a swipe carousel. WhatsApp button sits above the bottom bar.

### 8.2 Block order for the Standard template (seed this)
1. `TitleBlock` (H1, summary, badges, updated date)
2. `Gallery` hero (one large image)
3. `TrustRow` (from SiteSettings.trust; hide items with no data)
4. `FactChips` (the at-a-glance grid: duration, start and end, group size, pace, best time, guide language)
5. `Overview` highlights list
6. **`StickyTabs`** (see 8.3)
7. `BestTime`
8. `AccessibilitySection` (shows only if the tour has accessibility data)
9. `ReviewsBlock` (empty state until real reviews)
10. `FaqBlock`
11. `SimilarItems` (3 cards, "how it differs" line from CMS)
12. `LinkHubs`
13. `DepartureList` compact (next joint departures)
14. `OfferBanner` (only if an active offer applies)
15. `BookingCard` (the sticky side card on desktop, the bottom bar on mobile)

### 8.3 The tabs (the most important part)
Turn `StickyTabs` into a real **tab group** block:
- Fields: `tabs[]`, each with `key` (id used for the `#hash`), `title` (localised, defaults from `tabs.*` keys), and `panel` (a nested `blocks` field that accepts: Itinerary, IncludedExcluded (inclusions mode / exclusions mode), PriceMatrix + BookingForm, Gallery, VideoBlock, Content, FaqBlock, PolicyBlock).
- Seed tabs in this order: **Itinerary** (open by default), **Inclusions**, **Exclusions**, **Booking**, **Gallery**, **Videos**. An editor can reorder, rename or hide any tab in the admin with no code change.
- **Behaviour:** clicking a tab shows its panel in place. No navigation, no reload. Update the URL with `history.replaceState` to `#key`. Opening a URL that ends in `#gallery` opens that tab. Left and Right arrow keys move between tabs. Use real `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls`, and roving `tabindex`.
- **SEO:** **all panels are rendered in the server HTML**; inactive ones use the `hidden` attribute. Never load panel content with JavaScript after click.
- A tab with no content (no videos, no gallery) is **not rendered** at all.
- The tab bar is sticky under the top bar; scrolls sideways on mobile; the active tab uses `brand` background and `onBrand` text.
- The currently chosen tab does not need to be remembered between visits.

### 8.4 Each tab panel
- **Itinerary:** collapsible days using `<details>`; the first day open. Each day: title, body, hotel, meals, drive time, mobility level (shown on the accessible template). Below: "Download itinerary PDF" (from `itineraryPdf`; hide if none) and "Customise this tour" (links to the itinerary builder with the tour id, via `resolveHref`).
- **Inclusions / Exclusions:** the `included` and `excluded` lists. Inclusions use a green tick, exclusions a red cross. **Each icon has a text alternative** (not colour alone).
- **Booking:** (a) the price matrix table, (b) the **Next group departures** list, (c) the booking form. Details in 8.5.
- **Gallery:** grid of images from `gallery`. Click opens a lightbox (`<dialog>`) with caption (from alt/caption), Close button, Escape closes, focus returns. Images are real `<img>` through `next/image` with `sizes`.
- **Videos:** each video shows a thumbnail first. The YouTube iframe loads **only after the visitor presses play** (use the no-cookie domain). The video title, description, thumbnail and upload date are required to publish (doc 03) and feed the `VideoObject` schema. Provide a visible link to the video as a fallback.

### 8.5 The Booking panel and form, exactly
1. **Price matrix table**: rows = 2, 4, 6, 8 travellers; columns = the Seasons from the CMS (name plus date range text from the Seasons data). Prices are per person, formatted by `formatMoney` in the chosen currency. Note text from `booking.perPersonNote`.
2. **Next group departures** (from `JointDepartures`: future, published, not cancelled). Each row: date, status word with symbol, from-price, and "Pick date" which fills the date field. **No seat numbers until SeatReservations exists.** If there are none, hide the whole list.
3. **The form, in this order:**
   1. Full name
   2. Email
   3. **Country** (select, from the `Countries` collection, popular first, label shows name plus dial code)
   4. **Phone number**: the field is **disabled with the text "Select country first"** until a country is chosen. After choosing, show the dial code (like `+254`) in a box beside the field and enable the field. Validate with `libphonenumber-js` for the chosen country. Strip a leading 0. Save as **E.164** (`+254712345678`) plus `iso2`.
   5. **Number of travellers**: select with 2, 4, 6, 8 and "More than 8 (custom quote)".
   6. **Intended travel date**: a date input. Past dates and dates inside `minLeadDays` are blocked.
   7. **Live price box** (`aria-live="polite"`): shows the **season name** from `seasonForDate`, price per person, "x travellers", and the **total**. It updates when the date, the travellers or the currency changes. The matching price cell in the table gets a highlighted background **and** a visible text mark (not colour alone). Small note: "The season is set by your start date. This is an estimate; we confirm the final price by email."
   8. Access or dietary needs (textarea)
   9. Checkbox "Email me the itinerary PDF" (if a PDF exists)
   10. Consent checkbox, honeypot (hidden), submit button "Request a quote"
4. Before a date is chosen, the price box says `booking.datePrompt`.
5. For "More than 8", hide the price box and show the custom-quote message.
6. Submit posts to the inquiry endpoint. The success message repeats: travellers, date, season, estimated total, and the phone number with its code. Errors are specific and next to the field.
7. If an active offer applies to this tour, show **was / now** and carry `offerId` into the inquiry.
8. Fire analytics events from doc 01 (`form_start`, `form_submit`, `form_success`, `currency_change`, `customise_click`, `pdf_download`, `whatsapp_click`).

### 8.6 The side card (desktop) and bottom bar (mobile)
Shows `card.from` plus `cheapestFrom(tour)` per person (updates with currency), the main button (opens/focuses the Booking tab), an "Ask a question" link, and short lines from SiteSettings (`cancellationSummary`, `paymentMethods`, reply time). **Hide any line that has no data.** The card has the border and pop shadow from the Theme tokens.

### 8.7 Budget and accessible templates (differences only)
- **Budget** (`/budget-tours/[slug]`): after the TitleBlock add `PriceTable` (a compact "from" price) and add `WhyCheaper` (from `Tour.whyCheaper`, a "what's shared" explanation). `SimilarItems` returns 2 budget plus 1 standard.
- **Accessible** (`/disability-tours/[slug]`): show an **"Accessible" badge** in the title area; `AccessibilitySection` moves **up** to sit right after Overview; the itinerary shows each day's `mobilityLevel`; the Inclusions tab includes accessibility inclusions from `Tour.accessibility`; `SimilarItems` returns accessible tours first. **Never make an accessibility claim that is not in the tour's data.** Vehicle lift, step-free rooms and similar come only from the Vehicles and Hotels data linked to the tour.
- Variant-specific breadcrumbs and URLs come from the Routes global (Part 5).

---

## PART 9. The offers page: `/offers/[slug]`

There is **no finished board for this page**, so use `tour-page-v2.html` as the base and follow this spec. Add an `offer-detail` row to the matrix and record it as "designed from spec, awaiting visual approval".

Template variant: a new `offer` Template.

Block order:
1. `TitleBlock`: offer name, a **badge** (`badgeText` or computed "20% off"), summary.
2. `Gallery` (hero image) and `FactChips`: discount, **book by** date (`validUntil`), travel period, destination, who it applies to. A small "Ends soon" chip may show **only when `validUntil` is within a Setting-defined number of days**, computed from real dates. No countdown timers, no fake scarcity.
3. **`StickyTabs`** with tabs: **Details** (description plus "how this offer works"), **Eligible tours** (cards of the `appliesTo` tours with **was / now** prices computed by `applyOffer`; each card links via `resolveHref`), **Terms** (`terms` rich text plus `TermsFaq`), **Booking** (the same booking form in **offer mode**: choose one of the eligible tours first, then country, phone, travellers, date; the price box shows was and now; `offerId` is sent).
4. `SimilarItems` (other active offers), `CtaBand`, `Newsletter` (optional).
5. Side card (desktop) and bottom bar (mobile) show "now" price, "was" price struck through, and "book by {date}".

If the offer is expired or inactive, return **410** or redirect to `/offers`. The offers list page (a Pages document with OfferFilters, OffersGrid, FeaturedOffer, GroupDiscountTable, as in the matrix) is **not** part of this task; build `OffersGrid` only because the homepage needs it.

---

## PART 10. SEO, rich results and Google Merchant (follow doc 03, plus this)

**JSON-LD is generated only by shared builder functions from CMS data.** The JSON-LD you see inside my HTML boards is an **illustration only; do not copy it**.

Per page type:
- **Every page except home**: `BreadcrumbList` that matches the visible breadcrumb.
- **Tours (all variants)**: `["Product","TouristTrip"]` with name, description, images, `sku`, brand (organisation), `itinerary` as an `ItemList` from the itinerary days, and `offers` as an **AggregateOffer** (`lowPrice`, `highPrice`, `priceCurrency`, `offerCount`, `availability`, `priceValidUntil`, `url`, `seller`) computed from the price matrix. If an active offer applies, include the discounted price in the offer. `aggregateRating` and `review` **only** from approved reviews that are actually shown on the page. Add a `VideoObject` for each video that has all required fields. Do **not** add `Event` to tour pages (private tours are not events).
- **Joint departures**: `Event` as in doc 03, never for past dates.
- **Images**: `ImageObject` with `contentUrl`, `creator`, `creditText`, `copyrightNotice` (from Media). Add `license` only if I confirm photos are licensable.
- **Home**: `TravelAgency` (name, logo, address, geo, telephone, `sameAs`). No `aggregateRating` on the organisation.
- **FAQPage**: optional, low priority. Emit it only if `SeoSettings` enables it; the visible text and the markup must match exactly.
- **Google Merchant**: Tours and vehicle hire are services, so Merchant listings and Merchant opportunities may not apply. Build the `SeoSettings.merchant` group (default **OFF**): Merchant Center ID, return policy, shipping. When on, emit `hasMerchantReturnPolicy` and `shippingDetails` only from real policy data and **only for physical goods**. Never invent them for tours. Report this to me as an owner decision. Also tell me that a Google "Things to do" travel feed may be the correct route for tours and ask whether I want it designed.

Page basics for every page: unique `<title>` (about 60 characters, includes the "from" price on tour pages), meta description, **one canonical** (`SeoSettings.siteUrl`; use one `www` or non-`www` convention only), Open Graph and Twitter tags using the hero image, reciprocal `hreflang` for 7 locales plus `x-default`, `robots` `max-image-preview:large`, `noindex` on admin, preview, drafts and filter combinations. One `<h1>` per page. Primary content and JSON-LD are in the first server HTML. Update the sitemap (include image and video sitemaps) and `lastmod`. Add the readiness panel and `pnpm seo:audit` described in doc 03.

---

## PART 11. The homepage: `/` (target `design/home-v2.html`)

A Pages document made of blocks. Seed it in this order. Anything not listed here is **not** on the page (the other blocks stay available in the admin for editors).

1. **Header** (global): orange bar over the hero with logo, nav, currency select. Text in `ink`.
2. **`HeroCarousel`** (new block). See 11.1.
3. **`SearchBar`** (new block, the trip finder, overlaps the hero bottom by 64px): selects for Destination (from Destinations), Trip length, Travelling as (2, 4, 6, 8), Needs (standard, wheelchair accessible, mobility support). It is a real `<form method="get">` that goes to the tours listing with filters in the URL (so it works without JavaScript). Style: 2px ink border and the pop shadow token.
4. **`CategoryTiles`** (existing, extend): "Three ways to travel with us": three tiles from the `Categories` collection: **Accessible safaris** (yellow `sun` background, ink text, wheelchair icon), **Budget safaris** (`brand` background, ink text), **Signature safaris** (ink background, white text). Colour per tile is a CMS select (sun, brand, ink), not code. Each links via `resolveHref`.
5. **`FeaturedTours`** (existing): "Popular safaris", 4 cards (image, title, days and place, "From $X per person" from `cheapestFrom`, currency-aware). Each card links to the tour's **canonical** URL (so budget and accessible tours link to their own prefix). Cards use the hero or first gallery image; if none, a neutral placeholder from Media settings.
6. **`UpcomingDepartures`** (extend `DepartureList`): "Join a group departure", on an **orange (`brand`) band with ink text and ink buttons**. Three rows: tour name, vehicle, date, from-price, "Book a seat". **No seat counts until SeatReservations exists** (then show real seat squares with a text alternative). Hide the whole section if there are no future departures.
7. **`OffersGrid`** (new block): "Current offers", two cards on `tint` background, each with badge, title, summary, validity text (real `validUntil`). Only active, unexpired offers.
8. **`ValueProps`** (new block): "Local operators, not a middleman" with three short facts. All text from block fields.
9. **`CtaBand`**: "Not quite right? Build your own itinerary." Orange panel, ink button, links to the itinerary builder.
10. **Footer** (global): logo, tagline, link columns, email; WhatsApp floating button (from SiteSettings), currency from the header.

### 11.1 HeroCarousel: exact behaviour
**Layout:** two columns on desktop. Left: H1 (italic 800), lead text, two buttons (primary = ink background, white text; secondary = outline). Right: a **circular image stage** (aspect ratio 1:1, max 500px, white 6px border and a soft white ring) with **slides** inside, a caption pill on each slide, two floating **chips**, dots and a Pause button underneath. Behind everything: the hero background is a radial gradient from `sun` through to `brand` (values from Theme tokens), with **slow rotating light rays**. On mobile (under 980px) the columns stack, the image circle goes below the text (about 86% wide), chips are hidden.

**Admin fields:**
- `headline`, `lead` (localised), `primaryCta`, `secondaryCta` (link fields)
- `slides[]` (3 to 6): `image` (Media, required, alt required), `caption` (localised), `link` (link field), `focalPoint`
- `chips[]` (max 3): `text` (localised), optional `priceSource` (none, cheapest group seat, cheapest tour) which appends a computed price
- `autoplaySeconds` (default 6.5; 0 = no autoplay), `fadeMs` (default 1000), `kenBurns` (checkbox, default on), `shape` (circle, rounded, fullBleed), `showRays` (checkbox, default on)

**Motion rules:**
- Slides **crossfade** (opacity). The active slide does a slow **zoom** (scale 1.02 to about 1.17 over about 9 seconds, plus a small shift). The previous slide keeps its final zoom while it fades out, so nothing "jumps". Use only `transform` and `opacity`.
- The first slide is in the server HTML and visible **without JavaScript**. JavaScript only rotates slides. The first image is the LCP image: `priority`, `fetchPriority="high"`, correct `sizes`. Other slides load lazily. The stage has a fixed aspect ratio so there is **no layout shift**.
- A **Pause/Play button is always visible** and changes its label (`hero.pause` / `hero.play`, `aria-pressed`). Dots are real buttons with `aria-label` `hero.slideN` and `aria-current`. Each dot has a hit area of **at least 44px**. Autoplay pauses while the pointer is over the stage or focus is inside it.
- Wrap in `role="group"` with `aria-roledescription="carousel"`. Mark each slide `aria-label="n of N"`. Hide inactive slides from assistive technology.
- **Reduced motion:** if `prefers-reduced-motion: reduce`, **no autoplay**, no Ken Burns zoom, no rotating rays, no floating chips. The visitor can still change slides with the dots.
- Rays and chip float are decoration (`aria-hidden`).
- Keep the carousel one reusable client component with typed props. Do not fetch inside it.

**Sample slides:** the four illustrated scenes in `home-v2.html` (Masai Mara sunset, Amboseli with Kilimanjaro and elephants, Nakuru and Naivasha giraffes, Kenya coast dhow) are **placeholders**. Export each `<svg>` into `content/media/` as a sample image, upload them through the seed with proper alt text, and mark them `sample`. I will replace them with real photos in the admin.

---

## PART 12. Order of work, gates and what to deliver each time

Change to the old phase order for these pages only (record it in `BUILD_STATE.md`):

1. **Foundation A to C** (Parts 4 to 7): Theme, fonts, logo, Translations, Routes, migrations, Countries, Seasons, services, seed. **GATE 1: I approve before pages start.**
2. **Tour detail, standard template** (Part 8): on one real seeded tour (`masai-mara-classic`). **GATE 2: I review.**
3. **Variants** budget and accessible (8.7), routes and redirects. **GATE 3.**
4. **Offers detail** (Part 9).
5. **Homepage** (Part 11). **GATE 4: I review.**
6. **SEO, schema and audit** (Part 10), then hardening: accessibility, performance, security, tests. **GATE 5: final review.**
Between gates keep going without waiting, unless blocked.

### For every step, in this order
1. Restate the scope in 10 bullets or fewer.
2. Plan: files to add or change, schema changes, migrations, risks. 
3. Implement in small steps.
4. Self-review against the board and the matrix row.
5. Verify and print **exact results** of: `pnpm lint`, `pnpm generate:types`, `pnpm generate:importmap`, `pnpm test:int`, `pnpm build`, and `pnpm seo:audit` once it exists. If a browser tool exists, screenshot at **1280px and 390px** and compare to the board. If not, say so and give me a manual checklist.
6. Update `docs/build/BUILD_STATE.md`.
7. Send me **only new and changed files** (a list with paths, then the files).

### Fidelity report (required with every page)
A table, one row per board section: **Section | Block or component | Data source | Status (Done / Partial / Missing) | Notes**. Then: deviations, then what you could not verify. A page is not Done while any row is Partial or Missing.

---

## PART 13. Seed content (all marked `sample`)

Use the seed importer (`/content` folder plus script). Create:
- **Seasons** (Part 6), **Countries** (full list), **FxRates** (sample).
- **Templates:** Standard, Budget, Accessible, Offer (blocks in the orders above).
- **Tours:** `masai-mara-classic` (standard, 4 days, matrix: 2 travellers 760/860/980 USD, 4: 660/740/850, 6: 600/670/780, 8: 560/630/730 for Low/High/Peak; itinerary of 4 days), `amboseli-tsavo-safari` (standard, 5 days, from 720), `nakuru-naivasha-camping` (budget, 3 days, from 310), `rwanda-accessible-gorilla-safari` (accessible, 5 days, from 2450). Prices are **placeholders for the owner to replace**.
- **Offers:** `early-bird-2027` (10% off private safaris, valid until 31 Dec) and `green-season-special` (added value: third night free), both `sample`.
- **Joint departures:** two future dates for `masai-mara-classic`.
- **Pages:** the Home page (Part 11), with the four sample slides.
- **Globals:** Header, Footer, SiteSettings (trust items, empty `paymentMethods`), Company (name, tagline "Where the world meets the wild"), Theme (Part 4), Routes (Part 5), Translations (Part 4.4).
Reviews: **none**. The empty state shows.

---

## PART 14. Tests and acceptance

**Unit (Vitest):** `seasonForDate` (including a date on 31 Dec and 1 Jan, 29 Feb, season boundaries), `estimateTour` for each season and each group size and "more than 8", `applyOffer` (active, expired, inactive), `convert` and `formatMoney`, `cheapestFrom`, phone validation per country, slug and prefix resolution.
**Integration:** inquiry endpoint (valid, invalid phone, past date, honeypot, rate limit), sitemap contains only canonical 200 URLs, JSON-LD builders output the required properties, wrong-prefix tour URL returns 301, expired offer returns 410 or redirect.
**Playwright:** (1) open `/tours/masai-mara-classic`, click each tab and see the panel change without navigation, and `#gallery` opens Gallery; (2) pick country Kenya, see `+254`, type a number; (3) pick 4 travellers and a July date, see **Peak** and the correct total, and the matching price cell marked; (4) change the currency and see the total change; (5) mobile 390px bottom bar opens the form; (6) home hero shows slide 1 with JavaScript off, rotates with it on, Pause works, reduced motion stops autoplay; (7) offer page shows was/now and carries the offer into the inquiry; (8) Arabic locale renders right-to-left.
**Accessibility:** axe on one page per type, keyboard-only walk through tabs, accordion, lightbox, form and carousel; contrast at least 4.5:1; touch targets at least 44px; visible focus ring (use `ink` on orange areas, `brand` on white).
**Performance:** first fold of a tour page under 2.5s LCP on slow 4G; no layout shift from the carousel or images; video and lightbox code lazy.

**Acceptance (all in the admin, no code change):** rename or reorder a tab; hide the Videos tab; change the brand colour and see the site change; change the `budget-tours` prefix and see links and redirects update; add a new slide to the hero; create a new offer and see it appear on the homepage and its own page; set an offer to inactive and see it vanish.

---

## PART 15. Questions to answer in your first reply (do not guess)

1. I answer **fonts and logo** here (Montserrat and Figtree; logo at `content/brand/logo.jpg`). Confirm you can load them.
2. Email provider and WhatsApp channel for notifications.
3. Payments at launch: request-only or online deposits (card, M-Pesa Daraja)?
4. Media and PDF storage provider, and host type (serverless or server).
5. Locale routing: keep the single `[locale]` segment?
6. **Real season names and date ranges** (the seeded ones are samples).
7. Joint safaris: minimum guests, cutoff days, hold minutes, deposit percent, does "guaranteed" persist after a cancellation?
8. Real credentials, rating sources, the real cancellation and refund policy, accepted payment methods.
9. Are my photos licensable (for `license` in image metadata)? Any physical goods for Merchant listings? Do I want a "Things to do" feed?
10. Canonical host: `www.jaetravel.co.ke` or `jaetravel.co.ke`?
11. Confirm the five URL prefixes in Part 5 and the redirect list from the old live site.
12. Do I want 1, 3, 5 or 7 traveller prices (the matrix has 2, 4, 6, 8 only)? If yes, what is the pricing rule?

---

## PART 16. Final checklist before you say "done"

- [ ] Every board section has a row marked Done in the fidelity report.
- [ ] No hard-coded visible text, hex colour or path string in components (lint passes).
- [ ] All five URL types work: `/`, `/tours/[slug]`, `/budget-tours/[slug]`, `/disability-tours/[slug]`, `/offers/[slug]`.
- [ ] Tabs switch in place, deep-link by `#key`, and all panels are in the server HTML.
- [ ] Country, then phone, then travellers, then date, then season price, all from the pricing functions.
- [ ] Hero carousel works with and without JavaScript and respects reduced motion.
- [ ] Empty data hides sections and tabs. No fake reviews, seats, prices or claims.
- [ ] JSON-LD comes only from builders and passes the audit. Merchant stays OFF until I decide.
- [ ] Migrations exist for every schema change. Types and import map regenerated.
- [ ] `BUILD_STATE.md` updated. You sent only new and changed files and told me exactly what you could not run.
