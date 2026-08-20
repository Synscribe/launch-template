import { siteConfig } from "@/config/site";
import { getBlogPosts, type BlogPostSummary } from "@/lib/blog";
import { absoluteUrl } from "@/lib/seo";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  let posts: BlogPostSummary[] = [];

  try {
    posts = (await getBlogPosts({ limit: 20 })).posts;
  } catch {
    // Keep the feed valid during a temporary CMS outage.
  }

  const items = posts
    .map((post) => {
      const url = absoluteUrl(`/blog/${post.slug}`);
      return `<item>
  <title>${escapeXml(post.title)}</title>
  <link>${escapeXml(url)}</link>
  <guid isPermaLink="true">${escapeXml(url)}</guid>
  ${post.description ? `<description>${escapeXml(post.description)}</description>` : ""}
  ${post.publishedAt ? `<pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>` : ""}
</item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${escapeXml(siteConfig.name)}</title>
  <link>${escapeXml(siteConfig.url)}</link>
  <description>${escapeXml(siteConfig.description)}</description>
  <language>${escapeXml(siteConfig.locale)}</language>
  <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${escapeXml(absoluteUrl("/feed.xml"))}" rel="self" type="application/rss+xml" />
  ${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
