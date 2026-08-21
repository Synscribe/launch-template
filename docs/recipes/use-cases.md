# Use cases: structure, visuals, add, or remove

Use cases are ordinary, deletable content and routes. Each detail page comes from one validated JSON document. The JSON owns content, SEO, group membership, and `visualId` references; `page.tsx` owns the React composition. Do not put component names, file paths, Tailwind classes, or serialized React props in the content format.

## Detail-page structure

Every JSON-backed detail page uses the same route composition, in this order:

1. **Hero:** one H1, one summary, one primary action, and one `UseCaseVisual` selected by `hero.visualId`.
2. **Risks:** a short introduction and three problems the work should prevent.
3. **Solution:** three to five capability rows. Each row has a category, title, short explanation, highlights, and one visual selected by `visualId`.
4. **Method:** a short ordered sequence explaining how the work proceeds.
5. **Outcomes:** concrete deliverables or states the client should have before launch.
6. **FAQ:** native, server-rendered disclosures for real buying or delivery questions.
7. **Closing:** one final action with a real internal destination.

The structure lives in `src/app/uses/[slug]/page.tsx`; it is not configurable per JSON file. If a client needs a materially different page type, build an explicit route or intentionally change the shared composition. Do not add section flags or turn the JSON into a page builder.

## Add a use case

1. Copy `src/content/use-cases/website-migrations.json` to a lowercase, hyphenated filename.
2. Give the document a matching unique `slug`, a short hub title, and one or more `groups` IDs from `src/content/use-cases/groups.json`.
3. Replace every SEO, hero, risk, capability, method, outcome, FAQ, and closing field with project-appropriate copy. Do not keep claims, outcomes, audiences, or response promises that are not true for the client.
4. Choose one supported `visualId` for the hero and for each capability. The same field always selects the visual; the JSON never describes how it is rendered.
5. If none of the current IDs fits, add a new visual through the resolver workflow below before referencing it in JSON.
6. Run `pnpm check`. The content loader rejects malformed JSON, missing fields, filename/slug mismatches, duplicate slugs or capability visual IDs, unsupported visual IDs, unknown/duplicate group IDs, and external CTA paths.
7. Run `pnpm build`. `generateStaticParams` should list the new `/uses/<slug>` route.
8. Confirm the route is linked from the grouped `/uses` hub and appears in `/sitemap.xml`.
9. Review `SEO-02`, `SEO-03`, `SEO-05`, `SEO-06`, `SEO-08`, `SOCIAL-01`, and `IMAGE-01` in the generated `docs/launch/checklist.md`.
10. Run the live launch audit, then update those checks in `docs/launch/checklist.json`.

There is no numeric page order. Use cases have a deterministic alphabetical fallback, while the array order in `groups.json` controls the hub-section order. A use case with multiple group IDs appears in multiple relevant hub sections. Add a group definition only when the project has a real grouping to show; do not create empty speculative groups.

## The visual resolver

`UseCaseVisual` is the route-local visual resolver. Both the hero and capability rows call it with only a validated `visualId`:

- Renderer and typed source map: `src/app/uses/[slug]/_components/use-case-visual.tsx`
- React visual implementations: `src/app/uses/[slug]/_components/use-case-visual-components.tsx`
- Visual CSS and reduced-motion rules: `src/app/uses/[slug]/_components/use-case-visuals.module.css`
- Valid ID union and JSON validation: `src/lib/use-cases.ts`
- Local visual files: `public/media/uses`

The source map is deliberately bounded to `/uses`. It is not a site-wide block registry. Its exhaustive `Record<UseCaseVisualId, UseCaseVisualSource>` makes TypeScript fail when an allowed ID has no renderer.

Each source has one of two forms:

- `kind: "component"` points to a route-local React component. It may be a Server Component or an isolated Client Component when real interaction requires state. Keep an interactive visual in its own `*.client.tsx` module; do not add `"use client"` to the resolver or the shared server-component file. A Client Component must still have a useful no-JavaScript/server-rendered baseline, keyboard behavior, and reduced-motion handling where applicable.
- `kind: "image"` points to a project-owned local file and provides its alternative text. The resolver uses `next/image`, reserves a 4:3 frame, supplies responsive sizes, and may prioritize the image when it appears in the hero. Prepare the intended crop instead of relying on accidental object-position behavior.

To add a visual:

1. Use `$micro-ui` to identify the claim, visual mode, and smallest durable output.
2. Add the new ID to `USE_CASE_VISUAL_IDS` in `src/lib/use-cases.ts`.
3. For non-interactive React, add the implementation to `use-case-visual-components.tsx`, export it, import it into `use-case-visual.tsx`, and add a `kind: "component"` source. For interaction, create a focused `*.client.tsx` module under the same `_components` folder and register that component without moving the resolver across the client boundary.
4. For an image, save the approved optimized file under `public/media/uses`, then add a `kind: "image"` source with the local path and intentional alt text. Use an empty alt only when the image is genuinely decorative and repeats adjacent text.
5. Reference the new ID from `hero.visualId` or `solution.items[].visualId`.
6. Run tests and inspect every placement at desktop and mobile sizes. An image or interactive component that works in a feature row must also survive the hero width if the ID is used there.

Do not pass visual props through JSON. If a visual needs its own internal labels, states, or interaction, keep that implementation with the route-local component or project-owned asset. Critical page meaning must remain in the surrounding server-rendered copy.

## Reading budget

- Keep the hero to one clear H1, one summary, one primary action, and one visual. Use the next section to add context instead of creating another tier of hero prose. The first 200 words still need to establish page intent, but they do not all need to sit above the fold.
- Put depth in three to five `solution.items`. Use two short sentences for the description and three brief highlights. The selected visual should add understanding instead of repeating the paragraph.
- Do not add repeated section kickers, decorative sequence numbers, or browser-window chrome to make a long page feel designed. Headings and surface changes provide the hierarchy.
- Prefer clear headings and generous section spacing over a sticky jump bar. Keep native FAQ disclosure. Critical copy stays in server-rendered HTML; do not move it into a client-only carousel or tab system.
- If a page needs more than five capability items, first check whether two items overlap or whether the subject should become a guide rather than a use-case page.

## Implementation map

- Use-case content: `src/content/use-cases/<slug>.json`
- Hub group names, descriptions, and section order: `src/content/use-cases/groups.json`
- Validation, discovery, and visual ID union: `src/lib/use-cases.ts`
- Hub composition: `src/app/uses/page.tsx`
- Detail composition: `src/app/uses/[slug]/page.tsx`
- Visual resolver: `src/app/uses/[slug]/_components/use-case-visual.tsx`
- React visuals: `src/app/uses/[slug]/_components/use-case-visual-components.tsx`
- Local visual files: `public/media/uses`
- Route-local styling: `src/app/uses/[slug]/use-case.module.css`
- Discovery: `src/app/sitemap.ts` and `src/config/site.ts`

Adding a JSON document does not add a block type. All use cases share the same detail-page composition, and each `visualId` chooses one source from the bounded resolver. Add a new route-owned visual only when the available IDs cannot explain a real hero or capability.

## Remove use cases

1. Delete `src/app/uses`.
2. Delete `src/content/use-cases` (including the group manifest) and `src/lib/use-cases.ts` plus its test.
3. Delete `public/media/uses` when no other route uses those assets.
4. Remove the use-case import and routes from `src/app/sitemap.ts`.
5. Remove every use-case link from `src/config/site.ts`, page copy, footer, and related-content links.
6. Remove this recipe, update `docs/features.md` and `PLAN.md`, and mark use-case-only checks `not_applicable`.
7. Run `pnpm check`, `pnpm build`, and the launch audit. Verify old production use-case URLs receive an intentional 404/410 or relevant redirect.

Do not replace deletion with an `ENABLE_USE_CASES` flag.
