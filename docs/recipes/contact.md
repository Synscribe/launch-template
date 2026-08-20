# Contact form: configure, verify, or remove

The `/contact` page is ordinary, deletable code. It server-renders the page and form markup, then uses a small Client Component for validation, submission state, and minimized attribution. Delivery is disabled until every server-only mail value is present.

The canonical launch requirements are `FORM-01` through `FORM-04` in `docs/launch/checklist.md`. Keep rationale and verification changes there instead of creating another form or privacy checklist.

## Configure delivery

Set these as server-only deployment values. Never prefix them with `NEXT_PUBLIC_`.

```dotenv
MAIL_HOST="smtp.example.com"
MAIL_PORT="587"
MAIL_USER="..."
MAIL_PASS="..."
MAIL_FROM="Website <website@example.com>"
CONTACT_TO_EMAIL="reviewed-recipient@example.com"
```

All six values are required. The form stays visibly unavailable when one is missing, and the production launch audit fails `FORM-01`. There is no believable fallback sender or recipient.

SMTP delivery lives in `src/lib/contact-delivery.ts`. Replace that adapter when a project uses a transactional email API or CRM, while keeping validation and the route contract stable.

## Attribution kept by the default

`src/lib/visitor-context.ts` uses local browser storage to retain:

- the first same-site landing URL with only `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, and `utm_content`;
- the first external referrer with its query string and fragment removed;
- the first-visit time;
- up to five recent same-site paths with all query strings and fragments removed.

The default context expires after 90 days. The API checks origin, length, allowed campaign fields, and expiry again before sending it. It does not accept arbitrary off-site journey URLs. Form values and attribution are included in the delivery email; only a property-free `contact_form_submitted` conversion event is sent to PostHog after success.

Before production, the approved privacy policy must name the actual fields, browser storage, recipient/provider, purpose, access, retention, and deletion process. Change or remove attribution if the client cannot justify it.

## Validation and abuse controls

- `src/lib/contact.ts` trims and bounds fields, normalizes the optional website, rejects unexpected fields, and sanitizes attribution.
- `src/app/api/contact/route.ts` requires a same-origin request, checks body size and completion time, and returns safe errors.
- A hidden honeypot handles simple bots.
- `src/app/api/contact/_lib/rate-limit.ts` allows five attempts per IP in ten minutes.
- `src/lib/contact-delivery.ts` escapes every submitted value in HTML and uses the submitter only as `replyTo`.

The included rate limit is an in-memory, per-instance baseline. For high traffic, coordinated attacks, or multiple serverless instances, replace it with a durable provider/edge control and document the decision under `FORM-03`. Add CAPTCHA only when the actual abuse level and privacy tradeoff justify it.

## Verify

1. Confirm the recipient and sender belong to the current project.
2. Start from a URL with test UTMs, visit several same-site pages, then submit the form once.
3. Confirm the success and failure states, reply path, delivered field values, first landing/UTMs, external referrer, and the final five clean page paths.
4. Confirm the received message did not preserve unrelated or sensitive query values.
5. If PostHog is configured, confirm `contact_form_submitted` arrives without names, emails, message text, URLs, or campaign values.
6. Check keyboard behavior, visible focus, labels, field errors, mobile layout, and the form without a delivery configuration.
7. Run `pnpm check`, `pnpm build`, and the launch audit. Repeat the audit and an end-to-end delivery test against production, then record recipient ownership and evidence in `docs/launch/status.md`.

## Remove

When the project does not use a contact form:

1. Delete `src/app/contact`, `src/app/api/contact`, `src/lib/contact.ts`, `src/lib/contact-delivery.ts`, `src/lib/visitor-context.ts`, and their tests.
2. Remove `VisitorContextTracker` and its `Suspense` wrapper from `src/app/layout.tsx`.
3. Remove `/contact` from the header CTA, footer, and `src/app/sitemap.ts`; replace the CTA with a real destination.
4. Remove `nodemailer` and `@types/nodemailer`, then reinstall dependencies.
5. Remove the six contact mail values from `.env.example` and every deployment.
6. Remove the contact-specific privacy text and update `docs/features.md` and `docs/launch/status.md`.
7. Run the complete checks and audit every remaining CTA.

Do not retain the form behind an enable/disable flag.
