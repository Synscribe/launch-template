# Use cases: add or remove

Use cases are ordinary, deletable content and routes. Each detail page comes from one validated JSON document; the JSON contains content and SEO fields, while `page.tsx` owns the React composition and visual treatment. Do not add component names, Tailwind classes, or serialized React props to the content format.

## Add a use case

1. Copy `src/content/use-cases/website-migrations.json` to a lowercase, hyphenated filename.
2. Give the document a matching unique `slug`, a short hub title, and one or more `groups` IDs from `src/content/use-cases/groups.json`.
3. Replace every SEO, hero, risk, capability, method, outcome, FAQ, and closing field with project-appropriate copy. Do not keep claims, outcomes, or audiences that are not true for the client.
4. Choose one supported `id` for each capability. The ID selects its route-owned visual from `src/app/use-cases/[slug]/_components/feature-visuals.tsx`; the JSON does not describe React components, layout, or visual props.
5. Run `pnpm check`. The content loader rejects malformed JSON, missing fields, filename/slug mismatches, duplicate slugs or feature IDs, unsupported feature IDs, unknown/duplicate group IDs, and external CTA paths.
6. Run `pnpm build`. `generateStaticParams` should list the new `/use-cases/<slug>` route.
7. Confirm the route is linked from the use-case index or another crawlable page and appears in `/sitemap.xml`.
8. Review `SEO-02`, `SEO-03`, `SEO-05`, `SEO-06`, `SEO-08`, `SOCIAL-01`, and the per-page definition of done in `docs/launch/checklist.md`.
9. Run the live launch audit and attach project evidence to `docs/launch/status.md`.

There is no numeric page order. Use cases have a deterministic alphabetical fallback, while the array order in `groups.json` controls the future hub-section order. A use case with multiple group IDs can appear in multiple hub sections. Add a group definition only when the project has a real grouping to show; do not create empty speculative groups.

## Reading budget

- Keep the hero to one clear H1, one summary, and one primary action. Use the next section to add context instead of creating a third tier of hero copy. The first 200 words still need to establish page intent, but they do not all need to sit above the fold.
- Put depth in three to five `solution.items`. Use two short sentences for the description and three brief highlights. The selected feature visual should add understanding instead of repeating the paragraph.
- Do not add repeated section kickers, decorative sequence numbers, or browser-window chrome to make a long page feel designed. Headings and surface changes provide the hierarchy.
- Prefer clear headings and generous section spacing over a sticky jump bar. Keep native FAQ disclosure. Critical copy stays in server-rendered HTML; do not move it into a client-only carousel or tab system.
- If a page needs more than five capability items, first check whether two items overlap or whether the subject should become a guide rather than a use-case page.

Implementation:

- Use-case content: `src/content/use-cases/<slug>.json`
- Hub group names, descriptions, and section order: `src/content/use-cases/groups.json`
- Validation and discovery: `src/lib/use-cases.ts`
- Route composition: `src/app/use-cases/[slug]/page.tsx`
- Route-owned feature visuals: `src/app/use-cases/[slug]/_components/feature-visuals.tsx`
- Route-local styling: `src/app/use-cases/[slug]/use-case.module.css`
- Discovery: `src/app/sitemap.ts` and project navigation

Adding a JSON document does not add a new component or block type. All use cases share the same detail-page composition. A capability chooses one existing visual with its `id`, following the same small inventory pattern as the previous template. Add a new route-owned visual only when the available IDs cannot explain a real capability; do not serialize its props into JSON or build a general block registry.

## Remove use cases

1. Delete `src/app/use-cases`.
2. Delete `src/content/use-cases` (including the group manifest) and `src/lib/use-cases.ts` plus its test.
3. Remove the use-case import and routes from `src/app/sitemap.ts`.
4. Remove every use-case link from `src/config/site.ts`, page copy, footer, and related-content links.
5. Remove this recipe and update `docs/features.md`, `PLAN.md`, and `docs/launch/status.md`.
6. Run `pnpm check`, `pnpm build`, and the launch audit. Verify old production use-case URLs receive an intentional 404/410 or relevant redirect.

Do not replace deletion with an `ENABLE_USE_CASES` flag.
