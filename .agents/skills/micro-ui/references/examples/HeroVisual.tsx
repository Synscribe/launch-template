"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BODY,
  Counter,
  EASE,
  FAINT,
  INSET,
  LINE,
  MUTED,
  Plate,
  SPRING,
  TONES,
  useLoop,
  VisualFrame,
  Waveform,
} from "./_kit";

/**
 * The page hero — deliberately NOT one of the twenty capability visuals.
 *
 * Those each argue one feature. This argues the product: a real conversation
 * in flight, the customer and the agent taking turns, the language switching
 * mid-call without a hand-off, and the whole thing ending in revenue. It is
 * the only visual built on a two-sided dialogue and a time axis, so it does
 * not read as a feature card promoted to the top of the page.
 *
 * Not in FEATURE_VISUALS: it is not selected by a capability id.
 */

type Turn = {
  side: "customer" | "agent";
  text: string;
  lang: string;
};

const TURNS: Turn[] = [
  {
    side: "customer",
    text: "“Berapa kalau nak upgrade ke 1 Gbps?”",
    lang: "Bahasa Melayu",
  },
  {
    side: "agent",
    text: "“Can lah — RM 30 extra sebulan, same bill cycle.”",
    lang: "Manglish",
  },
  {
    side: "customer",
    text: "“Hmm, that's a bit steep for me right now.”",
    lang: "English",
  },
  {
    side: "agent",
    text: "“I can hold today's price until your next cycle.”",
    lang: "English",
  },
];

const MILESTONES = ["Identity verified", "Objection handled"];

export default function HeroVisual() {
  const { ref, phase, running } = useLoop(8, 1150);

  // Turns land one per phase from phase 1; milestones follow behind them.
  const shown = TURNS.slice(0, Math.max(0, Math.min(phase, TURNS.length)));
  const lang =
    TURNS[Math.max(0, Math.min(phase, TURNS.length) - 1)]?.lang ??
    TURNS[0].lang;
  const closed = phase >= 7;

  return (
    <VisualFrame innerRef={ref}>
      <Plate maxWidth="520px">
        {/* header: where the call is, and what language it is in right now */}
        <div className="mb-4 flex items-center gap-2.5">
          <span
            className="inline-flex items-center gap-[7px] rounded-full px-2.5 py-1 text-[10.5px] font-semibold tracking-[0.08em]"
            style={{
              color: TONES.positive.fg,
              background: TONES.positive.tint,
            }}
          >
            <motion.i
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "currentColor" }}
              animate={{ opacity: [1, 0.35, 1], scale: [1, 0.8, 1] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            LIVE
          </span>
          <span className="text-[12px] font-medium" style={{ color: MUTED }}>
            Kuala Lumpur · 11:04
          </span>
          {/* the language pill swaps as the caller switches */}
          <span className="relative ml-auto flex h-[24px] w-[112px] items-center justify-end overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={lang}
                className="absolute right-0 whitespace-nowrap rounded-full px-2.5 py-1 text-[10.5px] font-semibold"
                style={{
                  color: TONES.system.fg,
                  background: TONES.system.tint,
                }}
                initial={{ opacity: 0, y: 12, filter: "blur(5px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -12, filter: "blur(5px)" }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                {lang}
              </motion.span>
            </AnimatePresence>
          </span>
        </div>

        <Waveform tone="positive" bars={34} active={running} litRatio={0.82} />

        {/* the conversation: customer left, agent right, alternating */}
        <div className="mt-4 flex flex-col gap-2" style={{ minHeight: 168 }}>
          {TURNS.map((t, i) => {
            const visible = i < shown.length;
            const isAgent = t.side === "agent";
            return (
              <motion.div
                key={t.text}
                className={`flex ${isAgent ? "justify-end" : "justify-start"}`}
                initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                animate={
                  visible
                    ? { opacity: 1, y: 0, filter: "blur(0px)" }
                    : { opacity: 0, y: 10, filter: "blur(6px)" }
                }
                transition={{ duration: 0.55, ease: EASE }}
              >
                <span
                  className="max-w-[78%] rounded-2xl px-3.5 py-2.5 text-[12.5px] font-medium leading-snug"
                  style={
                    isAgent
                      ? {
                          background: TONES.system.tint,
                          color: TONES.system.fg,
                          borderTopRightRadius: 6,
                        }
                      : {
                          background: INSET,
                          color: BODY,
                          border: `1px solid ${LINE}`,
                          borderTopLeftRadius: 6,
                        }
                  }
                >
                  {t.text}
                </span>
              </motion.div>
            );
          })}
        </div>

        <div className="my-3.5 h-px" style={{ background: LINE }} />

        {/* milestones tick along, then the outcome lands on its own line */}
        <div className="flex flex-wrap items-center gap-2">
          {MILESTONES.map((m, i) => {
            const on = phase >= 4 + i;
            return (
              <motion.span
                key={m}
                className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-semibold"
                animate={{
                  color: on ? TONES.positive.fg : FAINT,
                  backgroundColor: on ? TONES.positive.tint : "rgba(0,0,0,0)",
                }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <motion.svg
                  width="10"
                  height="10"
                  viewBox="0 0 14 14"
                  fill="none"
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={
                    on ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4 }
                  }
                  transition={SPRING}
                >
                  <path
                    d="M3 7.3l2.8 2.8L11 4.2"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
                {m}
              </motion.span>
            );
          })}
        </div>

        <motion.div
          className="mt-3 flex items-center justify-between rounded-xl px-4 py-3"
          style={{ background: TONES.positive.tint }}
          animate={{ opacity: closed ? 1 : 0, y: closed ? 0 : 8 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <span className="text-[12.5px] font-medium" style={{ color: BODY }}>
            Upgrade closed on this call
          </span>
          <span
            className="text-[19px] font-bold tabular-nums"
            style={{ color: TONES.positive.fg }}
          >
            +RM <Counter to={360} run={running && closed} duration={1} />
          </span>
        </motion.div>
      </Plate>
    </VisualFrame>
  );
}
