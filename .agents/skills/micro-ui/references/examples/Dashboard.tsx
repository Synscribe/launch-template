"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Counter,
  EASE,
  INSET,
  LINE,
  LiveBadge,
  MUTED,
  Plate,
  PlateHead,
  TONES,
  VisualFrame,
  useLoop,
} from "./_kit";

const CATALOG = [
  { who: "Siti R. · 1 Gbps upgrade", tag: "Closed", tone: "positive" as const },
  { who: "Ahmad F. · Router swap", tag: "Callback", tone: "system" as const },
  {
    who: "Priya M. · Billing query",
    tag: "Resolved",
    tone: "neutral" as const,
  },
  { who: "Lim W. · Family bundle", tag: "Closed", tone: "positive" as const },
  {
    who: "Devi S. · Coverage check",
    tag: "Resolved",
    tone: "neutral" as const,
  },
];

const SPARK = "M0 28 L18 24 L36 26 L54 17 L72 20 L90 11 L108 13 L126 5";

/** The exec view: numbers climbing and the feed never stopping. */
export default function Dashboard() {
  const { ref, cycle, running } = useLoop(8, 1100);
  const n = useRef(0);
  const [feed, setFeed] = useState(() =>
    CATALOG.slice(0, 3).map((c, i) => ({ ...c, id: `seed-${i}` })),
  );

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      n.current += 1;
      const next = CATALOG[n.current % CATALOG.length];
      setFeed((prev) =>
        [{ ...next, id: `row-${n.current}` }, ...prev].slice(0, 3),
      );
    }, 2200);
    return () => window.clearInterval(id);
  }, [running]);

  return (
    <VisualFrame innerRef={ref}>
      <Plate>
        <PlateHead
          title="Outcomes today"
          badge={<LiveBadge tone="positive">LIVE</LiveBadge>}
        />

        <div className="flex items-end gap-3">
          <div className="flex-1">
            <span className="block text-[24px] font-extrabold leading-none tracking-[-0.02em]">
              RM{" "}
              <Counter
                to={291}
                run={running}
                duration={2}
                format={(v) => `${Math.round(v)}k`}
              />
            </span>
            <span
              className="mt-1.5 block text-[11px] font-medium"
              style={{ color: MUTED }}
            >
              Revenue attributed
            </span>
          </div>
          <svg
            width="126"
            height="32"
            viewBox="0 0 126 32"
            fill="none"
            className="flex-none"
          >
            <motion.path
              key={cycle}
              d={SPARK}
              stroke={TONES.positive.solid}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.6, ease: EASE }}
            />
            <motion.circle
              key={`dot-${cycle}`}
              cx="126"
              cy="5"
              r="3.5"
              fill={TONES.positive.solid}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 1.6,
                type: "spring",
                stiffness: 400,
                damping: 18,
              }}
            />
          </svg>
        </div>

        <div className="mt-3.5 flex gap-2.5">
          {[
            {
              to: 4812,
              label: "Calls today",
              fmt: (v: number) => Math.round(v).toLocaleString(),
            },
            {
              to: 18,
              label: "Upgrade rate",
              fmt: (v: number) => `${Math.round(v)}%`,
            },
          ].map((s) => (
            <div
              key={s.label}
              className="flex-1 rounded-xl px-3.5 py-2.5"
              style={{ background: INSET }}
            >
              <span className="block text-[16px] font-bold leading-tight">
                <Counter to={s.to} run={running} duration={2} format={s.fmt} />
              </span>
              <span
                className="mt-[2px] block text-[10.5px] font-medium"
                style={{ color: MUTED }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-3.5 overflow-hidden" style={{ height: 150 }}>
          <AnimatePresence initial={false} mode="popLayout">
            {feed.map((row) => (
              <motion.div
                key={row.id}
                initial={{ opacity: 0, y: -18, filter: "blur(5px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, transition: { duration: 0 } }}
                transition={{ duration: 0.42, ease: EASE }}
                className="mb-1.5 flex items-center gap-2.5 rounded-[10px] px-3 py-2.5"
                style={{ border: `1px solid ${LINE}` }}
              >
                <span
                  className="flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full"
                  style={{ background: INSET }}
                >
                  <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                    <path d="M3 2.4v7.2l6-3.6z" fill={MUTED} />
                  </svg>
                </span>
                <span className="flex-1 truncate text-[12px] font-semibold">
                  {row.who}
                </span>
                <span
                  className="rounded-full px-2.5 py-[3px] text-[10.5px] font-semibold"
                  style={{
                    color: TONES[row.tone].fg,
                    background: TONES[row.tone].tint,
                  }}
                >
                  {row.tag}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Plate>
    </VisualFrame>
  );
}
