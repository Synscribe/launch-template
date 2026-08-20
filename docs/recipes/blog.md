# Wisp blog: configure or remove

The blog is ordinary, deletable application code. It connects directly to Wisp on the server. There is no feature flag, retry layer, or application cache.

## Configure

1. Set `WISP_BLOG_ID` in the local and deployment environments. Keep it server-only; the browser does not need it.
2. Set `WISP_CONTENT_ORIGIN` to the website that owns source-relative links and legacy images inside Wisp articles. Valid blog links stay local; other root-relative links return to this origin, and Next Image permits this hostname.
3. Replace the temporary Cyber Sierra publication ID and content origin before using the template for another client.
4. Confirm the Wisp publication belongs to the client and contains only content approved for the production domain.
5. In Wisp, add the real tags that the index should use. The temporary source currently has a `featured` tag and a `press-release` tag; do not assume another publication uses either.
6. Edit `src/app/blog/blog.config.ts`. Add only filters backed by maintained Wisp tags. Set the optional lead article slug and featured tag, or use `null` to omit either featured surface. Remove a filter entry to hide it; there are no runtime feature flags.
7. Review the first page, every configured filter, an empty result, a search result, a middle and final pagination page, an article with an image, an article without an image, related articles, `/feed.xml`, and `/sitemap.xml`.
8. Confirm titles, descriptions, H1s, opening copy, visible dates, canonical URLs, share images, and Article JSON-LD against `SEO-02`, `SEO-03`, `SEO-05`, `SEO-06`, `SEO-08`, `SOCIAL-01`, and `CONTENT-01` in the canonical checklist.
9. Record the source, selected filters/featured behavior, and evidence in `docs/launch/status.md`.

Implementation:

- `src/lib/blog.ts` calls the Wisp client directly and provides safe empty results only when no blog ID is configured.
- `src/app/blog/blog.config.ts` owns the small route-specific list of optional tag filters, the pinned lead slug, and the featured tag.
- `src/app/blog/page.tsx` server-renders featured articles, filters, search, pagination, and article links.
- `src/app/blog/_components/blog-pagination.tsx` builds crawlable previous, next, first, last, and nearby page links while preserving the active filter/search.
- `src/app/blog/[slug]/page.tsx` renders sanitized Wisp HTML, visible source dates, metadata, and Article JSON-LD.
- `src/lib/blog-content.ts` owns sanitization, description fallback, date formatting, and reading-time calculation.
- `src/app/feed.xml/route.ts` serves the latest articles as RSS.
- `src/app/sitemap.ts` lists the blog index and every article returned by Wisp.

Tag filters are optional discovery controls, not independent tag archive pages. The template displays only real source tags and keeps filter, search, and pagination variants canonical to `/blog` and out of the sitemap.

## Remove

1. Delete `src/app/blog` and `src/app/feed.xml`.
2. Delete `src/lib/blog.ts`, `src/lib/blog-content.ts`, and `src/lib/blog-content.test.ts`.
3. Remove `WISP_BLOG_ID` and `WISP_CONTENT_ORIGIN` from `.env.example`, `src/config/env.ts`, and every deployment environment.
4. Remove `@wisp-cms/client`, `sanitize-html`, and `@types/sanitize-html`, then reinstall dependencies.
5. Remove `contentImageRemotePattern` and the Wisp image delivery pattern from `next.config.ts` if no remaining page uses them.
6. Remove Blog from `src/config/site.ts` and `src/components/site-footer.tsx`.
7. Remove the blog imports, index route, and article entries from `src/app/sitemap.ts`.
8. Remove `buildArticleJsonLd` and its tests from `src/lib/seo.ts` only if no remaining article-like route uses it.
9. Update `docs/features.md`, `docs/launch/status.md`, `README.md`, and this recipes index.
10. Run `pnpm check`, `pnpm build`, and the launch audit.

Do not replace the deleted files with `ENABLE_BLOG` or an equivalent flag.
