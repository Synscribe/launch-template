# Wisp blog: configure or remove

The blog is ordinary, deletable application code. It connects directly to Wisp on the server. There is no feature flag, retry layer, or application cache.

## Configure

1. Set `WISP_BLOG_ID` in the local and deployment environments. Keep it server-only; the browser does not need it.
2. Replace the demo publication ID before using the template for a client.
3. Confirm the Wisp publication belongs to the client and contains only content approved for the production domain.
4. Keep article links absolute or relative to this website. Root-relative links remain on the current domain.
5. In Wisp, add the real tags that the index should use. The demo source includes `tips-and-tricks`; do not assume a client publication uses it.
6. Edit `src/app/blog/blog.config.ts`. Add only filters backed by maintained Wisp tags. Set the optional lead article slug and featured tag, or use `null` to omit either featured surface. Remove a filter entry to hide it; there are no runtime feature flags.
7. Review the first page, every configured filter, an empty result, a search result, a middle and final pagination page, an article with an image, an article without an image, a long and short table of contents, every share destination, related articles, `/feed.xml`, and `/sitemap.xml`.
8. Confirm titles, descriptions, H1s, opening copy, visible date treatment, canonical URLs, share images, and Article JSON-LD against `SEO-02`, `SEO-03`, `SEO-05`, `SEO-06`, `SEO-08`, `SOCIAL-01`, and `CONTENT-01` in the canonical checklist. The default article hero shows “Last updated”; JSON-LD retains both source dates when available.
9. Run the blog-related checks and update their statuses in `docs/launch/checklist.json`.

Implementation:

- `src/lib/blog.ts` calls the Wisp client directly and provides safe empty results only when no blog ID is configured.
- `src/app/blog/blog.config.ts` owns the small route-specific list of optional tag filters, the pinned lead slug, and the featured tag.
- `src/app/blog/page.tsx` server-renders featured articles, filters, search, pagination, and article links.
- `src/app/blog/_components/blog-pagination.tsx` builds crawlable previous, next, first, last, and nearby page links while preserving the active filter/search.
- `src/app/blog/[slug]/page.tsx` renders the two-column article hero, sanitized Wisp HTML, visible source dates, metadata, and Article JSON-LD.
- `src/app/blog/[slug]/_components/article-sidebar.tsx` renders a server-built contents list, canonical LinkedIn/X/Facebook share links, and the return link. Mobile uses native `<details>` rather than a client boundary.
- `src/lib/blog-content.ts` owns sanitization, stable heading IDs, table-of-contents extraction, description fallback, date formatting, and reading-time calculation.
- `src/app/feed.xml/route.ts` serves the latest articles as RSS.
- `src/app/sitemap.ts` lists the blog index and every article returned by Wisp.

Tag filters are optional discovery controls, not independent tag archive pages. The template displays only real source tags and keeps filter, search, and pagination variants canonical to `/blog` and out of the sitemap.

The article table of contents uses sanitized `h2` and `h3` headings. Keep meaningful heading order in Wisp, avoid using headings only for visual styling, and verify copied fragment URLs after significant content edits. Share links use `NEXT_PUBLIC_SITE_URL` through the canonical URL helper; a preview deployment must never be treated as the production share origin.

## Remove

1. Delete `src/app/blog` and `src/app/feed.xml`.
2. Delete `src/lib/blog.ts`, `src/lib/blog-content.ts`, and `src/lib/blog-content.test.ts`.
3. Remove `WISP_BLOG_ID` from `.env.example`, `src/config/env.ts`, and every deployment environment.
4. Remove `@wisp-cms/client`, `sanitize-html`, and `@types/sanitize-html`, then reinstall dependencies.
5. Remove the Wisp image delivery pattern from `next.config.ts` if no remaining page uses it.
6. Remove Blog from `src/config/site.ts` and `src/components/site-footer.tsx`.
7. Remove the blog imports, index route, and article entries from `src/app/sitemap.ts`.
8. Remove `buildArticleJsonLd` and its tests from `src/lib/seo.ts` only if no remaining article-like route uses it.
9. Update `docs/features.md`, `README.md`, this recipes index, and any blog-only checklist statuses.
10. Run `pnpm check`, `pnpm build`, and the launch audit.

Do not replace the deleted files with `ENABLE_BLOG` or an equivalent flag.
