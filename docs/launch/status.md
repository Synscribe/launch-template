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

| Phase              | Status                 | Evidence                                                  |
| ------------------ | ---------------------- | --------------------------------------------------------- |
| Phase 0 foundation | Complete               | Config, shell, SEO, robots, sitemap, PostHog, docs, audit |
| Phase 1 homepage   | Complete               | `src/app/(marketing)/page.tsx`, desktop and mobile review |
| Legal approval     | Blocked for production | `TODO_CLIENT_LEGAL_REVIEW` intentionally present          |
| Contact            | Not started            | Later page phase                                          |
| Use cases          | Complete               | Grouped `/uses` hub and four JSON-backed detail pages     |
| Blog               | Planned default        | Later page phase; delete folder if unused                 |

## P0 evidence

| ID       | Status                              | Owner      | Evidence / exception                                                   |
| -------- | ----------------------------------- | ---------- | ---------------------------------------------------------------------- |
| BRAND-01 | Template only                       | Unassigned | Audit found no legacy identities; production rejects template identity |
| ROUTE-01 | Pass for current routes             | Unassigned | Local template audit, `artifacts/launch-audit.json`                    |
| ROUTE-02 | Pass                                | Unassigned | Custom 404 returned HTTP 404 in the local audit                        |
| SEO-01   | Pass in template mode               | Unassigned | Local crawling blocked; production verification remains                |
| SEO-02   | Pass for homepage                   | Unassigned | Metadata, one H1, and first-200-word review completed                  |
| SEO-03   | Pass for homepage                   | Unassigned | Canonical verified by the local audit                                  |
| SEO-04   | Implemented                         | Unassigned | Environment-aware `src/app/robots.ts`                                  |
| SEO-05   | Pass for current routes             | Unassigned | Homepage, uses hub, and four details listed by `src/app/sitemap.ts`    |
| SEO-06   | Pass for homepage                   | Unassigned | Copy and navigation present in rendered HTML                           |
| SEO-07   | Pass locally                        | Unassigned | One canonical root; production origin decision remains                 |
| PERF-01  | Pass for current homepage           | Unassigned | No content media; reduced motion leaves all copy visible               |
| PERF-02  | Pass locally; deploy check required | Unassigned | Browser profile: LCP 36 ms, CLS 0 on local production build            |
| SEC-01   | Pending production review           | Unassigned | No client secrets configured in the template                           |
| LEGAL-01 | Fail by design                      | Unassigned | Replace both legal scaffolds and record approval                       |
| OPS-01   | Not started                         | Unassigned | Production owners and rollback path are unassigned                     |
| QA-01    | Pass locally; deploy check required | Unassigned | `pnpm check`, build, browser review, and template audit                |

## P1 decisions

| ID           | Decision                                              | Owner      | Evidence                                         |
| ------------ | ----------------------------------------------------- | ---------- | ------------------------------------------------ |
| SEO-08       | WebSite schema on home; BreadcrumbList on uses routes | Unassigned | `src/lib/seo.ts`                                 |
| SOCIAL-01    | Default generated image implemented                   | Unassigned | `src/app/opengraph-image.tsx`, audit passed      |
| A11Y-01      | Non-blocking base review passed                       | Unassigned | Semantic snapshot, mobile layout, reduced motion |
| ANALYTICS-01 | PostHog code included, token absent                   | Unassigned | `src/instrumentation-client.ts`                  |
| MON-01       | Not assigned                                          | Unassigned | —                                                |

## Approved exceptions

None. Add the checklist ID, approver, reason, impact, follow-up owner, and due date here.

## Launch log

| Date       | Event                       | Result / follow-up                                           |
| ---------- | --------------------------- | ------------------------------------------------------------ |
| 2026-08-20 | Previous template audited   | New architecture recorded in `PLAN.md`                       |
| 2026-08-20 | Phase 0 and Phase 1 built   | Foundation and homepage completed                            |
| 2026-08-20 | Local launch audit and QA   | 18 pass, 0 warning, 3 intentional info; deploy audit remains |
| 2026-08-20 | shadcn/ui foundation added  | Button, Card, and Badge adopted without a component catalog  |
| 2026-08-20 | First use-case detail built | JSON-backed website-migrations page; index awaits review     |
| 2026-08-20 | Use-case detail audited     | 26 pass, 0 warning, 3 intentional info; desktop/mobile clean |
| 2026-08-20 | Use-case content deepened   | Group-aware model; 26 pass, 0 warning; desktop/mobile clean  |
| 2026-08-20 | Use-case reading pass       | Desktop hero 1,360→722px; mobile hero 1,981→1,248px          |
| 2026-08-20 | Uses collection completed   | Grouped hub and four details; 58 pass, 0 warning, 3 info     |
