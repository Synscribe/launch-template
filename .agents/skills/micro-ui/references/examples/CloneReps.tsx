"use client";

import { motion } from "framer-motion";
import {
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

const SRC = { x: 60, y: 92 };
const AGENTS = [
  { x: 232, y: 34, label: "Agent 02" },
  { x: 268, y: 92, label: "Agent 07" },
  { x: 232, y: 150, label: "Agent 11" },
];

/** One rep's playbook travelling out to every agent on the floor. */
export default function CloneReps() {
  const { ref, phase, cycle, running } = useLoop(6, 1200);

  return (
    <VisualFrame innerRef={ref}>
      <Plate>
        <PlateHead
          title="Best rep’s playbook"
          badge={<LiveBadge tone="human">COPIED</LiveBadge>}
        />

        <svg viewBox="0 0 320 190" className="w-full" style={{ height: 190 }}>
          {AGENTS.map((a, i) => (
            <line
              key={`l-${a.label}`}
              x1={SRC.x}
              y1={SRC.y}
              x2={a.x}
              y2={a.y}
              stroke={FAINT}
              strokeWidth="1.2"
              strokeDasharray="3 5"
            />
          ))}

          {/* the playbook itself, in transit */}
          {running &&
            AGENTS.map((a, i) => (
              <motion.circle
                key={`p-${cycle}-${a.label}`}
                r="4.5"
                fill={TONES.human.solid}
                initial={{ cx: SRC.x, cy: SRC.y, opacity: 0 }}
                animate={{ cx: a.x, cy: a.y, opacity: [0, 1, 1, 0] }}
                transition={{
                  duration: 1.4,
                  ease: EASE,
                  delay: 0.25 + i * 0.28,
                  times: [0, 0.15, 0.8, 1],
                }}
              />
            ))}

          <motion.circle
            cx={SRC.x}
            cy={SRC.y}
            r="26"
            fill={TONES.human.tint}
            animate={running ? { scale: [1, 1.06, 1] } : {}}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: `${SRC.x}px ${SRC.y}px` }}
          />
          <text
            x={SRC.x}
            y={SRC.y + 4}
            textAnchor="middle"
            fontSize="12"
            fontWeight="700"
            fill={TONES.human.fg}
          >
            SR
          </text>

          {AGENTS.map((a, i) => (
            <g key={a.label}>
              <motion.circle
                cx={a.x}
                cy={a.y}
                r="19"
                animate={{
                  fill: phase > i ? TONES.positive.tint : TONES.neutral.tint,
                }}
                transition={{ duration: 0.4 }}
              />
              <motion.g
                initial={{ opacity: 0, scale: 0.5 }}
                animate={
                  phase > i
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.5 }
                }
                transition={{ type: "spring", stiffness: 340, damping: 22 }}
                style={{ transformOrigin: `${a.x}px ${a.y}px` }}
              >
                <path
                  d={`M${a.x - 5} ${a.y} l3.5 3.5 L${a.x + 6} ${a.y - 5}`}
                  stroke={TONES.positive.fg}
                  strokeWidth="2.4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.g>
              <text
                x={a.x}
                y={a.y + 34}
                textAnchor="middle"
                fontSize="10"
                fontWeight="600"
                fill={MUTED}
              >
                {a.label}
              </text>
            </g>
          ))}
        </svg>

        <p className="m-0 text-[11.5px]" style={{ color: MUTED }}>
          The playbook stays after the rep who wrote it leaves.
        </p>
      </Plate>
    </VisualFrame>
  );
}
