# Migration and rebuild playbook

Use this workflow whenever an existing public site is being migrated, rebuilt, redesigned, or moved to a new domain. The canonical requirements are `MIG-01` through `MIG-08` in `checklist.md`.

## 1. Define the kind of change

Record whether the project changes:

- hosting/framework only;
- page design or component system;
- content/CMS;
- information architecture and URL paths;
- protocol, host, or domain;
- several of these at once.

For higher-traffic sites, reduce simultaneous change where practical. A framework migration, domain move, complete content rewrite, and new analytics model create more variables to diagnose when launched together.

## 2. Capture the old site

Before implementation:

- crawl reachable HTML and assets;
- save old XML sitemaps and robots rules;
- export landing pages and conversions from analytics;
- export indexed/performance pages and linking data from Search Console;
- export CMS routes and content;
- review server logs when available;
- identify linked PDFs, images, videos, and downloads;
- capture representative desktop/mobile screenshots;
- record forms, events, cookies, structured data, and external integrations.

Store old URLs in `url-map.csv`. Add the source of each URL so important orphaned URLs are not discarded merely because a crawl missed them.

## 3. Map every old URL

Allowed dispositions:

- `preserve`: same canonical path and content purpose;
- `redirect`: permanent redirect to a relevant final replacement;
- `consolidate`: multiple genuinely overlapping pages merge into one relevant destination;
- `gone`: intentional 404/410 with no misleading redirect.

For each URL, record traffic/backlink priority, new destination, implementation status, verification result, and notes. Do not mass-map unresolved rows to `/`.

## 4. Build one representative route first

Choose a route that exercises the real page model without being the riskiest page. Compare:

- status and final URL;
- title, description, H1, and first 200 words;
- visible published/updated dates where applicable;
- canonical, robots, hreflang, and structured data;
- internal links and conversion path;
- media and downloads;
- mobile/desktop screenshots;
- server-rendered HTML;
- performance and third-party scripts.

Use the result to define the next route. Do not create a generic block engine to account for every old template variation.

## 5. Implement redirects

For small and medium maps, implement reviewed rules in `src/config/redirects.ts`. Large or pattern-heavy migrations may use hosting/CDN rules, but `url-map.csv` remains the project evidence.

Rules:

- prefer server-side 301/308;
- redirect directly to the final destination;
- preserve needed query values and discard tracking noise deliberately;
- test encoded characters, case, trailing slash, host, protocol, and locale behavior;
- never redirect to a new 404;
- avoid wildcard rules until sampled against real URLs.

## 6. Compare preview against old

Run the launch audit and a migration comparison before cutover. Review all high-priority URLs plus a sample of each page type and disposition. Verify both the HTML and the rendered experience.

The comparison should report:

- old status → new status/final URL;
- redirect hops;
- title/description/H1 change;
- canonical/indexability change;
- first-200-word or key-content change;
- internal-link failures;
- structured-data/date change when applicable;
- screenshot differences for clone work.

## 7. Cutover

Before DNS or route activation:

- production environment and domain are final;
- temporary authentication/noindex/robots blocks have a named remover;
- redirects are deployed and tested;
- new canonical sitemap is ready;
- Search Console properties are verified;
- analytics events and form delivery work;
- server capacity, error monitoring, backup, and rollback are ready;
- client and technical owners share the launch window.

## 8. Monitor

At launch, first day, first week, and recurring intervals review:

- redirect and 404 logs;
- old/new traffic and conversion paths;
- Search Console indexing, sitemaps, crawl errors, queries, and pages;
- uptime and application errors;
- field Core Web Vitals when data becomes available;
- unexpected old-site traffic that reveals a missing mapping.

Keep redirects at least one year and preferably while they remain useful. For a domain move, complete the appropriate Search Console Change of Address process and retain the old host so redirects continue to work.
