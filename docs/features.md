# Feature and consideration catalog

Use this file at kickoff to decide what the project keeps, deletes, or adds. Defaults are code, not flags.

## Rules

- PostHog, blog, and use cases are included by default as their phases are completed.
- If unused, delete the route/components/content, navigation and sitemap entries, tests, dependency, and recipe references.
- Do not retain an unused integration behind `enabled: false`.
- Contact and advanced capabilities are added when the real project selects them.
- Record the project decision in `docs/launch/status.md`.

## Catalog

| Capability                                   | Default                   | Current state                         | Priority when used       | Main paths / action                                                               |
| -------------------------------------------- | ------------------------- | ------------------------------------- | ------------------------ | --------------------------------------------------------------------------------- |
| Explicit homepage                            | Keep                      | Implemented                           | P0                       | `src/app/(marketing)/page.tsx`                                                    |
| Shared header/footer                         | Keep                      | Implemented                           | P0                       | `src/components/site-*`                                                           |
| shadcn/ui primitives                         | Keep minimal              | Button, Card, and Badge implemented   | P1                       | `components.json`, `src/components/ui`; delete any primitive no page uses         |
| Metadata, canonical, structured-data helpers | Keep                      | Implemented                           | P0/P1                    | `src/lib/seo.ts`                                                                  |
| Robots and sitemap                           | Keep                      | Implemented                           | P0                       | `src/app/robots.ts`, `sitemap.ts`                                                 |
| 404 and error UI                             | Keep                      | Implemented                           | P0                       | `src/app/not-found.tsx`, `error.tsx`                                              |
| Terms and privacy                            | Keep and replace          | Scaffolded                            | P0 before production     | `src/app/privacy`, `src/app/terms`                                                |
| PostHog                                      | Keep unless unused        | Implemented, inactive without token   | P1                       | Configure or follow `docs/recipes/posthog.md` to remove                           |
| Blog                                         | Keep unless unused        | Planned page phase                    | P1                       | Local Markdown/MDX, server-rendered index/article; delete whole surface if unused |
| Use cases                                    | Keep unless unused        | Grouped hub and four details complete | P1                       | `/uses`, drop-in use-case JSON, group manifest, dynamic detail route              |
| Migration redirects                          | Keep for migrations       | Empty map                             | P0 for migration         | `docs/launch/url-map.csv`, `src/config/redirects.ts`                              |
| Contact form                                 | Add when selected         | Not started                           | P0 if primary conversion | Accessible UI, validated server handler, delivery and abuse controls              |
| Social previews                              | Keep                      | Implemented baseline                  | P1                       | `src/app/opengraph-image.tsx`, page metadata                                      |
| Animated sections                            | Add deliberately          | Homepage has CSS-only motion          | P1/P2                    | Route-local code, reduced motion, no hidden critical copy                         |
| Generated graphics                           | Add deliberately          | Not installed                         | P1/P2                    | Project-owned optimized assets with provenance/alt intent                         |
| Blog tags/search/related content             | Add later                 | Not installed                         | P2                       | Only after enough content exists                                                  |
| Docs/knowledge base                          | Add later                 | Not installed                         | P2                       | Choose tooling for actual docs needs                                              |
| `llms.txt`                                   | Add later                 | Not installed                         | P2                       | Generate from enabled content sources                                             |
| `.md` route representations                  | Add later                 | Not installed and non-blocking        | P2                       | Same source as HTML; HTML stays canonical                                         |
| IndexNow                                     | Add later                 | Not installed                         | P2                       | New per-site key and publish workflow                                             |
| i18n/hreflang                                | Add when locales exist    | Not installed                         | P1/P2                    | Locale-aware routing, canonicals, sitemap, hreflang                               |
| Experiments/personalization                  | Add with measurement plan | Not installed                         | P2                       | Review caching, crawl consistency, consent, and event design                      |

## Design-system replacement

Import a client system in this order:

1. Replace semantic tokens in `src/app/globals.css`.
2. Replace/add only primitives the current pages use.
3. Restyle the site shell.
4. Recompose route-local page sections.

`components.json` is the shadcn generator configuration, while the generated component files remain project-owned code. Keep the semantic shadcn variables mapped to the client tokens instead of maintaining two unrelated themes.

Routing, SEO helpers, sitemap/robots, redirect map, and launch audit should survive the visual replacement.
