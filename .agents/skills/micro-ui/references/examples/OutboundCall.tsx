"use client";

import { motion } from "framer-motion";
import {
  Counter,
  Divider,
  INK,
  LiveBadge,
  MUTED,
  Plate,
  PlateHead,
  Rise,
  TONES,
  TickDot,
  VisualFrame,
  Waveform,
  riseChild,
  useLoop,
} from "./_kit";

const STEPS = [
  { label: "Identity verified", meta: "NRIC" },
  { label: "Objection handled — “too expensive”", meta: "0:48" },
  { label: "1 Gbps upgrade accepted", meta: "+RM 30/mo" },
];

/** Live call console — the talk track completing in real time. */
export default function OutboundCall() {
  const { ref, phase, cycle, running } = useLoop(6, 1300);

  return (
    <VisualFrame innerRef={ref}>
      <Plate>
        <PlateHead
          title="Outbound call"
          badge={
            <LiveBadge tone="positive">
              <Counter
                to={134}
                run={running}
                duration={7}
                format={(v) =>
                  `${Math.floor(v / 60)}:${String(Math.floor(v % 60)).padStart(2, "0")}`
                }
              />
            </LiveBadge>
          }
        />

        <Waveform tone="positive" active={running} />
        <Divider />

        <Rise cycle={cycle}>
          {STEPS.map((s, i) => (
            <motion.div
              key={s.label}
              variants={riseChild}
              className="flex items-center gap-[11px] py-[7px]"
            >
              <TickDot on={phase > i} />
              <motion.span
                className="flex-1 font-medium"
                animate={{ color: phase > i ? INK : MUTED }}
                transition={{ duration: 0.35 }}
              >
                {s.label}
              </motion.span>
              <span
                className="text-[11.5px] font-semibold"
                style={{ color: MUTED }}
              >
                {s.meta}
              </span>
            </motion.div>
          ))}
        </Rise>

        <Divider />

        <motion.div
          className="flex items-center justify-between rounded-xl px-[15px] py-[13px]"
          style={{ background: TONES.positive.tint }}
          animate={{ opacity: phase >= 4 ? 1 : 0, y: phase >= 4 ? 0 : 8 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-[12.5px]" style={{ color: MUTED }}>
            Closed on this call
          </span>
          <span
            className="text-[21px] font-bold"
            style={{ color: TONES.positive.fg }}
          >
            RM <Counter to={360} run={running && phase >= 4} duration={1.2} />
          </span>
        </motion.div>
      </Plate>
    </VisualFrame>
  );
}
