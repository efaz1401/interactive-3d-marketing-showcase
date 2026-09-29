# yourfirstsite.com — Awwwards-style bilingual marketing one-pager

## Context

The user wants a marketing website for **yourfirstsite.com**, a service that builds
complete websites for **1000 Saudi Riyals** — covering domain acquisition, SEO, and
deployment within **7 days**. The tone should echo the humor of `minhpham.design`:
a dark, editorial, scroll-choreographed one-pager whose whole personality is a
**dual-voice joke** executed with total technical seriousness. Two decisions from the
user shape the build:

- **Bilingual (Arabic + English) with a toggle** → full copy in both languages, an
  RTL/LTR switch, and fonts covering both scripts.
- **A loaded external glTF 3D character** (replacing the reference site's static 3D
  render) that animates in sync with scrolling.

The project today is a bare Figma Make **React 19 + Vite 8 + Tailwind v4** starter
(`src/App.tsx` is the default dot-grid demo; nothing else installed, no assets). The
`src/imports/*.md` files are a design brief for the "minhpham.design pattern" written
for a vanilla GSAP/Lenis/Three build — we adopt its **design system, concept
discipline, and interaction catalog**, but re-implement in React.

**Outcome:** a single-page, dark, motion-driven bilingual site with one memorable
concept trick, a scroll-synced 3D robot mascot, and funny two-voice copy that clearly
communicates the 1000 SAR / 7-day offer.

## The concept (locked)

> **The site is a slick agency pitch — but a cursor-spotlight burns through to the
> honest solo-founder voice underneath.**

The polished layer sells hard ("Enterprise-grade websites. Seven days."). A vermillion
`#eb5939` layer sits underneath with the honest version ("It's one person and a lot of
coffee. Somehow the sites are great."). A circular CSS mask follows the cursor and
reveals the honest copy. On touch/no-hover, a draggable handle exposes it instead.
This works **on top of** the bilingual toggle — copy exists in 4 variants
(EN/AR × polished/honest).

## Stack additions

Install: `three`, `@react-three/fiber`, `@react-three/drei`, `gsap`, `lenis`.
- **Lenis** smooth scroll, bridged to **GSAP ScrollTrigger** (single source of scroll truth).
- **ScrollTrigger** scrubbed timelines drive both section reveals and the 3D character.
- **R3F + drei** (`useGLTF`, `useAnimations`, `Environment`, `ContactShadows`) render
  the character in a fixed full-viewport `<Canvas>` behind/beside content.

Self-host the model: download the three.js **RobotExpressive** mascot
(`https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb`, CC0)
into `public/models/RobotExpressive.glb` at build time so runtime has no external dep.
It ships expressive clips (Idle, Walking, Wave, Dance, Jump, ThumbsUp) we map to sections.

## Design tokens & fonts

Follow `src/imports/design-system.md`. Put tokens + font wiring in `src/index.css`
(keep `@import 'tailwindcss';`; Google Font `@import`s go **above** it per PostCSS ordering).

- Palette: `--c-bg:#0d0d0d`, `--c-fg:#fff`, `--c-neutral:#b7ab98`, `--c-accent:#eb5939`,
  `--c-muted:#4d4d4d`. Five colors, no gradients/shadows/radius. Hairline `1px` rules.
- Fonts (all public Google Fonts, fast-path `@import`):
  - Latin display: **Archivo** (Expanded weights for the stacked hero).
  - Latin body: **Nunito Sans**.
  - Arabic display + body: **Cairo** (geometric, full weight range, RTL-ready).
- Type scale: large two-tier hierarchy (huge hero/section heads, tiny uppercase labels),
  scaled responsively; add a breakpoint ~1000px so it collapses cleanly.

## Architecture / files

Re-implement the vanilla patterns as React components + hooks. New structure under `src/`:

```
src/
  App.tsx                    # replaces demo: providers + section composition
  index.css                  # fonts, tokens, global rules, RTL helpers
  i18n/
    strings.ts               # all copy: { en, ar } × { polished, honest } per key
    LangContext.tsx          # language state + dir(rtl/ltr) + t() helper, toggle
  hooks/
    useLenis.ts              # Lenis init + GSAP ticker bridge + reduced-motion gate
    useScrollProgress.ts     # exposes global/section scroll progress for the 3D scene
  components/
    Preloader.tsx            # 00→100 counter tied to real asset load, curtain lift
    Nav.tsx                  # logo + anchor nav + language toggle (roll-up hover)
    SpotlightLayer.tsx       # the concept trick: duplicate honest layer + cursor mask
    Reveal.tsx               # masked-line reveal primitive (ScrollTrigger)
    Character3D.tsx          # fixed <Canvas>; RobotExpressive; scroll-synced transform+clips
    sections/
      Hero.tsx  Offer.tsx  Pricing.tsx  Process.tsx
      Testimonials.tsx  Motto.tsx  Footer.tsx
```

### Key behaviors
- **`Character3D`**: fixed canvas. A `useFrame` loop reads scroll progress (from
  `useScrollProgress`) and lerps the robot's rotation/position across sections, and
  crossfades animation clips per section (Hero=Wave, Offer=Walking, Pricing=ThumbsUp,
  Process=Walking, Motto=Dance). Smoothed (lerp) so motion feels synchronized, not jumpy.
  Positioned to one side on desktop, smaller/centered on mobile.
- **`SpotlightLayer`**: full-document absolute duplicate, `#eb5939` bg,
  `mask-image` = single SVG circle, `--x/--y/--size` custom props lerped in a RAF loop
  from `pointermove` (add smoothed scrollY since layer spans document). `aria-hidden`,
  `pointer-events:none`. Touch fallback: draggable handle. Gated on `(any-hover:hover)`.
- **`Reveal`**: wraps lines in `overflow:hidden`, animates `yPercent` in on
  ScrollTrigger enter (once). End state = final layout (safe for reduced-motion).
- **`LangContext`**: sets `dir`/`lang` on `<html>`, swaps font stack + copy, persists to
  `localStorage`. Toggle in nav.
- **Reduced motion / a11y gates** (from `interactions.md` §Gates): honor
  `prefers-reduced-motion` (instant end states, destroy Lenis), keep focus rings,
  `aria-hidden` the duplicate spotlight layer, keyboard-reachable sections + toggle.

### Copy (both voices, both languages) — write real, funny lines, e.g.
- Hero polished EN: "Your first website. Live in seven days." / honest: "Before you talk
  yourself out of it again."
- Offer rows: Domain · SEO · Deployment · 7-day delivery — each with a dry honest sub-line.
- Pricing: giant "1000 SAR" with honest aside ("Yes, total. No 'starting from'.").
- Footer: witty sub-labels per contact link (minhpham pattern).
Arabic variants written natively (not machine-literal), RTL-aware line breaks.

## Boot order (in `App.tsx` / `useLenis`)
1. Register `ScrollTrigger`. 2. Init Lenis + GSAP ticker bridge. 3. Mount sections.
4. `Character3D` canvas. 5. `SpotlightLayer` (needs final height) + Preloader; call
`ScrollTrigger.refresh()` on preloader complete and `document.fonts.ready`.

## Verification
- `pnpm dev` is already running on `$PORT`; load the preview.
- Check: preloader → hero reveal; scroll drives the robot's motion/clip changes smoothly;
  spotlight reveals honest copy under the cursor; language toggle flips copy + RTL/LTR and
  fonts; layout holds at ~1000px and mobile (character scales, spotlight handle appears).
- Confirm `public/models/RobotExpressive.glb` loads (no external fetch, no console errors).
- Toggle `prefers-reduced-motion`: content fully visible, no motion, native scroll.
- Keyboard: nav + toggle + all sections reachable, focus visible.
- Only run a build/typecheck if a runtime error appears; keep verification proportional.

## Notes / risks
- Bundle: Three.js is heavy — acceptable given real interactive 3D is the brief; keep the
  rest lean (GSAP core + ScrollTrigger + Lenis ≈ 60KB gz). Load the canvas after first paint.
- Do not add an unlayered global CSS reset (Tailwind v4 layering). Keep `@import`s first.
- Replace the demo `App.tsx` fully (this is a from-scratch page, not an extension).
