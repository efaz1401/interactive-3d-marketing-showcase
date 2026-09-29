# MCP Servers for This Build

Package names and endpoints **verified live on 2026-08-26** (npm registry / HTTP reachability). Remote endpoints returning `401`/`405` are alive and simply require auth or a POST — that's expected.

Add with `claude mcp add`:
```bash
claude mcp add <name> -- npx -y <package>                 # local stdio
claude mcp add --transport http <name> <url>              # remote
```

---

## Tier 1 — actually needed

### Playwright MCP — visual verification loop
`@playwright/mcp` **v0.0.79** ✅ *(already available in this session as `mcp__playwright__*`)*
```bash
claude mcp add playwright -- npx -y @playwright/mcp@latest
```
The single most valuable server here. This site is *all* visual and motion, so you cannot build it blind:
- Screenshot at `1440 / 1728 / 1920 / 2560` to prove the `vw` type scale doesn't blow up
- `browser_resize` → mobile/tablet to check the art-directed image swaps
- `browser_console_messages` to catch GSAP plugin-registration errors
- `browser_evaluate` to read computed styles and verify tokens landed (`getComputedStyle(el).getPropertyValue('--size')`)
- Drive `pointermove` via `browser_run_code_unsafe` to test the spotlight masker at specific coordinates
- Snapshot the accessibility tree to confirm the duplicate layer is `aria-hidden` and labels aren't announced twice

### Chrome DevTools MCP — performance gates
`chrome-devtools-mcp` **v1.8.0** ✅
```bash
claude mcp add chrome-devtools -- npx -y chrome-devtools-mcp@latest
```
Playwright screenshots don't tell you *why* it's slow. This gives real performance traces, CPU/network throttling, and Core Web Vitals with an LCP breakdown. Given the reference site's 1.3 MB vendor bundle, this is what keeps you honest against the budget in `build-scaffold.md`. Use it for: LCP attribution on the hero video, layout-shift hunting after the preloader lifts, and frame-rate checks on the masker under 4× CPU throttle.

### Context7 — current library docs
`@upstash/context7-mcp` **v4.0.3** ✅
```bash
claude mcp add context7 -- npx -y @upstash/context7-mcp@latest
```
GSAP 3.13 made the paid plugins (SplitText, ScrollSmoother, Flip, Observer) free, and Lenis renamed its package from `@studio-freight/lenis` to `lenis`. Both are exactly the kind of change a model gets wrong from memory. Pull live docs for `gsap`, `lenis`, `three` before writing plugin code.

### Filesystem MCP — if working outside the project dir
`@modelcontextprotocol/server-filesystem` **v2026.7.10** ✅
```bash
claude mcp add fs -- npx -y @modelcontextprotocol/server-filesystem /path/to/assets
```
Only worth adding when source assets (Blender renders, video masters, font kits) live outside the repo. Built-in Read/Write covers the project itself.

---

## Tier 2 — depends on your workflow

### Figma MCP — design handoff and token extraction
Two options, both verified:

**Official, remote:** `https://mcp.figma.com/mcp` ✅ *(405 = alive)*
```bash
claude mcp add --transport http figma https://mcp.figma.com/mcp
```
**Official, local Dev Mode server** — requires the Figma **desktop app** running with Dev Mode MCP enabled in Preferences; listens on `http://127.0.0.1:3845/mcp` (unreachable above only because the app isn't open):
```bash
claude mcp add --transport http figma-local http://127.0.0.1:3845/mcp
```
**Third-party alternative:** `figma-developer-mcp` **v0.13.2** ✅ (Framelink) — works from a file URL + API token, no desktop app:
```bash
claude mcp add figma-alt -- npx -y figma-developer-mcp --stdio
```
Use it to pull Figma **variables** straight into `_tokens.scss` — palette, spacing scale, type ramp — instead of eyeballing hexes. Caveat: Figma-to-code output is verbose and component-shaped; this pattern wants hand-written CSS on a Bootstrap grid. Extract *tokens and measurements*, not markup.

### Blender MCP — the 3D renders
`blender-mcp` **v1.8.7** (PyPI) ✅
```bash
claude mcp add blender -- uvx blender-mcp
```
The reference site's one 3D element (`planet-1-1.png`) is a **static PNG**, not WebGL — the right call. This server drives Blender to produce that kind of render: scene setup, materials, lighting, and export. Genuinely useful if the concept needs bespoke 3D and you'd otherwise be stuck buying stock renders. Skip if you're using existing artwork.

### Firecrawl MCP — reference/competitor research
`firecrawl-mcp` **v3.24.0** ✅
```bash
claude mcp add firecrawl -- npx -y firecrawl-mcp
```
For building a moodboard from Awwwards/Godly/Httpster: crawl many sites and extract structured design observations at once. Handles JS-rendered pages that plain fetch misses. Needs `FIRECRAWL_API_KEY`. Note this session already has a `seo-firecrawl` skill if you want the wrapper.

*(A plain fetch server is redundant here — the built-in WebFetch tool did the entire teardown above.)*

---

## Tier 3 — deploy and project ops

| Server | Endpoint / package | Status | Use |
|---|---|---|---|
| **Cloudflare** | `https://docs.mcp.cloudflare.com/mcp` (docs), plus separate bindings/observability/radar servers | ✅ 405 | Matches the reference host. Pages deploys, cache rules, `_headers` |
| **Netlify** | `@netlify/mcp` v1.15.1 | ✅ | `claude mcp add netlify -- npx -y @netlify/mcp` — deploy, env vars, forms |
| **Vercel** | `https://mcp.vercel.com` | ✅ 401 | `claude mcp add --transport http vercel https://mcp.vercel.com` |
| **GitHub** | `https://api.githubcopilot.com/mcp/` | ✅ 401 | Repo, PRs, Actions for CI Lighthouse runs |
| **Notion** | `https://mcp.notion.com/mcp` | ✅ 401 | If copy for both voices is drafted in Notion — pull it rather than retype |
| **Linear** | `https://mcp.linear.app/mcp` | ✅ 401 | Section-by-section task tracking (note: `/mcp`, not the old `/sse`, which 404s) |

---

## Not MCP, but required

The heavy asset work is CLI, not MCP. Don't go looking for a server:

```bash
ffmpeg      # video pairs, posters, WebM/AV1 — see build-scaffold.md
magick      # ImageMagick: the -50 quality JPEG pairs, AVIF/WebP
subfont     # or glyphhanger / fonttools: subset .woff2 to used glyphs
svgo        # optimize icons and test-mask.svg
```

## Minimum viable set

If you add only three: **Playwright** (see it) + **Chrome DevTools** (measure it) + **Context7** (get the API right). Everything else is situational.

## Cost note

Each server's tool schemas consume context on every request. Six servers is a real tax on a long build session. Add Tier 1 up front; add Tier 2/3 only for the phase that needs them, then remove.
