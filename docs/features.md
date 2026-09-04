# Feature and consideration catalog

Use this file at kickoff to decide what the project keeps, deletes, or adds. Defaults are code, not flags.

## Rules

- PostHog, blog, use cases, contact, and Turnstile integration code are included by default as their phases are completed. Environment-backed services stay inactive until configured.
- If unused, delete the route/components/content, navigation and sitemap entries, tests, dependency, and recipe references.
- Do not retain an unused integration behind `enabled: false`.
- Advanced capabilities are added when the real project selects them.
- Mark checks for a removed feature `not_applicable` in `docs/launch/checklist.json`.

## Catalog

| Capability                                   | Default                   | Current state                                                                                                              | Priority when used       | Main paths / action                                                                              |
| -------------------------------------------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------ |
| Explicit homepage                            | Keep                      | Implemented; one contact action, positioning summary, capabilities, workflow, FAQ, and close                               | P0                       | `src/app/(marketing)/page.tsx`, `docs/recipes/homepage.md`                                       |
| Homepage proof sections                      | Keep only with real proof | Omitted until approved logos, sourced outcomes, or attributed quotes exist                                                 | P0 when shown            | Follow `HOME-02`; remove empty or unapproved proof instead of using samples                      |
| Shared header/footer                         | Keep                      | Implemented                                                                                                                | P0                       | `src/components/site-*`                                                                          |
| shadcn/ui primitives                         | Keep minimal              | Button, Card, and Badge implemented                                                                                        | P1                       | `components.json`, `src/components/ui`; delete any primitive no page uses                        |
| Metadata, canonical, structured-data helpers | Keep                      | Implemented                                                                                                                | P0/P1                    | `src/lib/seo.ts`                                                                                 |
| Robots and sitemap                           | Keep                      | Implemented                                                                                                                | P0                       | `src/app/robots.ts`, `sitemap.ts`                                                                |
| 404 and error UI                             | Keep                      | Implemented                                                                                                                | P0                       | `src/app/not-found.tsx`, `error.tsx`                                                             |
| Terms and privacy                            | Keep and replace          | Scaffolded                                                                                                                 | P0 before production     | `src/app/privacy`, `src/app/terms`                                                               |
| PostHog                                      | Keep unless unused        | Implemented, inactive without token                                                                                        | P1                       | Configure or follow `docs/recipes/posthog.md` to remove                                          |
| Blog                                         | Keep unless unused        | Wisp index and article routes complete                                                                                     | P1                       | `src/app/blog`, `src/lib/blog.ts`, `docs/recipes/blog.md`                                        |
| Use cases                                    | Keep unless unused        | Grouped hub and four details; hero/capability IDs use the shared project visual resolver                                   | P1                       | `/uses`, drop-in JSON, `UseCaseVisual`, `src/components/visuals`, dynamic detail                 |
| Migration redirects                          | Keep for migrations       | Empty map                                                                                                                  | P0 for migration         | `docs/launch/url-map.csv`, `src/config/redirects.ts`                                             |
| Contact form                                 | Keep unless unused        | Implemented; delivery unavailable until server mail values are set                                                         | P0 if primary conversion | `src/app/contact`, `src/app/api/contact`, `docs/recipes/contact.md`                              |
| Cloudflare Turnstile                         | Configure when warranted  | Included for the contact form; inactive unless both keys are set                                                           | P1 with public forms     | `src/lib/turnstile.ts`, `src/app/contact/_components/turnstile.tsx`, `docs/recipes/turnstile.md` |
| Social previews                              | Keep                      | Generated branded fallback implemented                                                                                     | P1                       | `src/app/opengraph-image.tsx`, page metadata, `$micro-ui`                                        |
| Animated sections                            | Add deliberately          | Homepage and two `/uses` samples use CSS-only motion                                                                       | P1/P2                    | Route-local code, reduced motion, no hidden critical copy; `$micro-ui`                           |
| Generated graphics                           | Add deliberately          | `$micro-ui` plus one typed React/local-file project visual resolver implemented                                            | P1/P2                    | `.agents/skills/micro-ui`, `src/components/visuals`, `public/media/uses`                         |
| Visual review workspace                      | Keep with project visuals | `/dev` hub and full visual inventory; unavailable without an exact server-only allow value                                 | P2 internal tooling      | `VISUAL_REVIEW_ENABLED`, `src/app/dev`, `src/components/visuals`                                 |
| Launch asset generator                       | Keep when useful          | Three 1270×760 template frames plus production-build Chrome exporter implemented                                           | P2 internal tooling      | `/dev/launch-assets`, `pnpm launch:assets`, `docs/recipes/launch-assets.md`                      |
| Blog discovery and article navigation        | Keep with blog            | Search, numbered pages, related cards, TOC, sharing, and feed implemented                                                  | P2                       | Server-rendered links and content; `src/app/blog`, `/feed.xml`                                   |
| Blog featured content and tag filters        | Configure when maintained | Empty by default; add only real CMS slugs and tags                                                                         | P2                       | Edit `src/app/blog/blog.config.ts`; use only real CMS slugs/tags                                 |
| Docs/knowledge base                          | Add later                 | Not installed                                                                                                              | P2                       | Choose tooling for actual docs needs                                                             |
| `llms.txt` + discovery `Link` header         | Keep and replace          | Launch Template example, conditional homepage discovery links, source check, live header/response/target audit, and recipe | P2                       | `public/llms.txt`, `src/config/discovery.ts`, `next.config.ts`, `docs/recipes/llms-txt.md`       |
| `.md` route representations                  | Add later                 | Not installed and non-blocking                                                                                             | P2                       | Same source as HTML; HTML stays canonical                                                        |
| IndexNow                                     | Generate per site         | Key generator included; no template key is shipped                                                                         | P2                       | `pnpm indexnow:key`, `docs/recipes/indexnow.md`                                                  |
| i18n/hreflang                                | Add when locales exist    | Not installed                                                                                                              | P1/P2                    | Locale-aware routing, canonicals, sitemap, hreflang                                              |
| Experiments/personalization                  | Add with measurement plan | Not installed                                                                                                              | P2                       | Review caching, crawl consistency, consent, and event design                                     |

## Design-system replacement

Import a client system in this order:

1. Replace semantic tokens in `src/app/globals.css`.
2. Replace/add only primitives the current pages use.
3. Restyle the site shell.
4. Recompose route-local page sections.

`components.json` is the shadcn generator configuration, while the generated component files remain project-owned code. Keep the semantic shadcn variables mapped to the client tokens instead of maintaining two unrelated themes.

Routing, SEO helpers, sitemap/robots, redirect map, and launch audit should survive the visual replacement.
