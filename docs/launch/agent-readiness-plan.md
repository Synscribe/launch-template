# Agent readiness implementation plan

This plan records the work prompted by the Ora audit of `https://agenticwebsite.io`.
Launch requirements and their status continue to live in `docs/launch/checklist.json`.
Do not use this file as a second checklist.

## Baseline

- The homepage returns HTML when a client requests `Accept: text/markdown`.
- Missing routes return the correct HTTP 404 status but return an HTML body to Markdown clients.
- The production `Organization` JSON-LD omits `contactPoint` and `address`.
- A clean search for “Agentic Website” does not currently surface the canonical domain.
- The local template and the live deployment do not currently contain the same routes or identity, so production verification requires the deployment source to be identified.

## Implementation order

### 1. Markdown content negotiation

- Parse `Accept` using quality values, wildcards, specificity, and `q=0` exclusions.
- Serve `text/markdown; charset=utf-8` when Markdown is preferred.
- Preserve HTML for browsers and clients that prefer HTML.
- Return `406 Not Acceptable` when the server cannot provide an acceptable representation.
- Add `Vary: Accept` without discarding Next.js response-header values.
- Generate the default Markdown representation from the rendered HTML response so page components remain the source of truth.
- Allow an optional route-specific Markdown file to override the generated representation.
- Keep custom Markdown overrides opt-in. A page must not require a second Markdown file.

### 2. Brand-name discoverability

- Keep the brand name consistent across visible content, metadata, `Organization`, `WebSite`, canonical URLs, and `llms.txt`.
- Add reviewed `legalName`, `alternateName`, `sameAs`, or `parentOrganization` values when they apply.
- Keep one canonical hostname and a direct apex redirect.
- Record the manual work required in Google Search Console, Bing Webmaster Tools, owned profiles, listings, the parent website, and the GitHub repository.
- Do not turn search-result position into a deterministic CI check.

### 3. Agent-friendly 404 responses

- Keep the existing human-facing 404 page and HTTP status.
- Return a useful Markdown body for missing paths requested with `Accept: text/markdown`.
- Include links to the homepage, sitemap, or `llms.txt`.
- Verify status, content type, `Vary`, body length, and recovery links in the live audit.

### 4. Organization schema completeness

- Add typed, reviewed organization identity fields in `src/config/site.ts`.
- Add `contactPoint` and `PostalAddress` to the `Organization` JSON-LD only from real public business information.
- Never invent a phone number or address to satisfy a scanner.
- Add source and live checks for the configured organization profile.

## Documentation and checks

- Update the matching reusable items in `docs/launch/checklist.json`.
- Regenerate `docs/launch/checklist.md` with `pnpm launch:checklist --write`.
- Update `docs/features.md`, `README.md`, and focused recipes where behavior or removal instructions change.
- Extend `scripts/launch-audit.ts` to check negotiated homepage responses, Markdown 404s, and Organization completeness.
- Add unit tests for every parser, resolver, serializer, and request-routing behavior introduced.

## Verification

Run:

```bash
pnpm launch:checklist --write
pnpm check
pnpm build
pnpm launch:verify
pnpm launch:audit --url http://localhost:3000 --mode template
```

After deployment, repeat the audit in production mode and verify Markdown and HTML responses with `curl`.

## Production inputs still required

- The repository or branch that deploys `www.agenticwebsite.io`.
- An approved public contact email or telephone and contact type.
- An approved public postal address, or a decision to keep it private and accept partial Organization completeness.
