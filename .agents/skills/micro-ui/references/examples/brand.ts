/**
 * ─── THE ONE FILE YOU EDIT PER BRAND ─────────────────────────────────────
 *
 * Everything else in this kit is brand-agnostic. To take the micro-UI system
 * to another company, copy the kit and rewrite this file from that project's
 * design tokens. Nothing below should be invented — every value here should
 * already exist somewhere in the host project.
 *
 * Accents are named by ROLE, not by hue, so a brand whose palette is purple
 * and orange fills the same three slots without renaming anything downstream:
 *
 *   positive — outcomes, money, resolved, compliant
 *   system   — routing, coverage, infrastructure, "the product working"
 *   human    — people, privacy, delivery, anything with a person behind it
 *   neutral  — resolved but unremarkable
 *
 * Each accent needs three values:
 *   fg    — text/icon colour, must pass contrast on `surface`
 *   tint  — the pale wash behind fg (pill fills, plate grounds)
 *   solid — the saturated fill (waveform bars, progress, filled dots)
 *
 * Typography is deliberately absent: the visuals inherit the page's font, so
 * they pick up the host brand's typeface with no configuration.
 *
 * This project's source of truth is the token block in src/app/globals.css.
 * Every slot below points at a CSS variable rather than a literal hex, so a
 * client token swap reaches the visuals with no edit here. Do not paste a hex
 * into this file — that is how a project ends up with a second palette.
 *
 * ─── TRAP: framer-motion cannot interpolate `var()` ───────────────────────
 *
 * A `var(--token)` colour resolves correctly for any static style, but an
 * `animate={{ color: … }}` between two of them SNAPS instead of tweening.
 * For an animated colour change, either cross-fade two stacked layers by
 * opacity, or animate opacity on a tinted overlay. See motion-system.md.
 *
 * ─── THREE TOKENS THIS TEMPLATE DOES NOT YET HAVE ─────────────────────────
 *
 * The template palette has one accent hue with text-grade contrast (signal),
 * so three derived steps are missing. Add them to the token block in
 * globals.css before first use — do not define them here, because other
 * components will want them too:
 *
 *   --mint-deep   a dark mint that passes contrast on paper   (~#2f6b52)
 *   --signal-soft a pale signal wash for tint fills           (~#fbe4dc)
 *   --ink-soft    a step lighter than --ink-faint, for
 *                 inactive state and connector lines          (~#b9beba)
 *
 * Until they exist, the slots marked below resolve to nothing. Derive the
 * real values from the client's palette, not from the suggestions above.
 */

export type AccentRole = "positive" | "system" | "human" | "neutral";

export type Accent = { fg: string; tint: string; solid: string };

export const BRAND: {
  accents: Record<AccentRole, Accent>;
  ink: string;
  body: string;
  muted: string;
  faint: string;
  line: string;
  inset: string;
  surface: string;
  plate: { maxWidth: string; radius: string; shadow: string };
} = {
  accents: {
    // mint family — completion and supporting emphasis
    positive: {
      fg: "var(--mint-deep)", // TODO_CLIENT_TOKEN: add --mint-deep to globals.css
      tint: "var(--mint)",
      solid: "var(--mint-strong)",
    },
    // ink family — routing, coverage, infrastructure
    system: {
      fg: "var(--ink-muted)",
      tint: "var(--muted)",
      solid: "var(--ink-faint)",
    },
    // signal family — the primary accent, people and delivery
    human: {
      fg: "var(--signal-strong)",
      tint: "var(--signal-soft)", // TODO_CLIENT_TOKEN: add --signal-soft to globals.css
      solid: "var(--signal)",
    },
    neutral: {
      fg: "var(--ink-faint)",
      tint: "var(--muted)",
      solid: "var(--ink-soft)", // TODO_CLIENT_TOKEN: add --ink-soft to globals.css
    },
  },

  ink: "var(--ink)", // primary text
  body: "var(--ink-muted)", // running copy inside a plate
  muted: "var(--ink-faint)", // secondary text
  faint: "var(--ink-soft)", // inactive state, connectors — TODO_CLIENT_TOKEN
  line: "var(--line)", // borders, dividers
  inset: "var(--muted)", // inset panels inside the plate
  surface: "var(--paper)", // the plate itself

  plate: {
    maxWidth: "420px",
    radius: "var(--radius-card)",
    shadow: "var(--shadow-card)",
  },
};
