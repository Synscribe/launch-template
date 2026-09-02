import type { ComponentType } from "react";
import Image, { type ImageProps } from "next/image";

import { VISUAL_IDS, type VisualId } from "../../lib/visuals";

import {
  BuyerJourneysVisual,
  ConversionPathVisual,
  InformationArchitectureVisual,
  InternalLinksVisual,
  MeasurementPlanVisual,
  MonitoringVisual,
  OfferAndAudienceVisual,
  PageMeaningVisual,
  ProofAndTrustVisual,
  ReleaseGatesVisual,
  ReusablePagesVisual,
  SaasHeroVisual,
  SearchIntentVisual,
  SeoLandingHeroVisual,
  StartupHeroVisual,
  UrlDecisionsVisual,
  UrlInventoryVisual,
} from "./placeholder-visual-components";

export type VisualStatus = "project" | "template-placeholder";

type VisualMetadata = {
  label: string;
  motionPattern: string | null;
  status: VisualStatus;
};

type ComponentVisualSource = VisualMetadata & {
  kind: "component";
  component: ComponentType;
};

type ImageVisualSource = VisualMetadata & {
  kind: "image";
  src: ImageProps["src"];
  alt: string;
};

export type VisualSource = ComponentVisualSource | ImageVisualSource;

const staticTemplateVisual = {
  motionPattern: null,
  status: "template-placeholder",
} as const;

const visualSources = {
  "placeholder-website-migration-overview": {
    ...staticTemplateVisual,
    kind: "image",
    label: "Website migration overview",
    src: "/media/uses/placeholder-website-migration-overview.svg",
    alt: "A reviewed route map connecting old website URLs to their launch destinations.",
  },
  "saas-rebuild-overview": {
    ...staticTemplateVisual,
    kind: "component",
    label: "SaaS website rebuild overview",
    component: SaasHeroVisual,
  },
  "startup-launch-overview": {
    ...staticTemplateVisual,
    kind: "component",
    label: "Startup launch overview",
    component: StartupHeroVisual,
  },
  "seo-landing-page-overview": {
    ...staticTemplateVisual,
    kind: "component",
    label: "SEO landing-page overview",
    component: SeoLandingHeroVisual,
  },
  "url-inventory": {
    ...staticTemplateVisual,
    kind: "component",
    label: "URL inventory",
    component: UrlInventoryVisual,
  },
  "url-decisions": {
    kind: "component",
    label: "URL decisions",
    motionPattern: "handoff arrow",
    status: "template-placeholder",
    component: UrlDecisionsVisual,
  },
  "page-meaning": {
    ...staticTemplateVisual,
    kind: "component",
    label: "Page meaning",
    component: PageMeaningVisual,
  },
  "release-gates": {
    ...staticTemplateVisual,
    kind: "component",
    label: "Release gates",
    component: ReleaseGatesVisual,
  },
  "post-launch-monitoring": {
    kind: "component",
    label: "Post-launch monitoring",
    motionPattern: "staggered chart reveal",
    status: "template-placeholder",
    component: MonitoringVisual,
  },
  "offer-and-audience": {
    ...staticTemplateVisual,
    kind: "component",
    label: "Offer and audience",
    component: OfferAndAudienceVisual,
  },
  "conversion-path": {
    ...staticTemplateVisual,
    kind: "component",
    label: "Conversion path",
    component: ConversionPathVisual,
  },
  "proof-and-trust": {
    ...staticTemplateVisual,
    kind: "component",
    label: "Proof and trust",
    component: ProofAndTrustVisual,
  },
  "measurement-plan": {
    ...staticTemplateVisual,
    kind: "component",
    label: "Measurement plan",
    component: MeasurementPlanVisual,
  },
  "buyer-journeys": {
    ...staticTemplateVisual,
    kind: "component",
    label: "Buyer journeys",
    component: BuyerJourneysVisual,
  },
  "information-architecture": {
    ...staticTemplateVisual,
    kind: "component",
    label: "Information architecture",
    component: InformationArchitectureVisual,
  },
  "reusable-pages": {
    ...staticTemplateVisual,
    kind: "component",
    label: "Reusable pages",
    component: ReusablePagesVisual,
  },
  "search-intent": {
    ...staticTemplateVisual,
    kind: "component",
    label: "Search intent",
    component: SearchIntentVisual,
  },
  "internal-links": {
    ...staticTemplateVisual,
    kind: "component",
    label: "Internal links",
    component: InternalLinksVisual,
  },
} satisfies Record<VisualId, VisualSource>;

export const VISUAL_ENTRIES = VISUAL_IDS.map((id) => ({
  id,
  ...visualSources[id],
}));

export function getVisualSource(id: VisualId): VisualSource {
  return visualSources[id];
}

export function ProjectVisual({
  id,
  priority = false,
  sizes = "(min-width: 1024px) 42vw, 100vw",
}: {
  id: VisualId;
  priority?: boolean;
  sizes?: string;
}) {
  const source = visualSources[id];

  if (source.kind === "component") {
    const Visual = source.component;
    return (
      <div data-visual-id={id}>
        <Visual />
      </div>
    );
  }

  return (
    <figure
      className="relative aspect-[4/3] min-w-0 overflow-hidden rounded-[1.75rem] border border-ink/10 bg-paper shadow-[0_24px_70px_rgba(29,41,38,0.07)]"
      data-visual-id={id}
    >
      <Image
        alt={source.alt}
        className="object-cover"
        fill
        priority={priority}
        sizes={sizes}
        src={source.src}
      />
    </figure>
  );
}
