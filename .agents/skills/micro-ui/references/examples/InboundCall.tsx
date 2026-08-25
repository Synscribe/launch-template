"use client";

import { motion } from "framer-motion";
import {
  BRAND,
  Counter,
  Divider,
  EASE,
  FAINT,
  LiveBadge,
  MUTED,
  Plate,
  PlateHead,
  TONES,
  VisualFrame,
  useLoop,
} from "./_kit";

const TIERS = [
  {
    w: 100,
    v: 1000,
    label: "inbound calls",
    fill: TONES.system.tint,
    ink: TONES.system.fg,
  },
  {
    w: 82,
    v: 1000,
    label: "answered, 0s wait",
    fill: TONES.system.tint,
    ink: TONES.system.fg,
  },
  {
    w: 60,
    v: 820,
    label: "resolved by the agent",
    fill: `color-mix(in srgb, ${TONES.system.solid} 26%, ${BRAND.surface})`,
    ink: TONES.system.fg,
  },
  {
    w: 30,
    v: 180,
    label: "escalated to a human",
    fill: `color-mix(in srgb, ${TONES.human.solid} 26%, ${BRAND.surface})`,
    ink: TONES.human.fg,
  },
];

const TRACK = 196;

/** Funnel — an hour of inbound volume narrowing to the calls a person needs. */
export default function InboundCall() {
  const { ref, phase, cycle, running } = useLoop(6, 1300);

  return (
    <VisualFrame innerRef={ref}>
      <Plate>
        <PlateHead
          title="Inbound, one hour"
          badge={<LiveBadge tone="system">TRIAGE</LiveBadge>}
        />

        <div key={cycle}>
          {TIERS.map((t, i) => (
            <div
              key={t.label}
              className="mb-2.5 grid items-center gap-3"
              style={{ gridTemplateColumns: `${TRACK}px 1fr` }}
            >
              <div
                className="relative h-[30px] rounded-[9px]"
                style={{ width: (TRACK * t.w) / 100 }}
              >
                <motion.div
                  className="absolute inset-0 rounded-[9px] origin-left"
                  style={{ background: t.fill }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    duration: 0.9,
                    ease: EASE,
                    delay: 0.12 + i * 0.16,
                  }}
                />
              </div>
              <motion.div
                className="whitespace-nowrap text-[12px]"
                style={{ color: MUTED }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.24 + i * 0.16 }}
              >
                <b className="mr-1.5 font-bold" style={{ color: t.ink }}>
                  <Counter to={t.v} run={running} duration={1.4} />
                </b>
                {t.label}
              </motion.div>
            </div>
          ))}
        </div>

        <Divider />
        <motion.p
          className="m-0 text-[11.5px]"
          style={{ color: FAINT }}
          animate={{ opacity: phase >= 4 ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          Only what a person actually needs to hear reaches a person.
        </motion.p>
      </Plate>
    </VisualFrame>
  );
}
