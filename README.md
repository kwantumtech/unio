# Unio — The Science of Reset

Event site for Unio, 9.19.2026 at Sacred Space Miami, Wynwood.
Vite + React. No UI, animation or icon dependencies.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
npm run preview
```

## Before launch — two things

1. The canonical and Open Graph metadata uses `https://uniomiami.com`.
   If the production domain changes, update `index.html`, `public/robots.txt`,
   and `public/sitemap.xml` together.
2. **Node 20.19+ is required** (Vite 8). `.nvmrc` pins 22 — `nvm use` before
   building. On Node 16 the build dies with a misleading
   `node:util … styleText` error that looks like application code.

## Brand

Taken verbatim from `Unio-brandbook.pdf`, defined as custom properties at the
top of `src/unio.css`. No other hues are introduced anywhere on the page.

| Token        | Hex       | Used for                                  |
| ------------ | --------- | ----------------------------------------- |
| Clarity      | `#fcfbf5` | Primary page ground                       |
| Reset        | `#ebe7d3` | Warm alternate sections                   |
| Regulation   | `#2e5b4f` | Buttons, wordmark, display date, numerals |
| Ground State | `#223425` | Plates, Ethos, Express Interest           |
| Anchor       | `#000000` | Footer                                    |

Type is Poppins (wordmark, nav, labels, buttons, eyebrows) and Cormorant
Garamond (display and body), from Google Fonts in `index.html`.

`--ink-muted` is `#4b6857` rather than a lighter tint so muted body copy clears
WCAG AA on **both** cream grounds (4.9:1 on Reset, 5.9:1 on Clarity). Changing
it breaks that.

## Structure

Hero → Recalibrate/Regulate/Reset → **I** What is Unio → **II** The Space →
**III** Who is Unio for → pull-quote → **IV** Ethos → **V** How can Unio help →
**VI** Express Interest → footer.

Section tones alternate deliberately: light, warm, light, *photo*, light,
*photo*, **dark**, warm, **dark**, then black. No two dark sections touch, and
the full-colour pull-quote is the bright beat that sets up the dark Ethos behind
it. The footer is Anchor black rather than another green so it steps down from
Express Interest instead of merging with it. Reordering anything here means
re-checking that.

**Ethos** is a six-cell grid: the section head takes the first cell and the five
statements fill the rest, so two columns resolve to a clean 3x2 rather than a
2+2+1 orphan. It was a single column of oversized type and ran 1851px tall;
it now runs 829px.

**Type on photography uses a plate, never a wash** (`.plate` in `unio.css`).
Both The Space and the pull-quote run their photograph at full colour and set
the copy on a frosted panel — `rgb(19 31 22 / 0.64)` over
`backdrop-filter: blur(26px) saturate(1.55)`. The saturate is what keeps the
frost from going muddy; the blur is what makes the backdrop safe to measure by
its *mean* rather than its brightest pixel. Gradient washes were tried first on
both and killed the imagery. There is a `@supports not` fallback to an opaque
plate for browsers without `backdrop-filter`.

The roman numerals are a running chapter thread; the hairline down the left
margin (`.spine`) fills with scroll progress and is the one piece of chrome that
runs the full length of the page.

## Assets

Two trees, and the split matters:

```
assets/                  source art — hand-managed, never served
  photography/           originals and the frames cropped from them
  video/                 the ocean master
  logos/                 Unio and A-List, as supplied
  reference/             look-and-feel comps, not used on the page
  brand/                 the brandbook PDF

public/assets/           GENERATED — do not edit by hand
  images/  video/  logos/
```

Everything under `public/assets/` is written by `scripts/media.py` and can be
deleted and rebuilt byte-identically at any time. Nothing in `assets/` is ever
served; it exists so the crops, grades and encodes stay reproducible. The two save-the-date graphics have type baked in, so photography taken from
them is cropped to their text-free regions; the Codex sheets are 2-up contact
sheets split on their white divider row.

| File             | Source                                        |
| ---------------- | --------------------------------------------- |
| `hero*.webp`     | `hero.png` — carries its own cream fade        |
| `hero-portrait*` | `hero.png`, recomposed around the figure       |
| `terrace*.webp`  | Codex 10_53_20, lower frame — backs the quote  |
| `venue*.webp`    | `sacred-space.png` — **the real location**     |
| `water-*.mp4`    | `video/ocean-aerial.mp4`, graded 4:5 loop       |
| `water-poster.webp` | that loop's own first frame                 |
| `logo-*.webp`    | `logo.png`, alpha-matted per colour            |
| `alist.webp`     | `qt=q_95.webp`, wordmark band — hero billing    |
| `alist-full.webp`| `qt=q_95.webp`, whole mark, cream — footer      |
| `og.jpg`         | Hero cropped to 1.91:1 with the wordmark       |

`venue.webp` is the only photograph of the actual venue and should never be
swapped back for a render. It is cropped from
`sacred-space.png` (2918x1596). `sacred-space.webp` — a 1080px-wide shot of the
pool axis — was used for The Space first and read visibly soft, because that
panel was blowing it up about 1.9x; the high-resolution crop renders at ~0.9x
instead, which is the whole reason it looks sharper. **Watch that ratio when
changing the panel's height.**

`sacred-space.png` is a screenshot: it carries a browser URL strip along the
bottom and a dark window border down the left, so every crop from it stays
inside `x >= 12, y <= 1588`. Its right half is cropped for The Space so that the
plate lands over the warm building and the planting carries the open side. Other
strong 4:5 crops remain in that frame — the bougainvillea cluster, the uplit
palm trunks, the pool edge, and the lit doorway that used to fill Section I —
if another section ever needs venue photography.

## The Section I loop

An aerial surf clip fills the 4:5 slot that used to hold a still.
`scripts/media.py` shells out to ffmpeg for it, and degrades to a message if
ffmpeg is absent rather than failing the image build.

- **The warm grade is baked into the encode, not applied as a CSS filter.** The
  source is a cool turquoise that fights the cream and green; `colorbalance`
  pulls the blues down and lifts the reds so the water reads green and the sand
  reads warm. Grading every frame in the compositor would cost more than
  grading once at build time — and it keeps the poster and the video identical.
- **The water only ever flows forward.** A palindrome loop was tried first — 6s
  forward, 6s reversed — which is seamless by construction but reads as a
  glitch, because retreating surf running backwards is uncanny. Instead the clip
  runs 16 seconds forward and its **last second is cross-dissolved into its
  first**, so the wrap is invisible without any motion ever reversing. Changing
  `LOOP` or `FADE` in the script rebuilds it.
- **Three rungs, picked at runtime** by `pickVideoTier()` in `hooks.js`:

  | Tier | Size | CRF | Weight | Served to |
  | ---- | ---- | --- | ------ | --------- |
  | `hi` | 576x720 | 27 | 1.8 MB | Retina, or no `navigator.connection` |
  | `md` | 576x720 | 31 | 1.0 MB | Non-retina, or downlink under 5 Mbps |
  | `lo` | 480x600 | 36 | 0.3 MB | Save-Data, or 2g/3g |

  The default leans to quality: `navigator.connection` is Chromium-only, so
  where it is absent (Safari, Firefox) we assume a good link rather than
  degrading. Only `lo` gives up resolution; the rest is quantiser.

- **The poster is the no-video fallback, and it is derived from the loop's own
  first frame** — so there is no jump or colour shift when playback starts. It
  stands in under reduced-motion, Save-Data, and before the file arrives.
  `assets/photography/ocean-still.png` is a hand-picked still of the same
  footage kept alongside it; it is *not* wired up, because it is a different
  moment and ungraded, so it would visibly cut and shift the moment the video
  began.

- **576x720 is a ceiling, not a choice.** The source is a 720p preview, so a
  4:5 slice can be at most 576 wide — anything larger is upscaling. At a 385px
  render that is 0.75x on a retina desktop, which is why `hi` still is not
  pin-sharp there. **A 4K master of the same Getty clip would fix that**; the
  title of the source asset says one exists. CRF past 27 was measured and buys
  almost nothing — 23 doubled the bytes for no visible gain.

- VP9 was tried and came out roughly three times larger on this footage, so
  there is no WebM. For reference, the same Getty clip on
  `alistevents.net/wellness` is served raw at ~41 MB.
- **It costs nothing until it is on screen.** There is no `autoplay` attribute
  and `preload="none"`; `useAmbientVideo` attaches the source only as the
  section approaches, and pauses on the way out. Under `prefers-reduced-motion`
  or Save-Data it never attaches at all and the poster frame stands in.

A-List Events supply their mark as a wordmark stacked over a script tagline.
The **hero billing takes the wordmark band alone** (`y 3-78`) — a tagline inside
a billing line is one thing too many. The **footer takes the whole lockup**,
tagline included, which is where it belongs. Both are retinted from the source
alpha: near-black for the cream hero, cream for the black footer. Both link to
`alistevents.net`.

The hero bills as **`a-list events` presents / THE SCIENCE OF RESET.** — the
partner mark carries the name so "presents" is the only word set, and it is held
below the title's weight so the two read in that order. The venue pill that used
to sit under it is gone; Sacred Space Miami still appears in The Space facts, the
mobile action bar, the menu and the page title.

Every resize runs an unsharp mask (`radius=1.1, percent=58, threshold=3`);
LANCZOS downsampling always softens slightly and the sharpen puts the edge back.

Grades live in CSS rather than baked into the files, so the source art stays
untouched. The hero gets `contrast(1.18) saturate(1.16) brightness(0.94)`. The
venue is a blue-grey dusk that otherwise fights the cream and green everywhere
else, so it is warmed — `saturate(1.16) contrast(1.07) brightness(1.06)
sepia(0.1) hue-rotate(-5deg)` — a lift, not a crush; darkening it into the scrim
was tried first and buried the venue.

**Contrast over photography is measured, not guessed.** Both plates were sized
by compositing the graded image *and the plate's own backdrop blur* onto a
canvas at the panel's real dimensions, then sampling luminance under each text
element's own bounding box. Worst case through the frost — The Space: headline
5.1, fact values 7.8, labels 5.6, kicker 5.2, CTA 6.9. Pull-quote: 4.0 at 56px
(needs 3), taken directly over the sun. Sampling a frame's *average* instead
would pass layouts that fail on bright pixels. Re-run that check if the
photography, the grade or the plate opacity changes — swapping The Space's image
for the sharper crop alone dropped the kicker to 2.33 and needed the plate taken
from 0.58 to 0.64, plus a full-cream eyebrow.

## Calls to action

There are two, and they currently point at different places:

- **Purchase a Ticket** — every primary CTA: the nav (top-right on desktop,
  inside the menu on phones), the hero button, and the mobile sticky action bar.
  All four open the FreshBooks checkout (`TICKET_URL` at the top of
  `src/App.jsx`) in a new tab, since it hands off to a third-party processor.
- **Sacred Space Miami — Wynwood** — the pill on The Space plate. Opens the
  venue on Google Maps (`MAPS_URL`) in a new tab. It carries a place, not an
  action, so it is allowed to wrap on narrow plates.
- **Express Interest** — now only the form's own heading and submit button.

⚠️ **Nothing on the page currently links to `#interest`.** The form is reachable
only by scrolling to it. That is a consequence of every CTA now pointing either
at checkout or at the map — deliberate if tickets are the only path you want,
but if the form is still meant to catch team and corporate enquiries it needs a
route back: adding `['Express Interest', '#interest']` to the `NAV` array is the
smallest fix.

The footer carries no navigation. It ran a copy of A-List's own site menu, which
duplicated what the mark itself now links to; the mark replaced it. Outbound
links live as constants at the top of `src/App.jsx` — `TICKET_URL`, `ALIST_URL`,
`BUILDER_URL`.

The form is deliberately downstream of checkout rather than parallel to it. If
that balance should change, the URL is a single constant and each CTA is a
one-line switch.

## Express Interest form

Fields: **Name\***, **Email\***, Phone number, and **What would you like to
learn more about?\*** — six checkboxes, at least one required. All three
starred fields validate in-page before anything is sent.

**It posts straight into the client's Google Form**, which writes a real row to
the linked responses sheet. No third-party form service, no backend to run.

```
docs.google.com/forms/d/e/1FAIpQLSfSOx2pmIRTtjOvBcnCo5hOcQXid1ojWBIoKqrdC8fuDQh5Gw/formResponse

entry.1747016377  Name          (required)
entry.305553560   Email         (required)
entry.349499540   Phone Number  (optional)
entry.2141214542  Interests     (required, repeated once per selection)
```

Three things about this that will break it if changed carelessly:

- **The request is `mode: 'no-cors'`.** Google sends no CORS headers, so a
  readable response is impossible. The body is a `URLSearchParams`, which sets a
  CORS-safelisted content type — **do not add a `Content-Type` header**, it
  turns the request into a preflight and Google will reject it.
- **The response is opaque.** We can confirm the request left the browser, not
  that Google accepted it. A malformed submission would still show the success
  message. That is the trade for not bouncing the visitor to a Google page.
- **The checkbox values must match the form's option strings byte for byte** —
  em dash included. A mismatch records an empty answer rather than erroring.
  `INTERESTS` in `App.jsx` is the mirror; verified identical.

Field ids came from the live form's `FB_PUBLIC_LOAD_DATA_`. If questions are
added or reordered in Google Forms, re-read them from there.

Setting **`VITE_RSVP_ENDPOINT`** overrides all of the above and POSTs
`application/json` as `{ name, email, phone, interests: [...] }` instead — the
shape Formspree, Basin, Getform and Netlify Forms accept — if you ever want to
move off Google Forms.

`interests` is read with `FormData.getAll()`, not `Object.fromEntries()`. A
checkbox group is many values under one name, so `fromEntries` silently keeps
only the last box ticked — it looks like it works right up until someone
selects more than one.

```
VITE_RSVP_ENDPOINT=https://formspree.io/f/YOUR_ID
```

With no endpoint set, submissions post directly to the configured Google Form.
There is no mail-client fallback; update the endpoint or Google Form configuration
if the intake destination changes.

## Motion

Hand-rolled — no GSAP, no Framer Motion. Long, low-travel, expo-out; everything
animates `opacity`/`transform` only.

- **`useReveal`** adds `.is-in` on first viewport entry, one observer per section.
- **`useParallax`** drives every `[data-speed]` element from a single
  rAF-throttled scroll listener; opts out below 860px and on coarse pointers.
- **`useScrollProgress`** writes the spine's `scaleY` straight to style in a rAF,
  so it never re-renders React.
- **`useDarkNav`** inverts the nav over the dark sections using a thin observer
  band at the top of the viewport.

Micro-interactions, all pointer-`fine` only and all reverting under
reduced-motion:

- **Magnetic CTAs** — `useMagnetic` leans a button toward the cursor with a
  distance falloff, transition off while tracking so the follow is 1:1, and a
  0.7s expo spring on release.
- **Rolling countdown** — each unit's value lifts out as the new one arrives
  rather than swapping. It runs continuously, so the travel is deliberately a
  few pixels.
- **Two-arrow buttons** — the arrow exits right as a second arrives from the
  left, inside an overflow-hidden box.
- **Mask reveal** — the Section I photograph wipes open on a `clip-path` inset
  instead of fading up.
- **Row hover** — a second rule draws across an audience or ethos row over the
  static hairline, while its numeral shifts and brightens.
- **Pointer light** — `usePointerLight` tracks the cursor across the Ethos grid
  as `--px`/`--py`, and a low-opacity radial follows it. One rAF listener on the
  container, no per-cell handlers.
- **Field focus** — the input underline draws in from the left rather than
  recolouring.

The only looping animation on the page is the hairline stem under `9.19`, which
breathes at roughly 11 cycles a minute.

`prefers-reduced-motion: reduce` collapses all of it to final state, including
the hero entrance, the ken-burns and the breath.

## Mobile

Designed, not shrunk. The hero uses a portrait recomposition of the same frame;
the wash holds through the type then releases so the bottom third of the
photograph reads at full strength; the lede is dropped (it repeats verbatim two
screens down) and the fold goes to the date, venue and CTA instead. A
thumb-reachable action bar rises once the hero leaves and retracts when the form
itself is on screen.

## Copy

All body copy is verbatim from `alistevents.net/unio-1`, with two edits:

1. The source runs two audience items together ("…intentional living Individuals
   who invest in personal growth…"). They are split into items 03 and 04.
2. Four headlines are new, written to give each section an editorial entry
   point: "A reset that is engineered, not improvised.", "For the people the room
   depends on.", "Seats are limited — intentionally so.", and the pull-quote
   "Health is not a perk. It is infrastructure." (a compression of the fourth
   ethos line, which still appears in full in that list).

The Recalibrate / Regulate / Reset trio and "We have a date. And a space designed
for it." are Unio's own, lifted from the save-the-date assets.
