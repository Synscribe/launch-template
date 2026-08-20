# PostHog: configure or remove

PostHog is present by default through Next.js `instrumentation-client`. It is inactive when no project token exists. This is environment configuration, not a template feature flag.

## Configure

1. Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` in the deployment environment.
2. Confirm the project belongs to the client and production environment.
3. Decide consent, cookies, session replay, surveys, retention, and staff/internal exclusions for the client's markets.
4. Define a small event plan. Never capture sensitive form values as event properties.
5. Verify pageviews and named conversion events in production.
6. Record the decision under `ANALYTICS-01` in `docs/launch/status.md`.

Implementation: `src/instrumentation-client.ts` follows PostHog's current Next.js client setup. If a Content Security Policy is added, allow the configured PostHog endpoints or use a reviewed reverse proxy.

## Remove

1. Delete `src/instrumentation-client.ts`.
2. Remove `posthog-js` from `package.json` and reinstall dependencies.
3. Remove PostHog environment values from `.env.example` and the deployment.
4. Remove analytics-specific CSP/proxy rules and event calls, if any.
5. Update `docs/features.md` and record “not used” for `ANALYTICS-01`.
6. Run `pnpm check`, `pnpm build`, and the launch audit.

Do not replace the integration with an `ENABLE_POSTHOG` flag.
