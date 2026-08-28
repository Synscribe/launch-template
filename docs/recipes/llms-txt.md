# `llms.txt` recipe

Use this recipe to replace the root `llms.txt` example with a concise, current index of the site's most useful public pages.

Checklist item: `LLM-01`.

## Files and environment values

- Website-level example: `public/llms.txt`
- Automated source check: `scripts/checks/llms-txt-ready.ts`
- Named-check registry: `scripts/checks/index.ts`
- Live response and target audit: `scripts/launch-audit.ts`
- Environment values: none. Write final absolute production URLs in the file; never derive them from a local or preview host.

Next.js serves `public/llms.txt` at `/llms.txt` as a static response. The shipped example describes Launch Template and deliberately includes `TEMPLATE_LLMS_TXT`, so client verification stays red until the file is replaced.

## Copyable template

Start with this structure. Replace every brace-delimited value, delete sections that do not apply, and add only reviewed public pages.

```markdown
# {SITE_OR_PRODUCT_NAME}

> {ONE_OR_TWO_SENTENCE_DEFINITION_OF_THE_OFFERING_AND_AUDIENCE}
> Last reviewed: {YYYY-MM-DD}.

## {PRIMARY_SECTION_NAME}

- [{PAGE_TITLE}](https://{PRODUCTION_DOMAIN}/{PATH}): {TASK_OR_QUESTION_THIS_PAGE_ANSWERS}
- [{PAGE_TITLE}](https://{PRODUCTION_DOMAIN}/{PATH}): {TASK_OR_QUESTION_THIS_PAGE_ANSWERS}

## {SECONDARY_SECTION_NAME}

- [{PAGE_TITLE}](https://{PRODUCTION_DOMAIN}/{PATH}): {TASK_OR_QUESTION_THIS_PAGE_ANSWERS}

## Instructions for AI agents

- {OPTIONAL_VERIFIED_CURRENT_INSTRUCTION}
```

The instructions section is optional. Remove it when the site has no verified behavioral guidance for agents.

## Required structure

A production file must have:

1. Exactly one H1 containing the site, company, or product name.
2. A short blockquote that defines the offering without relying on the rest of the site.
3. An ISO review date in the blockquote.
4. One or more H2 sections grouping related pages.
5. At least one described link using this exact shape:

```text
- [Specific title](ABSOLUTE_HTTPS_URL): Task-shaped description of what the page answers
```

Do not add multiple H1s, bare URLs, undescribed links, relative URLs, navigation dumps, or decorative sections that do not help an agent select a page.

## Choose pages

Select pages by the task or decision they answer, not merely because they appear in navigation or the sitemap.

Include, when applicable:

- an authoritative overview that clearly defines the offering;
- maintained product, service, documentation, guide, or use-case pages;
- current setup, pricing, compatibility, security, or migration information;
- a real contact or conversion page when it is the intended next step.

Omit:

- thin pages that add no distinct information;
- search, tag, pagination, archive, and duplicate parameter variants;
- privacy, terms, or utility pages unless a relevant task requires them;
- unapproved proof, claims, testimonials, or outcomes;
- stale, private, broken, redirecting, or duplicate destinations;
- pages included only to make the file look comprehensive.

Use the site's existing public pages. Do not copy content into separate files solely for `llms.txt`.

## Write descriptions

Descriptions help an agent decide which page to fetch. Each description should:

- state the task, question, decision, or subject the page answers;
- use concrete product, service, framework, or workflow terms where accurate;
- distinguish the page from nearby entries;
- remain useful when read without the surrounding section.

Avoid descriptions such as “learn more,” “world-class platform,” or “industry-leading solution.” Prefer specific language such as “Plan direct redirects and post-launch monitoring.”

Keep the index curated. More links are not automatically better.

## Add instructions only when verified

An instructions section can contain current rules such as:

- where to confirm the latest product or package version;
- which maintained workflow to use instead of a recently deprecated one;
- which source to check for current compatibility or release information;
- which supported path to prefer over a fragile alternative.

Keep instructions short and factual:

- Use one behavior per bullet.
- Use direct, imperative language.
- Name the preferred and deprecated patterns together when applicable.
- Focus on current or recent changes.
- Remove a rule when it becomes obsolete.
- Never invent instructions to bias an agent toward the site.

## Keep it current

For a small explicit website, curate `public/llms.txt` directly and review it whenever public routes, positioning, services, or use cases change.

For a collection-driven site, generate the link set from the same route or content source that publishes the website. Store the task-shaped description beside the source page instead of creating a separate llms-only inventory.

Update the file when:

- a linked route is added, removed, renamed, redirected, or materially rewritten;
- the site's positioning, offering, or supported use cases change;
- a linked claim or page is withdrawn;
- an agent instruction becomes stale.

Update the ISO review date on every meaningful change.

## Validation

### Source

- `public/llms.txt` exists.
- `TEMPLATE_LLMS_TXT`, brace-delimited template values, and unresolved `TODO_CLIENT_*` values are absent.
- There is exactly one H1 and it is the first content block.
- A blockquote summary and ISO review date are present.
- At least one H2 and one described absolute HTTPS link are present.
- Every link follows the required title, URL, and description shape.
- No URL appears twice.
- Every fact, claim, date, outcome, and instruction is reviewed.

### Deployed response

- `/llms.txt` returns direct HTTP 200.
- The content type is `text/plain` or `text/markdown`.
- The response has no redirect, authentication wall, HTML shell, cookie, or bot challenge.
- Every listed target returns direct HTTP 200 public content.
- No listed target redirects or requires authentication.

## Replace the Launch Template example

1. Inventory the current public pages.
2. Select only pages that help an agent understand, evaluate, or use the site.
3. Confirm every selected production URL is public, authoritative, direct, and current.
4. Replace the identity, summary, links, descriptions, and sections in `public/llms.txt`.
5. Add instructions only when the project has verified current guidance.
6. Remove `TEMPLATE_LLMS_TXT` after the finished file is reviewed.
7. Run the source verifier, build, and appropriate live audit.
8. Test every linked target in production.

The base template must fail verification until the example is replaced and `TEMPLATE_LLMS_TXT` is removed:

```bash
pnpm launch:verify
```

After replacement, use a reviewed production origin:

```bash
export PRODUCTION_URL="REVIEWED_PRODUCTION_ORIGIN"
pnpm launch:verify
curl -i "$PRODUCTION_URL/llms.txt"
pnpm launch:audit --url "$PRODUCTION_URL" --mode production
```

## Deliberate removal

The launch baseline keeps and replaces `llms.txt`. If a client explicitly decides not to publish it:

1. Delete `public/llms.txt`.
2. Set `LLM-01` to `not_applicable` in `docs/launch/checklist.json` and record the project decision.
3. Run `pnpm launch:checklist --write`, `pnpm launch:verify`, and the appropriate live audit.

Do not leave the unchanged example deployed or mark it complete manually; `LLM-01` is resolved by its named automated check.

## References

- [llms.txt format proposal](https://llmstxt.org/)
- [Synscribe: llms.txt implementation guide](https://www.synscribe.com/agentic-discovery/llms-txt)
- [Synscribe: llms.txt template pack](https://www.synscribe.com/agentic-discovery/resources/llms-txt-template-pack)
