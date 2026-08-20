# Project launch status

This file is the per-project record. Replace template entries with owners, evidence, dates, and approved exceptions. The reusable requirements live in `checklist.md`.

## Project

| Field              | Value                          |
| ------------------ | ------------------------------ |
| Project            | Next.js Client Launch Template |
| Mode               | New template foundation        |
| Production domain  | Unassigned                     |
| Launch date/window | Unassigned                     |
| Technical owner    | Unassigned                     |
| Client approver    | Unassigned                     |
| Rollback owner     | Unassigned                     |

## Current implementation phase

| Phase              | Status                 | Evidence                                                             |
| ------------------ | ---------------------- | -------------------------------------------------------------------- |
| Phase 0 foundation | Complete               | Config, shell, SEO, robots, sitemap, PostHog, docs, audit            |
| Phase 1 homepage   | Complete               | `src/app/(marketing)/page.tsx`, desktop and mobile review            |
| Legal approval     | Blocked for production | `TODO_CLIENT_LEGAL_REVIEW` intentionally present                     |
| Contact            | Not started            | Later page phase                                                     |
| Use cases          | Complete               | Grouped `/uses` hub and four JSON-backed detail pages                |
| Blog               | Complete               | Wisp featured index, filters, article TOC/sharing, feed, and sitemap |

## P0 evidence

| ID       | Status                              | Owner      | Evidence / exception                                                   |
| -------- | ----------------------------------- | ---------- | ---------------------------------------------------------------------- |
| BRAND-01 | Template only                       | Unassigned | Audit found no legacy identities; production rejects template identity |
| ROUTE-01 | Pass for current routes             | Unassigned | Local template audit, `artifacts/launch-audit.json`                    |
| ROUTE-02 | Pass                                | Unassigned | Custom 404 returned HTTP 404 in the local audit                        |
| SEO-01   | Pass in template mode               | Unassigned | Local crawling blocked; production verification remains                |
| SEO-02   | Pass for current routes             | Unassigned | Route metadata/H1 review; Wisp articles expose source dates            |
| SEO-03   | Pass for current routes             | Unassigned | Canonicals verified by the local audit                                 |
| SEO-04   | Implemented                         | Unassigned | Environment-aware `src/app/robots.ts`                                  |
| SEO-05   | Pass for current routes             | Unassigned | Local routes and Wisp articles listed by `src/app/sitemap.ts`          |
| SEO-06   | Pass for current routes             | Unassigned | Raw HTML includes blog links, article copy, dates, and navigation      |
| SEO-07   | Pass locally                        | Unassigned | One canonical root; production origin decision remains                 |
| PERF-01  | Pass for representative routes      | Unassigned | Responsive Wisp images; noncritical images lazy; dimensions reserved   |
| PERF-02  | Pass locally; deploy check required | Unassigned | Browser profile: LCP 36 ms, CLS 0 on local production build            |
| SEC-01   | Pending production review           | Unassigned | No client secrets configured in the template                           |
| LEGAL-01 | Fail by design                      | Unassigned | Replace both legal scaffolds and record approval                       |
| OPS-01   | Not started                         | Unassigned | Production owners and rollback path are unassigned                     |
| QA-01    | Pass locally; deploy check required | Unassigned | `pnpm check`, build, browser review, and template audit                |

## P1 decisions

| ID           | Decision                                               | Owner      | Evidence                                         |
| ------------ | ------------------------------------------------------ | ---------- | ------------------------------------------------ |
| SEO-08       | WebSite, BreadcrumbList, and Article schema where used | Unassigned | `src/lib/seo.ts`                                 |
| SOCIAL-01    | Default and article source images implemented          | Unassigned | Generated fallback, Wisp images, audit passed    |
| A11Y-01      | Non-blocking base review passed                        | Unassigned | Semantic snapshot, mobile layout, reduced motion |
| ANALYTICS-01 | PostHog code included, token absent                    | Unassigned | `src/instrumentation-client.ts`                  |
| MON-01       | Not assigned                                           | Unassigned | —                                                |

## P2 decisions

| ID         | Decision                                                             | Owner      | Evidence                                           |
| ---------- | -------------------------------------------------------------------- | ---------- | -------------------------------------------------- |
| CONTENT-01 | Wisp tags drive discovery; articles add server-built TOC/share links | Unassigned | Blog config/content helpers; desktop/mobile SSR QA |

## Approved exceptions

None. Add the checklist ID, approver, reason, impact, follow-up owner, and due date here.

## Launch log

| Date       | Event                        | Result / follow-up                                                |
| ---------- | ---------------------------- | ----------------------------------------------------------------- |
| 2026-08-20 | Previous template audited    | New architecture recorded in `PLAN.md`                            |
| 2026-08-20 | Phase 0 and Phase 1 built    | Foundation and homepage completed                                 |
| 2026-08-20 | Local launch audit and QA    | 18 pass, 0 warning, 3 intentional info; deploy audit remains      |
| 2026-08-20 | shadcn/ui foundation added   | Button, Card, and Badge adopted without a component catalog       |
| 2026-08-20 | First use-case detail built  | JSON-backed website-migrations page; index awaits review          |
| 2026-08-20 | Use-case detail audited      | 26 pass, 0 warning, 3 intentional info; desktop/mobile clean      |
| 2026-08-20 | Use-case content deepened    | Group-aware model; 26 pass, 0 warning; desktop/mobile clean       |
| 2026-08-20 | Use-case reading pass        | Desktop hero 1,360→722px; mobile hero 1,981→1,248px               |
| 2026-08-20 | Uses collection completed    | Grouped hub and four details; 58 pass, 0 warning, 3 info          |
| 2026-08-20 | Wisp blog completed          | Direct CMS calls, SSR index/articles, RSS, and sitemap            |
| 2026-08-20 | Blog launch audit            | 794 pass, 1 crawl-limit warning, 3 template info, 0 failures      |
| 2026-08-20 | Blog discovery UI added      | 790 pass, 5 crawl/short-variant warnings, 3 info, 0 failures      |
| 2026-08-20 | Article layout and TOC added | 790 pass, 5 crawl/short-variant warnings, 3 info, 0 failures      |
| 2026-08-20 | Article hero corrected       | Original tokens restored; description and last-updated date shown |

## Temporary template integrations

| Integration | Current value                                                    | Required client action                            | Owner      |
| ----------- | ---------------------------------------------------------------- | ------------------------------------------------- | ---------- |
| Wisp        | Cyber Sierra publication ID and content origin in `.env.example` | Replace or delete the blog before a client launch | Unassigned |
