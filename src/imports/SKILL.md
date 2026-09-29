---
name: awwwards-portfolio
description: Build an award-style single-page designer/studio portfolio with GSAP + Lenis + Three.js — the "minhpham.design" pattern. Use when the user asks for an Awwwards-level portfolio, a scroll-choreographed one-pager, a dual-layer/spotlight-reveal site, a preloader-percentage site, custom-cursor site, masked-line text reveals, or references minhpham.design / Fantasy Interactive-style motion work. Covers art direction, design tokens, the interaction catalog with working code, asset budget, performance and a11y gates.
---

# Awwwards-Style Portfolio (the minhpham.design pattern)

## What this pattern actually is

A **single-page, dark, editorial one-pager** whose entire value is *motion choreography* and **one memorable concept trick** — not page count. Reverse-engineered from `minhpham.design` (built 2023–24, Cloudflare-hosted static site, `vendor.bundle.js` 1.3 MB / `app.bundle.js` 114 KB / `app.css` 146 KB).

The concept trick there: **two complete copies of the page**, stacked. The top layer is the polished portfolio voice ("making good shit since 2009", "Over a decade of experience"). Underneath sits a vermillion `#eb5939` layer with the *honest* voice ("Hiding bad shit since 2009", "Only seven years of actively producing cool shit"). A circular CSS mask follows the cursor and burns a spotlight through to the honest layer. Same grid, same type, same positions — only the words change. The whole site is one joke, executed with total technical seriousness.

**Read this first, and internalize the rule:** copy the *system*, invent your own concept. A dual-layer spotlight on a second portfolio is plagiarism with extra steps. The transferable asset is the discipline — one concept, ~14 sections, 5 interaction primitives reused everywhere, obsessive typographic restraint.

## Workflow

1. **Lock the concept before any code.** Write one sentence: "The site is X, but Y." If you can't, stop and go back to the user. Everything below is scaffolding for the concept; without it you're building a template.
2. **Write all copy first, in both voices** (or however many the concept needs). Copy drives the layout in this pattern, never the reverse. Section heads are 1–2 words, all-caps, small. Body lines are one sentence with 1–3 words bolded for emphasis.
3. **Set tokens.** Read `references/design-system.md` — 5-color palette, one display face, `vw`-locked type scale on a 1728 px canvas, Bootstrap-grid-only layout.
4. **Scaffold the build.** Read `references/build-scaffold.md` — Vite, GSAP plugin registration order, the Lenis↔ScrollTrigger bridge, folder layout. Get an empty scrolling page working *before* animating.
5. **Build sections statically.** All ~14, correct type and spacing, zero animation. Review the static page as a print layout. If it isn't beautiful frozen, motion won't save it.
6. **Layer in interactions, one primitive at a time**, in this order: masked-line reveals → smooth scroll + parallax → custom cursor → preloader → the concept trick → media (reel, audio, WebGL). Read `references/interactions.md` for working implementations of each.
7. **Run the gates** in `references/interactions.md` § Gates — reduced-motion, keyboard, LCP, bundle budget, mobile fallback for the cursor trick. Non-negotiable; skipping them is what separates this from a Dribbble shot.

## Section order (the 14-beat structure)

Use this skeleton; rename to fit the concept. Each beat is one screen-ish, each has exactly one idea.

| # | Beat | Content | Primary motion |
|---|---|---|---|
| 1 | Preloader | Logo GIF, "Start", `00`→`100` % | Counter tween, then curtain lift |
| 2 | Fixed nav | Logo SVG + About/Work/Contact | Roll-up text on hover, hides on scroll-down |
| 3 | Hero | 5-line stacked `h1`, mixed weights, bg video | Line-by-line mask reveal, staggered |
| 4 | About | One sentence, 1–3 bolded words | Masked lines on enter |
| 5 | What I do | 5 rows: 3D / Visual / Motion / Product / Tutorial | Row borders draw in, per-row reveal |
| 6 | Full-bleed image | Art-directed desktop/mobile pair | Parallax, `data-lenis-speed` |
| 7 | Experience | One sentence, bolded span | Masked lines |
| 8 | History | Year → title rows (NOW, 2016, 2012, 2009) | Row stagger, top-border draw |
| 9 | Clients | Intro line + 6 named rows + 3D render | Row stagger, hover accent |
| 10 | Reel | Play glyph, "PLAY REEL", cursor label | Cursor morphs to label, click → fullscreen |
| 11 | Testimonials | 3 avatar thumbs as tabs, oversized quote marks | Thumb click → crossfade quote |
| 12 | Bottom banner | Art-directed image pair | Parallax |
| 13 | Motto | One centred pull-quote | Masked lines |
| 14 | Connect/footer | Socials with witty sub-labels, email, phone, rotating text ring, sound toggle | Ring rotates on RAF, link hover roll |

Note beat 14's detail: every social link carries a **descriptive sub-label** in the second voice — Dribbble "Fake works", YouTube "Random tutorials", LinkedIn "Serious me", Instagram "Not Tiktok", Facebook "Mostly dog stories", Behance "The Jurassic Park", email "100% chance I read it", phone "90% chance I don't pickup". That's where the personality lands hardest. Budget real writing time for it.

## Non-negotiables of the style

- **Dark.** `#0d0d0d` background, `#fff` type, one warm neutral (`#b7ab98`), one hot accent (`#eb5939`). Five colors total. No gradients, no glassmorphism, no shadows.
- **One display face.** Avant Garde 600 there; pick one geometric or grotesque display and use it everywhere. A second face only for `.desc` body text.
- **Hairline rules, not cards.** Rows separated by `1px solid` borders. Zero border-radius, zero elevation. The layout is a table, not a deck of cards.
- **Text-first.** No decorative illustration except one 3D render and the media. Images earn their place by being full-bleed and art-directed.
- **Every label appears twice in the DOM.** That's the masked roll-up hover — original + duplicate, `overflow: hidden` parent, translate on hover. If you see duplicated text in a source, that's what it is.
- **Overflow-hidden everywhere.** 39 `overflow-hidden` uses on that page. Masking is the entire aesthetic.
- **Bootstrap grid only.** `row`, `col-lg-*`, `offset-lg-2`, `d-none`/`d-block`. No components, no theme. The recurring measure is `col-lg-8 offset-lg-2` — an 8/12 centred column with a 2-col left gutter that section labels hang into.

## Anti-patterns

- Animating before the static layout is beautiful.
- More than ~6 distinct animation *kinds*. Reuse 5 primitives across 14 sections; variety comes from content, not from new effects.
- A concept trick that requires hover to be understood at all — mobile users must still get the joke (see § Gates: give them a draggable handle, as that site does with `#js-btn_clipPath`).
- Autoplaying audio. Ship the toggle **off**, always.
- Shipping 1.3 MB of vendor JS without measuring. That site's bundle is its worst quality; do better — see the budget in `references/build-scaffold.md`.
- Locking scroll behind a WebGL canvas that fails on low-end GPUs with no fallback.

## References

- `references/design-system.md` — exact palette, type scale, spacing tokens, grid, breakpoints, font strategy
- `references/interactions.md` — working code for all 8 interactions incl. the spotlight masker, plus the accessibility/performance gates
- `references/build-scaffold.md` — Vite setup, GSAP+Lenis bridge, folder structure, asset pipeline, bundle budget, deploy
- `references/mcp-servers.md` — which MCP servers help at which stage, with install commands
