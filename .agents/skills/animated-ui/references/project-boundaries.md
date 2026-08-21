# Project boundaries

## Sources

- Global tokens and reduced-motion baseline: `src/app/globals.css`
- Route-local use-case visuals: `src/app/uses/[slug]/_components`
- Homepage-only composition: `src/app/(marketing)/_components`
- Launch requirements and status: `docs/launch/checklist.json`
- Generated readable checklist: `docs/launch/checklist.md`

## Architecture

- Keep animation in the route's `_components` folder or route CSS module.
- Preserve Server Components by default. Isolate only the interactive fragment when client state is necessary.
- Do not introduce a global animation registry or serialize animation configuration into content JSON.
- Do not install an animation dependency until a real interaction requires it.
- If a design system is imported, remap motion and color through the existing token boundary rather than hard-coding the template brand.

## Verification

Relevant checklist IDs are `PERF-01`, `PERF-02`, `A11Y-01`, and `IMAGE-01`. Do not copy those requirements into the skill. Run the normal page audit, then update the matching status in the canonical JSON.
