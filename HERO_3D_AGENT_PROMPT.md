# Prompt for the agent: build the "Eyes on the Horizon" 3D image hero

You are working inside the **JaeTravel v2 project** (Payload CMS 3 + Next.js 16 + Postgres, the `jaetravel-v2.zip` build). Read this like a recipe. Do the steps in order. If something is unclear, **stop and ask**. Do not guess. Only send back **new and changed files**, never the whole project.

---

## 1. The goal, in plain words

My home page hero is a slider. I want to replace its look with the design on my flyer (two files: `Cheetah_Safari_Flier__1_.pdf` and the photo `DSC00493_jpg.jpeg`).

What I want:
1. **The same look as the flyer**: dark warm background, huge condensed white-cream headline in capital letters ("EYES ON / THE HORIZON"), small gold line above it, a short sentence, and a square gold button ("Book your adventure →"), with my contact details at the bottom.
2. **3D animation**: the picture and the text sit at different depths. They move a little when the mouse moves (or the finger drags), and the slides change with a 3D turn, not a plain fade.
3. **Transitions between slides** that feel smooth and expensive, but never slow the page.
4. **It is NOT this one image alone.** The hero must be a slider with 3 to 6 slides. Each slide has its own photo, its own headline, its own sentence and its own button. The cheetah is slide 1. The rest come from the CMS.
5. Everything is **editable in the admin** (Payload). No words, colours, phone numbers or links are typed in the code.

It must stay fast, accessible and good for search. A pretty hero that makes the page slow is a failure.

---

## 2. Read these first (do not skip)

1. `CLAUDE.md` and `docs/build/00-OPERATING-RULES.md` (the rules: nothing typed in code, empty means hidden, never invent facts, only changed files).
2. The current hero, so you change it and do not duplicate it:
   * `src/site/HeroSlider.tsx` (client component, the slider)
   * `src/site/blocks.tsx` (`HomeHeroBlock`, turns CMS data into slides)
   * `src/blocks/site/configs.ts` (`HomeHero` block fields)
   * `src/app/[locale]/(frontend)/site.css` (search for `/* ---------- hero slider ---------- */`)
   * `src/endpoints/seed/index.ts` (the home page seed with 4 slides)
   * `src/globals/Theme/index.ts`, `src/i18n/defaults.ts`, `src/globals/Company/index.ts`, `src/globals/SiteSettings/index.ts`
3. Open the flyer PDF. It has **two layouts**: page 1 is portrait (phone shape), page 2 is landscape (computer shape). Look at both at full size before you plan anything.

Then reply with **10 bullets or fewer** saying what you understood, and list your questions (section 11). Wait for my answers before building.

---

## 3. What the flyer looks like (the numbers to copy)

### Colours (sampled from the flyer)
| Name | Value | Where |
|---|---|---|
| Dark | `#1C1914` | background, text on the gold button |
| Cream | `#F5EFE3` | headline and body text on dark |
| Gold | `#E1A03E` | small line above the headline, the button, the bullet dots, progress ticks |

The site's brand orange (`#FF7302`) is used everywhere else. **The hero follows the flyer (dark, cream, gold).** Add three Theme tokens for this (`heroDark`, `heroCream`, `heroGold`) with these defaults, so I can change them in the admin. Do not change the brand orange.

### Fonts
The flyer shows a **tall condensed bold capital font for the headline** (looks like *Oswald*) and a **clean rounded sans for everything else** (looks like *DM Sans*). The PDF has no readable font names, so **tell me what you picked and why**. Load them with `next/font/google` as `--font-hero-display` (Oswald 600 and 700) and `--font-hero-body` (DM Sans 400, 500, 600). Only the hero uses them.

### Landscape layout (page 2, 16:9) — this is the main hero
```
+--------------------------------------------------------------------------------+
| JAETRAVEL EXPEDITIONS · KENYA   (gold, tiny, wide letter spacing)              |
|                                                                                |
| EYES ON                                                  [ the photo: animal   |
| THE HORIZON   (huge, cream, 2 lines)                       sits on the right,  |
|                                                            face looking at us]  |
| Kenya's wild, up close. Game drives, photography                               |
| safaris and custom itineraries.                                                |
| [ Book your adventure → ]  (square gold button)                                |
|                                                                                |
| WhatsApp / Call: +254 726 485 228   info@jaetravel.co.ke   www.jaetravel.co.ke |
+--------------------------------------------------------------------------------+
```
* Text block sits on the **left 6% margin**, vertically from about 11% to 90% of the height.
* The photo's subject is on the **right 40%**. A dark gradient covers the left half so the text is readable (cream on dark must be at least 4.5:1).
* Headline: all capitals, **2 lines**, very tall letters, line height about 0.92, letter spacing about 0.01em. Size `clamp(3.25rem, 9.6vw, 9.5rem)`.
* Eyebrow line: gold, `0.8rem`, weight 600, letter spacing `0.28em`, capitals.
* Sentence: cream, `clamp(1.05rem, 1.6vw, 1.45rem)`, max width 36 characters.
* Button: **square corners**, gold background, dark text, weight 600, an arrow, padding `0.95rem 2rem`.
* Contact line: bottom left, small (`0.95rem`), three items spaced apart.

### Portrait layout (page 1, phone) — used under 768px wide
```
JAETRAVEL EXPEDITIONS
EYES ON
THE HORIZON            (huge, top left, dark text on a pale photo area is NOT needed here:
                        use cream text over a dark gradient so it works on any photo)
[ photo, subject centred, fills the middle ]
KENYA'S WILD, UP CLOSE. YOUR SAFARI STARTS HERE.   (tagline, condensed capitals, cream)
Game drives • Photography safaris • Custom itineraries   (gold dots between)
[ Book your adventure ............... jaetravel.co.ke → ]  (full-width gold bar)
------------------------------------------------------------
WhatsApp / Call: ...        email        website
```
* Image on top, solid dark panel at the bottom holding the tagline, the three bullets, the full-width gold bar and the contact row (stack the contact row on very small screens).

---

## 4. What to build

### 4.1 CMS fields (extend `HomeHero` in `src/blocks/site/configs.ts`)
Keep every existing field (`kind` image or YouTube, `image`, `youtubeUrl`, `cta`, `secondaryCta`, `durationSeconds`, `autoplaySeconds`). **Add** to each slide:

| Field | Type | Meaning |
|---|---|---|
| `eyebrow` | text, localised | gold line, for example "JAETRAVEL EXPEDITIONS · KENYA" |
| `headlineLines` | array of text (max 3), localised | the headline, one row per line. The first slide's lines are the page's one `<h1>` (joined with a space for the real text) |
| `text` | textarea, localised | the sentence (this field already exists) |
| `tagline` | text, localised | the capital sentence used in the phone layout |
| `chips` | array of text (max 4), localised | "Game drives", "Photography safaris", "Custom itineraries" |
| `showContact` | checkbox, default on | shows the contact line. **The values come from Company and Site settings, never typed here** |
| `focalPoint` | select: left, centre, right (default right) | where the animal is, so the text goes to the other side |
| `cutout` | upload (PNG with transparent background), optional | the animal alone, for the extra-deep 3D effect (see 5.4) |
| `scrim` | number 0 to 100, default 70 | strength of the dark gradient |
| `depth` | select: none, soft, strong (default soft) | how much the 3D moves |

Also add block-level: `transition` select (`depth-turn` default, `cube`, `fade`), `tilt` checkbox (default on), `idleFloat` checkbox (default on).

Create the migration: `pnpm payload migrate:create hero_3d`, then `pnpm generate:types` and `pnpm generate:importmap`.

### 4.2 Contact details come from the CMS
* The flyer uses WhatsApp / call **+254 726 485 228**, **info@jaetravel.co.ke** and **www.jaetravel.co.ke**. These are my real details. Put them where they belong: `Company.phoneNumber = "+254 726 485 228"`, `SiteSettings.whatsappNumber = "254726485228"`, `SiteSettings.contactEmail = "info@jaetravel.co.ke"`. The website text comes from the site address setting. Update the seed so these are filled. (The seed currently has a fake phone number.)
* Pressing the phone item opens `tel:`, the email opens `mailto:`, the website item links home. Add small translation keys for any labels (`hero.contactLabel` and so on) in `src/i18n/defaults.ts`.

### 4.3 The photo
* Put the cheetah photo in `content/media/cheetah-resting.jpg` (2576 × 1934, 0.83 MB; I will place the file). The seed uploads it.
* Alt text: "A cheetah lying in dry grass and looking into the distance". Do not claim a park name.
* The slide's `focalPoint` is **right** because the animal is on the right.

---

## 5. The 3D system (the exciting part)

Use **CSS 3D transforms and plain JavaScript only**. **Do not add three.js, WebGL or any animation library.** They are heavy and not needed.

### 5.1 The stage
* The hero container gets `perspective: 1400px`. Each slide is a stack of layers inside a `transform-style: preserve-3d` wrapper.
* Layers, back to front:
  1. **Photo layer** (`translateZ(-140px) scale(1.14)`): the picture, slightly oversized so edges never show when it moves.
  2. **Scrim layer** (gradient, `translateZ(-60px)`).
  3. **Text layer** (`translateZ(70px)`): eyebrow, headline, sentence, button, contact line.
  4. **Cutout layer** (optional, `translateZ(20px)`, see 5.4).
* Scale each layer so the page does not look bigger than it should (compensate for perspective: `scale = 1 + z / perspective` where needed).

### 5.2 Movement from the mouse (desktop) and finger (phone)
* Track the pointer over the hero. Write two CSS variables, `--rx` and `--ry` (range -1 to 1), updated **once per animation frame** with smoothing (move 8% of the way to the target each frame).
* Rotate the stage by at most **±4° on X and ±6° on Y**. Move each layer sideways by `--rx` times its depth (the photo moves the least, the text the most). This is the parallax.
* **Phones and tablets (`pointer: coarse`)**: no tilt from the pointer. Use the swipe to change slides, and a gentle idle float (5.5). Do **not** ask for gyroscope permission.
* Stop all tracking when the hero is off screen (`IntersectionObserver`) and when the tab is hidden.

### 5.3 Slide transition (the "3D turn")
Default transition `depth-turn`, 1100 ms, `cubic-bezier(.77, 0, .18, 1)`:
* The slide leaving: rotates `rotateY(-28deg)`, moves back `translateZ(-320px)`, slides left 18% and fades out.
* The slide arriving: starts at `rotateY(28deg) translateZ(-320px)` from the right and settles flat.
* The headline lines **flip up** one after the other: each line starts `rotateX(-90deg)` with `transform-origin: bottom`, inside a mask (`overflow: hidden`), and turns to flat, 90 ms apart. The sentence, the button and the contact line follow, 120 ms apart.
* `cube` option: the two slides are two faces of a cube (`rotateY(±90deg)`). `fade` option: a plain crossfade (this is what runs for reduced motion, see 7).
* Only animate `transform` and `opacity`. Never animate `width`, `height`, `top`, `left` or `filter`.
* While a slide is arriving, give only that slide `will-change: transform`, and remove it when done.

### 5.4 The extra-deep trick (optional, only when a slide has a `cutout`)
The animal is a separate transparent picture. Put the **headline between the photo and the animal**, so the animal overlaps the end of the word and looks like it is standing in front of the letters. The animal moves a little more than the photo with the pointer. If a slide has no cutout, skip this layer and nothing breaks. Do not try to cut the animal out in the browser. I will supply cutouts later; make the field and the layer ready.

### 5.5 Always-on life
* **Idle float** (`idleFloat`): the photo drifts in a slow figure-eight, 14 s per loop, about ±8 px, so the hero never feels frozen. Paused when the user prefers reduced motion.
* **Autoplay**: each slide shows for its time (default 7 s). The progress indicator is a row of **square gold ticks** (matching the flyer's square button), each filling left to right while its slide is on. Keep the pause button, the previous and next buttons, the keyboard arrows and the swipe from the existing slider.
* **YouTube slides keep working**: the same layout and text, with the video as the photo layer (muted, loops, loads only after the poster has painted, never on phones or slow connections, as in the current slider).

---

## 6. More than one image (this is a slider, not one picture)

* 3 to 6 slides. Slide 1 is the cheetah. The others use **other photos** in the same flyer style.
* Use the same layout and the same type for every slide, so the hero looks like one family.
* Seed the home page with these five slides. **Slide 1 is real. Slides 2 to 5 are placeholders** using the sample artwork already in `content/media`; I will swap in real photos in the admin:

| # | Eyebrow | Headline lines | Sentence | Button |
|---|---|---|---|---|
| 1 | JAETRAVEL EXPEDITIONS · KENYA | EYES ON / THE HORIZON | Kenya's wild, up close. Game drives, photography safaris and custom itineraries. | Book your adventure → Tours |
| 2 | THE GREAT MIGRATION | WHERE THE HERD / CROSSES | Time your Masai Mara safari with the river crossings. | See migration tours |
| 3 | AMBOSELI | KILIMANJARO / AT YOUR BACK | Elephants, wide skies and a private driver-guide. | See Amboseli safaris |
| 4 | ACCESSIBLE SAFARIS | A SAFARI FOR / EVERY BODY | Adapted vehicles and guides trained to help. | See disability tours |
| 5 | BUILD YOUR OWN | YOUR ROUTE, / YOUR RULES | Tell us what you want to see and we shape the trip. | Start planning |

Slide 1's button goes to the tours list. Use the project's link fields (`routeKey` or a custom URL), never a typed path.

---

## 7. Speed, accessibility, search (these are rules, not wishes)

**Speed**
* The first slide's photo is the page's largest image: server-render it, `priority` / `fetchPriority="high"`, a correct `sizes`, a fixed aspect ratio box (no layout shift). Other photos load lazily. Preload the first one.
* The page must work and look right **with JavaScript off**: slide 1, with its text, visible.
* Targets on a mid phone with a slow connection: LCP under 2.5 s, CLS 0, no long tasks from the hero. Report real numbers if you can measure them. If you cannot, say so.
* Resize the cheetah for the web: generate sizes from the Media collection (the project already makes small, medium, large and xlarge). Do not ship the 2576 px original as the only file.

**Accessibility**
* Real text for every word. **No text inside images.**
* Text contrast at least 4.5:1 (cream on the dark gradient). Large text at least 3:1.
* One `<h1>` per page (slide 1's headline). The other slides use `role="heading" aria-level="2"` as the current slider does.
* Keep `role="group" aria-roledescription="carousel"`, the live slide counter, the visible **pause** button and keyboard support. Hidden slides are `aria-hidden` and their links are not focusable.
* Touch targets at least 44 px. Visible focus rings (use gold on dark).
* **`prefers-reduced-motion: reduce`**: no autoplay, no tilt, no idle float, no 3D turn. Use a quick fade. The visitor can still change slides with the buttons.
* **`pointer: coarse` / `saveData` / slow connection**: no tilt and no video.

**Search**
* The `<h1>` is the first slide's real text. Every photo has alt text from Media. Do not hide text for search engines.

---

## 8. Do not do these

* Do not add three.js, GSAP, Framer Motion or any animation library.
* Do not type any visible word, colour, phone number or link in the components.
* Do not animate layout properties.
* Do not put the headline in an image.
* Do not auto-play video with sound.
* Do not remove the existing slider features (YouTube slides, pause, swipe, keyboard, reduced motion).
* Do not change the brand orange, the header, or the rest of the site.
* Do not invent a park name, a number of animals or a fact about the photo.

---

## 9. Files you will probably touch

`src/blocks/site/configs.ts`, `src/site/HeroSlider.tsx` (and split out a small `useHeroTilt` hook if it helps), `src/site/blocks.tsx`, `src/app/[locale]/(frontend)/site.css`, `src/app/[locale]/(frontend)/layout.tsx` (fonts), `src/globals/Theme/index.ts` and `src/site/ThemeStyle.tsx` (3 tokens), `src/i18n/defaults.ts`, `src/endpoints/seed/index.ts`, `src/migrations/*`, `src/payload-types.ts`, `content/media/cheetah-resting.jpg`.

---

## 10. Order of work, and what to send back each time

1. **Plan** (10 bullets) and your questions (section 11). Wait.
2. **Static layout first**: build the flyer layout (landscape and portrait) with no animation. Send a screenshot at 1440 × 810, 1024 × 768 and 390 × 844 next to the flyer pages. **I review.**
3. **Add the 3D** (tilt, layers, transitions, text reveal, idle float). Send a short screen recording or tell me honestly if you cannot record one.
4. **Admin fields, seed, migration, tests.**
5. **Hardening**: reduced motion, no-JavaScript, keyboard, slow-connection checks.

For every step send:
* the list of changed and new files with their paths, then the files (no whole-project zip);
* the exact commands you ran (`pnpm generate:types`, `pnpm typecheck`, `pnpm build`, the tests) and their **real results**. If you could not run something, say so;
* a table: **Flyer element | What I built | Where | Match (Yes / Partly / No) | Note**. A step is not finished while any row says Partly or No without my approval.

---

## 11. Questions to answer first

1. Do you agree the hero uses the flyer colours (dark, cream, gold) while the rest of the site stays orange?
2. The fonts: *Oswald* and *DM Sans* are my best match for the flyer. Do you want other fonts?
3. Will I give you real photos for slides 2 to 5 now, or should the seed use the sample artwork for now?
4. Do I have transparent cut-outs of the animals for the extra-deep effect, or should that layer stay switched off for now?
5. Is the contact line on every slide, or only on slide 1? (Default: every slide, switchable per slide.)
6. Should the pause button and the ticks stay visible at the bottom, or move to the right side?

---

## 12. Acceptance (how I will check it)

* [ ] Slide 1 looks like the flyer (landscape on desktop, portrait on phones): colours, fonts, headline, gold button, contact line.
* [ ] There are at least 3 slides with different photos. All text, links and contact details are editable in the admin.
* [ ] Moving the mouse tilts the hero and shifts the layers. On a phone the swipe changes slides. No gyroscope prompt.
* [ ] Changing slides plays the 3D turn and the headline lines flip up one by one.
* [ ] A YouTube slide still works in the same layout.
* [ ] With reduced motion on: no autoplay, no tilt, a plain fade.
* [ ] With JavaScript off: slide 1 is visible and readable.
* [ ] Keyboard only: arrows change slides, the pause button works, focus is visible.
* [ ] Lighthouse mobile: LCP under 2.5 s, CLS 0 (or an honest note if not measured).
* [ ] `pnpm typecheck` and `pnpm build` pass. The migration is committed.
