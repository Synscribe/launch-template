# Agentic Website Template — detailed feature list

This is the working feature inventory for Launch Template marketing, discovery, and conversion copy. It is deliberately broader than a homepage feature grid and more precise than a sales page: public claims should be traceable to a capability in the template, its launch system, or its documented agent workflows.

## Positioning

**Primary category:** Agentic Website Template

**Lead outcome:** Get found by Google and ChatGPT.

**Supporting promise:** Migrate without throwing away the site that already works, then let the growth team ship the next change from a repository it owns.

**Category definition:** An agentic website is a marketing site built to be **edited by AI agents**—your growth team's Claude Code or Cursor points at a repo you own and ships changes without a dev in the loop.

**Plain-language fallback:** A Next.js website template with technical SEO, AI search optimization, migration workflows, lead attribution, and production launch checks built in.

**Best fit:** Growth and go-to-market teams at companies that are already live, already have customers, and need the website to become a durable operating asset rather than another no-code silo or developer queue.

**Migration wedge:** Clone the existing website 1:1, preserve its useful content and URLs, then upgrade the engine underneath it. The workflow applies to Webflow-to-Next.js, Framer-to-Next.js, WordPress-to-Next.js, and other authorized visible-site migrations; it is a guided code migration, not a one-click importer.

**Durability promise:** The site survives the person who built it. Its routes, content ownership, launch requirements, removal paths, and operating decisions are written down beside the code.

## The five signature feature groups

| Job to be done                  | Outcome                                                                                                              | Included proof                                                                                                                                                                         |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Build the SEO foundation        | Give every public page a clear, crawlable, canonical identity                                                        | Metadata helpers, canonical URLs, robots policy, sitemap generation, server-rendered content, structured-data builders, and live checks                                                |
| Prepare for AI search           | Make authoritative pages easier for agents and answer engines to find, understand, and select                        | `llms.txt`, homepage discovery `Link` headers, citation-friendly content rules, consistent descriptions, schema.org helpers, direct public-source validation, and HTML-first rendering |
| Migrate without starting over   | Keep the design and useful search signals while moving to an owned Next.js codebase                                  | URL inventory, URL map, redirect policy, page-signal comparison, asset/widget capture, screenshot comparison, cutover gates, and monitoring                                            |
| Let agents edit the site safely | Give the growth team explicit code, context, and verification instead of a proprietary visual-builder runtime        | App Router pages, route-local composition, repository instructions, canonical docs, focused agent skills, typed boundaries, tests, and launch commands                                 |
| Know where every lead came from | Carry useful acquisition and journey context into the conversion without collecting an uncontrolled browsing history | First-touch UTMs, query-free referrer, first landing page, five recent same-site paths, server revalidation, SMTP delivery, and privacy-aware analytics                                |

## 1. SEO foundation

The template treats technical SEO as part of the application architecture and launch process, not as a plugin installed after the pages are written.

### Page-level search signals

- A shared metadata builder keeps page titles, descriptions, canonical URLs, Open Graph fields, and Twitter card fields aligned.
- Every indexable route can declare its own title, description, canonical path, and social image while retaining one production origin.
- Page copy and metadata live with the route that owns them, so an agent can change the page and its search presentation in the same reviewable edit.
- The default page definition checks the meta title, meta description, H1, first visible content, real source dates, canonical URL, social preview, and indexability.
- The homepage can use one concise positioning sentence in visible copy, the meta description, and `WebSite` JSON-LD, giving people and machines a consistent definition of the offer.

### Crawlability and indexability

- Environment-aware `robots.txt` blocks local and preview deployments by default.
- Production indexing must be enabled deliberately through the deployment environment; it is never inferred from a plausible domain.
- Production robots policy permits intended public pages, blocks API paths, and publishes the absolute sitemap location.
- The sitemap is generated from actual enabled routes and content sources, including use cases and Wisp articles.
- Search, filter, pagination, redirect, error, preview, and `noindex` variants stay out of the canonical HTML sitemap by default.
- Core copy, headings, navigation, article content, use-case links, filters, pagination, and CTAs are server-rendered as HTML instead of arriving only after a client-side fetch.
- Unknown routes return a real 404. Removed content receives an intentional 404/410 or a relevant direct redirect instead of a misleading trip to the homepage.

### Canonical URL discipline

- One helper builds absolute URLs from the reviewed production origin.
- Canonicals, sitemap entries, internal links, structured data, and social-sharing URLs are designed to converge on the same final destination.
- The migration workflow explicitly covers host, protocol, path case, trailing slashes, query parameters, and redirect chains.
- Preview hosts are prevented from silently becoming production canonicals or share URLs.

### Structured data

- Typed schema.org builders are included for `WebSite`, breadcrumbs, articles, and FAQs.
- Article schema uses real published and modified dates only when the content source supplies them.
- FAQ schema is generated from the same questions and answers people see on the page.
- JSON-LD serialization escapes opening tags to avoid turning structured data into an injection path.
- The checklist favors accurate, applicable schema over adding generic markup to every route for appearance's sake.

### Search-result and sharing presentation

- A generated 1200×630 Open Graph image provides a code-native starting point that must be replaced with client-approved branding before production.
- Important pages receive aligned Open Graph and Twitter metadata.
- Social images, copy, crop, branding, and canonical production URLs are part of the launch review.

## 2. GEO and AI-search readiness

“GEO-ready” means the site exposes clear, authoritative, technically accessible source material for AI systems. It does not promise a ranking or citation from Google, ChatGPT, Perplexity, or any other system.

### `llms.txt` with production safeguards

- A complete root-level `llms.txt` example shows how to define the company, group authoritative pages, and describe the task or question each page answers.
- The homepage response advertises `/llms.txt` and `/sitemap.xml` in a structured HTTP `Link` header, letting clients discover those machine-readable surfaces without first parsing the HTML body.
- The entire discovery-header rule is conditional on `public/llms.txt`; deleting the file removes both links on the next build or server start.
- The format favors a curated source index over a sitemap dump: one identity, a self-contained definition, a review date, and described absolute links.
- A source validator rejects the untouched template, unresolved client placeholders, malformed structure, duplicate URLs, relative URLs, bare URLs, and links without useful descriptions.
- The live audit verifies that `/llms.txt` returns a direct, cookieless HTTP 200 response as plain text or Markdown rather than an HTML shell.
- In production, the audit follows every listed target and verifies that it is direct, public, and returns usable HTML or Markdown without authentication or redirects.
- The maintenance recipe ties `llms.txt` updates to real route, positioning, content, and release changes so the file does not become a stale parallel content inventory.

### Citation-friendly content structure

- The homepage positioning pattern creates one self-contained block naming the brand, category, audience, and real capabilities without requiring surrounding context.
- Route-specific H1s, opening copy, headings, FAQs, use-case details, dates, and internal links remain in server-rendered HTML.
- Blog articles receive sanitized semantic headings, stable fragment IDs, visible source dates, descriptions, and article schema.
- The content rules prohibit invented proof, automatically refreshed dates, stale instructions, generic “learn more” descriptions, and unsupported customer outcomes.
- Machine-readable summaries are derived from the same facts people see, reducing contradictions between visible copy, metadata, schema, sitemaps, and agent-facing files.

### Clear authority and source hygiene

- `llms.txt` points only to reviewed, public, authoritative production pages.
- Use-case pages validate metadata, content shape, group membership, visual references, and internal CTA destinations before they build.
- Blog HTML is sanitized, malformed local links are removed, external links are hardened, source-relative links can be resolved deliberately, and duplicate lead images are stripped.
- Published and modified dates remain connected to the CMS source rather than being invented for freshness.

### Current scope boundary

- HTML remains the canonical source.
- Content negotiation and alternate `.md` representations are not currently implemented and should not be advertised as shipped features.
- The architecture documents how selected Markdown representations can later be generated from the same source without creating a second hand-maintained website.

## 3. 1:1 website cloning and migration

The migration system is built to protect the live site's useful design, content, routes, integrations, and search equity while its underlying platform changes.

### Source-site inventory

- Recursive sitemap inventory follows sitemap indexes, reads plain or gzipped XML, deduplicates exact URLs, and keeps every discovered path available for the migration map.
- The workflow combines crawl data with analytics landing pages, Search Console, CMS exports, backlinks, server logs, and asset inventories so valuable orphaned URLs are not discarded.
- Exact URLs and wildcard page families are recorded separately: archetypes make implementation efficient without erasing the URL-by-URL migration obligation.
- Representative desktop and mobile screenshots capture the visual baseline.
- Forms, events, cookies, structured data, downloads, and third-party widgets are inventoried alongside visible page content.

### 1:1 visual reproduction

- The authorized clone workflow migrates project-owned source assets instead of approximating the old brand with unrelated placeholders.
- Visible widgets—including delayed overlays, consent, chat, scheduling, popups, and feedback controls—are captured in their observable desktop and mobile states.
- Screenshot comparison and visual diff loops drive implementation against the source site.
- The homepage is cloned and approved first, establishing a visual and technical reference before later routes are expanded.
- A clone journal distinguishes fully wired behavior, visual-only stand-ins, partial integrations, deliberate omissions, and blocked items.

### URL and search-equity preservation

- Every old URL receives an explicit disposition: preserve, redirect, consolidate, or intentionally remove.
- The canonical CSV URL map records source, priority, target, implementation status, verification state, and notes.
- Small and medium redirect maps have a typed Next.js configuration path; large or pattern-heavy migrations can move to reviewed CDN or hosting rules while the URL map stays canonical.
- Redirect guidance favors permanent, direct, relevant 301/308 destinations and tests encoded characters, case, query handling, host variants, loops, chains, and new 404s.
- High-value pages are compared for title, description, H1, first 200 words, dates, copy, media, structured data, internal links, and conversion paths.
- Final URLs are propagated through canonicals, navigation, body links, sitemaps, feeds, structured data, campaigns, profiles, and external references where possible.

### Safer cutover and monitoring

- Cutover checks cover the production domain, DNS/TLS, environment values, redirects, canonical sitemap, Search Console, analytics, forms, retained integrations, server capacity, errors, backups, and rollback ownership.
- Migration-only password protection, `noindex`, robots blocks, preview headers, and staging canonicals must be removed from production deliberately.
- Redirects are retained for at least a year and preferably for as long as they remain useful.
- Post-launch review covers redirect hits, 404s, indexing, sitemaps, crawl errors, rankings, landing-page traffic, conversion paths, uptime, application errors, and field Core Web Vitals.
- Domain moves include old and new Search Console properties, Change of Address when applicable, the new sitemap, and continued redirect service from the old host.

## 4. Owned code that agents can edit

The template is designed for a coding agent working in a normal repository, not for an AI wrapper around a proprietary page builder.

### Explicit Next.js architecture

- Every marketing page is an ordinary Next.js App Router route.
- Visible page copy, metadata, and composition stay in or beside that route.
- Components begin route-local and move to shared folders only after a second real use.
- Global configuration is limited to real global identity such as the brand, production URL, locale, navigation, optional contact details, and social links.
- There is no `site.json`, catch-all marketing renderer, section registry, serialized React-prop schema, or speculative block catalog for an agent to reverse-engineer.
- Dynamic routes exist only where there is a real repeated content model, such as articles and use cases.

### Repository context for AI agents

- `AGENTS.md` gives coding agents the project architecture, canonical sources, launch-safety rules, design boundaries, and required verification commands.
- `CLAUDE.md` and shared skill links expose the same project workflows to Claude-based tools without duplicating the canonical instructions.
- Stable checklist IDs let an agent refer to a launch requirement precisely without copying its wording into plans and status files.
- `PLAN.md`, the launch checklist, migration playbook, feature catalog, URL map, and configuration/removal recipes record why the system is shaped this way.
- Loud `TODO_CLIENT_*` sentinels represent missing production facts; the production audit rejects them instead of letting an agent invent believable replacements.

### Focused agent workflows

- The site-clone workflow guides an agent through source inventory, exact URL mapping, asset migration, widget reproduction, implementation journaling, screenshot comparison, and the homepage approval gate.
- The micro-UI workflow guides an agent through route-native product visuals, social images, small animations, accessibility, responsive behavior, and reduced-motion states.
- Claude Code, Codex, Cursor, and similar tools can work with the standard TypeScript, React, CSS, JSON, and Markdown files without a vendor-specific editing protocol.

### Safe design freedom

- Semantic design tokens in `globals.css` create a clear boundary for importing a client design system.
- The template includes only the shadcn/ui primitives used by current pages rather than shipping a dormant component showcase.
- Bespoke route composition remains possible without rewriting routing, metadata, robots, sitemap, redirects, or launch checks.
- `framer-motion` is the single accepted animation dependency, avoiding multiple competing motion systems.
- Use-case visuals resolve through one bounded, typed, route-local map that accepts React components or project-owned images without turning content JSON into a page builder.

### Deletable defaults instead of feature-flag debt

- Blog, use cases, contact, Turnstile, and PostHog are ordinary code with documented configuration and full removal paths.
- Unused routes, navigation, sitemap entries, tests, environment values, dependencies, and recipes are deleted together.
- An inactive integration is not left behind a permanent `enabled: false` switch.
- Optional contact email and social profiles disappear from the UI when no real value is configured.

## 5. Privacy-conscious lead attribution

The included conversion path is designed to answer “where did this lead come from?” without forwarding arbitrary browsing data into analytics or email.

### First-touch acquisition context

- Captures only the standard first-touch `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, and `utm_content` values.
- Records the first same-site landing URL while discarding every unrelated query parameter.
- Records the first external referrer after stripping its query string and fragment.
- Keeps the original first-visit timestamp instead of overwriting attribution on every visit.

### Bounded journey context

- Keeps at most five recent same-site paths.
- Removes query strings and fragments from those recent paths.
- Rejects arbitrary off-site journey URLs.
- Expires browser attribution context after 90 days by default.
- Validates origin, field length, approved campaign keys, and expiry again on the server before delivery.

### Useful delivery without analytics PII

- The delivered lead includes the form values, first-touch acquisition context, external referrer, first landing page, and recent same-site journey.
- The default PostHog integration receives only the property-free `contact_form_submitted` event after success.
- Names, email addresses, message content, page paths, and campaign values are not attached to that analytics event.
- The privacy recipe requires the real policy to describe the browser storage, fields, purpose, recipients, access, retention, and deletion process.

## 6. Conversion-ready contact workflow

- The contact page and initial form markup are server-rendered.
- A focused Client Component adds field validation, submission state, and attribution without moving the whole page across a client boundary.
- The API trims and bounds fields, normalizes the optional website, rejects unexpected keys, limits body size, and returns safe field-specific errors.
- SMTP delivery uses an explicit server-only adapter with no fictional fallback sender or recipient.
- The form remains visibly unavailable until every required mail value is configured, and a production audit treats missing delivery as a failure.
- Delivered HTML escapes every submitted value, and the submitter is used only as `replyTo` rather than as an untrusted sender.
- The default abuse baseline includes same-origin checks, a honeypot, a completion-time check, and five attempts per IP in ten minutes.
- Optional Cloudflare Turnstile activates only when both public and secret keys exist, then verifies the token server-side with action, hostname, IP, and idempotency controls.
- Recipes make clear when the in-memory rate limiter should be replaced by a durable provider, WAF rule, or edge control.
- Production verification covers the actual recipient, reply path, success and failure states, response promise, delivery contents, attribution, analytics event, accessibility, and abuse behavior.

## 7. Production launch system

The template includes an operating system for finishing a site, not just starter components.

### One canonical launch checklist

- A prioritized JSON checklist is the source of truth for reusable requirements, client-specific requirements, current status, rationale, related files, recipes, and automated checks.
- A generated Markdown view makes the same checklist easy for humans to read without allowing status to drift into a second document.
- Stable P0, P1, and P2 priorities distinguish launch blockers from expected quality checks and later enhancements.
- Client-specific findings can be added with the checklist CLI instead of creating a separate project punch list.
- Manual requirements can be marked `todo`, `done`, or `not_applicable`; named automated checks remain machine-owned.
- Production refuses to treat unresolved applicable P0 items as a successful launch.

### Source verification

- The normal `pnpm check` path verifies formatting, checklist validity and generated-document freshness, agent-skill integrity, lint, TypeScript, and tests.
- Named launch checks verify that client placeholder visuals are gone and `llms.txt` has been replaced with a valid client-specific file.
- The source scan catches unresolved `TODO_CLIENT_*` values, forbidden legacy identities, and the unchanged template package identity.
- Tests cover SEO helpers, use-case content, article sanitization and navigation, contact validation and delivery, attribution, Turnstile, rate limiting, checklist behavior, `llms.txt`, placeholder detection, pagination, and sitemap inventory.

### Live template, preview, and production audits

- Separate audit modes enforce different expectations for local/template, preview, and production environments.
- The crawler follows rendered internal links and reports broken destinations.
- It checks response status, redirects, metadata, H1 count, visible-word review, canonical URLs, sitemap membership, document language, social metadata, JSON-LD validity, and article dates.
- It verifies that unknown routes return HTTP 404.
- It tests robots and sitemap responses and requires preview/local crawling to stay blocked while production is open.
- It checks contact form markup and whether real delivery configuration is present.
- It validates the deployed `llms.txt` response and, in production, every described target.
- It verifies that the homepage advertises the expected discovery links when `llms.txt` is enabled and advertises neither link after a deliberate removal.
- It writes a machine-readable JSON artifact and exits non-zero on failures, making the audit usable in CI.
- The audit avoids cargo-cult gates such as an exact meta-description length, generic schema on every route, sitemap `priority`, a missing optional Markdown route, or a required Lighthouse score of 100.

### Production-safe incompleteness

- Client identity, legal language, contact recipients, integrations, analytics ownership, proof, and visuals are never filled with plausible fiction.
- Placeholder legal pages are `noindex` scaffolds and contain explicit review sentinels that block production.
- Template artwork and identities are automatically rejected before launch.
- Preview and local deployments default to non-indexable.
- Optional services stay inert until their complete configuration is supplied.
- The launch checklist requires a reviewed production domain, environment, DNS/TLS setup, rollback path, cutover owner, and post-launch monitoring plan.

## 8. Content engine

### Structured use-case landing pages

- A server-rendered `/uses` hub groups and links every enabled use case.
- Each use case supplies its own slug, hub label, group, title, description, hero, problem, capabilities, method, outcomes, FAQ, and CTA.
- One validated JSON document adds a new page without allowing arbitrary component names, file paths, classes, or React props into content.
- The loader rejects malformed documents, filename/slug mismatches, duplicate slugs, unsupported visuals, duplicate capability visual IDs, unknown groups, and external CTA paths.
- `generateStaticParams` exposes real detail routes, and the sitemap discovers them from the same content source.
- A bounded typed visual resolver maps approved IDs to route-local React visuals or optimized project-owned image files.
- The detail-page composition keeps critical meaning in HTML and uses visuals to explain rather than replace the surrounding copy.
- Native server-rendered FAQ disclosures work without JavaScript.
- The entire use-case surface has a documented deletion path when a project does not need it.

### Wisp-backed blog

- The server connects directly to Wisp with a server-only publication ID.
- Blog index and article routes are server-rendered.
- Search works through a normal GET request, filters map to real Wisp tags, and numbered pagination remains crawlable through ordinary links.
- An optional approved lead article and featured tag are configured beside the blog route rather than scattered through components.
- Search, tag, and pagination variants stay canonical to `/blog` and out of the sitemap unless a project deliberately promotes a valuable archive.
- Article HTML is sanitized before rendering, external links are hardened, images and video embeds are bounded, and source-relative legacy links can be resolved to an approved content origin.
- Real `h2` and `h3` headings receive stable unique anchors and produce a server-built table of contents.
- Articles include description fallback, reading-time estimation, visible source dates, related posts, canonical social-sharing links, and Article JSON-LD.
- `/feed.xml` publishes the latest articles as RSS.
- The sitemap includes the blog index and every article returned by the configured publication.
- A temporary CMS failure does not remove the site's local routes from the sitemap.
- The blog and its CMS dependencies can be removed completely when the project does not need a publishing surface.

## 9. Analytics and measurement

- PostHog is wired through Next.js client instrumentation and stays inactive without a project token.
- The setup keeps person profiles to identified users by default.
- The contact conversion emits a deliberately property-free named event.
- The launch process requires verification of the client-owned production project, pageviews, conversion events, staff exclusions, consent behavior, session replay, and retention.
- Sensitive form values are explicitly excluded from analytics.
- Post-launch review covers Search Console, analytics, uptime/errors, redirect and 404 behavior, conversion paths, and field performance.
- PostHog can be removed without disturbing routing, SEO, content, or forms.

## 10. Performance, accessibility, and resilient rendering

- Server Components remain the default; client boundaries are isolated to errors, form interaction, attribution tracking, and optional Turnstile.
- Critical copy and links remain visible without JavaScript.
- Next.js image handling supports responsive sizes, reserved aspect ratios, intentional priority for hero media, and lazy loading for noncritical images.
- The media checklist covers ownership, provenance, licenses, alt text, crop, dimensions, responsive treatment, format, and mobile placement—not only file size.
- Article images default to lazy loading and asynchronous decoding after sanitization.
- Motion must preserve a useful static state and honor `prefers-reduced-motion`.
- The micro-UI system supports code-native React visuals, CSS-first page motion, SVG, local images, and generated social graphics without adding another general graphics runtime.
- The accessibility review covers landmarks, keyboard navigation, visible focus, labels and errors, contrast, alternatives, zoom/reflow, document language, and reduced motion.
- Performance review focuses on LCP media, layout shift, font and third-party blocking, client-bundle cost, and representative mobile Core Web Vitals rather than chasing a cosmetic perfect score.

## 11. Security and privacy baseline

- Server-only mail, CMS, and Turnstile secrets are kept out of public environment variables.
- Environment parsing validates absolute URLs and treats production as an explicit deployment state.
- The Next.js powered-by response header is disabled.
- Contact requests are checked for origin, body size, timing, rate, allowed fields, and optional Turnstile verification before delivery.
- Untrusted lead content is escaped before HTML email delivery.
- CMS article content is sanitized to an explicit element, attribute, scheme, and iframe-host allowlist.
- External article links receive `noopener noreferrer`.
- JSON-LD output escapes characters that could break out of the script context.
- The launch checklist requires a client-specific review of secrets, dependencies, external scripts, security headers, form/API abuse, consent, data access, retention, and deletion.
- Legal pages remain visibly incomplete and non-indexable until the actual entity, service behavior, processors, rights, jurisdiction, dates, and approval are supplied.

## 12. Customization and deployment

- Built on Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, and minimal shadcn/ui primitives.
- Ready for Vercel and compatible Next.js hosting; the code and content remain in the customer's repository rather than in a locked visual-builder database.
- Global identity and navigation are changed through a small typed configuration surface.
- Semantic CSS tokens let a client design system replace the visual language without disturbing the site's search and launch infrastructure.
- Header, footer, error, not-found, privacy, terms, contact, use-case, blog, RSS, robots, sitemap, and Open Graph routes are already represented as explicit code.
- Optional email and social details disappear cleanly when absent.
- Environment-backed integrations do nothing until configured, reducing accidental cross-client data flow.
- Configuration and removal recipes explain the complete file, dependency, navigation, sitemap, environment, test, and documentation impact of each default feature.

## Feature status and claim discipline

### Ready to market as included

- Agent-editable, repository-owned Next.js architecture
- Technical SEO foundation
- GEO / AI-search readiness
- Root `llms.txt` template, conditional homepage discovery `Link` header, source validation, and deployed-target audit
- Schema.org builders for website, breadcrumbs, articles, and FAQs
- Server-rendered core content and links
- Environment-safe robots policy and generated sitemap
- Canonical URL and social-preview infrastructure
- Authorized 1:1 clone and migration workflow
- URL inventory, redirect mapping, cutover, and monitoring playbook
- Privacy-conscious lead attribution
- Validated contact form with SMTP adapter and baseline abuse controls
- Optional Turnstile and PostHog integrations
- Validated use-case page system
- Server-rendered Wisp blog with search, filters, pagination, related content, table of contents, RSS, and sitemap integration
- Canonical launch checklist, source verification, and live environment audit
- Route-native visuals and reduced-motion workflow
- Full configuration and deletion recipes for default features

### Market with a qualifier

- **“Gets found by Google and ChatGPT.”** Use as the lead outcome, followed by the more defensible explanation: the template implements crawlability, technical SEO, structured content, `llms.txt`, and AI-search readiness; no template can guarantee a ranking or citation.
- **“Clone any site you can see.”** Limit this to authorized sites and describe it as an agent-guided inventory, implementation, asset migration, and visual-comparison workflow—not automated copying or a one-click importer.
- **“No developer in the loop.”** Best used for routine growth-site changes after the repository, deployment permissions, and review policy are set up. Complex product integrations, legal approval, security decisions, and high-risk launches still require the appropriate owner.
- **“Self-hosted.”** Prefer “you own the repository and deployment” or “deploy to Vercel or another compatible Next.js host.” Vercel itself is managed hosting, so “self-hosted on Vercel” is imprecise.
- **“GEO-ready.”** Tie the phrase to concrete features—`llms.txt`, server-rendered content, consistent positioning, schema.org, citation hygiene, direct public pages, and validation—rather than implying control over an answer engine.

### Do not market as shipped yet

- HTTP content negotiation
- Alternate `.md` page representations
- Full-corpus Markdown exports or retrieval APIs
- IndexNow submission automation
- Built-in internationalization or `hreflang`
- A docs or knowledge-base framework
- Experimentation or personalization infrastructure
- A CMS-independent blog adapter
- One-click Webflow, Framer, or WordPress importing
- Guaranteed rankings, citations, traffic retention, performance scores, or conversion lift
- Customer logos, testimonials, outcome metrics, or a public showcase until real approved proof exists
- The course, agency package, or pricing offer until their real scope and delivery terms are defined

## Short-form feature stack

Use this version for a README introduction, directory listing, or compressed sales section:

> Launch Template is an Agentic Website Template for growth teams that want an owned, AI-editable marketing site. It combines a Next.js App Router foundation with technical SEO, `llms.txt` and HTTP discovery links, schema.org, server-rendered content, an authorized 1:1 migration workflow, privacy-conscious lead attribution, a production contact path, a Wisp content engine, and launch checks for routes, canonicals, robots, sitemaps, metadata, indexability, social previews, and unfinished client values. Deploy it on Vercel or another compatible host, keep the code, and let Claude Code, Codex, Cursor, or a similar agent ship the next change from a repository whose structure and launch rules are already written down.

## Suggested feature-page grouping

For the future `/features` route, keep the public page focused on buyer jobs rather than reproducing this entire inventory:

1. **Get found by Google and AI search** — combine the SEO and GEO foundations.
2. **Migrate without losing what already works** — show the 1:1 clone, URL map, redirects, and cutover system.
3. **Let your growth team ship the next change** — explain the explicit agent-editable repository and owned deployment.
4. **Know which pages create leads** — show the minimized first-touch and recent-journey attribution.
5. **Launch without the usual production mistakes** — close with the checklist, live audit, placeholder gates, preview safety, and rollback discipline.

Keep Wisp, PostHog, Turnstile, use-case pages, visuals, and RSS as supporting capabilities beneath those five jobs. They strengthen the offer, but they should not compete with the category claim or the migration-and-ownership differentiator.
