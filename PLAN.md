# Next.js Client Launch Template — Audit and Rebuild Plan

Status: planning only. No application code has been copied from the old template.

This plan is based on an audit of `../zero-to-rank-template` on 2026-08-20. It defines the new template's architecture, documentation contract, launch priorities, and page-by-page build order.

## 1. Intended outcome

Build a small Next.js starting point for three kinds of work:

1. Rebuild an existing client site while preserving its important URLs and search equity.
2. Migrate an existing site with minimal visual or content change.
3. Launch a new company or startup site from scratch.

The reusable value should live in:

- good framework defaults;
- a prioritized launch checklist;
- a technical SEO guide that points to real code;
- migration and launch workflows;
- focused agent skills for repetitive work;
- deletable defaults plus recipes that explain how to configure, adapt, or remove them.

The reusable value should **not** be a page-builder runtime, a large block catalog, or a collection of dormant integrations.

## 2. Executive decision

Do not port the old SDUI architecture.

The new template will use ordinary, explicit Next.js App Router pages. Page copy and composition will live in the route that renders it. Components begin route-local and move to shared folders only after a second real use.

There will be no:

- `site.json` page definitions;
- catch-all marketing-page renderer;
- block registry;
- block `type`/`variant` protocol;
- Zod schemas for serialized React props;
- default CMS, docs framework, or content-sync vendor;
- gallery of unused hero/CTA/table variants.

A small TypeScript config is still useful for truly global identity such as the production URL, brand name, default description, locale, navigation, and social links. It must never contain page layouts or page content.

## 3. Previous-template audit

### 3.1 Size and shape

The old template currently contains approximately:

- 15,802 lines of TypeScript/TSX under `src` and `scripts`;
- 114 block files, including 41 block tests;
- 29 runtime dependencies and 22 development dependencies;
- 72 bundled documentation files;
- 159 public assets;
- a 600-line, 27 KB `src/content/site.json`;
- 8 repository-local skills split between `.agents` and `.claude`.

The source is not enormous for a product, but it is too broad for a launch template because every fork inherits several unrelated products and workflows.

### 3.2 What is worth keeping conceptually

| Old capability                                  | Reference                                                                                                       | Decision                                                                       |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Next.js Metadata API with `metadataBase`        | `../zero-to-rank-template/src/app/layout.tsx`                                                                   | Keep, simplified.                                                              |
| Route-specific metadata                         | `../zero-to-rank-template/src/app/[[...slug]]/page.tsx`                                                         | Keep on explicit routes.                                                       |
| Generated `robots.txt` and sitemap              | `../zero-to-rank-template/src/app/robots.ts`, `../zero-to-rank-template/src/app/sitemap.ts`                     | Keep, but only include enabled/indexable routes.                               |
| Server Components by default                    | `../zero-to-rank-template/src/app`, `../zero-to-rank-template/src/blocks`                                       | Keep as the default rendering model.                                           |
| `next/image` and font conventions               | `../zero-to-rank-template/src/app/layout.tsx`, `../zero-to-rank-template/src/components/media-renderer.tsx`     | Keep.                                                                          |
| Build-time content validation                   | `../zero-to-rank-template/src/lib/uses-loader.ts`, `../zero-to-rank-template/src/content/uses/schema.ts`        | Keep only at real content boundaries such as frontmatter or external API data. |
| Contact attribution context                     | `../zero-to-rank-template/src/contexts/visitor-context.ts`                                                      | Keep as an opt-in recipe after privacy review.                                 |
| Article metadata and structured data            | `../zero-to-rank-template/src/app/blog/[slug]/page.tsx`                                                         | Keep in the default blog until the blog is deleted.                            |
| Local skills for repeatable visual work         | `../zero-to-rank-template/.agents/skills/animated-ui-skill`, `../zero-to-rank-template/.agents/skills/micro-ui` | Redesign for Next.js and this template's guardrails.                           |
| Written SEO assertions plus an executable audit | `../zero-to-rank-template/doc/docs-seo-spec.md`, `../zero-to-rank-template/scripts/seo-test.ts`                 | Keep the pattern, rewrite the assertions.                                      |

### 3.3 What caused the over-engineering

1. **The template became a runtime product.** `src/engine`, the registry, schemas, resolver, catch-all route, and block catalog exist to interpret serialized UI. Client sites do not need that indirection.
2. **The abstraction moved copy away from the page.** Understanding the homepage requires moving between `site.json`, schemas, a registry, and variant components.
3. **Variants multiplied maintenance.** A new variant often required a component, schema change, registry entry, tests, and sometimes a new block type.
4. **“Optional” features became mandatory dependencies.** Wisp, Fumadocs, Synscribe, PostHog, Nodemailer, Satori, and their supporting files are present even when a client does not need them.
5. **Product content leaked into the template.** CitationBench content, Reglyr email fallbacks, a Thrawn image hostname, and Synscribe integration code coexist in a supposedly reusable repository.
6. **The architecture solved slug collisions it had created.** Reserved-slug guards and route-coexistence ADRs are consequences of combining a catch-all page engine with explicit Next.js routes.
7. **The block library became the module repo this new template should avoid.** Most client work needs bespoke composition with a few shared primitives, not every historical section variant.

### 3.4 Launch-readiness failures found in the old template

These are exactly the failures the new audit must prevent:

- `src/app/api/contact-form/route.ts` falls back to `@reglyr.com` addresses and a `[Reglyr]` subject.
- `next.config.ts` still permits `www.trythrawn.com` images.
- `package.json` is still named `serp-sniper` while the visible site is CitationBench.
- privacy and terms are explicitly marked `TBD` and placeholder content.
- header/footer links point to missing internal routes including `/about`, `/platform`, `/solutions`, `/pricing`, `/login`, and `/signup`.
- the blog index loads posts in a client effect, so its initial HTML has no post links.
- the repository contains product-specific docs, use-case JSON, generated artwork, content-sync scripts, and vendor credentials that a new client could accidentally inherit.
- the SEO audit treats several optional or unsupported signals as mandatory while omitting a general migration gate.

The new template will prefer obvious `TODO_CLIENT_*` sentinel values that fail a launch audit over plausible-looking defaults that can silently ship.

### 3.5 SEO guidance that should be corrected

The untracked `../zero-to-rank-template/doc/seo-defaults.md` is a useful extraction, but its priorities need adjustment:

- Keep unique, descriptive titles and page-specific descriptions; remove arbitrary hard failures based on exact character counts.
- Do not emit `meta keywords`; Google states that it does not use them for indexing or ranking.
- Do not store sitemap `priority` or `changeFrequency` by default; Google ignores both. Use accurate `lastModified` only when a reliable source exists.
- Do not require JSON-LD on every page merely to make a test green. Add only accurate, applicable structured data with the properties required for the relevant search feature.
- Treat `llms.txt`, `llms-full.txt`, IndexNow, `.md` representations, and experimental schema types as optional enhancements, not launch-critical Google SEO.
- Keep semantic headings as an accessibility and content-quality convention; do not present “exactly one H1” as a universal ranking rule.
- Require crawlable internal links and server-rendered critical content, but do not force every docs link into every docs page.
- Give URL inventory, redirect mapping, and post-launch migration monitoring first-class P0 status.

## 4. Design principles for the new template

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

## 5. Canonical file map

This is the most important part of the future repository. Other agents and client repositories should be able to start here.

| Planned path                | Canonical responsibility                                                                                                                                | Copy/reference policy                                                                  |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `README.md`                 | Setup, project modes, and links to the documents below.                                                                                                 | Start here. Keep short.                                                                |
| `AGENTS.md`                 | Mandatory agent workflow, source-of-truth paths, and required checks.                                                                                   | Copy into client repos.                                                                |
| `docs/launch/checklist.md`  | **Canonical prioritized launch and technical SEO guide**, with stable IDs, rationale, applicability, evidence, and code links.                          | Primary file for agents to copy or work down; there is no separate SEO guide to drift. |
| `docs/launch/migration.md`  | Existing-site inventory, URL mapping, redirects, DNS/domain cutover, and monitoring.                                                                    | Required for migration/rebuild projects.                                               |
| `docs/launch/status.md`     | Per-project decisions, owners, exceptions, evidence links, and sign-off.                                                                                | Reset for every client. Never use template-complete statuses.                          |
| `docs/features.md`          | **Canonical feature/consideration catalog**: default, opt-in, future, dependencies, and relevant checks.                                                | Use during project kickoff and scoping.                                                |
| `docs/recipes/README.md`    | Index of configuration, deletion, and add-on recipes.                                                                                                   | Default features document clean removal; add-ons document installation.                |
| `docs/recipes/*.md`         | Configuration/removal notes for default features plus installation notes for contact, docs/MDX, `llms.txt`, `.md` routes, i18n, and advanced animation. | Each recipe lists files added/changed and removal steps.                               |
| `docs/launch/url-map.csv`   | Old URL → new URL/disposition inventory for migrations.                                                                                                 | Created per migration; not needed for new startups.                                    |
| `src/config/site.ts`        | Minimal typed global identity and navigation.                                                                                                           | No page bodies, blocks, or per-page layout config.                                     |
| `src/config/env.ts`         | Required/optional environment validation with no production fallbacks.                                                                                  | The build fails on invalid required values.                                            |
| `src/config/redirects.ts`   | Small/medium migration redirect map, when applicable.                                                                                                   | Generated or reviewed from `url-map.csv`; empty for new sites.                         |
| `src/lib/seo.ts`            | Metadata, URL normalization, and typed builders for applicable structured data.                                                                         | One SEO implementation boundary; no arbitrary JSON blobs in content files.             |
| `src/app/robots.ts`         | Environment-aware crawl policy and sitemap URL.                                                                                                         | Production and preview behavior must be tested.                                        |
| `src/app/sitemap.ts`        | Enabled, canonical, indexable routes only.                                                                                                              | Derived from actual content sources.                                                   |
| `scripts/launch-audit.ts`   | Static plus live launch checks keyed to checklist IDs.                                                                                                  | Single executable audit entry point.                                                   |
| `.agents/skills/*/SKILL.md` | Focused workflows for cloning, animation, visuals, SEO review, and launch review.                                                                       | Skills point back to canonical docs instead of copying them.                           |

Stable checklist IDs should use categories such as `BRAND-01`, `ROUTE-01`, `SEO-01`, `MIG-01`, `A11Y-01`, `PERF-01`, `FORM-01`, `DATA-01`, and `OPS-01`. IDs let other repos cite a requirement without depending on heading text.

## 6. Proposed application structure

```text
.
├── AGENTS.md
├── README.md
├── docs/
│   ├── features.md
│   ├── launch/
│   │   ├── checklist.md
│   │   ├── migration.md
│   │   ├── status.md
│   │   └── url-map.csv              # migration projects only
│   └── recipes/
│       └── README.md
├── public/
│   └── media/                       # only assets used by the current site
├── scripts/
│   └── launch-audit.ts
├── src/
│   ├── app/
│   │   ├── (marketing)/
│   │   │   ├── _components/         # homepage-only components
│   │   │   └── page.tsx
│   │   ├── privacy/page.tsx
│   │   ├── terms/page.tsx
│   │   ├── contact/                 # add when selected
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

## 7. Priority model

### P0 — blocks launch

A P0 item protects indexability, user trust, data safety, accessibility, a working conversion path, or an existing site's traffic. An applicable P0 item must pass or have a documented owner-approved exception in `docs/launch/status.md`.

### P1 — expected quality, feature-dependent

P1 items are valuable for most professional launches but may be inapplicable. Examples include social cards, analytics, appropriate structured data, a contact workflow, and post-launch field performance monitoring.

### P2 — enable after the core is stable

P2 items are enhancements or advanced capabilities: blog search, content tags, PostHog session replay, IndexNow automation, `llms.txt`, `.md` routes, a docs portal, i18n, experimentation, personalization, and advanced animation.

Priority and default state are separate. A contact form can be P0 **if the project selects it**, while remaining absent from projects that do not need a form.

## 8. Initial launch-checklist scope

The full checklist will be created in Phase 0. It should cover the following without turning every preference into a blocker.

### P0: every site

- `[BRAND-01]` No template brand, domain, package name, logo, favicon, OG asset, analytics key, or placeholder token remains. Contact email and social accounts are optional; if supplied, they must be intentional and valid.
- `[ROUTE-01]` Every internal nav, footer, CTA, and body link resolves to the intended 2xx page or reviewed redirect.
- `[ROUTE-02]` Unknown routes return a real 404; removed content returns 404/410 or a relevant permanent redirect.
- `[SEO-01]` The production site is crawlable and indexable; preview/staging behavior cannot leak into production.
- `[SEO-02]` Review each indexable page in this priority order: **(1)** meta title, **(2)** meta description, **(3)** H1, **(4)** the visible first 200 words, and **(5)** published/updated dates in content and JSON-LD when those dates are available. All must accurately describe the page and align with its user intent.
- `[SEO-03]` Critical pages have unique, accurate descriptions and self-consistent canonical URLs.
- `[SEO-04]` `robots.txt` reflects the intended production policy and points to an absolute sitemap URL.
- `[SEO-05]` The sitemap contains every canonical indexable HTML URL and excludes redirects, errors, `noindex` pages, and preview URLs. Optional `.md` representations never block launch.
- `[SEO-06]` Important pages are reachable through crawlable `<a href>` links from another findable page; core content is present in server-rendered/prerendered HTML.
- `[SEO-07]` URL casing, trailing-slash, host, and protocol policy are consistent; noncanonical variants redirect or canonicalize correctly.
- `[PERF-01]` Above-the-fold imagery is correctly sized and optimized; dimensions prevent layout shift; fonts and third-party scripts do not unnecessarily block rendering.
- `[PERF-02]` A representative mobile lab run has no known severe LCP, INP proxy, or CLS regression. Field Core Web Vitals monitoring is assigned after launch.
- `[SEC-01]` No secret is exposed client-side or committed; security headers, dependency state, and external scripts are reviewed in proportion to the site.
- `[LEGAL-01]` Legal pages contain client-approved details. Placeholder legal copy blocks launch.
- `[OPS-01]` Production domain, DNS, TLS, environment variables, deployment target, rollback owner, error monitoring, and launch window are recorded.
- `[QA-01]` The production build and launch audit pass against a preview deployment before DNS/cutover.

### P0: migration or rebuild only

- `[MIG-01]` Inventory old URLs from the old sitemap, crawl, analytics, Search Console, CMS, backlinks, and important media/downloads.
- `[MIG-02]` Give every old URL an explicit disposition: preserve, 301/308 to a relevant replacement, consolidate, or 404/410.
- `[MIG-03]` Test redirect targets, loops, chains, query handling, host/protocol variants, and high-traffic URLs. Do not mass-redirect irrelevant pages to home.
- `[MIG-04]` Preserve or intentionally replace titles, headings, copy, structured data, internal links, and media for pages with existing traffic.
- `[MIG-05]` Update canonical, hreflang, sitemap, navigation, and body links to final URLs.
- `[MIG-06]` Remove temporary `noindex`/crawl blocks at launch and verify representative URLs in Search Console.
- `[MIG-07]` Keep permanent redirects for at least a year and preferably as long as they remain useful; assign post-launch monitoring for old and new properties.
- `[MIG-08]` If the domain changes, verify old/new Search Console properties and complete the appropriate Change of Address workflow.

### P0: selected conversion features

- `[FORM-01]` The primary conversion path works end to end on production and reaches a monitored destination.
- `[FORM-02]` Server-side validation includes reasonable length limits; output is escaped; errors do not leak secrets or personal data.
- `[FORM-03]` Spam/rate-limit controls, retention, consent, privacy disclosure, and PII handling match the project risk.
- `[FORM-04]` Attribution fields are minimized, accurate, and not sent to analytics or storage without the required privacy decision.

### P1

- `[SOCIAL-01]` Default and page-specific Open Graph/Twitter previews are correct and tested on important routes.
- `[SEO-08]` Add only applicable structured data such as Organization, Breadcrumb, Article, Product, or LocalBusiness; validate it and keep it consistent with visible content. Include published/updated dates where the underlying content has them.
- `[A11Y-01]` As a non-blocking quality review, check semantic landmarks, keyboard navigation, focus visibility, form labels/errors, color contrast, image alternatives, and zoom/responsive behavior.
- `[ANALYTICS-01]` If analytics is selected, production events, exclusions, consent behavior, and ownership are verified; do not capture sensitive form fields.
- `[MON-01]` Search Console, analytics, uptime/error reporting, and field performance dashboards have owners.
- `[CONTENT-01]` About/contact/trust/authorship details support the site's actual business and content claims.
- `[IMAGE-01]` Important image assets have intentional filenames, formats, crops, alt behavior, and sharing variants.

### P2

- `[LLM-01]` Generate `llms.txt` from enabled content sources if useful to the project; treat it as experimental discovery support.
- `[LLM-02]` Serve selected content as `.md` from the same source, with an HTML canonical and an explicit indexing policy for the alternate representation.
- `[INDEX-01]` Add IndexNow only when publishing frequency and target engines justify it.
- `[CONTENT-02]` Add blog tags, search, RSS/Atom, related content, and content freshness workflows after a basic crawlable blog works.
- `[PERF-03]` Add real-user monitoring and enforce route-level performance budgets once traffic and page shapes justify them.

## 9. Initial feature catalog

`docs/features.md` will expand this table and link every row to its recipe, code, and checklist IDs.

| Capability                                     | Base default         | Priority when selected      | Intended implementation                                                                                               |
| ---------------------------------------------- | -------------------- | --------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Explicit homepage                              | On                   | P0                          | Bespoke `page.tsx` with route-local sections.                                                                         |
| Header, footer, 404, error UI                  | On                   | P0                          | Small shared shell.                                                                                                   |
| Root/page metadata, canonical, robots, sitemap | On                   | P0                          | Native Next.js APIs.                                                                                                  |
| Design tokens and primitives                   | On, minimal          | P0                          | Client-facing CSS variables plus only the shadcn primitives used by current pages.                                    |
| Terms and privacy routes                       | On                   | P0                          | Clearly incomplete templates; launch audit requires approved replacement.                                             |
| Migration inventory and redirects              | Off for startups     | P0 for migrations           | URL-map document plus reviewed Next/host redirects.                                                                   |
| Contact form with attribution                  | Off                  | P0 if it is the primary CTA | Provider-neutral recipe, validated server route, privacy/spam controls.                                               |
| Use-case index/detail pages                    | On; delete if unused | P1                          | Explicit dynamic content model, crawlable index, route-owned template. No feature flag.                               |
| Basic blog                                     | On; delete if unused | P1                          | Local MDX/Markdown first unless a CMS is an actual requirement. No feature flag.                                      |
| Blog tags and search                           | Off                  | P2                          | Add after the basic index/post path is server-rendered and stable.                                                    |
| PostHog                                        | On; delete if unused | P1/P2                       | Normal integration with environment configuration, consent decision, event plan, and no PII capture. No feature flag. |
| Animated sections                              | Off                  | P1/P2                       | Route-local React/CSS or selected library; reduced-motion and performance gates.                                      |
| Generated graphics                             | Off                  | P1/P2                       | Skill creates optimized project-owned assets and records usage/alt intent.                                            |
| 1:1 site clone/rebuild workflow                | Tooling only         | P0 for clone work           | Skill inventories URLs/assets and performs breakpoint visual comparisons.                                             |
| Docs/knowledge base                            | Off                  | P2                          | Choose MDX/docs tooling only when required.                                                                           |
| `llms.txt`                                     | Off                  | P2                          | Derived from enabled content; never independently hand-maintained.                                                    |
| `.md` route representations                    | Off                  | P2                          | Generated from the same source with duplicate-indexing safeguards.                                                    |
| Internationalization/hreflang                  | Off                  | P1/P2                       | Dedicated recipe once locales are known.                                                                              |
| A/B testing/personalization                    | Off                  | P2                          | Add only with measurement plan and crawl/cache review.                                                                |

## 10. Design-system and animation boundary

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

## 11. Migration and clone workflow

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
10. Cut over with rollback and monitoring owners present.

For client-authorized 1:1 clones, the skill should reproduce the visual system and behavior in maintainable local code. It should not blindly copy analytics IDs, form endpoints, third-party secrets, cookie tooling, stale scripts, or inaccessible markup.

## 12. Page-by-page implementation order

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

### Phase 2 — not-found, privacy, then terms

Treat these as separate pages. Legal pages may begin as clearly marked templates, but production audit must fail until organization identity, jurisdiction, service behavior, subprocessors/cookies, contacts, effective dates, and counsel/client approval are recorded as applicable.

Exit: there is no plausible-looking legal placeholder that can accidentally ship.

### Phase 3 — contact page and form recipe

Add the contact feature only if it belongs in the base example after Phase 1 review. Separate:

- form UI and accessible states;
- server-side schema and length limits;
- delivery adapter;
- attribution collection;
- spam/rate-limit control;
- analytics event;
- privacy/retention decision.

No provider-specific email fallback should exist. Missing delivery configuration must return a clear safe error and fail the production audit.

### Phase 4 — use-case pages

Use cases are a default, deletable surface rather than a feature flag. Start with one index and one detail page. Establish the real repeated content model before adding more pages. The index must server-render links to all public details. Each detail owns unique copy, metadata, canonical, and relevant internal links.

Do not use the old Synscribe envelope or copy the old fixed section set unless the new content actually requires it.

Current progress: the server-rendered `/uses` hub groups and links four JSON-backed detail pages covering migrations, SaaS rebuilds, startup launches, and SEO landing pages. The copy uses short, direct sentences and the detail layout uses generous section spacing without a sticky jump bar. Each capability declares one validated feature ID that selects a route-owned visual; visual props and component structure do not live in JSON. Numeric page ordering has been removed. Each page references group IDs, while `src/content/use-cases/groups.json` owns hub labels and section order without becoming a component registry. Automatic discovery, grouping, static generation, and sitemap inclusion are covered by tests and the launch audit.

### Phase 5 — basic blog

The blog is a default, deletable surface rather than a feature flag. Start with local Markdown/MDX because it is portable and requires no external account. Build, in order:

1. one article route;
2. server-rendered blog index;
3. sitemap integration and article metadata;
4. feed;
5. tags/pagination/search only when there is enough content to use them.

A CMS becomes a project decision documented in `docs/launch/status.md`, not a default template dependency.

### Phase 6 — agent skills

Create focused project skills using the repository's canonical docs:

- `site-clone`: inventory/capture, implement route by route, and visually compare approved sites;
- `animated-section`: create route-local Next.js animation with reduced-motion, a11y, and performance checks;
- `visual-generation`: create and optimize illustrations/graphics with asset, alt, and licensing/provenance notes;
- `technical-seo-review`: work through relevant `SEO-*` and `MIG-*` requirements and point to evidence;
- `launch-review`: run the launch audit, inspect non-automatable P0 items, and update status/evidence.

Skills must not carry duplicate checklists. They cite stable IDs from `docs/launch/checklist.md` and invoke shared scripts.

### Phase 7 — advanced content and LLM access

Only after the preceding paths are stable:

- docs/knowledge-base routing;
- `llms.txt` generated from the same content registry as the sitemap;
- selected `.md` representations generated from the same Markdown/MDX source;
- optional full-corpus exports with size and abuse controls;
- structured content APIs or retrieval endpoints;
- richer search and AI features.

HTML remains canonical. Advanced machine-readable representations must not create a second hand-maintained content system.

## 13. Per-page definition of done

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
10. `docs/launch/status.md` contains evidence or an explicit decision for non-automatable requirements.

## 14. Automation and CI

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
- `llms.txt` is disabled;
- an exact keyword phrase is missing from the first N characters;
- a sitemap omits ignored `priority`/`changefreq` values;
- a Lighthouse score is not 100.

Browser-based visual and accessibility tests may be added for representative routes, but the base suite should stay fast enough to run on every pull request.

## 15. Suggested first implementation milestones

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

## 16. What to copy from the old repo during implementation

Copy ideas and small reviewed helpers, not directories.

Potentially adapt:

- metadata, robots, and sitemap use of native Next.js APIs;
- the small `VisitorContext` model after privacy/data-minimization changes;
- HTML escaping and schema validation patterns from the contact handler;
- `Article` structured-data typing;
- animation reduced-motion patterns;
- the audit reporter structure from `scripts/seo-test.ts`;
- focused, currently used UI primitives.

Do not copy:

- `src/engine/**`;
- `src/content/site.json`;
- `src/blocks/**` as a directory;
- the catch-all marketing route;
- product content or public micro-UI collections;
- Wisp/Fumadocs/Synscribe integrations by default;
- the existing IndexNow key;
- product-specific environment variables;
- placeholder legal content or email fallbacks;
- the old README/package identity.

## 17. Assumptions to validate before implementation

These do not block the architecture plan, but should be decided when scaffolding starts:

- package manager and deployment platform;
- whether the base example should include a working contact form or only its recipe;
- preferred UI primitive baseline, if any;
- whether local MDX is acceptable as the first blog source;
- whether skills should target Codex only or also be mirrored for other agent formats;
- which real client migration will serve as the validation case;
- the expected legal/privacy review process for Singapore and each client's operating markets.

## 18. Primary references used to set priorities

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

## 19. Recommended next action

Build the basic blog slice with one local Markdown/MDX article, a server-rendered index, article metadata, sitemap integration, and a feed. Keep legal approval as a production gate requiring real project facts; do not invent generic approvals to close Phase 2.
