# Cloudflare Turnstile: configure, reuse, or remove

Cloudflare Turnstile is included as optional spam protection for the contact form. It is configuration-driven rather than controlled by a feature flag: unless both keys are present, the browser does not load the Turnstile script and the API skips verification.

Checklist item: `FORM-03`.

## File map

- `src/lib/turnstile.ts`: paired-key configuration and server-side Siteverify client.
- `src/lib/turnstile.test.ts`: configuration and verification contract tests.
- `src/app/contact/_components/turnstile.tsx`: explicit-render browser widget and token/reset hook.
- `src/app/contact/_components/contact-form.tsx`: token submission, disabled-button state, errors, and reset after each request.
- `src/app/contact/page.tsx`: passes the public widget configuration from the server-rendered route.
- `src/app/api/contact/route.ts`: verifies the token before the delivery side effect.
- `src/lib/contact.ts`: permits the transport-only `turnstileToken` field without adding it to the delivered contact data.
- `.env.example`: documents both keys without shipping a working credential.

The widget starts route-local because the contact form is its only real consumer. Promote it only after a second form uses it.

## Configure

Create a widget for the production host in Cloudflare Turnstile, then set both values in the matching deployment environment:

```dotenv
NEXT_PUBLIC_TURNSTILE_SITE_KEY="reviewed-public-site-key"
TURNSTILE_SECRET_KEY="reviewed-server-secret"
```

The site key is intentionally public. `TURNSTILE_SECRET_KEY` must remain server-only and must never be renamed with a `NEXT_PUBLIC_` prefix.

Configuration is paired:

- both values present: render the widget and require server verification;
- either or both values absent: render nothing, load no Cloudflare widget script, and skip server verification.

Do not set only one value. Although the feature safely remains inactive, a half-configured deployment is not the intended production state.

## Request flow

1. The contact page checks the paired server environment and passes only the public site key and `contact` action to the Client Component.
2. The widget loads Cloudflare's explicit-render script and returns a token to the form.
3. The submit button remains disabled until configured Turnstile has produced a token.
4. The form sends the token only when Turnstile is enabled.
5. The API keeps the honeypot, timing, same-origin, size, field, and rate-limit checks, then sends the token to Siteverify before email delivery.
6. Siteverify must return success with the expected `contact` action and request hostname. A missing, oversized, expired, replayed, mismatched, or unverifiable token fails closed when the feature is enabled.
7. The client resets the token after every request because Turnstile tokens are single-use and expire after five minutes.

The verifier sends the proxy-derived client IP when available, uses an idempotency key, and limits the Cloudflare request to ten seconds. It never logs the secret or submitted token. The route returns a generic safe error while logging only the rejection reason.

## Reuse on another form

Keep each form's orchestration and widget placement with that route:

1. Reuse `src/app/contact/_components/turnstile.tsx` initially; promote it to a shared component only when the second use is real.
2. Define a short stable action for the new form and pass the same value to the widget and `verifyTurnstile` call.
3. Allow `turnstileToken` in that endpoint's bounded transport payload, but do not persist it, email it, or send it to analytics.
4. Call `verifyTurnstile` before the endpoint's email, CRM, download, or subscription side effect.
5. Pass the request hostname and client IP to verification.
6. Reset the token after success and failure, and show a safe recoverable error when the challenge cannot load or validate.

Keep the existing rate limit and other cheap controls. Turnstile complements them; it does not replace request bounds, origin checks, a honeypot, or provider-level controls.

## Privacy and security review

When Turnstile is enabled:

- add Cloudflare and the challenge data flow to the project's reviewed privacy/subprocessor record as applicable;
- confirm the Cloudflare widget is restricted to the intended production and preview hostnames;
- update any Content Security Policy to allow the exact Cloudflare Turnstile script/frame connections required by the current integration;
- keep the secret only in the server environment and rotate it if exposed;
- do not send tokens to PostHog, logs, email, or storage;
- test the failure experience with the challenge domain blocked as well as the normal success path.

## Verify

1. Run `pnpm exec vitest run src/lib/turnstile.test.ts` and the complete `pnpm check`.
2. With both keys absent, load `/contact`: no Cloudflare challenge script or widget should appear, and ordinary form behavior should be unchanged.
3. Use Cloudflare's documented test keys in a non-production environment. Confirm success, invalid-token failure, expired-token reset, and a second submission with a new token.
4. Confirm the API rejects a token created for a different action or hostname.
5. Configure the reviewed production widget and keys, submit once from the deployed page, and confirm delivery still works end to end.
6. Confirm the browser receives only the public key and neither application logs nor delivered messages contain the token or secret.
7. Review `FORM-03`, the privacy disclosure, Cloudflare hostname restrictions, and any CSP changes before production.

Then run:

```bash
pnpm build
pnpm launch:audit --url "$PRODUCTION_URL" --mode production
```

## Remove

When the project does not want Turnstile but keeps the contact form:

1. Remove the Turnstile props and configuration from `src/app/contact/page.tsx`.
2. Remove the hook, widget, token field, reset calls, and token-dependent button state from `src/app/contact/_components/contact-form.tsx`.
3. Remove the `verifyTurnstile` call and imports from `src/app/api/contact/route.ts`.
4. Remove `turnstileToken` from the allowlist in `src/lib/contact.ts`.
5. Delete `src/app/contact/_components/turnstile.tsx`, `src/lib/turnstile.ts`, and `src/lib/turnstile.test.ts` when no other form uses them.
6. Remove both Turnstile values from `.env.example` and every deployment environment.
7. Update `docs/features.md`, this recipe, the contact recipe, and the `FORM-03` files/details in `docs/launch/checklist.json`; regenerate the readable checklist.
8. Run the complete checks and test the remaining abuse controls.

## References

- [Cloudflare Turnstile overview](https://developers.cloudflare.com/turnstile/)
- [Client-side explicit rendering](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/)
- [Required server-side validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
- [Cloudflare Turnstile test keys](https://developers.cloudflare.com/turnstile/troubleshooting/testing/)
