import type { MetadataRoute } from "next";

import { usesTemplateIdentity } from "@/config/env";
import { siteConfig } from "@/config/site";
import { getAllBlogPosts, type BlogPostSummary } from "@/lib/blog";
import { getAllUseCases } from "@/lib/use-cases";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const useCases = await getAllUseCases();
  let blogPosts: BlogPostSummary[] = [];

  try {
    blogPosts = (await getAllBlogPosts()).posts;
  } catch {
    // Keep the local routes discoverable during a temporary CMS outage.
  }

  const routes = [
    "/",
    "/uses",
    ...useCases.map((useCase) => `/uses/${useCase.slug}`),
    "/blog",
  ];

  if (!usesTemplateIdentity) routes.push("/privacy", "/terms");

  return [
    ...routes.map((route) => ({ url: `${siteConfig.url}${route}` })),
    ...blogPosts.map((post) => ({
      url: `${siteConfig.url}/blog/${post.slug}`,
      lastModified: post.updatedAt,
    })),
  ];
}
