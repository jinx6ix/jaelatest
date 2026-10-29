# Importing your tours, vehicles and destinations

## What is in this folder
| File | What it does |
|---|---|
| `jaetravel-import.sql` | Adds 80 tour pages, 6 vehicles and 5 destinations (the four countries plus "multi-country") with their images and SEO text |
| `scripts/copy-site-images.mjs` | Copies the 132 local images from your old project's `public` folder into this project's `public` folder |
| `src/site/TourPage.tsx` | Changed file: now shows a tour's long description (needed for the package tours) |
| `src/lib/site.ts` | Changed file: listing pages show up to 200 tours instead of 60 |

Replace the two changed files in the project, keeping the same paths.

## Steps
1. Use the v2 project on a database that already has the Payload tables (`pnpm payload migrate` on an empty database).
2. Load the SQL: `psql "$DATABASE_URL" -f jaetravel-import.sql`
   It runs in one transaction (all or nothing) and can be run again safely: anything that already exists is skipped, never overwritten.
3. Copy the images: `node scripts/copy-site-images.mjs "C:\path\to\old-project\public"`
4. The home, about and contact pages come from `pnpm seed`. Run it too if you have not yet (it also adds 9 sample tours you can delete in the admin: they are marked "sample").

## How your data was mapped
* **Tours** (72 in `tours.ts` + 8 package products): each becomes a tour page. The tour type is chosen from the title and slug: "accessible / disability / wheelchair" go to Disability tours, "migration" to Migration tours, everything else to Tours. Destination comes from the `country` field (the package products were assigned a country from their descriptions).
* **Duration** comes from the itinerary text ("Day 1 ... Day 3", "7-day ...", "half-day" counts as 1). Packages use their `duration` field.
* **Itinerary**: "Day 2-3: ..." is split into one entry per day. Tours whose itinerary is one sentence get no day list; the sentence is shown in the description as "Trip outline".
* **Packages** also bring highlights, included and excluded lists, group size and pace. Accommodation, best time, departures, age and sustainability are added to the description under "Good to know".
* **SEO**: `metaTitle` and `metaDescription` are kept (the " | Jae Travel Expeditions" ending is removed because the site adds the brand itself).
* **Vehicles**: type mapped to the new vehicle types, daily price and extras become rates, specs and features are kept.
* **Images** keep their old address (for example `/masai-mara-migration.jpg`). Five are hosted on imagekit and are used from there.

## Decisions to check
1. **Prices are flat.** Your files hold one price per tour, so every season and group size (2, 4, 6, 8 travellers) starts at that same price per person. Set real prices in the admin under Tours > Pricing. If your prices are for the whole trip rather than per person, tell me and I will change the import.
2. **Four tours are imported unpublished** so they do not appear on the site until you decide:
   * `rwanda-accessible-gorilla-safari-2` and `uganda-accessible-primate-safari-2`: a second record with the same slug in `tours.ts`
   * `rwanda-accessible-gorilla-safari-3`: the richer package with the same slug (compare it with the first and keep the better one)
   * `wheelchair-accessible-safari-vehicle`: a customisable transport option, not a day tour
3. **Left out of the import:**
   * Ratings and review counts. The new site shows reviews only when they are real and moderated, and rating markup from numbers that cannot be checked can get a site penalised by Google.
   * The four "on offer" tours (original price vs price): `masai-mara-luxury-safari` (4200 to 3500), `serengeti-migration-tour` (5000 to 4200), `volcanoes-national-park-safari` (4500 to 3800), `lake-nakuru-flamingo-spectacle` (550 to 450). Offers need an end date, so create them in the admin under Tours > Offers.
   * Meta keywords, `bookingSlug`, `region`, `url` and `id`.
   * Three package entries that are not tours: `6-sustainable-travel-tips` (a guide, better as a blog post), `kevin` (a guide profile), `toyota-prado` (a vehicle, already in your vehicles file).
4. 21 tours have only a one-line description in your data, so their pages are short. They are good candidates to expand in the admin.
