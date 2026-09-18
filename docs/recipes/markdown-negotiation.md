# Markdown content negotiation recipe

Use this recipe to serve readable Markdown from the same public URLs that serve HTML to browsers.

Checklist items: `LLM-03` and `ROUTE-02`.

## What stays in sync automatically

The React page remains the default source of truth.

For a request with `Accept: text/markdown`, the server fetches the rendered HTML for that same URL, selects its `<main>` content, and converts it to Markdown. A normal page does not need a matching `.md` file. Updating the page component updates both representations on the next request.

The HTML response keeps the existing page, components, metadata, interactions, and visual design. The Markdown response intentionally omits the shared navigation, footer, scripts, styles, templates, and SVG decoration outside the useful page content.

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
2. `src/lib/content-negotiation.ts` selects HTML or Markdown using media-range specificity, quality values, wildcards, and explicit `q=0` exclusions.
3. HTML requests continue to the original App Router page.
4. Markdown requests rewrite internally to `src/app/api/agent-markdown/route.ts`. The rewrite includes the source URL in its cache key.
5. The handler keeps the source status and redirects. It uses a route override when present; otherwise, `src/lib/markdown-representation.ts` converts the rendered `<main>` content.
6. Unsupported document types receive HTTP 406.

The internal route is implementation plumbing. Public agents should request the canonical page URL with an `Accept` header.

## Files and environment values

- Request routing: `src/proxy.ts`
- Internal representation handler: `src/app/api/agent-markdown/route.ts`
- Accept parser and `Vary` helper: `src/lib/content-negotiation.ts`
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
```

The Markdown request must finish with HTTP 200, `Content-Type: text/markdown; charset=utf-8`, `Vary: Accept`, and a nonempty Markdown body. The HTML requests must return the existing HTML document. The unsupported request must return HTTP 406.

Verify the Markdown 404 without checking only the status:

```bash
curl -sS -L -i -H 'Accept: text/markdown' http://localhost:3000/a-path-that-does-not-exist
```

It must finish with HTTP 404, `Content-Type: text/markdown; charset=utf-8`, `Vary: Accept`, an explanation, and a recovery link.

Run the complete checks:

```bash
pnpm check
pnpm build
pnpm launch:audit --url http://localhost:3000 --mode template
```

After deployment, repeat the `curl` checks and run the audit against the reviewed production origin with `--mode production`.

## Remove the feature deliberately

The template keeps Markdown negotiation by default. If a project deliberately removes it:

1. Remove the negotiation logic from `src/proxy.ts`, or delete the file if it has no other responsibility.
2. Delete `src/app/api/agent-markdown`, `src/lib/content-negotiation.ts`, `src/lib/markdown-representation.ts`, `src/lib/markdown-routing.ts`, and their tests.
3. Delete any files under `src/content/markdown`.
4. Remove the `/api/agent-markdown` entry from `outputFileTracingIncludes` in `next.config.ts`.
5. Run `pnpm remove turndown` and `pnpm remove -D @types/turndown`.
6. Set `LLM-03` to `not_applicable` in `docs/launch/checklist.json`, update `docs/features.md` and `README.md`, then regenerate `docs/launch/checklist.md`.
7. Run `pnpm launch:checklist --write`, `pnpm check`, `pnpm build`, and the appropriate live audit.

## References

- [Accept Markdown](https://acceptmarkdown.com/)
- [Accept Markdown Next.js recipe](https://acceptmarkdown.com/recipes/nextjs)
- [RFC 9110 content negotiation](https://www.rfc-editor.org/rfc/rfc9110.html#name-content-negotiation)
- [RFC 7763: The text/markdown media type](https://www.rfc-editor.org/rfc/rfc7763.html)
