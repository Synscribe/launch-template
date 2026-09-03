# Agent instructions

## Sources of truth

- Launch requirements, related files, automated checks, and current status: reusable `items` and client-specific `projectItems` in `docs/launch/checklist.json`
- Generated readable checklist: `docs/launch/checklist.md`
- Feature defaults and deletion paths: `docs/features.md`
- Migration workflow and URL mapping: `docs/launch/migration.md`, `docs/launch/url-map.csv`
- Architecture and phased plan: `PLAN.md`

Do not edit `docs/launch/checklist.md` directly or create a second SEO guide or checklist. Update the matching item in `docs/launch/checklist.json`, or add a discovered client requirement with `pnpm launch:checklist --add-project`, then run `pnpm launch:checklist --write` after manual JSON edits.

## Brand voice

Use plain English, short sentences, and concrete outcomes. The reader should understand a heading on the first pass.

- Lead with the reader's problem, desired result, or next action. Explain the implementation after the value is clear.
- Use words the audience already uses, such as homepage, CMS pages, forms, redirects, search traffic, and site navigation. Explain technical terms when they matter.
- Make headings useful and specific. A heading should answer a question, name a problem, or describe the section. Do not build headings around an arbitrary number of features or steps unless the number helps the reader.
- State what something is and why it matters. Do not use negative parallelism such as “not X, but Y,” and do not define a product by what it is not.
- Avoid abstract internal language such as “operating model,” “migration inventory,” “prove the hard parts,” or “the files are not the system.” Name the real task or risk instead.
- Avoid self-conscious copy that explains how the page is written. Make the useful claim directly.
- Connect every feature to a customer concern, such as getting found, making changes quickly, keeping the brand intact, understanding leads, or launching safely.
- Keep category and product language distinct. Define the category in its own terms, then explain how the product fits it.
- Use one sentence per line when a short contrast or definition needs emphasis.
- Do not use em dashes in public marketing copy. Use a period, comma, colon, or parentheses.
- Keep claims precise and supportable. Use a platform's real terminology when a page targets that platform, then explain the consequence in everyday language.
- CTA labels should describe the action and destination, such as “Start your migration,” “See pricing,” or “Contact the team.”

Use these corrections as calibration:

| Avoid                                                | Prefer                                                                                       |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| “Five questions reveal the operating model.”         | “Is your website ready to launch?”                                                           |
| “Website migration inventory”                        | “What needs to move”                                                                         |
| “Prove the hard parts before moving the whole site.” | “Step-by-step migration plan”                                                                |
| “Files are not the system.”                          | “A complete migration includes your pages, CMS content, forms, redirects, and integrations.” |
| “Five jobs. Five working parts.”                     | A heading that names the problem those features solve.                                       |
| “This is not a bundle of feature claims.”            | Explain what the features help the reader do and why that matters.                           |

## On-page SEO

Start with one primary keyword and the searcher's likely problem, desired result, and next action. Use the keyword where it helps the reader confirm that the page matches their search.

- Put the primary keyword at position one in the metadata title. Aim for roughly 50 to 60 characters in the rendered title, including the brand suffix.
- Put the primary keyword, or a close natural variant, near the beginning of the meta description. Aim for roughly 140 to 160 characters and explain the page's useful outcome.
- Start the H1 with the primary keyword whenever the sentence remains clear. If a short lead-in is necessary, keep it useful and move the keyword as close to the front as possible. Keep the H1 concise, usually about 6 to 14 words.
- Put the primary keyword, or a close natural variant, early in the first 200 visible words. The hero paragraph should usually establish the audience, outcome, and product fit in 30 to 65 words.
- Use parts of the primary keyword naturally in supporting headings when they help explain the page. Questions and answers are useful when they reflect how the audience searches.
- Keep one clear search purpose per page. The title, description, H1, opening paragraph, headings, and CTA should describe the same page and buyer need.
- Read every keyword placement aloud. Rewrite forced repetition, keyword stuffing, and phrases that make the page harder to understand.
- For every programmatic use-case page, choose the primary keyword before writing. Keep the shared structure consistent while making the problem, examples, feature order, supporting headings, proof, and next action specific to that search.
- Review programmatic SEO requirements manually. Do not add keyword fields or validation tests solely to force copy into a schema.

## Architecture

- Use explicit Next.js App Router pages.
- Keep route-specific copy, metadata, and composition with the route.
- Start components in the route's `_components` folder. Promote them only after a second real use.
- Keep metadata and applicable structured-data builders in `src/lib/seo.ts`.
- Do not add `site.json`, a marketing catch-all route, an SDUI renderer, a block registry, or schemas for serialized React props.
- Use-case JSON may reference only validated `visualId` values. Add IDs in `src/lib/visuals.ts` and React or local-file sources through the one bounded resolver in `src/components/visuals/project-visual.tsx`; `UseCaseVisual` is only its route-specific placement wrapper. Do not put component names, paths, classes, or props in JSON.
- PostHog, blog, and use cases are default deletable code. Do not add feature flags to turn them on or off. Remove their files, navigation, sitemap entries, tests, dependencies, and documentation when a project does not use them.
- Do not install a CMS, docs framework, content sync, or component catalog until the current project requires it.
- `framer-motion` is the one accepted animation dependency; it backs the `$micro-ui` motion kit. Do not add a second one.

## Launch safety

- Never replace a missing client value with a believable fictional value.
- Use a `TODO_CLIENT_*` sentinel for unresolved production content and leave the matching checklist item as `todo`.
- Contact email and social profiles are optional. If absent, omit their UI entirely.
- Never block the whole site in `robots.txt`, including local and preview deployments. Protect private previews with deployment access controls and keep targeted blocks for internal routes.
- Migration work starts with the URL map before routes or redirects are changed.

## UI work

- Bespoke page composition is expected.
- For an authorized 1:1 website clone, use `.agents/skills/site-clone`: inventory URLs and visible widgets before implementation, keep `docs/launch/clone-journal.md` current, compare with agent-browser, and stop after the homepage for user approval.
- Preserve the token boundary in `src/app/globals.css` when importing a client design system.
- Keep critical copy and links in server-rendered HTML.
- Animation must retain visible content without JavaScript and handle `prefers-reduced-motion`.
- `/dev`, `/dev/visuals`, and `/dev/launch-assets` are internal review tools. Keep their shared layout gated by the exact server-only `VISUAL_REVIEW_ENABLED=true` allow value, keep them out of navigation and sitemap, and never infer access from a deployment environment.
- Launch assets reuse validated project visuals and export with `pnpm launch:assets`. Keep frame copy and composition route-local, write generated files to `artifacts/launch-assets`, and do not automatically publish them under `public`.
- Avoid adding unused primitives or speculative reusable sections.

## Before completing work

Run and fix:

```bash
pnpm check
pnpm build
```

For page or launch work, also run the appropriate live audit:

```bash
pnpm launch:audit --url http://localhost:3000 --mode template
```

Before production, run `pnpm launch:verify`, then run the same audit against the deployed production URL with `--mode production`. Resolve every applicable manual P0 item and every failing automated check.
