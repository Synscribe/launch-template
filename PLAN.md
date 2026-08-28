# Next.js Client Launch Template — Architecture and Delivery Plan

Status: foundation, homepage, contact, use cases, Wisp blog, and the first visual skills implemented. This document remains the architecture and phased roadmap.

This document defines the template's architecture, documentation contract, launch priorities, and page-by-page build order.

## 1. Intended outcome

Build a small Next.js starting point for three kinds of work:

1. Rebuild an existing client site while preserving its important URLs and search equity.
2. Migrate an existing site with minimal visual or content change.
3. Launch a new company or startup site from scratch.

The reusable value should live in:

- good framework defaults;
- one prioritized launch and technical SEO checklist that points to real code;
- migration and launch workflows;
- focused agent skills for repetitive work;
- deletable defaults plus recipes that explain how to configure, adapt, or remove them.

The reusable value should **not** be a page-builder runtime, a large block catalog, or a collection of dormant integrations.

## 2. Executive decision

Use ordinary, explicit Next.js App Router pages. Page copy and composition live in the route that renders it. Components begin route-local and move to shared folders only after a second real use.

There will be no:

- `site.json` page definitions;
- catch-all marketing-page renderer;
- block registry;
- block `type`/`variant` protocol;
- Zod schemas for serialized React props;
- default CMS, docs framework, or content-sync vendor;
- gallery of unused hero/CTA/table variants.

A small TypeScript config is still useful for truly global identity such as the production URL, brand name, default description, locale, navigation, and social links. It must never contain page layouts or page content.

## 3. Design principles

1. **Explicit over interpretive.** A page is a `page.tsx`, not a JSON object consumed by a renderer.
2. **Colocate until reuse is proven.** Use `app/.../_components` first. Promote a component only when two pages genuinely share it.
3. **Good defaults, loud incompleteness.** Defaults should be safe. Client-specific values should fail visibly before production if unfinished.
4. **Server first.** Core copy, navigation, links, and content must be in the initial HTML. Add client boundaries only for interaction.
5. **One source for each fact.** Site identity, redirect mappings, article content, and checklist requirements each get one canonical location.
6. **Docs point to code; code does not duplicate the docs.** Every checklist item has a stable ID and a reference path or command.
7. **Defaults are deletable code, not flags.** PostHog, blog, and use cases ship as ordinary code. Delete their files and links when a project does not need them; do not build a feature-toggle system around the template.
8. **No fake completion.** Placeholder legal copy, dead CTA destinations, fake testimonials, and unconfigured forms block launch.
9. **Measure outcomes.** Automation should verify status codes, metadata, links, redirects, indexability, and production behavior—not SEO folklore.
10. **Make bespoke design easy.** The structure must allow a full design-system replacement and advanced animation without changing routing or SEO foundations.

## 4. Canonical file map

This is the repository map. Other agents and client repositories should be able to start here.

| Planned path                 | Canonical responsibility                                                                                                                       | Copy/reference policy                                                      |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `README.md`                  | Setup, project modes, and links to the documents below.                                                                                        | Start here. Keep short.                                                    |
| `AGENTS.md`                  | Mandatory agent workflow, source-of-truth paths, and required checks.                                                                          | Copy into client repos.                                                    |
| `docs/launch/checklist.json` | **Canonical prioritized launch requirements and current status**, with stable IDs, rationale, checks, code links, and optional recipes.        | Edit this file or use the checklist CLI; there is no separate status file. |
| `docs/launch/checklist.md`   | Generated readable view of the canonical JSON checklist.                                                                                       | Read or copy this view, but never edit it directly.                        |
| `docs/launch/migration.md`   | Existing-site inventory, URL mapping, redirects, DNS/domain cutover, and monitoring.                                                           | Required for migration/rebuild projects.                                   |
| `docs/features.md`           | **Canonical feature/consideration catalog**: default, opt-in, future, dependencies, and relevant checks.                                       | Use during project kickoff and scoping.                                    |
| `docs/recipes/README.md`     | Index of configuration, deletion, and add-on recipes.                                                                                          | Default features document clean removal; add-ons document installation.    |
| `docs/recipes/*.md`          | Configuration/removal notes for default features plus installation notes for docs/MDX, `llms.txt`, `.md` routes, i18n, and advanced animation. | Each recipe lists files added/changed and removal steps.                   |
| `docs/launch/url-map.csv`    | Old URL → new URL/disposition inventory for migrations.                                                                                        | Created per migration; not needed for new startups.                        |
| `public/llms.txt`            | Product-facing Launch Template example served directly from the domain root.                                                                   | Replace per client; generate link sets from real sources when warranted.   |
| `src/config/site.ts`         | Minimal typed global identity and navigation.                                                                                                  | No page bodies, blocks, or per-page layout config.                         |
| `src/config/env.ts`          | Required/optional environment validation with no production fallbacks.                                                                         | The build fails on invalid required values.                                |
| `src/config/redirects.ts`    | Small/medium migration redirect map, when applicable.                                                                                          | Generated or reviewed from `url-map.csv`; empty for new sites.             |
| `src/lib/seo.ts`             | Metadata, URL normalization, and typed builders for applicable structured data.                                                                | One SEO implementation boundary; no arbitrary JSON blobs in content files. |
| `src/app/robots.ts`          | Environment-aware crawl policy and sitemap URL.                                                                                                | Production and preview behavior must be tested.                            |
| `src/app/sitemap.ts`         | Enabled, canonical, indexable routes only.                                                                                                     | Derived from actual content sources.                                       |
| `scripts/launch-*.ts`        | Pnpm command entry points for checklist management, automatic verification, and live auditing.                                                 | Keep helper modules and tests out of the scripts root.                     |
| `scripts/checks/*.ts`        | Named automated-check registry and one focused implementation per check.                                                                       | Checklist `check` values must map to this explicit registry.               |
| `scripts/tests/**/*.test.ts` | Tests for checklist parsing, registry dispatch, and individual automated checks.                                                               | Each automated check needs passing and failing fixtures.                   |
| `.agents/skills/*/SKILL.md`  | Focused workflows for cloning, animation, visuals, SEO review, and launch review.                                                              | Skills point back to canonical docs instead of copying them.               |

Stable checklist IDs should use categories such as `BRAND-01`, `ROUTE-01`, `SEO-01`, `MIG-01`, `A11Y-01`, `PERF-01`, `FORM-01`, `DATA-01`, and `OPS-01`. IDs let other repos cite a requirement without depending on heading text.

## 5. Proposed application structure

```text
.
├── AGENTS.md
├── README.md
├── docs/
│   ├── features.md
│   ├── launch/
│   │   ├── checklist.json
│   │   ├── checklist.md
│   │   ├── migration.md
│   │   └── url-map.csv              # migration projects only
│   └── recipes/
│       └── README.md
├── public/
│   └── media/                       # only assets used by the current site
├── scripts/
│   ├── checks/
│   │   ├── index.ts              # explicit named-check registry
│   │   └── *.ts                  # one focused implementation per check
│   ├── tests/
│   │   └── **/*.test.ts
│   ├── launch-audit.ts
│   ├── launch-checklist.ts
│   └── launch-verify.ts
├── src/
│   ├── app/
│   │   ├── (marketing)/
│   │   │   ├── _components/         # homepage-only components
│   │   │   └── page.tsx
│   │   ├── privacy/page.tsx
│   │   ├── terms/page.tsx
│   │   ├── contact/                 # included by default; delete if unused
│   │   ├── uses/                    # included by default; delete if unused
│   │   ├── blog/                    # included by default; delete if unused
│   │   ├── error.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── not-found.tsx
│   │   ├── robots.ts
│   │   └── sitemap.ts
│   ├── components/
│   │   ├── ui/                      # only primitives currently used
│   │   ├── site-footer.tsx
│   │   └── site-header.tsx
│   ├── config/
│   │   ├── env.ts
│   │   ├── redirects.ts
│   │   └── site.ts
│   └── lib/
│       ├── seo.ts
│       └── utils.ts
└── .agents/skills/
```

Important boundaries:

- `src/config/site.ts` may hold brand identity, the canonical origin, locale, nav, footer links, and social profiles.
- Each route owns its visible copy and route metadata.
- A content collection may own repeated page data when a repeated page type actually exists. Prefer MDX/Markdown with validated frontmatter for editorial content and TypeScript for small curated datasets.
- Do not introduce a catch-all marketing route. Dynamic routes such as `blog/[slug]` and `uses/[slug]` are normal and encouraged when they match a real content model.
- `src/components/ui` is not a showcase. If a primitive is unused, it should not be in the base template.

## 6. Priority model

### P0 — blocks launch

A P0 item protects indexability, user trust, data safety, a working conversion path, or an existing site's traffic. An applicable P0 item must be `done` before production; use `not_applicable` only when the check genuinely does not belong to the project.

### P1 — expected quality, feature-dependent

P1 items are valuable for most professional launches but may be inapplicable. Examples include social cards, analytics, appropriate structured data, a contact workflow, and post-launch field performance monitoring.

### P2 — enable after the core is stable

P2 items are enhancements or advanced capabilities: blog search, content tags, PostHog session replay, IndexNow automation, `llms.txt`, `.md` routes, a docs portal, i18n, experimentation, personalization, and advanced animation.

Priority and default state are separate. A contact form can be P0 **if the project selects it**, while remaining deletable in projects that do not need a form.

## 7. Launch-checklist contract

The reusable launch and technical SEO requirements and current project status live only in `docs/launch/checklist.json`. Reusable template rules live in `items`; requirements discovered for a specific client or implementation live in `projectItems`. The file owns all IDs, priorities, rationale, related files, named automated checks, optional recipe links, and manual or derived status. `docs/launch/checklist.md` is generated from it. This plan defines the priority model and implementation sequence, but it must not restate the requirements.

## 8. Feature-catalog contract

The current default, implementation status, priority, code location, and deletion/configuration path for every feature live in `docs/features.md` and `docs/recipes`. Do not maintain a second feature table in this plan.

## 9. Design-system and animation boundary

The template should be easy to reskin without touching the SEO and launch machinery.

Keep four replaceable layers:

1. `globals.css` / token file: color, type, spacing, radius, shadow, and motion variables.
2. `components/ui`: accessible primitives currently in use.
3. site shell: header and footer.
4. page composition: route-local, fully bespoke.

Importing a client design system should normally replace layers 1–3 while preserving routes, metadata, sitemap/robots, content models, and audit scripts.

Advanced animation is allowed, but every animated section must define:

- what enhancement it adds without hiding critical copy;
- behavior for `prefers-reduced-motion`;
- whether it creates a Client Component boundary;
- loading and layout-shift impact;
- mobile/touch behavior;
- keyboard/focus behavior when interactive;
- an unanimated fallback.

No animation component belongs in a global library merely because it might be reused someday.

## 10. Migration and clone workflow

The migration path must begin before implementation:

1. Crawl and capture the old site.
2. Export known URLs and performance/search data.
3. Save desktop/mobile screenshots of representative templates and important pages.
4. Inventory content, forms, analytics events, structured data, downloads, and external integrations.
5. Fill `docs/launch/url-map.csv` and identify must-preserve URLs.
6. Decide whether the job is visual cloning, design refresh, information-architecture change, domain move, or some combination.
7. Build one route template and compare it before scaling the pattern.
8. Implement redirects from the reviewed map.
9. Crawl preview and compare old/new status, metadata, headings, canonicals, internal links, word/content presence, and screenshots.
10. Cut over with the rollback path and post-launch monitoring ready.

For client-authorized 1:1 clones, the skill should reproduce the visual system and behavior in maintainable local code. It should not blindly copy analytics IDs, form endpoints, third-party secrets, cookie tooling, stale scripts, or inaccessible markup.

## 11. Page-by-page implementation order

Do not scaffold every nice-to-have route at once. Finish each stage before starting the next.

### Phase 0 — repository foundation (no feature pages)

Create:

- Next.js, TypeScript, styling, formatting, linting, and test baseline;
- `README.md`, `AGENTS.md`, the merged launch/technical-SEO checklist, and stable checklist IDs;
- minimal `site.ts` and environment validation;
- root layout, fonts, tokens, header/footer primitives, and the default PostHog integration;
- `robots.ts`, `sitemap.ts`, `not-found.tsx`, and `error.tsx`;
- a first `launch-audit.ts` that detects sentinel placeholders, stale brand/domain strings, broken internal links, invalid production configuration, bad status codes, missing/incorrect canonicals, sitemap drift, and accidental production `noindex`.

Exit: an intentionally plain site builds, the documentation is usable, and unfinished client values fail loudly.

### Phase 1 — homepage only

Build one strong, generic example homepage with real component code and a modest but polished design. It should demonstrate:

- visible value proposition and one primary action;
- semantic, server-rendered content;
- an intentional responsive layout;
- correct metadata and sharing preview;
- one restrained visual treatment that can be removed or replaced;
- route-local sections, not a reusable block catalog.

Exit: homepage passes the per-page definition of done and becomes the style reference for the next route.

Current progress: the homepage now follows the shared hero → trust → positioning → capabilities → path to start → questions → closing-action flow in `docs/recipes/homepage.md`. Its original design and copy remain the base; the existing checklist section now comes before the workflow. The header, hero, and close use the same “Launch Website” action and `/contact` destination. The visible positioning sentence, metadata description, and WebSite JSON-LD share `siteConfig.description`, while the questions and FAQ JSON-LD share one server-owned array. The trust bar names the real project stack; customer logos, outcome numbers, and quotes remain intentionally omitted until the project has approved, sourced proof.

### Phase 2 — not-found, privacy, then terms

Treat these as separate pages. Legal pages may begin as clearly marked templates, but production audit must fail until organization identity, jurisdiction, service behavior, subprocessors/cookies, contacts, effective dates, and counsel/client approval are recorded as applicable.

Exit: there is no plausible-looking legal placeholder that can accidentally ship.

### Phase 3 — contact page and form recipe

The contact form is a default, deletable surface rather than a feature flag. Keep these concerns separate:

- form UI and accessible states;
- server-side schema and length limits;
- delivery adapter;
- attribution collection;
- spam/rate-limit control;
- analytics event;
- privacy/retention decision.

No provider-specific email fallback should exist. Missing delivery configuration must return a clear safe error and fail the production audit.

Current progress: complete. `/contact` server-renders its copy and initial form markup. A small Client Component owns validation and submission state. The API revalidates bounded fields, rejects unexpected values, checks same-origin/timing/honeypot/rate-limit signals, and sends through an explicit SMTP adapter only when every server-only value is present. Optional Cloudflare Turnstile protection stays inactive unless both keys are configured, then validates single-use tokens, action, and hostname before delivery. Attribution retains only first-touch UTM fields, a query-free external referrer, the first landing page, and five query-free same-site paths for 90 days. PostHog receives only the successful conversion event name. Configuration, privacy decisions, production verification, and full deletion are documented in `docs/recipes/contact.md` and `docs/recipes/turnstile.md`; the production audit rejects missing delivery configuration.

### Phase 4 — use-case pages

Use cases are a default, deletable surface rather than a feature flag. Start with one index and one detail page. Establish the real repeated content model before adding more pages. The index must server-render links to all public details. Each detail owns unique copy, metadata, canonical, and relevant internal links.

Current progress: the server-rendered `/uses` hub groups and links four JSON-backed detail pages covering migrations, SaaS rebuilds, startup launches, and SEO landing pages. The copy uses short, direct sentences and the detail layout uses generous section spacing without a sticky jump bar. Heroes and capability rows use the same validated `visualId`; the route-local `UseCaseVisual` resolver maps each ID to either React or a project-owned local image without placing component props, paths, or layout in JSON. Numeric page ordering has been removed. Each page's `metadata` contains its slug, hub anchor, single group, title, and description; `src/content/use-cases/groups.json` owns hub labels and section order without becoming a component registry. Automatic discovery, grouping, static generation, exhaustive visual mapping, and sitemap inclusion are covered by tests, TypeScript, and the launch audit.

### Phase 5 — basic blog

The blog is a default, deletable surface rather than a feature flag. It connects directly to Wisp and includes:

1. server-rendered article and index routes;
2. server-side search and pagination;
3. sanitized article HTML, visible dates, metadata, and Article JSON-LD;
4. dynamic sitemap integration and an RSS feed;
5. related and featured articles, optional filters backed by real source tags, numbered pagination, and server-built article contents/share links.

`WISP_BLOG_ID` is server-only. Calls are direct, with no retry or application cache. Featured slugs and optional filters live in route-owned `src/app/blog/blog.config.ts`; filter/search/page variants remain server-rendered and canonical to `/blog`. Replace the demo publication ID for a client project. `docs/recipes/blog.md` records configuration and the complete deletion path.

### Phase 6 — agent skills

Create focused project skills using the repository's canonical docs:

- `site-clone`: inventory/capture, implement route by route, and visually compare approved sites;
- `micro-ui`: create route-native interface visuals, route-local animation, and generated graphics without a standalone block or asset catalog, with reduced-motion, a11y, and performance checks;
- `technical-seo-review`: work through relevant `SEO-*` and `MIG-*` requirements;
- `launch-review`: run the launch audit, inspect non-automatable P0 items, and update checklist status.

Skills must not carry duplicate checklists. They cite stable IDs from `docs/launch/checklist.json`, add client-specific gates to `projectItems`, may keep non-status evidence such as a clone implementation journal, may link to the generated Markdown view, and invoke shared scripts.

Current progress: `site-clone` and `micro-ui` are complete in `.agents/skills`, with `.claude/skills` symlinks exposing the same canonical files to Claude. `site-clone` includes recursive sitemap inventory, exact URL-map output, wildcard page-family grouping, customer-owned asset migration, visible widget reproduction, implementation journaling with checklist escalation, agent-browser visual comparison, persistent homepage execution, and an approval gate before later routes. `micro-ui` absorbed the former `animated-ui` skill and the designer's motion system: a shared framer-motion kit (`_kit.tsx` plus a token-mapped `brand.ts`), a twenty-pattern motion catalogue, and a brand-adoption procedure, while keeping the `ImageResponse`, SVG, and still-visual output paths. The visual skills have been exercised on real code: the generated root Open Graph image, the typed React/local-file `/uses` visual resolver, and two route-local feature animations. `framer-motion` is the one animation dependency; no graphics dependency was added. `technical-seo-review` and `launch-review` remain deliberately deferred.

### Phase 7 — advanced content and LLM access

Only after the preceding paths are stable:

- docs/knowledge-base routing;
- `llms.txt` curated from the same enabled route/content sources as the sitemap, with generated link sets for collection-driven sites;
- selected `.md` representations generated from the same Markdown/MDX source;
- optional full-corpus exports with size and abuse controls;
- structured content APIs or retrieval endpoints;
- richer search and AI features.

HTML remains canonical. Advanced machine-readable representations must not create a second hand-maintained content system.

Current progress: the root `public/llms.txt` Launch Template example, `LLM-01` automated replacement/shape check, production response and public-target audit, and `docs/recipes/llms-txt.md` are implemented. The example remains intentionally invalid for a client launch until its content and `TEMPLATE_LLMS_TXT` marker are replaced. Small sites may curate it alongside explicit routes; content-heavy sites generate its link set from their existing source collections.

## 12. Per-page definition of done

Every page is complete only when:

1. visible copy and destinations are client-appropriate, with no sentinel or inherited product text;
2. the route returns the intended status and works without client-side JavaScript for core content/links;
3. title, description where useful, canonical, social preview, main heading, and indexability are correct;
4. it is reachable from the intended information architecture and is in the sitemap if indexable;
5. images and media have intentional dimensions, loading behavior, alternatives, and rights/provenance;
6. desktop and mobile layouts, keyboard behavior, focus, zoom, reduced motion, empty/error/loading states, and content overflow are reviewed;
7. selected analytics/conversion events are verified without unintended PII;
8. relevant structured data is accurate and validated, or deliberately absent;
9. build, typecheck, lint, focused tests, and launch audit pass;
10. Every applicable checklist item has been set to `done`; unused feature checks are explicitly `not_applicable`.

## 13. Automation and CI

Prefer one understandable audit script over a collection of overlapping SEO scripts.

The intended commands are:

```bash
pnpm check
pnpm build
pnpm launch:audit --url http://localhost:3000
pnpm launch:audit --url https://preview.example.com --mode preview
pnpm launch:audit --url https://example.com --mode production
```

The launch audit should:

- crawl from sitemap plus internal links;
- check status codes and redirect chains;
- validate internal destinations, canonicals, indexability, titles, descriptions, primary headings, social image URLs, and language;
- compare sitemap URLs with discoverable canonical pages;
- detect template sentinels and a configurable list of forbidden legacy brands/domains/emails;
- verify production vs preview robots policy;
- validate migration redirects from the URL map where present;
- produce a human-readable table keyed to checklist IDs;
- distinguish `FAIL`, `WARN`, `INFO`, and `NOT_APPLICABLE`;
- write a machine-readable report for CI artifacts.

It should **not** fail a launch because:

- a meta description is outside a guessed character range;
- a page lacks generic `WebPage` JSON-LD;
- optional `.md` representations are absent;
- an exact keyword phrase is missing from the first N characters;
- a sitemap omits ignored `priority`/`changefreq` values;
- a Lighthouse score is not 100.

Browser-based visual and accessibility tests may be added for representative routes, but the base suite should stay fast enough to run on every pull request.

## 14. Implementation milestones

### Milestone A — usable skeleton

- Foundation and canonical docs exist.
- Minimal homepage, shell, 404, robots, and sitemap work.
- Production configuration and placeholder checks fail safely.
- PostHog is installed as the one default analytics integration; it is environment-configured and deletable without affecting the rest of the site.

### Milestone B — credible launch baseline

- Homepage design is polished and replaceable.
- Privacy and terms workflow is explicit.
- P0 checklist and audit cover new-startup launches.
- A second sample project can copy the checklist and point back to code paths successfully.

### Milestone C — migration-ready

- Migration guide, URL map, redirect implementation, and audit comparison work on a real old site.
- Clone skill can inventory, screenshot, rebuild, and compare one representative site.
- Redirect and indexability mistakes block launch.

### Milestone D — selected feature recipes

- Contact, use-case, blog, PostHog, animation, and generated-visual setup/removal recipes are proven one at a time.
- Removing one capability does not require changing or flagging the others.

### Milestone E — advanced content

- Docs, `.md` routes, and LLM discovery files are generated from shared sources and remain optional.

## 15. Primary references used to set priorities

- [Next.js Metadata and OG images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [Next.js `generateMetadata`](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js production checklist](https://nextjs.org/docs/app/guides/production-checklist)
- [Google: developer SEO guide](https://developers.google.com/search/docs/fundamentals/get-started-developers)
- [Google: title-link best practices](https://developers.google.com/search/docs/appearance/title-link)
- [Google: snippets and meta descriptions](https://developers.google.com/search/docs/appearance/snippet)
- [Google: supported meta tags](https://developers.google.com/search/docs/crawling-indexing/special-tags)
- [Google: sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google: canonical URL guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Google: JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Google: site moves and URL migrations](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes)
- [Google: structured-data guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [web.dev: Core Web Vitals thresholds](https://web.dev/articles/defining-core-web-vitals-thresholds)
- [llms.txt proposal and format](https://llmstxt.org/)
- [Synscribe: llms.txt implementation guide](https://www.synscribe.com/agentic-discovery/llms-txt)
- [Synscribe: llms.txt template pack](https://www.synscribe.com/agentic-discovery/resources/llms-txt-template-pack)

## 16. Recommended next action

Complete Phase 6 with `technical-seo-review` and `launch-review`, because their source material and audit paths already exist. Keep legal approval as a production gate requiring real project facts; do not invent generic approvals to close Phase 2.
