# Launch assets

Use launch assets when a marketplace listing, campaign, deck, or announcement should reuse the
same product visuals as the website. They are browser screenshots of a gated React route, not a
second illustration system.

## File map

- Workspace access: `src/app/dev/layout.tsx`
- Asset data: `src/app/dev/launch-assets/_lib/launch-assets.ts`
- Frame composition: `src/app/dev/launch-assets/_components/launch-frame.tsx`
- Gallery: `src/app/dev/launch-assets/_components/launch-asset-gallery.tsx`
- Route: `src/app/dev/launch-assets/page.tsx`
- Exporter: `scripts/launch-assets.mjs`
- Generated output: `artifacts/launch-assets`
- Long-form project workflow: `docs/recipes/launch-assets.md`

## Access model

The whole `/dev` tree is deny-by-default. It exists only for the exact server-only value:

```bash
VISUAL_REVIEW_ENABLED=true pnpm dev
```

`.env.example` sets that value for copied local configuration. Do not add a `NEXT_PUBLIC_`
version, infer access from `NODE_ENV`, or configure the allow value on a public deployment. The
exporter passes it only to its temporary local production server.

## Add or change a frame

1. Read every frame in the set before designing one.
2. Use real project positioning and proof. Use `TODO_CLIENT_*` for an unresolved client fact.
3. Add or edit one typed entry in `_lib/launch-assets.ts`.
4. Select a reusable illustration with a validated `visualId`; do not import a component into the
   data or create another ID-to-component map.
5. Keep the frame composition in `launch-frame.tsx`. Add a second explicit composition only when
   a real channel requires a materially different format.
6. Review the ordinary animated gallery at `/dev/launch-assets` and the underlying set at
   `/dev/visuals`.
7. Export and inspect the exact PNGs.

The exporter discovers frames from `data-launch-asset`, `data-export-width`, and
`data-export-height` on the rendered article. Do not parse TSX source or maintain a second asset
ID list in the script.

## Export

```bash
pnpm launch:assets
pnpm launch:assets -- --only migration-system
pnpm launch:assets -- --skip-build
```

The command builds the production app unless `--skip-build` is supplied, starts temporary local
servers, discovers frames from rendered DOM attributes, and exports every full-set frame in its
own isolated Chrome process and profile. Each renderer emulates `prefers-reduced-motion: reduce`,
waits for fonts/images/hydration, forces one settled composite, and captures the asset by its
exact DOM bounds. Output remains in the ignored `artifacts/launch-assets` folder.

The separate browser process, isolated `--user-data-dir`, settled composite, and reduced-motion
emulation are load-bearing. Removing them can yield blank or partially painted screenshots when
Chrome reuses work from a related page, or can catch a loop halfway through its claim.

## Do not use ImageResponse for this path

`ImageResponse` is the preferred path for purpose-built Open Graph cards, but it cannot reuse the
full Tailwind, CSS-module, browser, and Framer Motion implementation of project visuals. Launch
assets use the browser exporter for fidelity. Keep OG composition in route-colocated
`opengraph-image.tsx` files and use only the CSS subset supported by that renderer.

## Verification

- Missing or non-exact `VISUAL_REVIEW_ENABLED` returns 404 for the entire `/dev` tree.
- Every frame has a unique kebab-case ID and integer dimensions.
- Copy and proof are real and traceable to project content.
- The ordinary gallery animates where appropriate.
- Reduced-motion emulation shows the resolved state rather than an empty visual.
- Every PNG has the declared dimensions and a nonblank composition.
- Generated output is not copied to `public` unless a public route genuinely consumes it.
- `pnpm check`, `pnpm build`, and the applicable live audit pass.
