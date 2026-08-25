# Widgets and implementation journal

Treat every visible source-site surface as clone scope unless the user explicitly excludes it. This includes elements injected by third-party scripts, rendered in iframes or shadow roots, or delayed until scroll/time/consent: cookie banners, chat launchers, scheduling panels, review badges, popups, feedback tabs, notification bars, and similar overlays.

Visual fidelity and production functionality are separate acceptance dimensions. A faithful local stand-in can close a screenshot gap, but it does not make the underlying integration launch-ready.

## Discover widgets and states

Use a clean browser profile when consent or first-visit state matters. After the initial load:

1. wait for delayed scripts and fonts, then scroll the full page;
2. inspect fixed/sticky elements, iframes, shadow roots, script sources, and network domains;
3. capture the default, expanded, dismissed, error, and responsive states that can be observed safely;
4. record which behavior depends on cookies, identity, region, authentication, vendor configuration, or data submission;
5. repeat at desktop and mobile when placement or state changes.

Do not accept legal terms, send a message, submit personal data, or trigger a real booking merely to inspect a state. Ask for safe test credentials or source evidence when a state cannot be reached without a consequential action.

## Classify each surface

Use one implementation status in `docs/launch/clone-journal.md`:

- `wired`: the approved integration or native implementation works end to end and was verified;
- `visual-only`: the local UI reproduces the observed appearance/state but its external behavior is absent;
- `partial`: some behavior works and the exact remainder is recorded;
- `omitted`: the user approved removing it from clone scope;
- `blocked`: access, licensing, configuration, or client input prevents implementation or verification.

For a visual-only or partial clone, implement only honest local UI behavior such as opening, closing, switching a visible panel, or dismissing it for the current page session. Do not pretend that a message was delivered, consent was stored, trackers were gated, a booking was created, or a support agent is online.

Never reuse the source site's vendor account ID, API key, form recipient, consent policy, cookie, endpoint, or analytics destination. Do not load the old production widget script. Use a new client-owned configuration only after it is supplied and reviewed. Reproduce third-party marks or assets only when the client has the right to use them.

## Keep the journal current

At the start of clone implementation, copy the bundled template:

```bash
cp .agents/skills/site-clone/assets/clone-journal.md docs/launch/clone-journal.md
```

Update the journal during implementation rather than reconstructing it at handoff. Record what works, what differs or is unwired, the observed source evidence, verified states/viewports, the launch decision, and the linked checklist ID. The journal is evidence and decision history, not a second launch checklist; actionable unresolved work belongs in `docs/launch/checklist.json`.

## Add project-specific launch gates

Add one `projectItems` check for every visual-only, partial, blocked, or launch-relevant omitted surface. Choose `P0` when it affects legal/privacy behavior, safety, data delivery, or the selected primary conversion path. Otherwise use the repository priority model and record the decision.

```bash
pnpm launch:checklist --add-project WIDGET-01 P0 \
  "cookie consent behavior is production-ready" \
  --detail "The source banner is visually cloned in preview." \
  --detail "Persistence, regional policy, and script gating still require client configuration." \
  --recipe docs/launch/clone-journal.md
```

Use stable project-local IDs such as `WIDGET-01` or `INTEGRATION-01`; do not modify reusable base checks to encode one client's implementation. The CLI writes the new item as `todo` and regenerates `docs/launch/checklist.md`.

Set the item to `done` only after its real production behavior has been verified. Set it to `not_applicable` only after the client deliberately excludes the surface and the clone journal records that decision. Never resolve a behavior check from screenshot parity alone.
