import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { siteConfig } from "@/config/site";

import { LaunchAssetGallery } from "./_components/launch-asset-gallery";
import { getLaunchAsset, LAUNCH_ASSETS } from "./_lib/launch-assets";

type LaunchAssetsPageProps = {
  searchParams: Promise<{ asset?: string | string[] }>;
};

export default async function LaunchAssetsPage({
  searchParams,
}: LaunchAssetsPageProps) {
  const { asset: rawAsset } = await searchParams;
  const asset = typeof rawAsset === "string" ? rawAsset : undefined;

  if (rawAsset !== undefined && (!asset || !getLaunchAsset(asset))) notFound();

  if (asset) {
    return (
      <main className="overflow-hidden bg-white" id="main-content">
        <LaunchAssetGallery onlyId={asset} />
      </main>
    );
  }

  return (
    <main
      className="overflow-x-auto bg-[#e9e8e3] px-10 py-14"
      id="main-content"
    >
      <div className="mx-auto mb-10 w-[1270px]">
        <Link
          className="inline-flex items-center gap-2 text-sm font-semibold text-ink-muted hover:text-ink"
          href="/dev"
        >
          <ArrowLeftIcon className="size-4" />
          Visual workshop
        </Link>
        <p className="mt-10 text-[11px] font-bold tracking-[0.16em] text-ink-faint uppercase">
          {LAUNCH_ASSETS.length} export-ready frames
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-tight">
          {siteConfig.name} launch assets
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-muted">
          Template examples at 1270 × 760, composed from the same visual source
          map as the site. Replace their copy and placeholder visuals before a
          client launch. Exports emulate reduced motion and capture each frame
          by its exact DOM bounds.
        </p>
      </div>
      <div className="mx-auto w-[1270px]">
        <LaunchAssetGallery />
      </div>
    </main>
  );
}
