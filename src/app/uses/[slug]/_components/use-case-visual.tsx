import type { ComponentType } from "react";
import Image, { type ImageProps } from "next/image";

import type { UseCaseVisualId } from "@/lib/use-cases";

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
} from "./use-case-visual-components";

type ComponentVisualSource = {
  kind: "component";
  component: ComponentType;
};

type ImageVisualSource = {
  kind: "image";
  src: ImageProps["src"];
  alt: string;
};

type UseCaseVisualSource = ComponentVisualSource | ImageVisualSource;

const useCaseVisualSources = {
  "website-migration-overview": {
    kind: "image",
    src: "/media/uses/website-migration-overview.svg",
    alt: "A reviewed route map connecting old website URLs to their launch destinations.",
  },
  "saas-rebuild-overview": {
    kind: "component",
    component: SaasHeroVisual,
  },
  "startup-launch-overview": {
    kind: "component",
    component: StartupHeroVisual,
  },
  "seo-landing-page-overview": {
    kind: "component",
    component: SeoLandingHeroVisual,
  },
  "url-inventory": { kind: "component", component: UrlInventoryVisual },
  "url-decisions": { kind: "component", component: UrlDecisionsVisual },
  "page-meaning": { kind: "component", component: PageMeaningVisual },
  "release-gates": { kind: "component", component: ReleaseGatesVisual },
  "post-launch-monitoring": {
    kind: "component",
    component: MonitoringVisual,
  },
  "offer-and-audience": {
    kind: "component",
    component: OfferAndAudienceVisual,
  },
  "conversion-path": { kind: "component", component: ConversionPathVisual },
  "proof-and-trust": { kind: "component", component: ProofAndTrustVisual },
  "measurement-plan": { kind: "component", component: MeasurementPlanVisual },
  "buyer-journeys": { kind: "component", component: BuyerJourneysVisual },
  "information-architecture": {
    kind: "component",
    component: InformationArchitectureVisual,
  },
  "reusable-pages": { kind: "component", component: ReusablePagesVisual },
  "search-intent": { kind: "component", component: SearchIntentVisual },
  "internal-links": { kind: "component", component: InternalLinksVisual },
} satisfies Record<UseCaseVisualId, UseCaseVisualSource>;

export function UseCaseVisual({
  id,
  priority = false,
}: {
  id: UseCaseVisualId;
  priority?: boolean;
}) {
  const source = useCaseVisualSources[id];

  if (source.kind === "component") {
    const Visual = source.component;
    return <Visual />;
  }

  return (
    <figure className="relative aspect-[4/3] min-w-0 overflow-hidden rounded-[1.75rem] border border-ink/10 bg-paper shadow-[0_24px_70px_rgba(29,41,38,0.07)]">
      <Image
        alt={source.alt}
        className="object-cover"
        fill
        priority={priority}
        sizes="(min-width: 1024px) 42vw, 100vw"
        src={source.src}
      />
    </figure>
  );
}
