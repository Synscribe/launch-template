import type { MetadataRoute } from "next";

import { usesTemplateIdentity } from "@/config/env";
import { siteConfig } from "@/config/site";
import { getAllUseCases } from "@/lib/use-cases";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const useCases = await getAllUseCases();
  const routes = [
    "/",
    ...useCases.map((useCase) => `/use-cases/${useCase.slug}`),
  ];

  if (!usesTemplateIdentity) routes.push("/privacy", "/terms");

  return routes.map((route) => ({ url: `${siteConfig.url}${route}` }));
}
