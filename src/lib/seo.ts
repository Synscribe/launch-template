import type { Metadata } from "next";

import { siteConfig } from "../config/site";

export type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  imagePath?: string;
  noIndex?: boolean;
};

export function absoluteUrl(path = "/"): string {
  return new URL(path, `${siteConfig.url}/`).toString();
}

export function createPageMetadata({
  title,
  description,
  path,
  imagePath = "/opengraph-image",
  noIndex = false,
}: PageMetadataInput): Metadata {
  const canonical = absoluteUrl(path);
  const image = absoluteUrl(imagePath);

  return {
    title,
    description,
    alternates: { canonical },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "website",
      locale: siteConfig.locale.replace("-", "_"),
      url: canonical,
      siteName: siteConfig.name,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    inLanguage: siteConfig.locale,
  } as const;
}

export type BreadcrumbJsonLdItem = {
  name: string;
  path: string;
};

export function buildBreadcrumbJsonLd(items: BreadcrumbJsonLdItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  } as const;
}

export type ArticleJsonLdInput = {
  headline: string;
  description: string;
  path: string;
  authorName?: string;
  publishedAt?: string;
  updatedAt?: string;
  imagePath?: string;
};

export function buildArticleJsonLd({
  headline,
  description,
  path,
  authorName,
  publishedAt,
  updatedAt,
  imagePath,
}: ArticleJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    url: absoluteUrl(path),
    ...(authorName
      ? { author: { "@type": "Person" as const, name: authorName } }
      : {}),
    publisher: { "@type": "Organization", name: siteConfig.name },
    ...(publishedAt ? { datePublished: publishedAt } : {}),
    ...(updatedAt ? { dateModified: updatedAt } : {}),
    ...(imagePath ? { image: absoluteUrl(imagePath) } : {}),
  } as const;
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
