---
name: micro-ui
description: >
  Build the small product visuals that sit beside feature copy in this Next.js project — live,
  looping React components by default, and generated images when the output has to be a file.
  Use for feature illustrations, micro UI cards, capability visuals, product mockups, use-case
  graphics, Open Graph images, route-local animation, reveal sequences, micro-interactions, and
  motion audits. Triggers on: micro ui, feature visual, feature card, marketing card, product
  shot, feature illustration, illustrate this feature, animated feature graphic, animated hero,
  OG image, social image. Preserve the project's design tokens, server-rendering boundary,
  use-case visual-ID mapping, reduced-motion fallback, accessibility, and launch checks.
---

# Micro UI

Build a small piece of product UI that demonstrates one feature. The default output is a **live
React component that loops**: motion is usually the point, because a static picture of a
dashboard says "we have a dashboard", while a number climbing and a feed streaming says "this
thing is running right now".

That default is not the only output. Some briefs need a file — a share card, a social preview, an
asset for a surface that cannot run JavaScript — and those paths are first-class here.

Keep the result in the route or image implementation that consumes it; do not start a visual
catalog.

## Choose the output first

Use the smallest durable format:

1. **Looping React component** for a feature visual that sits beside marketing copy. This is the
   default. Build it on the motion kit described below.
2. **Route-native React/CSS** for a visible page feature that does not need a loop, and for
   page-level motion — reveals, ambient background, micro-interactions. Start in that route's
   `_components` folder.
3. **Next.js `ImageResponse`** for Open Graph or other generated social images.
4. **Project-owned SVG** only when a reusable static asset is genuinely needed outside React.
5. **Raster generation** only when the brief needs photographic, painterly, or textured artwork
   that code cannot express well.

Do not create a standalone HTML demo, add Satori directly, or install a graphics dependency when
the existing Next.js stack can render the result.

## Before you build

### 1. Find the house style — do not invent one

The point of this skill is that a whole set feels like one system, and that the
system looks native to _this_ brand. Two things to establish before writing code:

**Is there already a kit here?** If so, extend it rather than starting over.

```bash
ls src/app/uses/\[slug\]/_components/visuals/_kit.tsx \
   src/app/uses/\[slug\]/_components/visuals/brand.ts 2>/dev/null
```

**What is this brand's palette?** Colour is the only brand-coupled part of the
kit and it lives in one file, `brand.ts`. Never pick a hex that the project
does not already use.

```bash
grep -n "^\s*--" src/app/globals.css | head -60   # semantic tokens
ls src/app/uses/\[slug\]/_components/              # existing use-case visuals
```

Then look at the actual homepage — the token block lists what exists, the pages
show what is _used_, and the visuals have to sit next to it.

Read as well:

- the consuming route and its content source;
- the closest existing visual component;
- `references/motion-system.md` for the kit's API and the timing rules;
- `references/motion-patterns.md` to pick a motion pattern;
- `references/visual-modes.md` to choose a structure for still output;
- `references/project-boundaries.md` for this template's file and verification rules;
- **at least one** example in `references/examples/` before writing code.

**Porting to a new company or repo: read `references/brand-adoption.md` first.**
It is the whole procedure — prerequisites, what to fill into `brand.ts`, how to
handle a repo with no tokens or a dark-first brand, and what must stay
identical across brands.

### 2. Read the whole set before designing any one visual

You are choosing motion patterns for a _set_. Read every feature first, then assign patterns so
that **no two visuals in the set move the same way**. A set where three cards all fade a list in
from the left reads as one lazy template applied three times, which is exactly the failure this
skill exists to avoid.

Large JSON: pull only what you need first.

```bash
jq '[.capabilities[] | {visualId, category, title, highlights, description}]' \
  src/content/use-cases/*.json
```

### 3. Extract the visual claim

Write one sentence describing what the visual must prove. Map each visible label, state, or
metric to real route content. Do not invent customer names, results, integrations, dates, or
performance numbers.

## The rule that makes the set work

Each use-case capability carries a **stable `visualId`** — not the page, not the heading. That id
selects the visual, through the project's bounded typed resolver. Same capability, same visual,
everywhere it appears. A new page written later gets its visual for free.

Adding one means:

- add the id to `USE_CASE_VISUAL_IDS` in `src/lib/use-cases.ts`;
- populate the exhaustive `Record<UseCaseVisualId, UseCaseVisualSource>` in
  `use-case-visual.tsx` so TypeScript catches a missing source;
- use a `kind: "component"` source for route-local React and a `kind: "image"` source for an
  approved local file;
- keep copy in the content file or route, not inside a generic registry.

Do not add a second registry, a `FEATURE_VISUALS` map, or component names, paths, classes, or
props in JSON. The `/uses` resolver is the only intentional ID-to-visual map in this project.

## Motion rules

Non-negotiable, because consistency is what makes a set feel designed:

- **One loop per visual**, 7–9s. Phases advance on a single interval; a `cycle` counter bumps on
  wrap and is used as a React `key` to replay entry animations declaratively.
- **One entry gesture: blur-rise.** `opacity 0→1`, `y 10→0`, `blur(6px)→0`, expo-out
  `cubic-bezier(0.22, 1, 0.36, 1)`, staggered ~140ms.
- **Spring overshoot is reserved for state changes** — a badge landing, a tick stamping, a row
  re-ranking. Never for plain entrances. Overshoot everywhere reads as bouncy, not precise.
- **Nothing animates off-screen.** Gate on `useInView`.
- **Reduced motion holds the resolved state.** Not the empty state — the finished one. A user
  with the preference set should see the payoff, just not the movement. The no-motion state must
  be intentionally composed, not merely a one-frame animation.
- **Numbers count, they don't cut.** Write to the DOM through a motion value so a 60fps count
  never re-renders the tree.
- **No hover states, no click targets.** These are illustrations; they are not operable.

### Composing the reduced-motion state

- render the final state immediately;
- remove looping transforms;
- retain borders, labels, icons, and other non-motion state cues;
- avoid replacing an animation with a flash or abrupt opacity change;
- test the actual media query, not only a code review.

### Server-first baseline

A visual is an enhancement. It never becomes the only carrier of meaning:

- keep the component server-renderable unless interaction or a loop truly needs a Client Component;
- isolate an interactive or looping `/uses` visual in its own `*.client.tsx` module; do not make
  the visual resolver a Client Component;
- keep critical copy, links, and controls in server-rendered HTML, visible and usable without
  JavaScript;
- duplicate explanatory content should be `aria-hidden="true"`;
- meaningful standalone imagery needs useful alternative text;
- reserve layout space before animation starts; never gate navigation, form access, or meaning
  behind a timeline.

## Choosing a motion pattern

`references/motion-patterns.md` catalogues the twenty patterns already built, what each is for,
and which component demonstrates it. Use it to pick, then check the set for duplicates.

Selection process:

1. Read all features in the set.
2. For each, name **three** candidate patterns — most features can be shown more than one way.
3. Assign across the whole set so every visual moves differently. Vary the _container_ too:
   card, console, chart, diagram, orbit, dial, timeline, transcript.
4. Ask of each: **what changes on screen, and does that change carry the claim?** If the answer
   is "things fade in", the pattern is wrong. "A masked field masks itself", "a queue re-ranks",
   "a rail draws to go-live" — those carry a claim.

For page-level motion that is not a kit visual — a section reveal, an ambient background, a
disclosure transition — prefer CSS transitions and keyframes, and keep the timings in
`references/motion-system.md`; it is the single source for motion timing in this project. State
the purpose of the motion in one sentence. If removing the animation changes nothing about
comprehension, keep it subtle or skip it.

## Choosing a mode for still output

When the output is a generated image, an SVG, or a component that does not loop, pick a
structure from `references/visual-modes.md`.

Shortlist three modes, then choose the one that communicates the claim most directly and differs
from nearby visuals. Avoid repeating the same card/dashboard structure throughout a page.

Apply the project visual language:

- use the semantic colors from `globals.css`; do not introduce a second palette;
- preserve the serif display/sans body relationship where applicable;
- keep labels short enough to survive mobile layouts and image rendering;
- prefer Lucide or existing project icons for route-native visuals.

## Writing the component

```tsx
"use client";

import { motion } from "framer-motion";
import {
  LiveBadge,
  Plate,
  PlateHead,
  TONES,
  useLoop,
  VisualFrame,
} from "./_kit";

/** One line on what the loop actually shows — this is the design brief, keep it. */
export default function ThingName() {
  const { ref, phase, cycle, running } = useLoop(6, 1250);

  return (
    <VisualFrame innerRef={ref}>
      <Plate>
        <PlateHead title="…" badge={<LiveBadge tone="green">LIVE</LiveBadge>} />
        {/* phase-driven content */}
      </Plate>
    </VisualFrame>
  );
}
```

Rules that come up every time:

- `useLoop(phases, phaseMs)` owns the in-view ref, reduced-motion handling and the cycle counter.
  Do not roll your own interval.
- Drive discrete state from `phase` (`phase > i`), continuous state from a `key={cycle}` plus an
  `initial`/`animate` pair. Mixing the two arbitrarily is what makes loops stutter.
- `<text>` in SVG cannot contain HTML. To put a counter in the middle of a ring, overlay an
  absolutely-positioned `<span>` on the SVG instead.
- Clip any streaming list with a fixed height and `overflow-hidden`, and make the height match
  `rows × row height` — a feed that overflows its box is the most common bug here.
- Keep the plate ≤ 420px wide. These sit beside copy in a two-column block, not full-bleed.

## Writing a generated image

For `ImageResponse`:

- keep dimensions explicit, normally 1200×630 for Open Graph;
- use literal color values, not `var(--token)` and not `brand.ts` — the image renderer cannot
  resolve CSS variables. Read the current value out of `globals.css` and inline it, the way
  `src/app/opengraph-image.tsx` already does, and re-check it when a client swaps the palette;
- use inline values that the image renderer supports reliably;
- use flex layouts instead of CSS Grid;
- keep the headline readable at small share-card sizes;
- include the real site name and a clear visual motif, not a screenshot of an entire page;
- omit claims that are not visible or verified elsewhere.

## Content

Real content, always. Real plan names, real objection text, real currency, real language mix.
Every highlight in the feature copy should map to something visible in the component — turn it
into a UI element rather than restating it as a label.

Numbers must be plausible and internally consistent (a funnel that starts at 1,000 does not end
at 1,200).

**Never replace a missing client value with a believable fictional value.** When a real value is
not available, use a `TODO_CLIENT_*` sentinel and leave the matching item in
`docs/launch/checklist.json` as `todo`. An invented figure that reaches a public page is a launch
defect, not a placeholder.

## Verify the real output

- render or open the consuming route;
- inspect desktop and mobile crops;
- emulate `prefers-reduced-motion: reduce` and confirm the resolved state is composed, not blank;
- test keyboard focus and touch behavior on any interactive neighbour;
- confirm no content or link disappears without JavaScript;
- check for layout shift and excessive main-thread work;
- inspect the generated OG endpoint at its final dimensions when applicable;
- confirm all visual IDs still resolve in both hero and capability placements;
- check that core copy remains in server-rendered HTML;
- walk the per-visual checklist at the end of `references/motion-system.md` for animated output;
- run `pnpm check`, `pnpm build`, and the applicable launch audit.

## What not to do

- No dark plates — these sit on white/cream sections and are drawn as light cards
- No gradient container backgrounds, no glow, no glassmorphism
- No emoji, no stock illustration, no external images
- No two visuals in a set moving the same way
- No motion that outlasts its meaning — when the loop's story is told, reset
- No Satori dependency added directly; `ImageResponse` is the supported path
- No standalone HTML prototype shipped as the production implementation
- No GSAP, Lottie, Rive, Three.js, or CDN scripts
- No perpetual spinning, bouncing, or pulsing near long-form copy
- No animating every section with the same reveal
- No useful content hidden until a scroll observer runs

## Guardrails

- Do not add `site.json`, a site-wide image/block registry, serialized React props, or
  speculative visual variants. The bounded `/uses` visual resolver is the only intentional
  ID-to-visual map.
- Do not add unused example components to production code. `references/examples/` is the quality
  bar, not content to ship.
- Do not use an external image when a small route-native diagram communicates the point better.
- Do not put essential meaning only inside a decorative visual.
- Do not create five nearly identical cards and call them a visual system.
- Do not copy motion values or brand colors from a source template without remapping them
  through this project's token boundary.
