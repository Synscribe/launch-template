---
name: micro-ui
description: Create compact, marketing-ready product and process visuals inside this Next.js project. Use for feature illustrations, micro UI cards, product mockups, Open Graph images, visual explanations, or use-case graphics. Prefer route-native React/CSS or Next ImageResponse over disconnected assets, and preserve the project's design tokens, server-rendering boundary, use-case visual-ID mapping, accessibility, and launch checks.
---

# Micro UI

Create one useful visual that makes the surrounding claim easier to understand. Keep it in the route or image implementation that consumes it; do not start a visual catalog.

## Choose the output first

Use the smallest durable format:

1. **Route-native React/CSS** for a visible page feature. Start in that route's `_components` folder.
2. **Next.js `ImageResponse`** for Open Graph or other generated social images.
3. **Project-owned SVG** only when a reusable static asset is genuinely needed outside React.
4. **Raster generation** only when the brief needs photographic, painterly, or textured artwork that code cannot express well.

Do not create a standalone HTML demo, add Satori directly, or install a graphics dependency when the existing Next.js stack can render the result.

## Read before drawing

Read:

- the consuming route and its content source;
- `src/app/globals.css` for semantic tokens;
- the closest existing visual component;
- `references/visual-modes.md` to choose a structure;
- `references/project-boundaries.md` for this template's file and verification rules.

For a set, read every feature summary first. Assign structurally different modes before implementing any item.

## Workflow

### 1. Extract the visual claim

Write one sentence describing what the visual must prove. Map each visible label, state, or metric to real route content. Do not invent customer names, results, integrations, dates, or performance numbers.

### 2. Pick a mode

Shortlist three modes, then choose the one that communicates the claim most directly and differs from nearby visuals. Avoid repeating the same card/dashboard structure throughout a page.

### 3. Apply the project visual language

- Use the semantic colors from `globals.css`; do not introduce a second palette.
- Preserve the serif display/sans body relationship where applicable.
- Keep labels short enough to survive mobile layouts and image rendering.
- Use whitespace, hierarchy, and one accent rather than decorative density.
- Prefer Lucide or existing project icons for route-native visuals.

### 4. Implement at the consuming boundary

For route visuals:

- keep the component server-renderable unless interaction truly needs a Client Component;
- isolate an interactive `/uses` visual in its own `*.client.tsx` module; do not make the visual resolver a Client Component;
- duplicate explanatory content should be `aria-hidden="true"`;
- meaningful standalone imagery needs useful alternative text;
- on `/uses`, select hero and capability visuals through the validated `visualId` and register the source in `use-case-visual.tsx`;
- use a `kind: "component"` source for route-local React and a `kind: "image"` source for an approved local file;
- keep copy in the content file or route, not inside a generic registry.

For `ImageResponse`:

- keep dimensions explicit, normally 1200×630 for Open Graph;
- use inline values that the image renderer supports reliably;
- use flex layouts instead of CSS Grid;
- keep the headline readable at small share-card sizes;
- include the real site name and a clear visual motif, not a screenshot of an entire page;
- omit claims that are not visible or verified elsewhere.

### 5. Verify the real output

- render or open the consuming route;
- inspect desktop and mobile crops;
- inspect the generated OG endpoint at its final dimensions when applicable;
- confirm all visual IDs still resolve in both hero and capability placements;
- check that core copy remains in server-rendered HTML;
- run `pnpm check`, `pnpm build`, and the applicable launch audit.

## Guardrails

- Do not add `site.json`, a site-wide image/block registry, serialized React props, or speculative visual variants. The bounded `/uses` visual resolver is the only intentional ID-to-visual map.
- Do not add unused example components to production code.
- Do not use an external image when a small route-native diagram communicates the point better.
- Do not put essential meaning only inside a decorative visual.
- Do not create five nearly identical cards and call them a visual system.
- Do not animate through this skill; use `$animated-ui` when motion materially helps.
