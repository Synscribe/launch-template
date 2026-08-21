import assert from "node:assert/strict";
import test from "node:test";
import { gzipSync } from "node:zlib";

import {
  crawlSitemaps,
  decodeSitemapBody,
  extractLocs,
  groupRouteFamilies,
  renderRouteGroups,
  renderUrlMap,
} from "./inventory-sitemap.mjs";

test("decodeSitemapBody reads plain and gzipped XML", () => {
  const xml = "<urlset><url><loc>https://example.com/</loc></url></urlset>";
  assert.equal(decodeSitemapBody(Buffer.from(xml)), xml);
  assert.equal(decodeSitemapBody(gzipSync(xml)), xml);
});

test("extractLocs decodes XML and CDATA values", () => {
  assert.deepEqual(
    extractLocs(`
      <urlset>
        <url><loc>https://example.com/a?x=1&amp;y=2</loc></url>
        <url><loc><![CDATA[https://example.com/b]]></loc></url>
      </urlset>
    `),
    ["https://example.com/a?x=1&y=2", "https://example.com/b"],
  );
});

test("crawlSitemaps follows an index and deduplicates exact URLs", async () => {
  const documents = new Map([
    [
      "https://example.com/sitemap.xml",
      `<sitemapindex>
        <sitemap><loc>https://example.com/pages.xml</loc></sitemap>
        <sitemap><loc>https://example.com/blog.xml</loc></sitemap>
      </sitemapindex>`,
    ],
    [
      "https://example.com/pages.xml",
      `<urlset>
        <url><loc>https://example.com/</loc></url>
        <url><loc>https://example.com/about</loc></url>
      </urlset>`,
    ],
    [
      "https://example.com/blog.xml",
      `<urlset>
        <url><loc>https://example.com/blog/one</loc></url>
        <url><loc>https://example.com/blog/two</loc></url>
        <url><loc>https://example.com/about</loc></url>
      </urlset>`,
    ],
  ]);

  const result = await crawlSitemaps(["https://example.com/sitemap.xml"], {
    fetchText: async (url) => {
      const document = documents.get(url);
      if (!document) throw new Error(`Unexpected URL: ${url}`);
      return document;
    },
  });

  assert.equal(result.sitemapUrls.length, 3);
  assert.deepEqual(result.pageUrls, [
    "https://example.com/",
    "https://example.com/about",
    "https://example.com/blog/one",
    "https://example.com/blog/two",
  ]);
});

test("groupRouteFamilies emits wildcard archetypes without losing exact URLs", () => {
  const urls = [
    "https://example.com/",
    "https://example.com/about",
    "https://example.com/blog/one",
    "https://example.com/blog/two",
    "https://example.com/uses/migrate",
    "https://example.com/uses/rebuild",
  ];
  const grouped = groupRouteFamilies(urls);

  assert.deepEqual(
    grouped.families.map((family) => family.pattern),
    ["/blog/*", "/uses/*"],
  );
  assert.deepEqual(grouped.standalone, [
    "https://example.com/",
    "https://example.com/about",
  ]);
  assert.equal(renderUrlMap(urls).split("\n").length - 1, urls.length + 1);
  assert.match(
    renderRouteGroups({
      source: "https://example.com",
      sitemapUrls: ["https://example.com/sitemap.xml"],
      pageUrls: urls,
      minGroup: 2,
    }),
    /`\/blog\/\*`/,
  );
});

test("groupRouteFamilies does not merge paths from different origins", () => {
  const grouped = groupRouteFamilies([
    "https://example.com/blog/one",
    "https://docs.example.com/blog/two",
  ]);
  assert.deepEqual(grouped.families, []);
  assert.equal(grouped.standalone.length, 2);
});
