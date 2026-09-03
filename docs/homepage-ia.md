# Homepage: research, structure, and what is written into the repo

This is the research and decision record behind the homepage structure. The working instructions live in `docs/recipes/homepage.md`, while checklist status lives only in `docs/launch/checklist.json`.

---

## 1. The research

Seven homepages were read section by section in August 2026: Stripe, Payload, Lemon Squeezy, Linear, Clerk, Attio, and Ramp. Lemon Squeezy blocks automated fetching, so its markup was pulled directly and stripped.

### What each one does, in order

| Site              | Flow                                                                                                                                                                                                                                                                                               |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Stripe**        | Hero → **logo carousel, 16 logos, immediately** → solutions grid → **stats: 135+ currencies, $1.9tn volume, 99.999% uptime, 200M+ subscriptions** → named case studies with metrics → separate blocks for startups, platforms, developers → news → final CTA                                       |
| **Lemon Squeezy** | Hero → **"trusted by thousands of companies globally"** → **"why lemon squeezy?" capsule** → 6 numbered cards (135+ countries, 20+ payment methods, 130+ currencies) → ecommerce → marketing → reporting → developers → 6 quotes + 2 case studies ($300k, 94% revenue boost) → support → final CTA |
| **Payload**       | Hero → value prop → 4 use-case cards → **testimonials under the headline "From Fortune 500 companies to indie devs, Payload is the answer to 'build vs. buy'"** (Blue Origin, Microsoft, Hello Bello) → 4 features → brand narrative → CTA                                                         |
| **Clerk**         | Hero → **trust bar, 11 logos, immediately** → 7 capability sections → 8 testimonials → "Start now, no strings attached"                                                                                                                                                                            |
| **Linear**        | Hero → 5 product sections → **logo bar late: "Powers over 40,000 product teams"** → 3 quotes (OpenAI, Ramp, Opendoor) → final CTA                                                                                                                                                                  |
| **Attio**         | Hero → demo video → **logo bar** → workflow → capabilities → **scale stats: 2.6M MCP calls/month, 400M API calls/week, 15M emails/day** → "30,000+ customers" → CTA                                                                                                                                |
| **Ramp**          | Hero + logos + metrics → products → **outcome stats: 27M+ hours saved, 75% faster close, 90% auto-coded (Glossier), 75% less reconciliation (Webflow), 325 hrs/month (8VC)** → vs. competitors → pricing → CTA                                                                                     |

### The shared spine

All seven run the same seven beats, in the same order:

1. **Hero** — what it is, who for, one primary and one secondary action
2. **Trust** — logos or a specific claim
3. **Positioning** — one dense block that defines the thing
4. **Capabilities** — four to six blocks, each carrying a number
5. **Proof** — stats and named quotes, attached to companies
6. **Path to start** — how you actually begin
7. **Closing action** — repeat the hero action

Seven independent teams, with different products, audiences, and price points, converging on the same order is the strongest signal in the research. The order is not a style choice; it tracks the sequence a buyer's questions arrive in.

---

## 2. Why each rule holds

### The trust line goes below the hero, but only if the logos work alone

Stripe, Clerk, Lemon Squeezy, and Attio put it immediately under the hero. Linear and Payload delay it until after the product is explained. That looks like a contradiction until you look at whose logos they are.

Stripe has OpenAI and Toyota, which need no setup. Linear waits, then leads with a number — "Powers over 40,000 product teams" — because a strip of unfamiliar startup logos is decoration.

The testing data agrees. Specific claims such as "Trusted by 8 of the Fortune 50" beat a plain logo strip by 14 points of conversion lift, and social proof inside the first screen lifts conversion around 12% on average. Logos alone leave most of the lift on the table.

**So the rule is: a trust line is logos plus a claim line, never logos alone; and when the logos will not be recognised on sight, drop the strip and lead with the claim.** The cut-off written into the recipe is roughly five recognisable logos.

**And the escape:** move it below the product explanation when the product needs explaining first, or when the proof is thin. Two logos under the hero read as two logos; the same two after the reader understands the product read as early adopters. If it moves, the numbers and quotes move with it — split proof is weaker than proof in either position.

### Numbers must be outcomes or scale

None of the seven use vanity metrics. Every number falls into one of two buckets:

- **Scale** — what the system handles. Stripe's 99.999% uptime and 500M+ daily API requests. Attio's 400M API calls a week.
- **Customer outcome** — what changed for a named customer. Ramp's "75% less reconciliation at Webflow". Lemon Squeezy's "$300k with a Figma course".

Counts of internal structure are absent from all seven. That is the basis for the rule in `HOME-02`: a number that describes our own filing system is not an outcome and does not belong in a stat row.

### Quotes need a number and a name

The strongest examples weld the two together. Ramp does not say customers save time; it says **8VC: 325 hours saved monthly**. Payload's testimonial section carries the positioning argument in its own headline and hangs Blue Origin and Microsoft off it.

Two quotes with names, roles, companies, and numbers beat six generic ones.

### The "Why Lemon Squeezy" pattern is worth copying

This is the most transferable thing in the research. Their markup, in order:

```
[eyebrow]  why lemon squeezy?
[h2]       Lemon Squeezy is the all-in-one platform for running your SaaS
           business. Payments, subscriptions, global tax compliance, fraud
           prevention, multi-currency support, failed payment recovery,
           PayPal integration and more. We make running your software
           business easy peasy.
[cards]    01 Global tax compliance   02 Borderless SaaS payments
           03 Instant payment methods 04 Local currency support
           05 A.I. fraud prevention   06 Failed payment recovery
```

**Why machines quote it:** it is a self-contained block. Brand name, category, audience, and eight capability nouns, with no links inside and no pronouns depending on earlier text. Any system that chunks the page gets one chunk that fully answers "what is this?". Links inside such a block measurably reduce citation, because they make attribution ambiguous — the guidance is to keep the block clean and put links in the body below it.

**Why humans do not mind it:** three deliberate choices. It is set as a heading, not body copy, so it is skimmed in three seconds. It is one paragraph, not a bullet list — the bulleted "Why choose us ✓ Fast ✓ Reliable" version is the one that reads as filler. And it never repeats; the six cards expand it rather than restating it.

**The taste risk** is a section that reads as written for a machine. The recipe names four warning signs: the paragraph duplicates a list that appears again later; the eyebrow poses a question the page then answers at length, like an FAQ pretending to be a section; the paragraph runs past 55 words into a wall of nouns; or the tone shifts and one block sounds like a directory listing. The test is reading it out loud.

**The mechanism that makes it pay off:** the lead sentence must be identical on the page, in the meta description, and in the JSON-LD. Consistency across surfaces is what earns the citation. Because a full capsule is around 300 characters and a search result truncates near 155, only the **lead sentence** is canonical — it names the brand, the category, and the audience, and stays under 155 characters. The capability list stays on the page.

### Length, and what to do when it needs to be longer

The consensus is one page, one goal, with several chances to act — the same action, the same label, at the hero, mid-page, and the close. A persistent header action is associated with 15–20% higher CTA engagement on long B2B pages.

The budget written into the recipe is **eight to ten sections, each at most one and a half screens**. Clerk ships eleven short ones; Linear ships eight.

When a page genuinely needs more, the seven sites do four things rather than stacking more sections:

1. **Split by audience.** Stripe writes parallel blocks for startups, enterprise, and platforms, each with its own proof, so each reader only reads their own third.
2. **Summarise and link out.** Payload's use-case cards and Linear's feature sections are one card each pointing at a full page. Stripe's homepage links out more than thirty times.
3. **Keep the action in the sticky header** so scroll cost is recoverable.
4. **Merge before adding.** Three sections making the same argument are one section.

This repo already has the escape valves: `/uses` and `/blog`.

### Sources

- [Landing page conversion study, 2,000 pages tested](https://www.digitalapplied.com/blog/landing-page-conversion-study-2000-pages-tested-2026)
- [Social proof placement tactics](https://wisernotify.com/blog/landing-page-social-proof/)
- [CTA placement strategies](https://www.landingpageflow.com/post/best-cta-placement-strategies-for-landing-pages)
- [B2B homepage practices](https://www.lowcode.agency/blog/b2b-website-homepage-best-practices-that-convert)
- [Earning LLM citations](https://seoprofy.com/blog/llm-citations/)
- [LLM optimization best practices](https://www.stackmatix.com/blog/llm-optimization-best-practices)
- [Answer engine optimization guide](https://cxl.com/blog/answer-engine-optimization-aeo-the-comprehensive-guide/)

---

## 3. The agreed structure

Full rules in `docs/recipes/homepage.md`. Summarised here so both do not need holding at once.

| #   | Section             | Job                                         | State                         |
| --- | ------------------- | ------------------------------------------- | ----------------------------- |
| 0   | Header with action  | Action reachable at any scroll depth        | Built                         |
| 1   | Hero                | What this is, who for, what to do           | Built                         |
| 2   | Trust line          | Establish confidence in the first screen    | Built with the real stack     |
| 3   | Positioning summary | Define it once, one paragraph, display type | Built                         |
| 4   | Capabilities        | Four to six specifics                       | Built                         |
| 5   | Outcome numbers     | Show the payoff                             | Omitted — no sourced outcomes |
| 6   | Quotes              | Someone else already did this               | Omitted — no approved quotes  |
| 7   | How it works        | Inventory → Build → Audit → Launch          | Built                         |
| 8   | Questions           | Objection handling plus FAQ schema          | Built                         |
| 9   | Closing action      | Repeat the hero action                      | Built                         |

Decisions the owner has made:

- **Audience:** developers and business owners taking over their own website with an AI coding tool like Claude Code or Codex.
- **Primary action:** Launch Website, pointing at the `/contact` form. The header, hero, and close use the same label and destination.
- **Trust line:** default position is directly below the hero, with the two escapes described in §2.

---

## 4. What is implemented in the repo

The documentation and checklist work is complete. This is the part to build against.

### New recipe — `docs/recipes/homepage.md`

Covers:

- **Section order** — the eleven positions in §3, with which are required and which are conditional on real input.
- **Where proof goes** — the three kinds of proof and their separate jobs; the default position; the rule for switching a logo strip to a specific claim; the two conditions for moving the whole proof block down; and the requirement to record the placement choice in the page file.
- **Never invent proof** — no plausible logo, number, quote, name, or company, and no sample logos to show a layout. A section with no real input does not render. Pending values use a `TODO_CLIENT_*` sentinel, which the production audit already fails on, so no new audit code was needed.
- **What counts as a number** and **what makes a quote work**.
- **The positioning summary** — the capsule shape, six rules, the lead-sentence mechanism, and the four taste warnings.
- **Write plainly** — short sentences, common words, active voice, no unexplained jargon, cut adjectives that carry no information, read it out loud before shipping.
- **Length** — the eight-to-ten section budget and the four techniques for when it must be longer.
- **Implementation map**, verification steps, and removal steps for each optional section.
- **Where these rules come from** — the seven sites and the sources above.

### Three new checklist items — `docs/launch/checklist.json`

Inserted in canonical order; `docs/launch/checklist.md` regenerated with `pnpm launch:checklist --write`. Never edit the `.md` directly.

| ID        | Priority | Group                                             | Covers                                                                                                                                                                          |
| --------- | -------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `HOME-01` | P0       | every site                                        | One action in the header, hero, and close, with the same label and destination. Real destination, not a same-page anchor. A closing section exists. Reachable on a phone.       |
| `HOME-02` | P0       | every site                                        | Proof is real, defined, and cleared: permissioned logos, numbers with a written definition and source, quotes with name, role, company, and approval. Plus the placement rules. |
| `HOME-03` | P1       | non-blocking quality and feature-dependent checks | One positioning summary, opening with a lead sentence of 155 characters or fewer, appearing word for word in the meta description and the JSON-LD.                              |

`HOME-01` points at `FORM-01` rather than duplicating it: `FORM-01` covers whether the contact form works end to end, `HOME-01` only covers reaching it.

### Supporting edits

- `docs/recipes/README.md` — index entry for the new recipe.
- `docs/features.md` — the homepage row now points at the recipe, and a new "Homepage proof sections" row records that they are kept only when real.
- `scripts/tests/launch-checklist.test.ts` — item count 39 → 42. Keep in sync when items are added.

### Code that supports the spec

- `src/lib/seo.ts` — new `buildFaqJsonLd` for the questions section.
- `src/components/site-header.tsx` — CTA label unified to "Launch Website".
- `src/config/site.ts` — `siteConfig.description` holds the canonical positioning sentence, under 155 characters, shared by the page, the meta description, and the JSON-LD.
- `src/app/(marketing)/home.module.css` — `.faqItem` and `.faqMarker`. Reduced motion is already handled globally in `globals.css`; do not re-declare it per module.
- `src/app/(marketing)/page.tsx` — the existing server-rendered homepage with a real-stack trust bar, positioning summary, reordered checklist/workflow, questions, and closing action. Customer-proof placement is recorded beside the intentionally omitted proof block.

---

## 5. What is still needed

The remaining inputs are real proof. The page deliberately omits sections 2, 5, and 6 until these exist:

1. **Logos**, with permission for each. Fewer than about five recognisable ones means writing one countable claim instead.
2. **Two or three numbers**, each with a written definition and a source.
3. **Two or three quotes**, each with name, role, company, and recorded approval.

---

## 6. Constraints and practical notes

- **Homepage anchors have inbound links.** `src/app/uses/page.tsx` and three files in `src/content/use-cases/` link to homepage anchors. Renaming a section id without updating them breaks `ROUTE-01`.
- Use the package-manager version declared by the repository and check `git status` after dependency operations. Do not commit an unrelated lockfile rewrite.

## 7. Verifying

```bash
pnpm check
pnpm build
pnpm dev                     # port 3000 may be taken; it picks another
pnpm launch:audit --url http://localhost:<port> --mode template
```

Then by hand:

- Open the page and read it top to bottom, out loud.
- Check it at phone, tablet, and desktop widths.
- Confirm the primary action is reachable on a phone without scrolling back to the top.
- Confirm the page does not end on a feature or a graphic.
- Confirm the positioning lead sentence, the meta description, and the JSON-LD description are identical.

The reusable checklist keeps `HOME-01`, `HOME-02`, and `HOME-03` as project checks. Mark `HOME-01` and `HOME-03` done only after reviewing the cloned project. `HOME-02` stays todo until all rendered proof is real, sourced, and approved; an intentionally omitted proof section is not permission to invent it.
