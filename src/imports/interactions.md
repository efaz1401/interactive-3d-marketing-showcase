# Interaction Catalog

Eight interactions carry the whole site. Build them in this order. Every one is gated — see § Gates at the bottom.

Detected stack (from `vendor.bundle.js`, 1.3 MB): **GSAP** core + **ScrollTrigger**, **ScrollSmoother**, **Flip**, **Observer**, **SplitText**; **Lenis**; **Three.js** (460 `THREE` references); Bootstrap grid CSS. `app.bundle.js` (114 KB) is the site's own code — 19 `lenis` refs, 10 `Observer`, a `Masker` class, and 5 `uniforms` (one small shader).

---

## 1. The spotlight reveal — the signature trick

**What it is:** the entire page exists twice. `.main-layer` is the polished voice; `.layer.layer__red` is a full-page absolute duplicate with an accent background and a **CSS mask** that is a single circle. A `Masker` class lerps the cursor position into `--x`/`--y`/`--size` inside a RAF loop, so a soft circular window follows the pointer and reveals the honest copy underneath.

The shipped rule, verbatim:
```css
.layer__red {
  --size: 0px;
  background: #eb5939;
  position: absolute; top: 0; left: 0;
  min-height: 100%;
  z-index: 5;
  pointer-events: none;
  mask-image: url(assets/icons/test-mask.svg);
  mask-origin: content-box;
  mask-repeat: no-repeat;
  mask-position: calc(var(--x) - var(--size)/2) calc(var(--y) - var(--size)/2), center;
  mask-size: var(--size), contain;
}
```
`--size: 0px` means the layer is fully masked out at rest. Nothing renders until the pointer moves.

**Why it's smart:** no WebGL, no canvas, no blend modes. One SVG circle and three custom properties. It composites on the GPU and costs nothing.

**Implementation:**

```js
// src/js/masker.js
import { lerp } from './utils';

export default class Masker {
  constructor() {
    this.DOM = {
      layer: document.querySelector('.js-masker'),
      handle: document.getElementById('js-btn_clipPath'), // touch fallback
    };
    if (!this.DOM.layer) return;

    this.max = 640;                       // px diameter when open
    this.current = { x: innerWidth / 2, y: innerHeight / 2, size: 0 };
    this.target  = { ...this.current };
    this.active  = false;

    this.bind();
    this.raf = requestAnimationFrame(this.render);
  }

  bind() {
    // Pointer devices only — see § Gates
    if (matchMedia('(any-hover: hover)').matches) {
      addEventListener('pointermove', (e) => {
        this.target.x = e.clientX;
        this.target.y = e.clientY + scrollY; // layer is document-height, not viewport
        this.target.size = this.max;
        this.active = true;
      }, { passive: true });

      document.documentElement.addEventListener('pointerleave', () => {
        this.target.size = 0;
      });
    }
    // Touch: a visible draggable handle, so mobile still gets the concept
    this.DOM.handle?.addEventListener('pointerdown', () => (this.target.size = this.max));
  }

  render = () => {
    const c = this.current, t = this.target;
    c.x    = lerp(c.x,    t.x,    0.12);   // trailing feel
    c.y    = lerp(c.y,    t.y,    0.12);
    c.size = lerp(c.size, t.size, 0.08);   // slower so it "breathes" open

    const s = this.DOM.layer.style;
    s.setProperty('--x',    `${c.x}px`);
    s.setProperty('--y',    `${c.y}px`);
    s.setProperty('--size', `${c.size}px`);

    this.raf = requestAnimationFrame(this.render);
  };

  destroy() { cancelAnimationFrame(this.raf); }
}
```

```js
// src/js/utils.js
export const lerp = (a, b, t) => a + (b - a) * t;
```

**Gotchas:**
- Add `scrollY` to `--y` because the red layer spans the whole document, not the viewport. If you use ScrollSmoother/Lenis, read the *smoothed* scroll value, not `window.scrollY`, or the spotlight will lag behind by the smoothing delta.
- Keep both layers in lockstep: identical grid classes, identical `<br>` positions. If a line wraps differently in one layer, the illusion dies. That's why the source repeats copy per breakpoint.
- `pointer-events: none` on the reveal layer — all clicks belong to the base layer.
- Set `aria-hidden="true"` on the duplicate layer. Screen readers must not hear the page twice.

**Concept variants** if you want the mechanic without the joke: X-ray a wireframe under a finished UI; reveal a night version under a day version; expose process sketches under final renders; show the code under the rendered component.

---

## 2. Masked line reveals (used ~46 times)

The most-reused primitive. Class names in the source: `heading-mask`, `heading-mask_el`, `heading-mask_el__masking`, `heading-mask_el__deep`, `simple-masking`, `simple-masking_el`.

```css
.simple-masking { overflow: hidden; display: block; }
.simple-masking_el { display: block; will-change: transform; }
```

```js
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';   // Club GSAP; see § Alternatives

gsap.registerPlugin(ScrollTrigger, SplitText);

document.querySelectorAll('[data-reveal]').forEach((el) => {
  const split = new SplitText(el, { type: 'lines', linesClass: 'simple-masking_el' });
  // wrap each line so overflow can clip it
  split.lines.forEach((line) => {
    const wrap = document.createElement('span');
    wrap.className = 'simple-masking';
    line.parentNode.insertBefore(wrap, line);
    wrap.appendChild(line);
  });

  gsap.from(split.lines, {
    yPercent: 110,
    duration: 1.1,
    ease: 'expo.out',
    stagger: 0.08,
    scrollTrigger: { trigger: el, start: 'top 85%', once: true },
  });
});
```

`__deep` in the source is a second, slower-moving inner element — a parallax-within-the-mask that makes the reveal feel weighted rather than mechanical. Add `gsap.from(inner, { yPercent: 40, ... })` on the same timeline at ~40 % of the outer distance.

**Alternatives to SplitText** (paid Club GSAP plugin): `Splitting.js` (free), or CSS `text-wrap: balance` + manual `<span>` per line if the copy is fixed — which it is here, since every line is hand-broken anyway.

**Row borders:** section rows use `border-top: 1px solid`. Animate `scaleX` from 0 with `transform-origin: left` on a pseudo-element, staggered with the text. Do not animate `width`.

---

## 3. Smooth scroll (Lenis) + per-element parallax

The source drives parallax with data attributes: `data-lenis-speed` (5 uses), `data-lenis-parallax`, `data-screen-offset`, `data-offset`.

```js
import Lenis from 'lenis';
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  syncTouch: false,                     // native momentum on touch — do not fight it
});

// Bridge Lenis → ScrollTrigger (required; they both want to own scroll)
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// Anchor nav
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    lenis.scrollTo(a.getAttribute('href'), { offset: 0, duration: 1.4 });
  });
});

// data-lenis-speed="0.85" → moves slower than scroll; >1 → faster
document.querySelectorAll('[data-lenis-speed]').forEach((el) => {
  const speed = parseFloat(el.dataset.lenisSpeed);
  gsap.to(el, {
    yPercent: (1 - speed) * 100,
    ease: 'none',
    scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
  });
});
```

**Pick one, not both:** GSAP `ScrollSmoother` and Lenis both hijack scroll. That site ships both (ScrollSmoother in vendor, Lenis actually wired up) — bundle bloat from an unfinished migration. Use **Lenis** (free, ~3 KB) unless you already pay for Club GSAP.

Always expose an escape hatch: `lenis.stop()` when a modal/reel opens, `lenis.start()` on close.

---

## 4. Custom cursor with contract/expand states

Markup hooks: `<html class="no-system-cursor">`, `.vj-cursor.js-vj-cursor`, and `js-cursor-contract` on 35 elements.

```css
.no-system-cursor, .no-system-cursor * { cursor: none; }
.vj-cursor {
  --size: 7.5rem; --x: 50%; --y: 50%; --opacity: 0;
  position: fixed; top: 0; left: 0; z-index: 100;
  display: flex; align-items: center; justify-content: center;
  width: var(--size); height: var(--size);
  border-radius: 50%;
  opacity: var(--opacity);
  pointer-events: none;
  transform: translate3d(calc(var(--x) - 50%), calc(var(--y) - 50%), 0);
  transition: opacity .3s, width .4s cubic-bezier(.16,1,.3,1), height .4s cubic-bezier(.16,1,.3,1);
}
.vj-cursor span { text-align: center; }
@media (hover: none) { .vj-cursor { display: none !important; } }
```
Same lerp loop as the masker writes `--x`/`--y`. Three states:
- **default** — small dot, `--size: 0.75rem`
- **contract** — over links (`js-cursor-contract`): shrink and drop opacity so the link reads clean
- **label** — over the reel: expand to `7.5rem`, fill accent, show the two-line "PLAY / REEL" text already sitting inside the cursor element

```js
document.querySelectorAll('.js-cursor-contract').forEach((el) => {
  el.addEventListener('pointerenter', () => cursor.classList.add('is-contract'));
  el.addEventListener('pointerleave', () => cursor.classList.remove('is-contract'));
});
```
The label text lives in the DOM inside `.vj-cursor` from the start (`<span class="d-block">PLAY</span><span class="d-block">REEL</span>`) — never injected on hover, so there's no layout thrash.

---

## 5. Preloader with percentage counter

Assets: `logo.gif`, label "Start", counter `00` → `100`.

```js
const counter = { v: 0 };
const total = document.querySelectorAll('img[data-src], video[data-src]').length || 1;
let loaded = 0;

const tick = () => {
  loaded++;
  gsap.to(counter, {
    v: (loaded / total) * 100,
    duration: 0.4,
    onUpdate: () => { el.textContent = String(Math.floor(counter.v)).padStart(2, '0'); },
  });
};
```
Two rules that matter:
- **Never fake it.** Tie the counter to real `load` events on the hero video + above-fold images. A fake 3-second timer is the single most common tell of a template.
- **Never block on everything.** Preload the hero only; lazy-load beats 6+ (that's what `preload="none"` on the reel video and `data-src` on the banners are for). Then hard-cap the loader at ~2.5 s and lift regardless.

Exit: `body { overflow: hidden }` is set inline in the source and removed on complete. Lift the curtain with `clipPath: 'inset(0 0 100% 0)'` and start the hero timeline on the same `onComplete`, overlapping ~0.2 s so it reads as one move.

---

## 6. Reel video + fullscreen

Three video elements in the source:
```html
<video id="hero-bg-video" autoplay muted playsinline loop preload="none"
       data-pc="assets/video/hero.mp4" data-mobile="assets/video/hero_mobile.mp4"></video>

<video id="videoPlayer" playsinline muted loop preload="auto"
       data-poster="assets/images/reel-poster.jpg"
       data-poster-mobile="assets/images/reel-mobile-poster.jpg"></video>

<video id="videoPlayer_red" playsinline muted loop preload="none" width="1920" height="1080"></video>
```
Note `videoPlayer_red` — even the reel exists in both voices, so the spotlight works over video too.

- `autoplay muted playsinline loop preload="none"` + `data-pc`/`data-mobile` — swap `src` in JS after a `matchMedia` check so mobile never downloads the desktop file.
- Always ship a `poster`. It's the LCP element.
- Encode two files: desktop ~1920×1080 CRF 26, mobile ~960×540. Target < 3 MB each. Add a WebM/AV1 source for ~40 % savings.
- Click → `lenis.stop()`, unmute, expand with GSAP `Flip` from the inline thumb rect to fullscreen. Return focus to the trigger on close.

---

## 7. Testimonial thumb slider

Three avatars (`michael-glass.jpg`, `peter-smart.jpg`, `linh-le.jpg`) act as tabs; `li.thumb-item.is-active` marks state; oversized quote glyphs frame the text. Crossfade the quote and slide the active thumb — no carousel library needed for three items.

Build it as real tabs: `role="tablist"` / `role="tab"` / `aria-selected` / `role="tabpanel"`, arrow-key navigation. It costs ten lines and makes the section keyboard-usable.

---

## 8. Footer details: rotating text ring + sound toggle

- **Text ring** (`ic-text-ring.svg`, `ic-touch.svg`): SVG with a `<textPath>` on a circle, rotated by `gsap.to(el, { rotate: 360, duration: 20, repeat: -1, ease: 'none' })`. In CSS the source uses `--duration: 10s`. Pause it when off-screen with `ScrollTrigger` — a permanently-running RAF in the footer is wasted battery.
- **Sound toggle** (`<audio loop class="js-web-sound" src="assets/mp3/audio-site.mp3">`, `--color: #b7ab98`): ship **off**. Label "Sound On/Off", persist choice in `localStorage`, use a real `<button aria-pressed>`. Autoplaying audio will get the site blocked by browsers and hated by users.

---

## Gates — run every one before shipping

**Reduced motion.** The source wraps motion in `@media (prefers-reduced-motion: no-preference)`. Do the same, and in JS:
```js
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduce) {
  gsap.globalTimeline.timeScale(200);   // effectively instant, end states preserved
  lenis.destroy();                      // native scroll
}
```
End states must be the *final* layout — never leave content at `opacity: 0` when motion is off.

**Touch / no-hover.** Gate the cursor and the spotlight on `(any-hover: hover)`. Give touch users the concept another way — the source ships `#js-btn_clipPath`, a visible draggable handle with `ic-touch.svg`. Without it, half your audience never sees the idea.

**Keyboard.** Custom cursor must not remove focus rings. All 14 sections reachable by Tab. Reel and any modal must trap focus and close on Escape. `cursor: none` on `*` is fine; `outline: none` is not.

**Screen readers.** `aria-hidden="true"` on the duplicate layer. Every duplicated hover-label span (`heading-mask_el`) also needs `aria-hidden` on the copy, or every nav item is announced twice.

**Performance budget.**
- The reference site ships **1.3 MB vendor JS**. Beat it: GSAP core + ScrollTrigger + Lenis ≈ 60 KB gzipped. Only add Three.js if there's real WebGL, and code-split it behind a dynamic `import()` that runs after LCP.
- LCP < 2.5 s: hero poster as a preloaded WebP/AVIF, `preload="none"` on all video, `-50` quality JPEGs for full-bleed art.
- Drop Three.js entirely if the only 3D is a static render — `planet-1-1.png` on that site is a **PNG**, i.e. they already made that call for the planet.
- Test on a mid-tier Android at 4× CPU throttle. If the spotlight drops below 50 fps, reduce lerp work or disable it there.

**Reduced-data / battery.** `matchMedia('(prefers-reduced-data: reduce)')` → skip the hero video, show the poster.
