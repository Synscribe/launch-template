# Visual review and launch assets

The internal visual workspace makes the project illustrations reviewable as one set and exports
launch, marketplace, deck, or campaign PNGs from the same React components used by the site. It
is development tooling, not a public product route.

## Access and safety

The complete `/dev` tree is deny-by-default. It returns 404 unless the server receives the exact
server-only value:

```bash
VISUAL_REVIEW_ENABLED=true pnpm dev
```

`.env.example` sets that value so a copied local configuration exposes the tools. The routes do
not infer access from `NODE_ENV` or `NEXT_PUBLIC_DEPLOYMENT_ENV`, and the value must not use a
`NEXT_PUBLIC_` prefix. Do not configure it on a public deployment.

The shared `src/app/dev/layout.tsx` owns the access check and noindex metadata for:

- `/dev`: workspace index;
- `/dev/visuals`: every registered project visual and its content placements;
- `/dev/launch-assets`: the export-ready frame gallery.

The routes stay out of public navigation and sitemap. Production robots policy also disallows
`/dev/`; access still depends on the server-only allow value rather than robots behavior.

## One visual source map

Reusable illustrations have one implementation boundary:

- IDs and the `VisualId` type: `src/lib/visuals.ts`
- Exhaustive ID-to-source map and renderer: `src/components/visuals/project-visual.tsx`
- React implementations: `src/components/visuals`
- Use-case placement wrapper: `src/app/uses/[slug]/_components/use-case-visual.tsx`
- Visual inventory: `src/app/dev/visuals/page.tsx`

Use cases, the inventory, and launch assets all consume that one resolver. Do not add a separate
feature-visual map. Content JSON may select only a validated `visualId`; it never receives a
component name, path, class, layout, or serialized React props.

The inventory shows the source kind, placeholder/project status, named motion pattern, and every
current use-case placement derived from the real content files. Review the ordinary state there,
then use browser emulation to inspect `prefers-reduced-motion: reduce` separately.

## Launch frame sources

The launch set lives with its route:

- Copy, IDs, dimensions, proof, tones, and `visualId`: `src/app/dev/launch-assets/_lib/launch-assets.ts`
- Frame composition: `src/app/dev/launch-assets/_components/launch-frame.tsx`
- Gallery composition: `src/app/dev/launch-assets/_components/launch-asset-gallery.tsx`
- Gallery/single-frame route: `src/app/dev/launch-assets/page.tsx`

The included entries are Launch Template examples marked
`TEMPLATE_PLACEHOLDER_LAUNCH_ASSETS`. Replace or remove them before a client launch. Use only
real, approved positioning and proof. If a needed client value is unresolved, use a
`TODO_CLIENT_*` sentinel and leave the applicable checklist item `todo`; never fill the image
with plausible fiction.

To add a frame:

1. Read the complete launch set and the current `/dev/visuals` inventory.
2. Extract one claim the frame must prove.
3. Add a unique lowercase kebab-case ID and integer dimensions.
4. Keep the headline short enough for the declared frame and use three brief proof chips.
5. Select a validated `visualId` whose visible state actually supports the claim.
6. Preview the gallery and the single-frame URL:

   ```text
   /dev/launch-assets
   /dev/launch-assets?asset=search-foundation
   ```

7. Export and inspect the exact PNG rather than approving only the browser source.

Add another explicit frame composition only when a real channel needs a materially different
layout. Do not build an asset block renderer or serialize layout props.

## Export

Requirements: a successful project build and Google Chrome or Chromium. Set `CHROME` only when
the executable is not in a standard location.

```bash
pnpm launch:assets
pnpm launch:assets -- --only migration-system
pnpm launch:assets -- --skip-build
CHROME=/absolute/path/to/chrome pnpm launch:assets
```

The exporter:

1. builds the production app unless `--skip-build` is present;
2. starts a temporary local `next start` with `VISUAL_REVIEW_ENABLED=true` only for the exporter child;
3. discovers IDs and dimensions from rendered `data-launch-asset` attributes;
4. renders every frame in its own isolated Chrome process, temporary profile, and random local ports so Chromium cannot reuse a stale paint layer from a related frame;
5. emulates `prefers-reduced-motion: reduce` before navigation;
6. waits for the document, fonts, images, hydration, and settled animation frames;
7. forces one settled frame composite, then captures the exact asset element bounds rather than the surrounding site shell;
8. validates the PNG signature and dimensions;
9. writes files to the ignored `artifacts/launch-assets` directory and shuts everything down.

Do not collapse the full export back into one shared browser process, and do not remove the
isolated profile, settled composite, or reduced-motion emulation. Those safeguards prevent
exports that look successful while omitting a paint layer or catching a visual halfway through
its motion state.

Generated files are deliverables, not website runtime assets. Do not automatically copy them to
`public`. If a public route genuinely consumes one, move that approved file intentionally under
`public/media`, register its real consumer, and review it through `IMAGE-01`.

## Open Graph images use a different renderer

Keep purpose-built Open Graph cards in route-colocated `opengraph-image.tsx` files using Next.js
`ImageResponse`. That path is appropriate for dynamic per-page titles and simple flexbox-based
social compositions. It does not support the full Tailwind, CSS-module, browser, and Framer
Motion implementation of project visuals, so launch assets use Chrome for fidelity instead of
maintaining a second ImageResponse copy.

When multiple route-specific OG images exist, `/dev` may gain a separate OG endpoint inventory.
Do not add it before there is a second real generated card to review.

## Checklist and verification

Relevant checklist IDs are `BRAND-01`, `BRAND-02`, `SOCIAL-01`, `A11Y-01`, and `IMAGE-01`.

Before approval:

- confirm missing, false, uppercase, or public-looking allow values still return 404;
- confirm `/dev` routes have noindex metadata and are absent from navigation and sitemap;
- review every visual at desktop and narrow widths;
- emulate reduced motion and confirm animated visuals show their resolved state;
- export every frame and inspect its copy, crop, font rendering, logo/identity, and exact size;
- run `pnpm check`, `pnpm build`, and the applicable live launch audit.

## Remove launch assets or the workspace

To remove only launch export while keeping the visual inventory:

1. Delete `src/app/dev/launch-assets` and `scripts/launch-assets.mjs`.
2. Remove `launch:assets` from `package.json`.
3. Remove the `ws` development dependency if nothing else uses it.
4. Remove launch-asset references from this recipe, `README.md`, `docs/features.md`, `AGENTS.md`,
   and `.agents/skills/micro-ui`.

To remove the entire visual workspace as well:

1. Delete `src/app/dev`.
2. Remove `VISUAL_REVIEW_ENABLED` from `.env.example`.
3. Remove `/dev/` from the production robots disallow list if no other internal route uses it.

Keep `src/components/visuals`, `src/lib/visuals.ts`, and the `UseCaseVisual` wrapper while the site
still uses registered visuals. Update `docs/launch/checklist.json`, run
`pnpm launch:checklist --write`, then run the full verification commands after removal.
