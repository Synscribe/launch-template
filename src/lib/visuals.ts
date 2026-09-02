export const VISUAL_IDS = [
  "placeholder-website-migration-overview",
  "saas-rebuild-overview",
  "startup-launch-overview",
  "seo-landing-page-overview",
  "url-inventory",
  "url-decisions",
  "page-meaning",
  "release-gates",
  "post-launch-monitoring",
  "offer-and-audience",
  "conversion-path",
  "proof-and-trust",
  "measurement-plan",
  "buyer-journeys",
  "information-architecture",
  "reusable-pages",
  "search-intent",
  "internal-links",
] as const;

export type VisualId = (typeof VISUAL_IDS)[number];
