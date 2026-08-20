# Next.js Client Launch Template

A lean starting point for client migrations, rebuilds, and new startup sites. The template reuses launch discipline—not a runtime page builder.

## Start here

1. Read [`docs/launch/checklist.md`](docs/launch/checklist.md). It is the canonical launch and technical SEO guide.
2. Use [`docs/features.md`](docs/features.md) during project kickoff. Default features are normal code: delete them when unused instead of adding flags.
3. For an existing site, begin with [`docs/launch/migration.md`](docs/launch/migration.md) and [`docs/launch/url-map.csv`](docs/launch/url-map.csv).
4. Record project decisions and launch evidence in [`docs/launch/status.md`](docs/launch/status.md).
5. Keep [`PLAN.md`](PLAN.md) for the architecture audit and page-by-page roadmap.

## Development

Requirements: Node.js 20.9+ and pnpm 10.

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Quality checks:

```bash
pnpm check
pnpm build
pnpm launch:audit --url http://localhost:3000 --mode template
```

Before production, configure the real identity and run:

```bash
pnpm launch:audit --url https://example.com --mode production
```

The production audit rejects the `Launch Template` identity, `TODO_CLIENT_*` sentinels, inherited legacy brands, broken internal links, production crawl blocks, sitemap drift, and missing priority metadata.

## Current implementation

- Phase 0 foundation: implemented.
- Phase 1 homepage: implemented.
- shadcn/ui: configured with the `base-nova` style; only the Button, Card, and Badge primitives used by current pages are checked in.
- PostHog: included through `src/instrumentation-client.ts`; add its token to activate it or delete the file and dependency.
- Privacy and terms: safe noindex scaffolds only. They deliberately block production until replaced and reviewed.
- Uses: the grouped `/uses` hub and four JSON-backed detail pages are implemented; adding a content file automatically adds its validated route and sitemap entry.
- Blog: planned as a default surface for its page-by-page phase; it will be a folder to delete, not a feature flag.

## Architecture rules

- Build explicit App Router pages.
- Keep page copy and composition in or beside the route.
- Promote a route-local component only after real reuse.
- Keep metadata and applicable structured data together in `src/lib/seo.ts`.
- Keep shadcn primitives in `src/components/ui`; add a component only when a current page uses it.
- Never introduce `site.json`, a marketing catch-all renderer, or a block registry.
- Do not ship plausible placeholder client details. Use loud sentinels that the audit can reject.

## Configuration

Global identity and navigation live in `src/config/site.ts`; environment parsing lives in `src/config/env.ts`. Email and social links are optional. Page content does not belong in global config.

Set `NEXT_PUBLIC_DEPLOYMENT_ENV` deliberately:

- `local`: robots disallows crawling.
- `preview`: robots disallows crawling.
- `production`: robots allows the public site and publishes the sitemap URL.

This environment value is a deployment safety control, not a feature flag.
