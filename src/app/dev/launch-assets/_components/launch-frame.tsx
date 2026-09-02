import Image from "next/image";

import { ProjectVisual } from "@/components/visuals/project-visual";
import { siteConfig } from "@/config/site";
import { defaultOrganizationLogoPath } from "@/lib/seo";

import type { LaunchAsset } from "../_lib/launch-assets";

const toneClasses = {
  mint: {
    accent: "text-ink",
    ornament: "bg-mint/55",
    wash: "bg-mint/30",
  },
  signal: {
    accent: "text-signal-strong",
    ornament: "bg-signal/10",
    wash: "bg-signal/5",
  },
} as const;

function brandDestination(): string {
  try {
    const hostname = new URL(siteConfig.url).hostname;
    return hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "[::1]"
      ? siteConfig.name
      : hostname;
  } catch {
    return siteConfig.name;
  }
}

export function LaunchFrame({ asset }: { asset: LaunchAsset }) {
  const tone = toneClasses[asset.tone];

  return (
    <article
      className="relative shrink-0 overflow-hidden bg-canvas text-ink"
      data-export-height={asset.height}
      data-export-width={asset.width}
      data-launch-asset={asset.id}
      id={`launch-asset-${asset.id}`}
      style={{ height: asset.height, width: asset.width }}
    >
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute -top-40 -right-28 size-[500px] rounded-full ${tone.ornament}`}
        />
        <div
          className={`absolute -bottom-48 left-[34%] size-[420px] rounded-full ${tone.ornament}`}
        />
      </div>

      <div className="relative z-10 flex h-full flex-col px-[72px] py-[54px]">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              alt=""
              className="size-9"
              height={36}
              src={defaultOrganizationLogoPath}
              width={36}
            />
            <span className="text-xl font-semibold tracking-[-0.025em]">
              {siteConfig.name}
            </span>
          </div>
          <span className="text-[11px] font-bold tracking-[0.15em] text-ink-faint uppercase">
            Agentic website template
          </span>
        </header>

        <div className="grid flex-1 grid-cols-[minmax(0,1fr)_500px] items-center gap-16">
          <div className="max-w-[600px]">
            <p
              className={`mb-6 text-[12px] font-bold tracking-[0.18em] uppercase ${tone.accent}`}
            >
              {asset.eyebrow}
            </p>
            <h2 className="font-display text-[68px] leading-[0.94] tracking-[-0.048em]">
              {asset.title}
              <br />
              <span className={tone.accent}>{asset.accent}</span>
            </h2>
            <p className="mt-7 max-w-[560px] text-[18px] leading-[1.6] text-ink-muted">
              {asset.description}
            </p>
          </div>

          <div
            aria-label={asset.visualLabel}
            className={`relative flex min-h-[500px] items-center justify-center rounded-[34px] border border-white/80 p-9 shadow-[0_28px_80px_rgba(29,41,38,0.10)] ${tone.wash}`}
            role="img"
          >
            <div
              aria-hidden="true"
              className="absolute inset-5 rounded-[26px] border border-white/80"
            />
            <div aria-hidden="true" className="relative z-10 w-full">
              <ProjectVisual id={asset.visualId} sizes="500px" />
            </div>
          </div>
        </div>

        <footer className="flex items-center justify-between border-t border-ink/10 pt-6">
          <div className="flex items-center gap-2.5">
            {asset.proof.map((item) => (
              <span
                className="rounded-full border border-ink/10 bg-paper/90 px-3.5 py-2 text-[11px] font-semibold text-ink-muted"
                key={item}
              >
                {item}
              </span>
            ))}
          </div>
          <span className="text-[12px] font-semibold text-ink-muted">
            {brandDestination()}
          </span>
        </footer>
      </div>
    </article>
  );
}
