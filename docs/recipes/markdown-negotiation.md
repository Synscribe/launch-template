# Markdown content negotiation recipe

Use this recipe to serve readable Markdown through the same canonical URLs that serve HTML and through explicit `.md` aliases.

Checklist items: `LLM-02`, `LLM-03`, and `ROUTE-02`.

## What stays in sync automatically

The React page remains the default source of truth.

For a request with `Accept: text/markdown`, the server fetches the rendered HTML for that same URL, selects its `<main>` content, and converts it to Markdown. The explicit `.md` alias uses that same handler and body. A normal page does not need a matching Markdown source file. Updating the page component updates every representation on the next request.

The HTML response keeps the existing page, components, metadata, interactions, and visual design. The Markdown response intentionally omits the shared navigation, footer, scripts, styles, templates, and SVG decoration outside the useful page content.

## How visual cards become readable Markdown

HTML can wrap an entire card in one link, including a heading, description, image, and call to action. Markdown cannot put block headings or paragraphs inside link brackets. The converter handles that difference before returning the response:

- A link containing a heading becomes ordinary Markdown blocks. The heading carries the card destination.
- Elements marked `aria-hidden="true"` and images without useful alt text are omitted as decoration.
- A meaningful image keeps its alt text. When Next.js serves it through `/_next/image`, the Markdown uses the original `url` source instead of the optimizer URL.
- Inline links and links without a heading keep normal Markdown link behavior.

For example, a linked use-case card becomes:

```md
### [Website migrations](/uses/website-migrations)

We protect important URLs, search traffic, and customer journeys while the new site is built.

View use case
```

This normalization is generated from the rendered page. It does not require a second content file or any change to the visual card. Use a pathname override only when the agent-facing content should deliberately differ from the page.

## Use an explicit `.md` URL

Append `.md` to a public page path when a client cannot send an `Accept` header:

| Canonical HTML URL         | Explicit Markdown URL         |
| -------------------------- | ----------------------------- |
| `/`                        | `/index.md`                   |
| `/uses`                    | `/uses.md`                    |
| `/uses/website-migrations` | `/uses/website-migrations.md` |

The alias returns Markdown regardless of the request's `Accept` header. It uses the exact generated or overridden body returned by content negotiation on the canonical path.

The canonical HTML URL remains authoritative. Explicit aliases are not added to the HTML sitemap. Same-origin redirects keep the `.md` suffix, and missing aliases keep HTTP 404 with the Markdown recovery body.

The `.md` suffix is reserved for this routing convention. Do not place an unrelated static Markdown asset at a public path that collides with a page alias.

## Add a custom Markdown override

An override is optional. Use one when an agent needs a shorter task guide, a more explicit data representation, or content that should differ deliberately from the visual page.

Create a UTF-8 Markdown file under `src/content/markdown` using the public pathname:

| Public URL         | Optional override file                    |
| ------------------ | ----------------------------------------- |
| `/`                | `src/content/markdown/index.md`           |
| `/contact`         | `src/content/markdown/contact.md`         |
| `/uses/example`    | `src/content/markdown/uses/example.md`    |
| `/guide/first-run` | `src/content/markdown/guide/first-run.md` |

The file body is served verbatim. It must not be empty. Query-string variants use the override for the pathname.

An override changes only the Markdown representation. It does not create an HTML route, change a redirect, or turn a missing route into HTTP 200. The existing route's status remains authoritative.

## Request flow

1. `src/proxy.ts` applies only to document `GET` and `HEAD` requests. Static files, machine-readable endpoints, Next.js internals, and API routes keep their existing behavior.
2. A path ending in `.md` is mapped to its canonical source path before `Accept` negotiation. `/index.md` maps to `/`.
3. `src/lib/content-negotiation.ts` selects HTML or Markdown on canonical URLs using media-range specificity, quality values, wildcards, and explicit `q=0` exclusions.
4. HTML requests continue to the original App Router page.
5. Negotiated and explicit Markdown requests rewrite internally to `src/app/api/agent-markdown/route.ts`. The rewrite includes the source URL and explicit-route state in its cache key.
6. The handler keeps the source status and redirects. It uses a route override when present; otherwise, `src/lib/markdown-representation.ts` converts the rendered `<main>` content.
7. Unsupported document types on canonical URLs receive HTTP 406.

The internal route is implementation plumbing. Public agents should request the canonical page URL with an `Accept` header.

## Files and environment values

- Request routing: `src/proxy.ts`
- Internal representation handler: `src/app/api/agent-markdown/route.ts`
- Accept parser and `Vary` helper: `src/lib/content-negotiation.ts`
- Explicit alias mapping: `src/lib/markdown-routing.ts`
- HTML conversion and override resolver: `src/lib/markdown-representation.ts`
- Optional overrides: `src/content/markdown/**/*.md`
- Override deployment tracing: `next.config.ts`
- Unit tests: the adjacent `*.test.ts` files and `src/proxy.test.ts`
- Live endpoint checks: `scripts/launch-audit.ts`
- Runtime dependency: `turndown`
- Environment values: none

## Verify locally

Build and start the production server before checking response headers:

```bash
pnpm build
pnpm start
```

In another terminal, verify both representations and an unsupported type:

```bash
curl -sS -L -i -H 'Accept: text/markdown' http://localhost:3000/
curl -sS -L -i -H 'Accept: text/html' http://localhost:3000/
curl -sS -L -i -H 'Accept: text/markdown;q=0.2, text/html;q=1' http://localhost:3000/
curl -sS -L -i -H 'Accept: application/pdf' http://localhost:3000/
curl -sS -L -i http://localhost:3000/uses.md
curl -sS -L -i http://localhost:3000/uses/website-migrations.md
```

The Markdown request must finish with HTTP 200, `Content-Type: text/markdown; charset=utf-8`, `Vary: Accept`, and a nonempty Markdown body. The HTML requests must return the existing HTML document. The unsupported request must return HTTP 406. Linked cards must have linked headings rather than headings or paragraphs inside one pair of link brackets.

Confirm that an explicit alias and negotiated Markdown are byte-for-byte identical:

```bash
diff -u \
  <(curl -sS -L -H 'Accept: text/markdown' http://localhost:3000/uses) \
  <(curl -sS -L http://localhost:3000/uses.md)
```

No output means the bodies match.

Verify the Markdown 404 without checking only the status:

```bash
curl -sS -L -i -H 'Accept: text/markdown' http://localhost:3000/a-path-that-does-not-exist
curl -sS -L -i http://localhost:3000/a-path-that-does-not-exist.md
```

It must finish with HTTP 404, `Content-Type: text/markdown; charset=utf-8`, `Vary: Accept`, an explanation, and a recovery link.

Run the complete checks:

```bash
pnpm check
pnpm build
pnpm launch:audit --url http://localhost:3000 --mode template
```

After deployment, repeat the `curl` checks and run the audit against the reviewed production origin with `--mode production`.

## Remove only explicit `.md` aliases

Header negotiation is the P0 baseline. If a project keeps negotiation but deliberately removes the P2 aliases:

1. Remove `sourcePathnameFromMarkdownAlias`, `markdownAliasPathname`, and `MARKDOWN_EXPLICIT_PARAM` from `src/lib/markdown-routing.ts` and their tests.
2. Remove the explicit-path branch and `.md` matcher exception from `src/proxy.ts`.
3. Remove explicit redirect rewriting from `src/app/api/agent-markdown/route.ts`.
4. Set `LLM-02` to `not_applicable`, update the feature catalog and this recipe, then regenerate the readable checklist.
5. Confirm `/uses.md` no longer returns `text/markdown`, while `Accept: text/markdown` on `/uses` still works.

## Remove every Markdown representation

The template keeps Markdown negotiation by default. If a project deliberately removes it:

1. Remove the negotiation logic from `src/proxy.ts`, or delete the file if it has no other responsibility.
2. Delete `src/app/api/agent-markdown`, `src/lib/content-negotiation.ts`, `src/lib/markdown-representation.ts`, `src/lib/markdown-routing.ts`, and their tests.
3. Delete any files under `src/content/markdown`.
4. Remove the `/api/agent-markdown` entry from `outputFileTracingIncludes` in `next.config.ts`.
5. Run `pnpm remove turndown` and `pnpm remove -D @types/turndown`.
6. Set `LLM-02` and `LLM-03` to `not_applicable` in `docs/launch/checklist.json`, update `docs/features.md` and `README.md`, then regenerate `docs/launch/checklist.md`.
7. Run `pnpm launch:checklist --write`, `pnpm check`, `pnpm build`, and the appropriate live audit.

## References

- [Accept Markdown](https://acceptmarkdown.com/)
- [Accept Markdown Next.js recipe](https://acceptmarkdown.com/recipes/nextjs)
- [RFC 9110 content negotiation](https://www.rfc-editor.org/rfc/rfc9110.html#name-content-negotiation)
- [RFC 7763: The text/markdown media type](https://www.rfc-editor.org/rfc/rfc7763.html)
