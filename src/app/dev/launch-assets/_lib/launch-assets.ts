import type { VisualId } from "@/lib/visuals";

export type LaunchAssetTone = "mint" | "signal";

export type LaunchAsset = {
  id: string;
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  proof: readonly [string, string, string];
  tone: LaunchAssetTone;
  visualId: VisualId;
  visualLabel: string;
  width: number;
  height: number;
};

const MARKETPLACE_SIZE = { width: 1270, height: 760 } as const;

// TEMPLATE_PLACEHOLDER_LAUNCH_ASSETS: replace or remove these examples for a client.
export const LAUNCH_ASSETS = [
  {
    id: "search-foundation",
    eyebrow: "SEO and AI-search foundation",
    title: "Get found by",
    accent: "Google and ChatGPT.",
    description:
      "Ship crawlable pages, canonical metadata, structured data, llms.txt, and launch checks in one owned Next.js codebase.",
    proof: [
      "Metadata + canonicals",
      "HTML-first content",
      "llms.txt validation",
    ],
    tone: "signal",
    visualId: "search-intent",
    visualLabel: "Search intent organized into clear landing-page targets",
    ...MARKETPLACE_SIZE,
  },
  {
    id: "migration-system",
    eyebrow: "1:1 website migrations",
    title: "Migrate without",
    accent: "starting over.",
    description:
      "Inventory every URL, preserve useful design and content, map redirects, and verify the new site before cutover.",
    proof: ["URL map first", "Screenshot comparison", "Redirect verification"],
    tone: "mint",
    visualId: "url-decisions",
    visualLabel:
      "Old URLs receiving reviewed preserve, redirect, or remove decisions",
    ...MARKETPLACE_SIZE,
  },
  {
    id: "agent-ready",
    eyebrow: "A repository agents can operate",
    title: "Let agents ship",
    accent: "with guardrails.",
    description:
      "Explicit App Router pages, canonical project instructions, typed boundaries, and production launch checks keep every change inspectable.",
    proof: ["Route-local composition", "Typed visual IDs", "Production audit"],
    tone: "signal",
    visualId: "release-gates",
    visualLabel:
      "A release gate showing the production checks required before launch",
    ...MARKETPLACE_SIZE,
  },
] as const satisfies readonly LaunchAsset[];

export function getLaunchAsset(id: string): LaunchAsset | undefined {
  return LAUNCH_ASSETS.find((asset) => asset.id === id);
}
