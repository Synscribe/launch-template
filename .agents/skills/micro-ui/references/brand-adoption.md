# Taking this to another brand

> **In this repo the port is already done.** `examples/brand.ts` is filled from
> the token block in `src/app/globals.css`, using `var(--token)` references
> rather than hexes, with three derived steps flagged `TODO_CLIENT_TOKEN`. Read
> this file when taking the kit to a _different_ company, or when a client
> replaces the template palette wholesale.

The motion system is brand-agnostic. The palette is not. Porting the kit to a
new company is one file of work — but only if you do the discovery first,
because the whole point is that the visuals look native to _their_ site, not
like a Seavoice component with the colours swapped.

## Prerequisites in the host repo

| Need                  | Why                                    | If missing                                                           |
| --------------------- | -------------------------------------- | -------------------------------------------------------------------- |
| React 18+             | the visuals are components             | this kit does not apply — say so rather than reaching for static SVG |
| `framer-motion`       | every animation                        | `npm i framer-motion`                                                |
| Tailwind (or `cn`)    | `_kit.tsx` uses `cn` for class merging | drop `cn` and concatenate strings; nothing else depends on Tailwind  |
| A design-token source | so colours are inherited, not invented | see "When there are no tokens" below                                 |

Typography needs nothing: the visuals set no `font-family`, so they inherit the
host page's typeface automatically.

## Step 1 — discover the brand (do not skip)

Read before you write. You are looking for four things: the palette, the
neutrals, the surface treatment, and whether an in-house visual style already
exists that you should extend instead of replacing.

```bash
# an existing animated-visual system is the highest-value find — extend it
ls src/components/**/visuals/ src/components/**/_kit.tsx 2>/dev/null

# design tokens, in rough order of likelihood
cat src/tokens/* 2>/dev/null
grep -n "^\s*--" src/index.css src/app/globals.css 2>/dev/null | head -40
grep -n "colors:" -A 40 tailwind.config.* 2>/dev/null

# how the marketing pages actually use colour — more honest than the token file
grep -rohE "bg-\[?#[0-9A-Fa-f]{6}\]?|bg-(brand|accent|primary)[a-z-]*" src/components/*.tsx |
  sort | uniq -c | sort -rn | head -20
```

Then look at the live homepage. Token files list what exists; the homepage
shows what is _used_, which is what the visuals must match. Note the section
grounds, whether cards are flat or shadowed, the corner radius, and whether the
brand leans on gradients or flat fills.

## Step 2 — fill in `brand.ts`

Copy `examples/_kit.tsx` and `examples/brand.ts` into the host project, then
rewrite `brand.ts`. This is the only file that should differ between brands.

```ts
export const BRAND = {
  accents: {
    // Three roles, filled from the host palette. Name them by role, never by
    // hue — a brand whose accents are purple and orange fills the same slots.
    positive: { fg: "", tint: "", solid: "" }, // outcomes, money, resolved
    system: { fg: "", tint: "", solid: "" }, // routing, coverage, infrastructure
    human: { fg: "", tint: "", solid: "" }, // people, privacy, delivery
    neutral: { fg: "", tint: "", solid: "" }, // resolved but unremarkable
  },
  ink: "", // primary text
  muted: "", // secondary text
  faint: "", // inactive state, connectors
  line: "", // borders, dividers
  inset: "", // inset panels inside the plate
  surface: "", // the plate itself
  plate: { maxWidth: "420px", radius: "18px", shadow: "" },
};
```

Rules for filling it:

- **Every value must already exist in the host project.** If you are picking a
  hex, you have skipped step 1.
- **`fg` must pass contrast on `surface`** — these carry small text. A brand's
  mid-tone accent usually needs its dark variant here.
- **`tint` is the pale wash behind `fg`.** If the brand has no tints, derive
  them and add them to the host's token file rather than hiding them in
  `brand.ts` — other components will want them too.
- **`solid` is the saturated fill** for waveform bars, progress and filled
  dots. Usually the brand's DEFAULT.
- **Only three accents.** More and the set stops reading as one system.

### When there are no tokens

Some repos genuinely have none. Then: take the palette off the homepage,
write it into a token file in the host's own conventions, and point `brand.ts`
at that. Do not let `brand.ts` become the project's de-facto palette — it is a
consumer of tokens, not a source of them.

### When the brand is dark-first

The kit assumes light plates on a light page, because that is where these
usually sit. For a dark-first brand, invert `surface`/`ink`/`line`/`inset` and
raise the accent `fg` values for contrast — but check the _page section_ the
visual sits in, not the site's overall mood. A dark site with a white feature
band still wants light plates.

## Step 3 — check nothing else is brand-coupled

```bash
# after porting, this should return only brand.ts
grep -rn "#[0-9A-Fa-f]\{6\}" _kit.tsx brand.ts *.tsx | grep -v "^brand.ts"
```

`#fff` inside an icon's `stroke` is the one acceptable exception — it sits on a
filled accent, so it is white by construction rather than by palette.

## Step 4 — build one visual and stop

Build a single visual, put it on a real page next to real copy, and look at it
against the rest of the site. Adjust `brand.ts` until it stops looking like a
foreign object. _Then_ build the rest — a wrong palette replicated twenty times
is twenty files to fix.

## What stays the same across every brand

Do not re-tune these per brand. They are the system, and changing them is what
makes a ported set feel like a different product:

- one loop per visual, 7–9s
- blur-rise entry on expo-out, staggered ~140ms
- spring overshoot only on state changes
- paused off-screen, resolved state under reduced motion
- no two visuals in a set moving the same way

See `motion-system.md` for the full contract and `motion-patterns.md` for the
pattern catalogue.
