import { describe, expect, it } from "vitest";

import {
  addBlogHeadingAnchors,
  descriptionFromPost,
  estimateReadingMinutes,
  sanitizeBlogContent,
} from "./blog-content";

describe("blog content helpers", () => {
  it("uses CMS descriptions when they are present", () => {
    expect(descriptionFromPost("  A clear summary.  ", "<p>Body</p>")).toBe(
      "A clear summary.",
    );
  });

  it("builds a short plain-text description from article content", () => {
    const description = descriptionFromPost(
      null,
      `<p>${"useful ".repeat(30)}</p>`,
    );

    expect(description.length).toBeLessThanOrEqual(155);
    expect(description).not.toContain("<p>");
    expect(description.endsWith("…")).toBe(true);
  });

  it("estimates reading time at 200 words per minute", () => {
    expect(estimateReadingMinutes(`<p>${"word ".repeat(201)}</p>`)).toBe(2);
  });

  it("removes unsafe markup and hardens external links", () => {
    const html = sanitizeBlogContent(
      '<h1>Title</h1><script>alert(1)</script><p><img src="https://example.com/x.jpg" onerror="alert(1)"></p><a href="https://example.com">Source</a>',
    );

    expect(html).toContain("<h2>Title</h2>");
    expect(html).not.toContain("script");
    expect(html).not.toContain("onerror");
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it("removes a duplicated lead image from the article body", () => {
    const image = "https://example.com/header.jpg";
    const html = sanitizeBlogContent(
      `<p><img src="${image}" alt=""></p><p>Start here.</p>`,
      image,
    );

    expect(html).not.toContain(image);
    expect(html).toContain("Start here.");
  });

  it("keeps blog links local and returns other source links to their origin", () => {
    const html = sanitizeBlogContent(
      '<a href="/blog/another-post">Article</a><a href="/book-a-demo">Demo</a>',
      null,
      "https://cybersierra.co",
    );

    expect(html).toContain('href="/blog/another-post"');
    expect(html).toContain('href="https://cybersierra.co/book-a-demo"');
  });

  it("turns malformed local blog destinations into plain text", () => {
    const html = sanitizeBlogContent(
      '<a href="/blog/book a demo">Book a demo</a>',
      null,
      "https://cybersierra.co",
    );

    expect(html).toBe("Book a demo");
  });

  it("adds stable heading anchors and builds a nested table of contents", () => {
    const result = addBlogHeadingAnchors(
      "<h2>Start Here</h2><p>Body</p><h3>Useful &amp; Safe</h3><h2>Start Here</h2>",
    );

    expect(result.html).toContain('<h2 id="start-here">Start Here</h2>');
    expect(result.html).toContain('<h2 id="start-here-2">Start Here</h2>');
    expect(result.tableOfContents).toEqual([
      { id: "start-here", level: 2, text: "Start Here" },
      { id: "useful-and-safe", level: 3, text: "Useful & Safe" },
      { id: "start-here-2", level: 2, text: "Start Here" },
    ]);
  });

  it("preserves a CMS heading id when it is already present", () => {
    const result = addBlogHeadingAnchors(
      '<h2 id="existing-section">Existing section</h2>',
    );

    expect(result.html).toBe('<h2 id="existing-section">Existing section</h2>');
    expect(result.tableOfContents[0]?.id).toBe("existing-section");
  });
});
