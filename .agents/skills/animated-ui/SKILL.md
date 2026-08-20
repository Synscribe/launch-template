---
name: animated-ui
description: Create or refine route-native animation and motion in this Next.js website. Use for animated heroes, feature demonstrations, micro-interactions, reveal sequences, ambient backgrounds, or motion audits. Prefer CSS and existing dependencies, preserve server-rendered content without JavaScript, support reduced motion, and test accessibility, responsiveness, performance, and layout stability.
---

# Animated UI

Use motion to explain state, hierarchy, or cause and effect. A page does not need animation merely because it is a marketing page.

## Read before animating

Read:

- the route and the component being changed;
- `src/app/globals.css`, including the global reduced-motion rule;
- `references/motion-patterns.md` to select an approach;
- `references/project-boundaries.md` for this template's architecture and checks.

State the purpose of the motion in one sentence. If removing the animation changes nothing about comprehension, keep it subtle or skip it.

## Workflow

### 1. Choose the least complex mechanism

1. Use CSS transitions/keyframes for ambient movement, one-time emphasis, and small state changes.
2. Use native browser APIs for visibility or pointer-driven behavior when needed.
3. Create a Client Component only for real interactive state or sequencing that CSS cannot express.
4. Add a motion library only when a current, approved interaction clearly benefits from it. Do not add one for a sample.

### 2. Preserve the server-first baseline

- Keep critical copy, links, and controls in server-rendered HTML.
- Ensure all content is visible and usable when JavaScript is disabled.
- Use animation as enhancement; never gate navigation, form access, or meaning behind a timeline.
- Keep the component route-local until there is a second real use.

### 3. Build the motion

- Prefer `transform` and `opacity`.
- Keep entrance movement short and small.
- Use a shared timing relationship within one composition.
- Reserve layout space before animation starts.
- Avoid animating width, height, margin, padding, top, or left when a transform can express the effect.
- Avoid continuous motion around reading-heavy content.
- Keep hover behavior optional; the main idea must work on touch and keyboard.

### 4. Provide reduced motion

The no-motion state must be intentionally composed, not merely a one-frame animation. Confirm that `prefers-reduced-motion: reduce` removes nonessential movement and leaves final content visible. Add component-specific rules when the global rule is insufficient.

### 5. Verify

- inspect desktop and mobile;
- test keyboard focus and touch behavior;
- emulate reduced motion;
- confirm no content or link disappears without JavaScript;
- check for layout shift and excessive main-thread work;
- run `pnpm check`, `pnpm build`, and the applicable launch audit.

## Guardrails

- Do not default to GSAP, Motion, Lottie, Rive, Three.js, or CDN scripts.
- Do not ship standalone HTML prototypes as production implementation.
- Do not add perpetual spinning, bouncing, or pulsing near long-form copy.
- Do not animate every section with the same reveal.
- Do not hide useful content until a scroll observer runs.
- Do not copy motion values or brand colors from the source template without adapting them.
- Do not turn motion samples into a global component catalog.
