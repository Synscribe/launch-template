import { ArrowRightIcon, ImagesIcon, PanelsTopLeftIcon } from "lucide-react";
import Link from "next/link";

import { VISUAL_IDS } from "@/lib/visuals";

import { LAUNCH_ASSETS } from "./launch-assets/_lib/launch-assets";

const tools = [
  {
    href: "/dev/visuals",
    icon: PanelsTopLeftIcon,
    eyebrow: `${VISUAL_IDS.length} registered visuals`,
    title: "Feature and illustration inventory",
    description:
      "Review every validated visual, its source, motion pattern, placeholder state, and current content placements.",
  },
  {
    href: "/dev/launch-assets",
    icon: ImagesIcon,
    eyebrow: `${LAUNCH_ASSETS.length} export-ready frames`,
    title: "Launch asset gallery",
    description:
      "Compose campaign-ready frames from the same visuals used by the website, then export exact PNGs with reduced motion.",
  },
] as const;

export default function DevPage() {
  return (
    <main className="bg-canvas px-5 py-16 sm:px-8 lg:py-24" id="main-content">
      <div className="mx-auto max-w-6xl">
        <header className="max-w-3xl">
          <p className="text-xs font-bold tracking-[0.18em] text-signal-strong uppercase">
            Environment-gated workspace
          </p>
          <h1 className="mt-5 font-display text-5xl leading-[0.96] tracking-[-0.045em] sm:text-6xl">
            Review the visual system before it leaves the repository.
          </h1>
          <p className="mt-6 text-lg leading-8 text-ink-muted">
            These internal routes are available only when the server-only visual
            review variable is explicitly enabled. They are never part of public
            navigation or the sitemap.
          </p>
        </header>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                className="group rounded-[1.75rem] border border-ink/10 bg-paper p-7 shadow-[0_20px_60px_rgba(29,41,38,0.06)] transition-transform duration-200 hover:-translate-y-1"
                href={tool.href}
                key={tool.href}
              >
                <div className="flex items-start justify-between gap-6">
                  <span className="grid size-12 place-items-center rounded-2xl bg-ink text-mint">
                    <Icon className="size-5" />
                  </span>
                  <ArrowRightIcon className="size-5 text-ink-faint transition-transform duration-200 group-hover:translate-x-1" />
                </div>
                <p className="mt-10 text-xs font-bold tracking-[0.14em] text-signal-strong uppercase">
                  {tool.eyebrow}
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                  {tool.title}
                </h2>
                <p className="mt-4 leading-7 text-ink-muted">
                  {tool.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
