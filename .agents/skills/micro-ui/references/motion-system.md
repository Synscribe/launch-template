# Motion system

Read this before writing a visual. It is the contract every component in the set keeps.

## The brand contract

Colour lives in **one file: `brand.ts`**. Nothing else in the kit holds a hex.
Porting to another company is rewriting that file — see `brand-adoption.md`.

Accents are named by **role, not hue**, so a purple-and-orange brand fills the
same slots without renaming anything downstream:

| Slot             | Carries                              | Needs                   |
| ---------------- | ------------------------------------ | ----------------------- |
| `TONES.positive` | outcomes, money, resolved, compliant | `fg` / `tint` / `solid` |
| `TONES.system`   | routing, coverage, infrastructure    | `fg` / `tint` / `solid` |
| `TONES.human`    | people, privacy, delivery            | `fg` / `tint` / `solid` |
| `TONES.neutral`  | resolved but unremarkable            | `fg` / `tint` / `solid` |

`fg` is text/icon colour and must pass contrast on `surface`. `tint` is the
pale wash behind it. `solid` is the saturated fill for bars, progress and
filled dots.

Neutrals, also from `brand.ts`: `INK` (primary text), `MUTED` (secondary),
`FAINT` (inactive, connectors), `LINE` (borders), `INSET` (panels inside the
plate). Plate geometry — max width, radius, shadow — comes from `BRAND.plate`.

In this project every slot in `brand.ts` is a `var(--token)` reference into the
token block in `src/app/globals.css`, so a client token swap reaches the visuals
without touching the kit. Three derived steps the template does not yet have —
`--mint-deep`, `--signal-soft`, `--ink-soft` — are marked `TODO_CLIENT_TOKEN` in
`brand.ts` and must be added to `globals.css` before first use.

**One accent per visual**, at different intensities to carry state: `solid` for
done/active, `tint` for the surface behind it, `FAINT` for not-yet. Vary the
accent across the set so the page feels colourful without any single card being
busy. Roughly 80% neutral, 20% accent.

Typography is deliberately not in the contract: the visuals set no
`font-family` and inherit the host page's typeface. Sizes are fixed by the
system — plate title 15px/600, row title 12.5px/600, body 12–13.5px, meta
10.5–11.5px/500–600, stat 20–24px/700–800 with `tabular-nums`.

For a filled-in example, read `examples/brand.ts`.

## Timing

| Thing                              | Value                                 |
| ---------------------------------- | ------------------------------------- |
| Loop length                        | 7–9s (`useLoop(6, 1250)` ≈ 7.5s)      |
| Entry duration                     | 0.65s                                 |
| Stagger between siblings           | 0.14s                                 |
| Entry easing                       | `[0.22, 1, 0.36, 1]` (expo-out)       |
| State-change spring                | `stiffness 340, damping 24, mass 0.7` |
| Ambient pulse (live dot, waveform) | 1.8–2.6s, independent of the loop     |
| Text morph in / out                | 0.45–0.55s with `blur(6–7px)`         |

Ambient motion (a pulsing dot, a rotating spinner, a waveform) runs on its own clock and does
**not** reset with the loop. It is the visual's heartbeat; the loop is its sentence.

## Kit API

`_kit.tsx` — copy it, plus `brand.ts`, into a project that does not have one yet.
Only `brand.ts` should differ between projects.

```ts
useLoop(phases, phaseMs); // → { ref, phase, cycle, running, reduce }
```

Owns the in-view gate, reduced-motion handling and the cycle counter. `ref` goes on
`<VisualFrame innerRef={ref}>`. Under reduced motion `phase` pins to the last phase and
`running` is false — visuals must render their _resolved_ state in that case.

| Export                                                             | What it is                                                            |
| ------------------------------------------------------------------ | --------------------------------------------------------------------- |
| `VisualFrame`                                                      | outer flex centre, owns the in-view ref                               |
| `Plate`                                                            | the card; `maxWidth` overrides the standard width (a hero runs wider) |
| `PlateHead`                                                        | title + optional leading element + right-aligned badge                |
| `LiveBadge`                                                        | pill with a breathing dot                                             |
| `Pill`                                                             | small state chip, `active` toggles tint                               |
| `Divider`                                                          | 1px rule at the standard rhythm                                       |
| `Rise`                                                             | staggered blur-rise container; pass `cycle` to replay                 |
| `riseParent` / `riseChild`                                         | the variants, when you need them directly                             |
| `Counter`                                                          | counts to a value, writes to the DOM, no re-render                    |
| `Waveform`                                                         | bars with staggered scaleY, ambient                                   |
| `TickDot`                                                          | circle that fills and stamps a tick                                   |
| `CheckIcon`                                                        | the tick glyph                                                        |
| `ScanSweep`                                                        | gradient bar that sweeps once per cycle                               |
| `DrawPath`                                                         | SVG path that draws once per cycle                                    |
| `EASE`, `SPRING`                                                   | the timing constants                                                  |
| `TONES`, `INK`, `BODY`, `MUTED`, `FAINT`, `LINE`, `INSET`, `BRAND` | brand values, re-exported from `brand.ts`                             |

## Two kinds of state

Getting this split right is the difference between a smooth loop and a stuttering one.

**Discrete** — something is on or off at a given phase. Drive from `phase`:

```tsx
<TickDot on={phase > i} />
<motion.span animate={{ color: phase > i ? INK : FAINT }} transition={{ duration: 0.35 }} />
```

**Continuous** — something sweeps, draws, counts or fills over the cycle. Drive from a
`key={cycle}` remount plus `initial`/`animate`:

```tsx
<motion.div
  key={cycle}
  initial={{ scaleX: 0 }}
  animate={{ scaleX: 0.82 }}
  transition={{ duration: 2.4, ease: EASE }}
/>
```

## Traps

- `<text>` cannot contain an HTML `<span>`. Overlay an absolutely-positioned span on the SVG.
- A streaming list needs `overflow-hidden` and a height equal to `rows × row height`, or rows
  spill past the card during their exit animation.
- `layout` + `AnimatePresence` on the same element needs `mode="popLayout"` or rows jump.
- Framer animates SVG `cx`/`cy`/`r`/`pathLength` directly — use that instead of transforms when
  moving something along a line.
- An orbiting container rotates its children too. Counter-rotate each chip so labels stay level.
- `useInView` from `framer-motion`, not from a hand-rolled IntersectionObserver.
- Framer cannot interpolate a `var()` colour — `animate={{ color: … }}` between two tokens snaps
  rather than tweens. Cross-fade two stacked layers by opacity instead, or animate opacity on a
  tinted overlay. Static `var()` styles are fine.

## Checklist before you call one done

- [ ] Loops cleanly — the last frame flows into the first with no jump
- [ ] Reduced motion shows the resolved state, not an empty card
- [ ] Nothing overflows the plate at any phase (check the midpoint, not just the end)
- [ ] One accent, ~80% neutral
- [ ] Moves differently from every other visual in the set
- [ ] The thing that changes on screen _is_ the claim the copy makes
- [ ] No hex outside `brand.ts` (`#fff` on a filled accent is the one exception)
