# Next.js Client Launch Template

A lean starting point for client migrations, rebuilds, and new startup sites. The template reuses launch discipline—not a runtime page builder.

## Start here

1. Work through the readable [`docs/launch/checklist.md`](docs/launch/checklist.md). Its source and current state live in [`docs/launch/checklist.json`](docs/launch/checklist.json).
2. Use [`docs/features.md`](docs/features.md) during project kickoff. Default features are normal code: delete them when unused instead of adding flags.
3. For an existing site, begin with [`docs/launch/migration.md`](docs/launch/migration.md) and [`docs/launch/url-map.csv`](docs/launch/url-map.csv).
4. Update a check with `pnpm launch:checklist --set <ID> <todo|done|not_applicable>`.
5. Add a client-specific check with `pnpm launch:checklist --add-project <ID> <P0|P1|P2> <title> --detail <Markdown>`.
6. Keep [`PLAN.md`](PLAN.md) for the architecture audit and page-by-page roadmap.

## Development

Requirements: Node.js 20.9+ and pnpm 10.

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Quality checks:

```bash
pnpm launch:checklist
pnpm check
pnpm build
pnpm launch:audit --url http://localhost:3000 --mode template
```

Launch commands have separate jobs:

- `pnpm launch:checklist` displays manual progress and identifies automated items. Its `--set`, `--add-project`, `--write`, and `--check` options manage or validate the canonical checklist.
- `pnpm launch:verify` executes every named check whose checklist status is `auto`. It needs no running website and exits non-zero when a check fails.
- `pnpm launch:audit` runs those automated checks plus live crawling, route, metadata, indexability, sitemap, and production-safety checks against a URL.
- `pnpm indexnow:key` creates or rotates a site's IndexNow ownership key and root-level public verification file.

`pnpm check` includes `pnpm launch:checklist --check` so invalid checklist data or stale generated Markdown fails normal CI. It does not run `pnpm launch:verify`, because the base template intentionally contains marked placeholders until a client replaces them.

Before production, configure the real identity and run:

```bash
pnpm launch:verify
pnpm launch:audit --url https://example.com --mode production
```

`pnpm launch:verify` runs every checklist item whose status is `auto`; it exits non-zero while any named check fails. The production audit runs those functions alongside live route, metadata, indexability, and sitemap checks. It also fails while any manual P0 item remains `todo`.

## Current implementation

- Phase 0 foundation: implemented.
- Phase 1 homepage: implemented with one `/contact` action, a stack trust bar, shared positioning sentence, reordered existing sections, FAQ, and close. Customer-proof sections stay omitted until real inputs exist; see `docs/recipes/homepage.md`.
- shadcn/ui: configured with the `base-nova` style; only the Button, Card, and Badge primitives used by current pages are checked in.
- PostHog: included through `src/instrumentation-client.ts`; add its token to activate it or delete the file and dependency.
- Privacy and terms: safe noindex scaffolds only. They deliberately block production until replaced and reviewed.
- Uses: the grouped `/uses` hub and four JSON-backed detail pages are implemented. Heroes and capability rows share one validated `visualId` contract that resolves project React visuals or owned images through the shared resolver and thin `UseCaseVisual` wrapper; see `docs/recipes/use-cases.md`.
- Visual workshop and launch assets: an exact server-only allow value exposes `/dev`, the full `/dev/visuals` inventory, and three template launch frames at `/dev/launch-assets`. `pnpm launch:assets` builds the production app and exports exact reduced-motion PNGs to `artifacts/launch-assets`; see `docs/recipes/launch-assets.md`.
- Blog: connected directly to Wisp with a configurable lead story, real-tag filters, compact search, numbered pagination, article contents/share links, related posts, RSS, and sitemap entries. Replace the demo publication ID or delete the blog for a client project.
- Contact: server-rendered page and form markup with bounded API validation, explicit SMTP delivery, minimized first/recent-touch attribution, basic abuse controls, optional Cloudflare Turnstile, and a clean removal path. Delivery stays unavailable until every server-only mail value is configured; Turnstile stays inactive until both of its keys are configured.
- `llms.txt`: a complete website-level example selling Launch Template, conditional homepage `Link` discovery header, focused source validator, production header/response/public-target audit, and configuration/removal recipe are included. Deleting `public/llms.txt` removes the discovery header rule on the next build or server start. `pnpm launch:verify` deliberately fails until the example is replaced for the client.
- Project skills: `$site-clone` and `$micro-ui` live in `.agents/skills`. Claude discovers the same files through `.claude/skills` symlinks, so edit only the canonical `.agents` copies.

## Architecture rules

- Build explicit App Router pages.
- Keep page copy and composition in or beside the route.
- Promote a route-local component only after real reuse.
- Keep metadata and applicable structured data together in `src/lib/seo.ts`.
- Keep shadcn primitives in `src/components/ui`; add a component only when a current page uses it.
- Never introduce `site.json`, a marketing catch-all renderer, or a block registry.
- Do not ship plausible placeholder client details. Use loud sentinels that the audit can reject.

## Project skills

- `$site-clone` inventories an authorized source site, maps exact URLs and wildcard page families, migrates original assets, reproduces visible widgets, journals functional gaps, and drives a screenshot/diff loop through homepage approval before other routes.
- `$micro-ui` builds route-native interface visuals, route-local motion, local use-case images, generated social images, and browser-exported launch assets. Looping capability visuals use its shared framer-motion kit; page-level motion stays CSS-first. Server-rendered content stays visible without JavaScript and every animation has a composed reduced-motion state. Reusable visuals resolve through one bounded typed map shared by `/uses`, the gated inventory, and launch assets instead of a site-wide block registry.

The `.claude/skills/*` entries are symlinks to `.agents/skills/*`. Keep the names aligned and validate both the canonical skill and its symlink after changing one.

## License

The template code is available under the [MIT License](LICENSE).

## Configuration

Global identity and navigation live in `src/config/site.ts`; `src/config/env.ts` parses the deployment-specific site URL and Wisp publication ID. Page content does not belong in global config.

Set the server-only `WISP_BLOG_ID` to the publication used by `/blog`. Featured content and optional filters are declared in `src/app/blog/blog.config.ts`. See [`docs/recipes/blog.md`](docs/recipes/blog.md) for configuration and complete removal steps.

Set all `MAIL_*` values and `CONTACT_TO_EMAIL` to activate `/contact`; none may use a `NEXT_PUBLIC_` prefix. The default stores only first-touch campaign fields and five recent same-site paths, and sends no form values to PostHog. See [`docs/recipes/contact.md`](docs/recipes/contact.md) for privacy decisions, verification, and removal.

Set both `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and server-only `TURNSTILE_SECRET_KEY` to add Cloudflare Turnstile to the contact form. With either value absent, the widget script is not loaded and server verification is skipped. See [`docs/recipes/turnstile.md`](docs/recipes/turnstile.md) for the reusable file map and setup flow.

Set server-only `VISUAL_REVIEW_ENABLED=true` to expose `/dev`, `/dev/visuals`, and `/dev/launch-assets`. `.env.example` enables it for copied local configuration; do not set it on a public deployment. The exporter supplies it only to its temporary local server.

`robots.txt` always allows public routes and publishes the sitemap URL. It
blocks only `/api/` and `/dev/`. Protect private previews with deployment
access controls instead of a site-wide robots block.
