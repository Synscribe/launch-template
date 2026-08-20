# Agent instructions

## Sources of truth

- Launch and technical SEO requirements: `docs/launch/checklist.md`
- Current project evidence and exceptions: `docs/launch/status.md`
- Feature defaults and deletion paths: `docs/features.md`
- Migration workflow and URL mapping: `docs/launch/migration.md`, `docs/launch/url-map.csv`
- Architecture and phased plan: `PLAN.md`

Do not create a second SEO guide or checklist. Add rationale, code references, and verification steps to the canonical checklist so they cannot diverge.

## Architecture

- Use explicit Next.js App Router pages.
- Keep route-specific copy, metadata, and composition with the route.
- Start components in the route's `_components` folder. Promote them only after a second real use.
- Keep metadata and applicable structured-data builders in `src/lib/seo.ts`.
- Do not add `site.json`, a marketing catch-all route, an SDUI renderer, a block registry, or schemas for serialized React props.
- Use-case JSON may reference only validated `visualId` values. Add React or local-file sources through the bounded route-local `UseCaseVisual` resolver; do not put component names, paths, classes, or props in JSON.
- PostHog, blog, and use cases are default deletable code. Do not add feature flags to turn them on or off. Remove their files, navigation, sitemap entries, tests, dependencies, and documentation when a project does not use them.
- Do not install a CMS, docs framework, content sync, animation library, or component catalog until the current project requires it.

## Launch safety

- Never replace a missing client value with a believable fictional value.
- Use a `TODO_CLIENT_*` sentinel for unresolved production content and record an owner in `docs/launch/status.md`.
- Contact email and social profiles are optional. If absent, omit their UI entirely.
- Preview/local deployments must stay non-indexable. Production must be explicitly configured as production.
- Migration work starts with the URL map before routes or redirects are changed.

## UI work

- Bespoke page composition is expected.
- Preserve the token boundary in `src/app/globals.css` when importing a client design system.
- Keep critical copy and links in server-rendered HTML.
- Animation must retain visible content without JavaScript and handle `prefers-reduced-motion`.
- Avoid adding unused primitives or speculative reusable sections.

## Before completing work

Run and fix:

```bash
pnpm check
pnpm build
```

For page or launch work, also run the appropriate live audit:

```bash
pnpm launch:audit --url http://localhost:3000 --mode template
```

Before production, run the same audit against the deployed production URL with `--mode production` and attach evidence to `docs/launch/status.md`.
