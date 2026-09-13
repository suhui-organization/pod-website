# Design

## Theme

Light, white, single-accent — with one dark band. A developer reads this in daylight
next to an editor, deciding in half a minute whether to install something. The surface
stays quiet so the hero moment and the install command carry the weight.

Physical scene: *工作日白天，开发者刚在群里看到这个项目，浏览器开在编辑器旁边，
第一屏就要判断值不值得装。* Daylight + short dwell time + a skeptical reader →
pure white surface, one cobalt accent, no terminal cosplay (see `PRODUCT.md`
anti-references).

Reference: **deepseek.com**. Its actual stylesheet tokens are a pure `#ffffff` surface,
near-black ink, and exactly one saturated blue. That restraint is adopted wholesale;
the hex is not. See Color.

Color strategy: **Restrained**, with two deliberate exceptions — the hero halo, and one
dark band. The single accent is the product's own cobalt, bent toward the reference's hue.

## Color

All values OKLCH. Every ink value carries its measured WCAG ratio; the ramp was verified
against the rendered page with canvas-composited pixels, in both the light and dark
sections, not by eye.

| Token | Value | Measured | Use |
|---|---|---|---|
| `--bg` | `oklch(1 0 0)` | — | page background (pure white, no hidden warmth) |
| `--surface-2` | `oklch(0.972 0.005 265)` | — | toolbars, code blocks |
| `--line` | `oklch(0.912 0.007 265)` | — | hairlines |
| `--line-strong` | `oklch(0.858 0.01 265)` | — | section rules |
| `--ink` | `oklch(0.22 0.012 265)` | 17.3:1 | headings, primary text |
| `--ink-2` | `oklch(0.45 0.015 265)` | 7.4:1 | body floor |
| `--ink-3` | `oklch(0.52 0.012 265)` | 5.5:1 | lightest text allowed |
| `--brand` | `oklch(0.57 0.2 264)` | white on it = 4.64:1 | primary button, marks |
| `--brand-ink` | `oklch(0.47 0.17 264)` | 7.1:1 on white | links, hero's claim line |
| `--ok` / `--warn` / `--deny` | `oklch(0.5 0.13 158 / 68)` · `oklch(0.5 0.19 27)` | 4.9–6.6:1 | `allow` / `approve` / `deny` |
| `--dark-bg` | `oklch(0.185 0.018 265)` | — | the evidence band surface |
| `--on-dark` | `oklch(0.97 0.005 265)` | 17.1:1 | headings on dark |
| `--on-dark-2` | `oklch(0.8 0.012 265)` | 10.0:1 | body on dark |
| `--on-dark-3` | `oklch(0.72 0.012 265)` | 7.5:1 | lightest text on dark |
| `--brand-on-dark` | `oklch(0.72 0.15 264)` | 7.4:1 | links and accents on dark |
| `--ok-on-dark` | `oklch(0.78 0.15 158)` | 9.9:1 | the verified tick |

### Rules

- **The reference's blue was rejected as a fill.** DeepSeek's `#4D6BFE` reaches only
  4.09:1 against white text — it fails AA for a 15px button label. The brand token is the
  most vivid cobalt that still clears 4.5:1 (`#376ceb`, hue 264, within 10° of the
  reference). The vividness gap is paid back by the hero halo.
- **One accent, no second colour.** Saturated colour appears in exactly two places: the
  brand, and the three-state verdict vocabulary inherited from the product console.
- **Dark is a section, not a theme.** Only the evidence band inverts. Its colours are a
  re-derived set, not the light tokens dimmed — every verdict hue is lifted so it still
  clears 4.5:1 on near-black.
- **The three states always ship shape as well as colour.** `allow` = dot, `approve` =
  square, `deny` = rotated square, `unlisted` = dashed outline. A legend decodes them.
- No gradient text. No glassmorphism. No `border` + wide-shadow pairing.

## Typography

Two families, both self-hosted (latin subset, ~83 KB total). Chosen against the voice
words *precise, quiet, evidentiary*; the reflex pick (Geist) was rejected — it is the
current dev-tool monoculture.

- **UI:** `Schibsted Grotesk` (variable 400–900) → CJK falls through to `PingFang SC` /
  `Hiragino Sans GB` / `Microsoft YaHei` / `Noto Sans SC`.
- **Data:** `Spline Sans Mono` (variable 300–700) — commands, hashes, tool names, counts,
  and nothing else.

| Step | Size | Weight | Use |
|---|---|---|---|
| `--fs-display` | `clamp(2.6rem, 6vw, 5.25rem)` | 600 | h1 only |
| `--fs-h2` | `clamp(1.85rem, 3.2vw, 2.75rem)` | 600 | section headings |
| `--fs-h3` | `clamp(1.125rem, 1.5vw, 1.3rem)` | 600 | group headings |
| `--fs-lead` | `clamp(1.0625rem, 1.25vw, 1.1875rem)` | 400 | section ledes |
| `--fs-body` | `1.0625rem` | 400 | body, line-height 1.68 |
| `--fs-sm` | `0.9375rem` | 400/500 | dense rows, meta |
| `--fs-xs` | `0.8125rem` | 500 | labels, commands, badges |

Rules:

- Display letter-spacing floor is `-0.04em`; h1 uses `-0.03em`, headings `-0.026em`.
  No display size shouts — the ceiling is 5.25rem, under the 6rem cap.
- The hero h1 is two lines with an intentional hierarchy split: the setup line in `--ink`,
  the claim in `--brand-ink`. Volume contrast instead of both lines shouting.
- Body measure capped at 62–68ch; `text-wrap: balance` on h1–h3, `pretty` on prose.
- Latin is subset to `U+0000-00FF` + punctuation, so CJK always renders from the system
  stack — no Chinese webfont download, no blocked-CDN failure mode.
- **Two locales, both laid out.** English copy runs ~30% longer than Chinese; every
  breakpoint was re-checked with the page in English. Nothing truncates in either.

## Layout

- Container: `min(1200px, 100% - 2 × clamp(20px, 5vw, 48px))`. Narrow variant: 900px.
- Vertical rhythm: `--section-y: clamp(72px, 9vw, 136px)`, sections split by hairlines.
- Responsive grids use `repeat(auto-fit, minmax(min(Npx, 100%), 1fr))`. The `min()` is
  load-bearing: a bare `minmax(320px, 1fr)` sets a 320px floor that overflows any viewport
  below ~360px and pushes the whole document sideways.
- Asymmetry where it earns attention: section headers are a two-column flex row (heading
  left, lede right) rather than a centred stack.
- The dark band is full-bleed; everything else lives inside the container.
- **Page order is what → how → try → proof → compare → limits → start.** The
  capability overview sits directly under the hero. It used to sit fifth of
  eight, which put the feature list 4.3 screens down — a visitor could not tell
  what the tool does without scrolling past the entire pitch.
- Verified free of horizontal overflow and of clipped identifiers at 320 / 360 / 414 /
  480 / 600 / 768 / 900 / 1000 / 1040 / 1100 / 1200 / 1440 / 1920px, in both locales.

## Components

- **Compile visual** (`CompileVisual`) — the hero's one moment. 24 real capabilities run
  through the same `compileRule()` the CLI models; each chip resolves from `pending` to its
  verdict on a 26ms stagger, behind a single sweep band that crosses once. Before it
  resolves every chip is already readable, so the effect enhances rather than gates.
- **Evidence band** (`EvidenceBand`) — a six-link chain lighting in sequence, then a
  confirmation. The fingerprints are illustrative and the caption says so.
- **Capability overview** (`CapabilityMap`) — a tinted band of eight tiles on a
  six-column grid: two wide (span 3) and six plain (span 2), filling exactly three
  rows. The wide tiles carry a real micro-visual (three verdicts from the demo
  corpus, or a three-link chain); every tile ends on its command, which is the
  anchor a developer scans first. Below it, one line lists the remaining commands
  so the inventory is complete without a second wall of prose.
- **Product captures** (`ScreensSection`) — real screenshots of the console, never a
  drawing of one, laid out as a wide capture beside a narrow one on a 1.48:1 grid.
  A 1440px capture shown at 700px is unreadable, so every shot opens at full size in
  a native `<dialog>`; focus trapping, Escape-to-close and the inert background come
  from the platform rather than a library. Each `<img>` carries its intrinsic
  `width`/`height` so the section reserves space and does not jump as captures load.
- **Policy panel** (`PolicyPanel`) — the compiled artifact, a real `<table>` whose every
  row is computed, not drawn.
- **Verdict pill** (`VerdictPill`) — `--fs-xs`, mono, tinted, always paired with the word
  and a distinguishing glyph shape.
- **Copy field** (`CopyField`) — the command wraps rather than scrolling; the button shows
  a `已复制` / `Copied` state announced through `aria-live`.
- **Language toggle** (`LanguageToggle`) — a two-state pill with a sliding indicator;
  the document's `lang`, title and description follow it.
- **Demo list row** (`CompilerDemo`) — a real `<button>` with `aria-pressed`. Below 1040px
  the section stacks so the corpus column stays wide enough for the longest identifier;
  below 560px the row itself stacks identifier → count + verdict.
- Every interactive element ships default / hover / focus-visible / active states.

## Motion

- 140–200ms, `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out-quart). The hero sweep and the
  chain use `cubic-bezier(0.16, 1, 0.3, 1)`.
- **One signature moment, not a reflex.** Scroll reveals are reserved for lists and grids
  where sibling stagger carries real meaning (loop steps, capability groups, limit rows).
  Section headers and single blocks do not fade in. Only 15 elements on the page carry a
  reveal, down from 40 — the uniform entrance is the AI default, not a design decision.
- **Reveals enhance an already-visible default.** Content is visible in CSS; the `js`
  class is added only when motion is allowed and `IntersectionObserver` exists. A headless
  renderer, a hidden tab, or a JS failure therefore never ships a blank section.
- `prefers-reduced-motion: reduce` skips the `js` class and resolves every effect to its
  final state immediately: chips arrive coloured, the chain arrives verified.

## Bans carried from the skill

No side-stripe borders · no gradient text · no glassmorphism · no hero-metric template ·
no identical icon+title card grids · no tracked uppercase eyebrows · no numbered
scaffolding (the numbered sequences are real sequences) · no `border` + wide-shadow
pairing · no radii ≥ 24px · no sketchy SVG illustration · no `repeating-linear-gradient`
stripes.

`node .agents/skills/impeccable/scripts/detect.mjs` reports **zero** findings on this
codebase.
