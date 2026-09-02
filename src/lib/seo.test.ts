import { describe, expect, it } from "vitest";

import {
  absoluteUrl,
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildOrganizationJsonLd,
  buildWebsiteJsonLd,
  createPageMetadata,
  defaultOrganizationLogoPath,
  organizationJsonLdId,
  serializeJsonLd,
  websiteJsonLdId,
} from "./seo";

describe("SEO helpers", () => {
  it("builds absolute URLs from the configured origin", () => {
    expect(absoluteUrl("/uses/example")).toBe(
      "http://localhost:3000/uses/example",
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

  it("gives the organization a canonical node id", () => {
    const organization = buildOrganizationJsonLd();

    expect(organization["@id"]).toBe("http://localhost:3000/#organization");
    expect(organization["@id"]).toBe(organizationJsonLdId);
    expect(organization.url).toBe("http://localhost:3000");
  });

  it("omits optional organization fields the environment does not supply", () => {
    const organization = buildOrganizationJsonLd();

    expect(organization).not.toHaveProperty("sameAs");
  });

  it("resolves the logo to the bundled brand file", () => {
    const organization = buildOrganizationJsonLd();

    expect(organization.logo).toBe(absoluteUrl(defaultOrganizationLogoPath));
    expect(organization.logo).toBe("http://localhost:3000/brand/logo.svg");
  });

  it("points the website and articles at the canonical organization node", () => {
    const website = buildWebsiteJsonLd();
    const article = buildArticleJsonLd({
      headline: "A useful article",
      description: "A useful description.",
      path: "/blog/useful",
    });

    expect(website["@id"]).toBe(websiteJsonLdId);
    expect(website.publisher).toEqual({ "@id": organizationJsonLdId });
    expect(article.publisher).toEqual({ "@id": organizationJsonLdId });
    expect(article.isPartOf).toEqual({ "@id": websiteJsonLdId });
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

  it("omits an article author when the source does not provide one", () => {
    const article = buildArticleJsonLd({
      headline: "A useful article",
      description: "A useful description.",
      path: "/blog/useful",
    });

    expect(article).not.toHaveProperty("author");
  });

  it("builds ordered absolute breadcrumb items", () => {
    const breadcrumbs = buildBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Website migrations", path: "/uses/website-migrations" },
    ]);

    expect(breadcrumbs.itemListElement[1]).toEqual({
      "@type": "ListItem",
      position: 2,
      name: "Website migrations",
      item: "http://localhost:3000/uses/website-migrations",
    });
  });

  it("builds FAQ structured data from visible questions and answers", () => {
    const faq = buildFaqJsonLd([
      {
        question: "Can I bring my own design system?",
        answer: "Yes. Replace the design tokens and keep the launch checks.",
      },
    ]);

    expect(faq).toMatchObject({
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Can I bring my own design system?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Replace the design tokens and keep the launch checks.",
          },
        },
      ],
    });
  });

  it("escapes opening tags in serialized JSON-LD", () => {
    expect(serializeJsonLd({ value: "</script>" })).toContain("\\u003c");
  });
});
