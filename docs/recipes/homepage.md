# Homepage: compose, prove, and launch

The homepage is an explicit App Router page, not a block registry. Its job is to tell the right visitor what the site offers, establish trust with real evidence, show a clear path to start, and make the primary action easy to reach.

Checklist priority and completion state live only in `docs/launch/checklist.json`. Review `HOME-01`, `HOME-02`, `HOME-03`, `SEO-02`, `FORM-01`, and `SOCIAL-01` while changing this page.

## Default order

Use this sequence unless the real product and proof justify a different one:

1. Shared header with the primary action.
2. Hero: what this is, who it helps, one primary action, and at most one secondary action.
3. Proof: a trust claim and approved logos when the evidence is strong enough.
4. Positioning summary: one self-contained paragraph that defines the offer.
5. Capabilities: four to six concrete things the visitor gets.
6. Outcome numbers: two or three sourced scale or customer-outcome measures.
7. Quotes: two or three approved quotes tied to a name, role, and company.
8. How it works: the shortest useful path to start.
9. Questions: real objections with visible answers and matching FAQ structured data when applicable.
10. Closing action: repeat the primary action.

The header, hero, and closing action must use the same label and destination. A long page may repeat that action once in the middle. Do not replace the real conversion route with a same-page anchor.

## Proof is optional until it is real

Never invent a customer, logo, number, quote, role, company, or approval to complete the layout. Omit a proof section when the project has no approved input. Do not publish sample logos as decoration.

The template uses a text-only bar naming its real stack as a baseline trust signal. That is product evidence, not customer proof. Replace or remove it when the client stack changes, and never style technology names as if they were customer logos.

The default proof position is directly after the hero. Use a claim plus logos rather than unexplained logos alone. Move the entire proof block after the positioning or capabilities only when the product must be understood first or the available names are not recognisable without context. Keep logos, outcome numbers, and quotes together instead of scattering weak proof across the page. Record the placement decision in the homepage source.

A useful number must describe either:

- system scale with a written definition and source; or
- a customer outcome tied to a named customer and measurement window.

Counts of pages, checklist levels, modules, or internal files are not customer outcomes. A quote needs approval plus the person's name, role, and company. Prefer two specific quotes over a wall of anonymous praise.

## Positioning summary

Write one self-contained block that can answer “what is this?” without depending on the hero. Its first sentence must:

- name the brand, category, and audience;
- remain at or below 155 characters;
- appear word for word in `siteConfig.description`, homepage metadata, visible homepage copy, and WebSite JSON-LD;
- use common words and active voice.

The rest of the block may name the core capabilities, but keep the full block under roughly 55 words. Do not put links inside it. Read it aloud. Rewrite it when it sounds like a keyword list, repeats the next section, or shifts into a different voice.

## Writing and length

Use short sentences. Lead with what the visitor can do. Explain unfamiliar terms where they first appear. Cut adjectives that do not change the meaning.

Aim for eight to ten short sections when real proof exists. Keep each section below roughly one and a half screens. When the page becomes longer:

1. merge sections making the same argument;
2. split genuinely different audiences;
3. summarise a subject and link to `/uses` or `/blog`;
4. keep the primary action available in the sticky header.

Critical copy and links stay in server-rendered HTML. Animation may enhance a section but must preserve visible content without JavaScript and respect reduced motion.

## Implementation map

- Homepage composition and the proof-placement decision: `src/app/(marketing)/page.tsx`
- Route-local styling: `src/app/(marketing)/home.module.css`
- Canonical positioning sentence and public configuration: `src/config/site.ts`
- Shared primary action: `src/components/site-header.tsx`
- Metadata and FAQ/WebSite structured data: `src/lib/seo.ts`
- Conversion destination: `src/app/contact`
- Canonical readiness checks: `docs/launch/checklist.json`

Keep new homepage sections route-local. Promote a component only after a second real use. Do not add proof flags or a serialized section schema.

## Verification

1. Read the page top to bottom and remove repeated claims.
2. Confirm the primary action has the same label and `/contact` destination in the header, hero, and close.
3. Compare the visible positioning lead sentence with the meta description and WebSite JSON-LD.
4. Confirm every rendered logo, number, and quote has a source and approval. If not, remove its section.
5. Check phone, tablet, and desktop widths. Confirm the closing action is reachable and the page does not end on a feature graphic.
6. Disable JavaScript and confirm the core copy, questions, and links remain present.
7. Run:

```bash
pnpm check
pnpm build
pnpm launch:audit --url http://localhost:3000 --mode template
```

Before production, repeat the audit against the deployed URL and record the relevant decisions in `docs/launch/checklist.json`.

## Removing optional sections

- Trust: remove its markup and any logo assets.
- Outcome numbers: remove the section and its page-local data; do not leave zero or placeholder values.
- Quotes: remove the section and its page-local data; do not retain unapproved quotes in source.
- FAQ: remove the visible section, `buildFaqJsonLd` call, and JSON-LD script together. Remove the helper only when no other route uses it.

The research behind the order and proof rules is recorded in `docs/homepage-ia.md`. It is background, not a second checklist.
