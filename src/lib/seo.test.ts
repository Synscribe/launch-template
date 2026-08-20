import { describe, expect, it } from "vitest";

import {
  absoluteUrl,
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  createPageMetadata,
  serializeJsonLd,
} from "./seo";

describe("SEO helpers", () => {
  it("builds absolute URLs from the configured origin", () => {
    expect(absoluteUrl("/use-cases/example")).toBe(
      "http://localhost:3000/use-cases/example",
    );
  });

  it("keeps canonical and sharing URLs aligned", () => {
    const metadata = createPageMetadata({
      title: "Example page",
      description: "An accurate description for the example page.",
      path: "/example",
    });

    expect(metadata.alternates?.canonical).toBe(
      "http://localhost:3000/example",
    );
    expect(metadata.openGraph?.url).toBe("http://localhost:3000/example");
  });

  it("includes article dates only when source data provides them", () => {
    const article = buildArticleJsonLd({
      headline: "A useful article",
      description: "A useful description.",
      path: "/blog/useful",
      authorName: "A. Writer",
      publishedAt: "2026-08-20",
    });

    expect(article).toMatchObject({ datePublished: "2026-08-20" });
    expect(article).not.toHaveProperty("dateModified");
  });

  it("builds ordered absolute breadcrumb items", () => {
    const breadcrumbs = buildBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Website migrations", path: "/use-cases/website-migrations" },
    ]);

    expect(breadcrumbs.itemListElement[1]).toEqual({
      "@type": "ListItem",
      position: 2,
      name: "Website migrations",
      item: "http://localhost:3000/use-cases/website-migrations",
    });
  });

  it("escapes opening tags in serialized JSON-LD", () => {
    expect(serializeJsonLd({ value: "</script>" })).toContain("\\u003c");
  });
});
