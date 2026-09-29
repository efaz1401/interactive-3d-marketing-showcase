# Design System

All values below are **measured from the live `app.css`** (146 KB) unless marked *inferred*.

## Palette

Five colors carry the whole site. Frequency counts from the shipped CSS:

```css
:root {
  --c-bg:      #0d0d0d;  /* 25 uses — page background, hairline borders */
  --c-fg:      #ffffff;  /* 19 uses — primary type */
  --c-neutral: #b7ab98;  /* 17 uses — warm sand: sub-labels, meta, sound toggle */
  --c-accent:  #eb5939;  /* 10 uses — vermillion: the reveal layer, hover states */
  --c-muted:   #4d4d4d;  /*  3 uses — disabled/tertiary */
  /* incidental: #0c0c0c, #2a2a2a (near-black steps), #c59b64 (gold, one use) */
}
```

Notes:
- `#eb5939` is used as a **full background** on the reveal layer, not as small accents. When it appears it takes the entire viewport. That's why it can be this loud.
- `#b7ab98` is the workhorse — every secondary line, every sub-label. It's what stops the page reading as harsh black/white.
- Borders are `#0d0d0d` on the accent layer and `#fff`/low-opacity white on the dark layer, so the same 1px rule reads correctly in both voices.

## Typography

**Faces:**
```css
@font-face {
  font-family: "Avant Garde";
  font-style: normal;
  font-weight: 600;
  src: url("assets/fonts/4dd591d8-4168-4263-b05b-7183ddaff1f4.woff2") format("woff2"),
       url("assets/fonts/90882e39-7091-4415-b231-1e068ccdcc6f.woff")  format("woff");
}
```
- Display: **ITC Avant Garde Gothic**, weight **600 only** — self-hosted, UUID filenames (a MyFonts/Monotype webfont kit). Licensed; substitute if you don't own it.
- Body: **Nunito Sans** (`font-family: Nunito Sans, sans-serif`) for `.desc` paragraphs.
- Total: **one weight of one display face + one body face.** Two files. That restraint is the look.

**Free substitutes** for Avant Garde (geometric, wide-set, high x-height, distinctive single-storey `a`):
| Substitute | Source | Notes |
|---|---|---|
| Poppins SemiBold | Google | Closest geometric feel, very common |
| Space Grotesk Medium/Bold | Google | More character, slightly technical |
| Archivo / Archivo Expanded | Google | Better for the wide stacked hero |
| PP Right Grotesk, Monument Extended | Pangram Pangram (paid) | If budget exists, closer to award-site register |

**Scale — this is the important part.** The site is designed on a **1728 px canvas** and scales by `vw`, not by breakpoint steps:

```css
/* 16px at 1728px viewport → 16/1728 = 0.009259 */
html { font-size: 0.9259259259vw; }          /* ≥1200px */
```
Everything downstream is in `rem`, so the entire page scales proportionally with the window. Fixed `rem` values in use:

```
0.625 0.75 0.875 1 1.25 1.5 1.75 1.875 2 2.5 2.75 3.75 5 6.875 7.5 8.75 rem
```
So the display scale is roughly **5 / 6.875 / 7.5 / 8.75 rem** (80 / 110 / 120 / 140 px at 1728) for hero + section heads, and **0.625–1.25 rem** (10–20 px) for labels and body. There is essentially nothing in between — a deliberate, brutal two-tier hierarchy.

Below 1200 px, `html { font-size: 10px }` and the layout falls back to conventional breakpoint sizing.

**Rules:**
- Section labels: `text-uppercase`, `0.625–0.75rem`, letter-spaced, `--c-neutral`. Always tiny.
- Hero: stacked one-word-per-line `h1`, `<br>`-separated, mixed weights inside the lockup (`making` / **`good`** / **`shit`** / `since` / `2009`).
- Body: `.desc` class, `mb-0`, one sentence, 1–3 words in `<strong>`. `--break-line: 1.2em` controls the tight leading on display type.

## Spacing tokens

```css
:root {                        /* mobile-first defaults */
  --screen-x:          1.25rem;
  --break-line:        1.2em;
  --border-size-large: 1px;
  --viewSizeX:         375px;
  --viewSizeY:         682px;
  --spacing-supper:    10rem;
  --spacing-xl:        10rem;
  --spacing-xlx:       10rem;
  --spacing-lg:        5rem;
  --spacing-md:        5rem;
  --spacing-sm:        3rem;
  --spacing-sx:        1.5rem;
  --screen-left:       3rem;
  --size-btn:          78px;
}
@media (min-width: 1200px) {
  :root {
    --screen-x:       2.6666666667vw;   /* 46px at 1728 */
    --spacing-supper: 16.5625rem;       /* 265px at 1728 — the big section gap */
  }
}
```
`--screen-x` is the page gutter and is `vw`-based so margins scale with the canvas. `--spacing-supper` (265 px) is the rhythm between major beats — very generous, and a big part of why the page feels expensive.

## Grid

Bootstrap 5 grid utilities **only** (no Bootstrap components, no theme). Measured class frequency:

```
text-dark 151 · mb-0 114 · col-12 103 · row 86 · offset-sm-1 82
container_content 81 · offset-lg-2 80 · col-sm-6 39 · col-lg-3 39
d-none 44 · d-block 41 · d-sm-block 38 · d-lg-none 18 · overflow-hidden 39
```

The recurring measures:
- **Text blocks:** `col-lg-8 col-sm-10 col-12 offset-lg-2 offset-sm-1` — 8/12 centred with a 2-col left gutter.
- **Row items (clients, services):** `col-lg-3 col-sm-4 col-12` — title left, description right.
- **Wide intro:** `col-lg-9 offset-lg-2`.
- `container_content` is the custom wrapper applying `--screen-x` padding.

Duplicated `d-sm-block d-none` / `d-lg-none d-block` pairs mean **the same copy is written 2–3 times** at different breakpoints so line breaks can be hand-tuned per device. Verbose, but it's how they control ragging exactly.

## Breakpoints

```
Down:  max-width 767px / 767.98px / 1199.98px
Up:    min-width 768px, 1024px, 1200px, 1400px, 1600px, 1728px
Also:  @media (any-hover: hover)                  — gate cursor/hover effects
       @media (prefers-reduced-motion: no-preference) — gate all motion
```
`1728px` as the top breakpoint = the design canvas. `(any-hover: hover)` is how the custom cursor and the spotlight trick are correctly excluded from touch devices.

## Assets & naming

```
assets/
  fonts/   <uuid>.woff2 / .woff
  icons/   logo.svg  ic-play.svg  ic-text-ring.svg  ic-touch.svg
           ic-dribbble.svg ic-ig.svg ic-ytb.svg ic-in.svg
           test-mask.svg        ← the reveal mask (a plain black circle!)
  images/  logo.gif             ← preloader
           work-50.jpg / work-mobile-50.jpg
           banner-bottom-50.jpg / banner-bottom-mobile-50.jpg
           planet-1-1.png       ← the one 3D render
           michael-glass.jpg peter-smart.jpg linh-le.jpg
           reel-poster.jpg / reel-mobile-poster.jpg
           screenshot.jpg       ← 1200×630 OG image
  video/   hero.mp4 / hero_mobile.mp4
  mp3/     audio-site.mp3
```
The `-50` suffix = JPEG quality 50. At full-bleed scale on a dark page, q50 is invisible and halves the payload. Adopt this. Every full-bleed image ships as a **desktop/mobile art-directed pair**, swapped via `data-src` / `data-src-mobile` and `data-srcset`.

`test-mask.svg` is worth seeing in full — the entire signature effect rides on this:
```svg
<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="50" fill="black"/>
</svg>
```

## Head / meta baseline

```html
<html lang="en" class="js no-system-cursor">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="…one-sentence positioning statement…">
<link rel="canonical" href="https://example.com">
<meta property="og:type"        content="website">
<meta property="og:title"       content="Name — Multidisciplinary Designer">
<meta property="og:image"       content="https://example.com/assets/images/screenshot.jpg">
<meta property="og:image:width"  content="1200">
<meta property="og:image:height" content="630">
```
`no-system-cursor` on `<html>` is the hook that hides the native cursor — set it in markup, not JS, so there's no flash of the default arrow.
