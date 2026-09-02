import { LaunchFrame } from "./launch-frame";
import { LAUNCH_ASSETS } from "../_lib/launch-assets";

export function LaunchAssetGallery({ onlyId }: { onlyId?: string }) {
  const assets = onlyId
    ? LAUNCH_ASSETS.filter((asset) => asset.id === onlyId)
    : LAUNCH_ASSETS;

  return (
    <div className="space-y-16">
      {assets.map((asset) => (
        <LaunchFrame asset={asset} key={asset.id} />
      ))}
    </div>
  );
}
