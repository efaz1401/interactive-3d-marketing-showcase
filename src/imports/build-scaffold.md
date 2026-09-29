# Build Scaffold

## What the reference site actually ships

```
/                       (static, Cloudflare CDN, Cache-Control: max-age=14400)
├── index.html          59 KB   — single page, all 14 sections, both layers
├── app.css             146 KB  — one stylesheet, Bootstrap grid + custom
├── vendor.bundle.js    1.3 MB  — GSAP + plugins, Lenis, Three.js, Bootstrap
├── app.bundle.js       114 KB  — site code (Masker, cursor, loader, sliders)
├── assets/js/caching.js        — service worker registration
└── assets/{fonts,icons,images,video,mp3}/
```
Signals: `Service-Worker-Allowed: /`, `?v=1.0.0.3` cache-busting query strings, `Server: cloudflare`, `/cdn-cgi/l/email-protection` (Cloudflare email obfuscation), GA4 `G-…`, and `<meta name="generator" content="Powered by DevHonTran@2023 - Creative developer.">`. No CMS. Bundled with a classic webpack `vendor`/`app` split.

**Takeaway:** a hand-built static site is the correct architecture. No framework needed — there is one page and no data. Don't reach for Next.js for this.

## Recommended setup

Vite + vanilla, or Astro if you want more pages later.

```bash
npm create vite@latest my-portfolio -- --template vanilla
cd my-portfolio
npm i gsap lenis
npm i -D sass vite-plugin-image-optimizer @vitejs/plugin-legacy
```

```
src/
├── index.html
├── js/
│   ├── main.js            # boot order
│   ├── masker.js          # the concept trick
│   ├── cursor.js
│   ├── preloader.js
│   ├── reveals.js         # masked line reveals
│   ├── scroll.js          # Lenis + ScrollTrigger bridge + parallax
│   ├── reel.js
│   ├── testimonials.js
│   ├── sound.js
│   └── utils.js           # lerp, clamp, matchMedia helpers
├── styles/
│   ├── main.scss
│   ├── _tokens.scss       # palette, spacing, type scale
│   ├── _grid.scss         # Bootstrap grid only: @use "bootstrap/scss/grid"
│   ├── _typography.scss
│   └── sections/_hero.scss …
└── assets/{fonts,icons,images,video,mp3}/
```

Import only Bootstrap's grid, not all of it:
```scss
// _grid.scss
@use "bootstrap/scss/functions";
@use "bootstrap/scss/variables";
@use "bootstrap/scss/mixins";
@use "bootstrap/scss/grid";      // row/col/offset
@use "bootstrap/scss/utilities/api";  // d-none/d-block only if configured
```
That's ~10 KB instead of ~230 KB.

## Boot order (matters)

```js
// main.js
import { gsap }      from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);          // register BEFORE any tween

import initScroll       from './scroll';     // 1. Lenis + ScrollTrigger bridge
import initReveals      from './reveals';    // 2. create timelines (paused)
import Preloader        from './preloader';  // 3. drives the hero timeline on complete
import Masker           from './masker';     // 4. needs final layout height
import Cursor           from './cursor';
import initReel         from './reel';
import initTestimonials from './testimonials';
import initSound        from './sound';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hover  = matchMedia('(any-hover: hover)').matches;

const lenis = initScroll({ reduce });
initReveals({ reduce });
if (hover) { new Cursor(); new Masker(); }
initReel({ lenis }); initTestimonials(); initSound();
new Preloader({ onComplete: () => ScrollTrigger.refresh() });
```
`ScrollTrigger.refresh()` after the preloader lifts and after fonts load (`document.fonts.ready`) — otherwise every trigger position is computed against the wrong document height.

## Asset pipeline

| Asset | Treatment |
|---|---|
| Full-bleed images | Desktop + mobile pair, JPEG **q50** (the `-50` suffix convention), AVIF/WebP with JPEG fallback |
| Hero video | `hero.mp4` (1920×1080, CRF 26) + `hero_mobile.mp4` (960×540); swap `src` by `matchMedia`; `preload="none"`; always a poster |
| Reel | `preload="none"`, poster is the LCP-safe placeholder |
| Fonts | Self-host `.woff2` only (drop `.woff` unless you support IE), `font-display: swap`, `<link rel="preload" as="font" crossorigin>` for the display face |
| Icons | Inline SVG or a sprite; never an icon font |
| 3D render | Export as **PNG/WebP still** unless it must be interactive — that's what `planet-1-1.png` is |
| Audio | Single mp3, ~128 kbps mono, lazy-loaded, off by default |

```bash
# JPEG q50 full-bleed pair
magick input.jpg -resize 1920x -quality 50 work-50.jpg
magick input.jpg -resize 828x  -quality 50 work-mobile-50.jpg

# Video pair
ffmpeg -i src.mov -vf scale=1920:-2 -c:v libx264 -crf 26 -an -movflags +faststart hero.mp4
ffmpeg -i src.mov -vf scale=960:-2  -c:v libx264 -crf 28 -an -movflags +faststart hero_mobile.mp4

# Poster from frame 1
ffmpeg -i hero.mp4 -vframes 1 -q:v 3 reel-poster.jpg
```

## Bundle budget

| | Reference site | Your target |
|---|---|---|
| Vendor JS (gz) | ~1.3 MB raw | **< 70 KB gz** |
| Site JS (gz) | 114 KB raw | < 25 KB gz |
| CSS (gz) | 146 KB raw | < 25 KB gz |
| Fonts | 2 files | 1–2 `.woff2`, < 90 KB total |
| Above-fold media | video | < 400 KB (poster only) |
| LCP | — | < 2.5 s on 4G |

GSAP core + ScrollTrigger + Lenis ≈ 60 KB gz. Three.js is ~600 KB raw / ~150 KB gz — **only** load it via `await import('three')` after LCP, and only if there's genuine interactive 3D.

## Deploy

Cloudflare Pages, Netlify, or Vercel — all fine for a static one-pager. Match the reference's caching:
```
# _headers (Cloudflare Pages / Netlify)
/assets/*
  Cache-Control: public, max-age=31536000, immutable
/*.html
  Cache-Control: public, max-age=0, must-revalidate
```
Hash filenames in the build (Vite does this) and drop the `?v=1.0.0.3` query-string approach — hashed names invalidate correctly, query strings don't on all proxies.

Add: `robots.txt`, a 1200×630 OG image, GA4 or Plausible, and a service worker only if you actually need offline (the reference ships one via `caching.js`; for a one-pager the CDN already covers it).

## Pre-launch checklist

- [ ] Concept sentence still legible to someone who's never seen the site
- [ ] Static page (no JS) is beautiful and readable
- [ ] All copy proofread in both voices; sub-labels actually funny
- [ ] `prefers-reduced-motion` verified — content visible, no motion
- [ ] Touch: concept accessible via the drag handle; no dead hover-only content
- [ ] Keyboard: all sections + reel + modal reachable, focus visible, Escape closes
- [ ] Screen reader: duplicate layer and duplicate hover labels `aria-hidden`
- [ ] Lighthouse ≥ 90 perf / 100 a11y on mobile
- [ ] Mid-tier Android at 4× CPU throttle holds ~60 fps on the spotlight
- [ ] Sound off by default; toggle persists
- [ ] OG image renders correctly in a link-preview debugger
- [ ] `1440`, `1728`, `1920`, `2560` widths all correct (the `vw` type scale must not blow up)
