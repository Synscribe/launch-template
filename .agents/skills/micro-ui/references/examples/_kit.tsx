"use client";

/**
 * Shared motion kit for the /uses capability visuals.
 *
 * House rules (kept identical across all twenty so the page reads as one system):
 *   · one loop per visual, ~8s, restarted by bumping `cycle`
 *   · entry gesture is always blur-rise on expo-out, staggered ~140ms
 *   · spring overshoot is reserved for state changes (a badge landing, a tick)
 *   · nothing animates off-screen, and nothing animates under reduced-motion
 *
 * Visuals are light-on-white by design: they sit on white/cream sections.
 */

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  type Transition,
  type Variants,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { BRAND, type AccentRole } from "./brand";

export { BRAND };

/* ── tokens ──────────────────────────────────────────────────────────── */

export const EASE = [0.22, 1, 0.36, 1] as const;
export const SPRING: Transition = {
  type: "spring",
  stiffness: 340,
  damping: 24,
  mass: 0.7,
};

/** Accents by role. Swap the values in brand.ts, not here. */
export const TONES = BRAND.accents;

export type ToneName = AccentRole;

export const INK = BRAND.ink;
export const BODY = BRAND.body;
export const MUTED = BRAND.muted;
export const FAINT = BRAND.faint;
export const LINE = BRAND.line;
export const INSET = BRAND.inset;

/* ── the loop ────────────────────────────────────────────────────────── */

/**
 * Drives one visual. Returns the current phase and a `cycle` counter that
 * increments on every wrap — use it as a React `key` to replay entry
 * animations without any imperative resetting.
 *
 * Under reduced motion the loop never starts and the visual holds its last
 * phase, which is always the "resolved" state.
 */
export function useLoop(phases: number, phaseMs = 1100) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "200px" });
  const reduce = useReducedMotion();

  const [phase, setPhase] = useState(reduce ? phases - 1 : 0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (reduce || !inView) return;
    const id = window.setInterval(() => {
      setPhase((p) => {
        if (p + 1 >= phases) {
          setCycle((c) => c + 1);
          return 0;
        }
        return p + 1;
      });
    }, phaseMs);
    return () => window.clearInterval(id);
  }, [reduce, inView, phases, phaseMs]);

  return { ref, phase, cycle, running: !reduce && inView, reduce: !!reduce };
}

/* ── entry gesture ───────────────────────────────────────────────────── */

export const riseParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } },
};

export const riseChild: Variants = {
  hidden: { opacity: 0, y: 10, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: EASE },
  },
};

/** Wraps children in the standard staggered blur-rise. */
export function Rise({
  cycle,
  className,
  children,
}: {
  cycle: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      key={cycle}
      variants={riseParent}
      initial="hidden"
      animate="show"
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── plate chrome ────────────────────────────────────────────────────── */

export function Plate({
  innerRef,
  className,
  maxWidth,
  children,
}: {
  innerRef?: React.Ref<HTMLDivElement>;
  className?: string;
  /** Override the standard plate width — the hero is wider than a feature card. */
  maxWidth?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      ref={innerRef}
      className={cn("w-full border p-5 text-[13px]", className)}
      style={{
        maxWidth: maxWidth ?? BRAND.plate.maxWidth,
        borderRadius: BRAND.plate.radius,
        boxShadow: BRAND.plate.shadow,
        background: BRAND.surface,
        borderColor: LINE,
        color: INK,
      }}
    >
      {children}
    </div>
  );
}

export function PlateHead({
  title,
  badge,
  lead,
}: {
  title: string;
  badge?: React.ReactNode;
  lead?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center gap-2.5">
      {lead}
      <span className="text-[15px] font-semibold tracking-[-0.01em]">
        {title}
      </span>
      <span className="ml-auto">{badge}</span>
    </div>
  );
}

export function LiveBadge({
  tone = "positive",
  children,
  pulse = true,
}: {
  tone?: ToneName;
  children: React.ReactNode;
  pulse?: boolean;
}) {
  const t = TONES[tone];
  return (
    <span
      className="inline-flex items-center gap-[7px] rounded-full px-2.5 py-1 text-[10.5px] font-semibold tracking-[0.08em]"
      style={{ color: t.fg, background: t.tint }}
    >
      {pulse && (
        <motion.i
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: "currentColor" }}
          animate={{ opacity: [1, 0.35, 1], scale: [1, 0.8, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      {children}
    </span>
  );
}

export function Pill({
  tone = "neutral",
  active = true,
  className,
  children,
}: {
  tone?: ToneName;
  active?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const t = TONES[tone];
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-[3px] text-[10.5px] font-semibold transition-colors duration-500",
        className,
      )}
      style={{
        color: active ? t.fg : FAINT,
        background: active ? t.tint : "transparent",
      }}
    >
      {children}
    </span>
  );
}

export function Divider({ className }: { className?: string }) {
  return (
    <div
      className={cn("my-3.5 h-px", className)}
      style={{ background: LINE }}
    />
  );
}

/* ── numbers ─────────────────────────────────────────────────────────── */

/**
 * Counts to `to` whenever `run` flips true, writing straight to the DOM so a
 * 60fps count never re-renders the tree around it.
 */
export function Counter({
  to,
  run,
  duration = 1.6,
  format = (v: number) => Math.round(v).toLocaleString(),
  className,
  style,
}: {
  to: number;
  run: boolean;
  duration?: number;
  format?: (v: number) => string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const node = useRef<HTMLSpanElement>(null);
  const mv = useMotionValue(0);

  useMotionValueEvent(mv, "change", (v) => {
    if (node.current) node.current.textContent = format(v);
  });

  useEffect(() => {
    if (!run) {
      mv.set(to);
      return;
    }
    mv.set(0);
    const controls = animate(mv, to, { duration, ease: EASE });
    return () => controls.stop();
  }, [run, to, duration, mv]);

  return (
    <span ref={node} className={cn("tabular-nums", className)} style={style}>
      {format(run ? 0 : to)}
    </span>
  );
}

/* ── small parts reused by more than one visual ──────────────────────── */

export function Waveform({
  tone = "positive",
  bars = 26,
  active = true,
  litRatio = 0.78,
}: {
  tone?: ToneName;
  bars?: number;
  active?: boolean;
  litRatio?: number;
}) {
  const t = TONES[tone];
  return (
    <div className="flex h-[26px] items-center gap-[3px]">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.b
          key={i}
          className="w-[3px] rounded-full"
          style={{
            height: "100%",
            originY: 0.5,
            background: i / bars < litRatio ? t.solid : FAINT,
          }}
          animate={active ? { scaleY: [0.18, 1, 0.18] } : { scaleY: 0.18 }}
          transition={{
            duration: 0.9 + ((i * 53) % 500) / 1000,
            repeat: active ? Infinity : 0,
            ease: "easeInOut",
            delay: (i * 0.137) % 1.1,
          }}
        />
      ))}
    </div>
  );
}

export function CheckIcon({
  color = "#fff",
  size = 11,
}: {
  color?: string;
  size?: number;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M3 7.3l2.8 2.8L11 4.2"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Circle that fills and stamps a tick when `on` flips. */
export function TickDot({
  on,
  tone = "positive",
}: {
  on: boolean;
  tone?: ToneName;
}) {
  const t = TONES[tone];
  return (
    <motion.span
      className="flex h-[21px] w-[21px] flex-none items-center justify-center rounded-full border-[1.6px]"
      animate={{
        backgroundColor: on ? t.fg : "rgba(0,0,0,0)",
        borderColor: on ? t.fg : FAINT,
      }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      <motion.span
        className="flex"
        animate={{ opacity: on ? 1 : 0, scale: on ? 1 : 0.5 }}
        transition={SPRING}
      >
        <CheckIcon />
      </motion.span>
    </motion.span>
  );
}

/** A scan bar that sweeps across its parent once per cycle. */
export function ScanSweep({
  cycle,
  tone = "human",
}: {
  cycle: number;
  tone?: ToneName;
}) {
  const t = TONES[tone];
  return (
    <motion.div
      key={cycle}
      aria-hidden
      className="pointer-events-none absolute inset-y-0 w-[120px]"
      style={{
        background: `linear-gradient(90deg, transparent, ${t.tint}, transparent)`,
      }}
      initial={{ x: -130, opacity: 0 }}
      animate={{ x: 460, opacity: [0, 1, 1, 0] }}
      transition={{ duration: 2.4, ease: EASE, times: [0, 0.1, 0.85, 1] }}
    />
  );
}

/** Draws an SVG path once per cycle. */
export function DrawPath({
  d,
  cycle,
  delay = 0,
  stroke = FAINT,
  width = 1.4,
  dash = 400,
}: {
  d: string;
  cycle: number;
  delay?: number;
  stroke?: string;
  width?: number;
  dash?: number;
}) {
  return (
    <motion.path
      key={cycle}
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={width}
      strokeLinecap="round"
      strokeDasharray={dash}
      initial={{ strokeDashoffset: dash }}
      animate={{ strokeDashoffset: 0 }}
      transition={{ duration: 1.1, ease: EASE, delay }}
    />
  );
}

/** Wrapper every visual uses: centres the plate and owns the in-view ref. */
export function VisualFrame({
  innerRef,
  children,
}: {
  innerRef: React.Ref<HTMLDivElement>;
  children: React.ReactNode;
}) {
  return (
    <div ref={innerRef} className="flex w-full items-center justify-center">
      {children}
    </div>
  );
}
