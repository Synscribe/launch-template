"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Divider,
  EASE,
  LiveBadge,
  Pill,
  Plate,
  PlateHead,
  VisualFrame,
  useLoop,
} from "./_kit";

const LINES = [
  {
    lang: "Bahasa Melayu",
    say: "“Boleh, saya boleh tukar ke pelan 1 Gbps hari ini juga.”",
  },
  {
    lang: "Manglish",
    say: "“Can lah — I upgrade you to 1 Gbps, same bill cycle.”",
  },
  {
    lang: "English",
    say: "“Of course. I’ll move you to 1 Gbps from next month.”",
  },
];

const PILLS = ["Bahasa Melayu", "Manglish", "English", "Mandarin", "+12 more"];

/** One conversation, three languages — the sentence morphs where a cut would be. */
export default function Multilingual() {
  const { ref, phase } = useLoop(LINES.length, 2600);
  const current = LINES[phase];

  return (
    <VisualFrame innerRef={ref}>
      <Plate>
        <PlateHead
          title="Same agent, same call"
          badge={<LiveBadge tone="system">LIVE</LiveBadge>}
        />

        <div className="relative min-h-[74px]">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.p
              key={current.lang}
              className="absolute inset-0 m-0 text-[15px] font-medium leading-[1.5]"
              initial={{ opacity: 0, y: 14, filter: "blur(7px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -14, filter: "blur(7px)" }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              {current.say}
            </motion.p>
          </AnimatePresence>
        </div>

        <Divider />

        <div className="flex flex-wrap gap-1.5">
          {PILLS.map((p) => (
            <Pill
              key={p}
              tone="system"
              active={p === current.lang}
              className="border px-[11px] py-1 text-[11px]"
            >
              {p}
            </Pill>
          ))}
        </div>
      </Plate>
    </VisualFrame>
  );
}
