import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { runAutomatedChecks, validateAutomatedChecks } from "./checks";
import {
  allChecklistItems,
  loadChecklist,
  type LaunchChecklist,
} from "./launch-checklist";

type Mode = "template" | "preview" | "production";
type Level = "PASS" | "FAIL" | "WARN" | "INFO";

type Result = {
  id: string;
  level: Level;
  subject: string;
  message: string;
};

type Page = {
  requestedUrl: string;
  finalUrl: string;
  status: number;
  contentType: string;
  linkHeader: string;
  setsCookie: boolean;
  html: string;
};

type ChecklistSummary = {
  total: number;
  todo: number;
  done: number;
  notApplicable: number;
  automatic: number;
  p0TodoIds: string[];
};

const args = process.argv.slice(2);
const baseUrl = normalizeBase(argument("--url") ?? "http://localhost:3000");
const mode = parseMode(argument("--mode") ?? "template");
const maxPages = Number.parseInt(argument("--max-pages") ?? "100", 10);
const results: Result[] = [];

function argument(name: string): string | undefined {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
}

function parseMode(value: string): Mode {
  if (value === "template" || value === "preview" || value === "production") {
    return value;
  }
  throw new Error(`Unknown audit mode: ${value}`);
}

function normalizeBase(value: string): string {
  return new URL(value).toString().replace(/\/$/, "");
}

function normalizePageUrl(value: string): string {
  const url = new URL(value);
  url.hash = "";
  return url.toString();
}

function record(
  id: string,
  level: Level,
  subject: string,
  message: string,
): void {
  results.push({ id, level, subject, message });
}

function auditChecklist(checklist: LaunchChecklist): ChecklistSummary {
  const items = allChecklistItems(checklist);
  const summary = {
    total: items.length,
    todo: items.filter((item) => item.status === "todo").length,
    done: items.filter((item) => item.status === "done").length,
    notApplicable: items.filter((item) => item.status === "not_applicable")
      .length,
    automatic: items.filter((item) => item.status === "auto").length,
    p0TodoIds: items
      .filter((item) => item.priority === "P0" && item.status === "todo")
      .map((item) => item.id),
  };

  if (summary.p0TodoIds.length === 0) {
    record("QA-01", "PASS", "checklist", "Every P0 item is resolved");
  } else {
    record(
      "QA-01",
      mode === "production" ? "FAIL" : "INFO",
      "checklist",
      `${summary.p0TodoIds.length} P0 item(s) still todo: ${summary.p0TodoIds.join(", ")}`,
    );
  }

  return summary;
}

async function auditAutomatedChecks(checklist: LaunchChecklist): Promise<void> {
  validateAutomatedChecks(checklist);

  for (const result of await runAutomatedChecks(checklist)) {
    if (result.passed) {
      record(result.id, "PASS", result.check, "Automated check passed");
      continue;
    }

    for (const finding of result.findings) {
      record(
        result.id,
        mode === "production" ? "FAIL" : "INFO",
        finding.subject,
        finding.message,
      );
    }
  }
}

function validateAuditIds(checklist: LaunchChecklist): void {
  const checklistIds = new Set(
    allChecklistItems(checklist).map((item) => item.id),
  );
  const unknownIds = [
    ...new Set(
      results.map((result) => result.id).filter((id) => !checklistIds.has(id)),
    ),
  ];

  if (unknownIds.length > 0) {
    throw new Error(
      `Launch audit uses unknown checklist IDs: ${unknownIds.join(", ")}`,
    );
  }
}

function attr(tag: string, name: string): string | undefined {
  const match = tag.match(new RegExp(`${name}\\s*=\\s*["']([^"']*)["']`, "i"));
  return match?.[1];
}

function firstTag(html: string, pattern: RegExp): string | undefined {
  return html.match(pattern)?.[0];
}

function metadataContent(
  html: string,
  attribute: "name" | "property",
  value: string,
): string | undefined {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  const tag = tags.find(
    (candidate) => attr(candidate, attribute)?.toLowerCase() === value,
  );
  return tag ? attr(tag, "content") : undefined;
}

function linkHref(html: string, rel: string): string | undefined {
  const tags = html.match(/<link\b[^>]*>/gi) ?? [];
  const tag = tags.find((candidate) =>
    (attr(candidate, "rel") ?? "").toLowerCase().split(/\s+/).includes(rel),
  );
  return tag ? attr(tag, "href") : undefined;
}

function titleText(html: string): string | undefined {
  return decode(
    html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "",
  ).trim();
}

function headingTexts(html: string, level: number): string[] {
  const matches = html.matchAll(
    new RegExp(`<h${level}\\b[^>]*>([\\s\\S]*?)<\\/h${level}>`, "gi"),
  );
  return [...matches].map((match) => plainText(match[1]));
}

function plainText(html: string): string {
  return decode(
    html
      .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
      .replace(/<svg\b[\s\S]*?<\/svg>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " "),
  ).trim();
}

function decode(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function words(value: string): string[] {
  return value.split(/\s+/).filter(Boolean);
}

function isNoIndex(html: string): boolean {
  const value = metadataContent(html, "name", "robots")?.toLowerCase() ?? "";
  return value.split(/\s*,\s*/).includes("noindex");
}

function jsonLdBlocks(html: string): unknown[] {
  const scripts = html.matchAll(
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  );
  const values: unknown[] = [];

  for (const match of scripts) {
    try {
      values.push(JSON.parse(match[1]));
    } catch {
      values.push({ __invalid: true });
    }
  }
  return values;
}

function structuredTypes(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(structuredTypes);
  if (!value || typeof value !== "object") return [];
  const item = value as Record<string, unknown>;
  const ownType =
    typeof item["@type"] === "string"
      ? [item["@type"]]
      : Array.isArray(item["@type"])
        ? item["@type"].filter(
            (type): type is string => typeof type === "string",
          )
        : [];
  const graph = item["@graph"] ? structuredTypes(item["@graph"]) : [];
  return [...ownType, ...graph];
}

function hasArticleDate(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(hasArticleDate);
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  if (item.datePublished || item.dateModified) return true;
  return item["@graph"] ? hasArticleDate(item["@graph"]) : false;
}

function internalLinks(html: string, fromUrl: string): string[] {
  const links = html.match(/<a\b[^>]*>/gi) ?? [];
  const urls = new Set<string>();

  for (const tag of links) {
    const href = attr(tag, "href");
    if (
      !href ||
      href.startsWith("#") ||
      /^(mailto:|tel:|javascript:)/i.test(href)
    ) {
      continue;
    }

    try {
      const url = new URL(href, fromUrl);
      if (url.origin !== new URL(baseUrl).origin) continue;
      url.hash = "";
      urls.add(url.toString());
    } catch {
      record("ROUTE-01", "FAIL", fromUrl, `Invalid href: ${href}`);
    }
  }

  return [...urls];
}

async function fetchPage(url: string): Promise<Page> {
  try {
    const response = await fetch(url, {
      redirect: "follow",
      headers: { "user-agent": "launch-template-audit/1.0" },
    });
    return {
      requestedUrl: url,
      finalUrl: response.url,
      status: response.status,
      contentType: response.headers.get("content-type") ?? "",
      linkHeader: response.headers.get("link") ?? "",
      setsCookie: response.headers.has("set-cookie"),
      html: await response.text(),
    };
  } catch (error) {
    return {
      requestedUrl: url,
      finalUrl: url,
      status: 0,
      contentType: "",
      linkHeader: "",
      setsCookie: false,
      html: error instanceof Error ? error.message : String(error),
    };
  }
}

async function walkFiles(target: string): Promise<string[]> {
  const entries = await readdir(target, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const entryPath = path.join(target, entry.name);
    if (entry.isDirectory()) files.push(...(await walkFiles(entryPath)));
    else files.push(entryPath);
  }
  return files;
}

async function staticAudit(): Promise<void> {
  const roots = ["src", "public"];
  const files = ["package.json", ".env.example", "next.config.ts"];

  for (const root of roots) {
    try {
      files.push(...(await walkFiles(root)));
    } catch {
      // A missing optional root has nothing to scan.
    }
  }

  const scannable = files.filter((file) =>
    /(?:\.(?:ts|tsx|js|mjs|json|md|txt|css|svg)|package\.json|\.env\.example)$/.test(
      file,
    ),
  );
  const forbidden = ["reglyr", "trythrawn", "citationbench", "serp-sniper"];
  let sentinelCount = 0;
  let legacyCount = 0;

  for (const file of scannable) {
    const content = await readFile(file, "utf8");
    const sentinels = content.match(/TODO_CLIENT_[A-Z0-9_]+/g) ?? [];
    if (sentinels.length > 0) {
      sentinelCount += sentinels.length;
      record(
        "BRAND-01",
        mode === "production" ? "FAIL" : "INFO",
        file,
        `Unresolved sentinel: ${[...new Set(sentinels)].join(", ")}`,
      );
    }

    const matchedLegacy = forbidden.filter((term) =>
      content.toLowerCase().includes(term),
    );
    if (matchedLegacy.length > 0) {
      legacyCount += matchedLegacy.length;
      record(
        "BRAND-01",
        "FAIL",
        file,
        `Forbidden legacy identity: ${matchedLegacy.join(", ")}`,
      );
    }
  }

  if (sentinelCount === 0) {
    record("BRAND-01", "PASS", "source", "No TODO_CLIENT_* sentinels found");
  }
  if (legacyCount === 0) {
    record("BRAND-01", "PASS", "source", "No known legacy identities found");
  }

  const packageJson = JSON.parse(await readFile("package.json", "utf8")) as {
    name?: string;
  };
  if (mode === "production" && packageJson.name === "next-launch-template") {
    record(
      "BRAND-01",
      "FAIL",
      "package.json",
      "Replace the template package name before production",
    );
  }
}

function isMarkdownResponse(page: Page): boolean {
  return (
    /^text\/(?:plain|markdown)(?:;|$)/i.test(page.contentType) &&
    !/^\s*<!doctype\s+html\b/i.test(page.html)
  );
}

function isPublicContentResponse(page: Page): boolean {
  return (
    isMarkdownResponse(page) ||
    (/^text\/html(?:;|$)/i.test(page.contentType) &&
      /^\s*<!doctype\s+html\b/i.test(page.html))
  );
}

function describedLlmsLinks(content: string): string[] {
  const links = content.matchAll(
    /^- \[[^\]]+]\((https:\/\/[^\s)]+)\):\s+\S.*$/gm,
  );
  return [...links].map((match) => match[1]);
}

async function auditLlmsTxt(llmsTxt: Page): Promise<void> {
  if (llmsTxt.status !== 200) {
    record("LLM-01", "FAIL", "/llms.txt", `HTTP ${llmsTxt.status}`);
    return;
  }

  const requested = normalizePageUrl(llmsTxt.requestedUrl);
  const final = normalizePageUrl(llmsTxt.finalUrl);
  const directAndCookieless = requested === final && !llmsTxt.setsCookie;
  record(
    "LLM-01",
    directAndCookieless ? "PASS" : "FAIL",
    "/llms.txt",
    directAndCookieless
      ? "Served directly without a redirect or cookie"
      : [
          requested === final ? undefined : `redirected to ${llmsTxt.finalUrl}`,
          llmsTxt.setsCookie ? "sets a cookie" : undefined,
        ]
          .filter(Boolean)
          .join("; "),
  );
  record(
    "LLM-01",
    isMarkdownResponse(llmsTxt) ? "PASS" : "FAIL",
    "/llms.txt",
    isMarkdownResponse(llmsTxt)
      ? `HTTP 200 with ${llmsTxt.contentType}`
      : `Expected text/plain or text/markdown without an HTML document; received ${llmsTxt.contentType || "no content type"}`,
  );

  const links = describedLlmsLinks(llmsTxt.html);
  record(
    "LLM-01",
    links.length > 0 ? "PASS" : "FAIL",
    "/llms.txt",
    `${links.length} described absolute link(s) found`,
  );

  if (mode !== "production") return;

  const targets = await Promise.all(links.map((url) => fetchPage(url)));
  for (const target of targets) {
    const direct =
      normalizePageUrl(target.requestedUrl) ===
      normalizePageUrl(target.finalUrl);
    const passed =
      target.status === 200 && direct && isPublicContentResponse(target);
    record(
      "LLM-01",
      passed ? "PASS" : "FAIL",
      target.requestedUrl,
      passed
        ? `Direct public content response (${target.contentType})`
        : `Expected direct HTTP 200 HTML or Markdown; received HTTP ${target.status}, ${target.contentType || "no content type"}${direct ? "" : `, redirected to ${target.finalUrl}`}`,
    );
  }
}

function hasDiscoveryLink(
  header: string,
  target: string,
  relation: string,
  contentType: string,
): boolean {
  return header.split(",").some((value) => {
    const link = value.trim();
    return (
      link.startsWith(`<${target}>`) &&
      new RegExp(`(?:^|;)\\s*rel=["']${relation}["'](?:;|$)`, "i").test(link) &&
      new RegExp(`(?:^|;)\\s*type=["']${contentType}["'](?:;|$)`, "i").test(
        link,
      )
    );
  });
}

function auditDiscoveryLinkHeader(
  homepage: Page | undefined,
  llmsTxtEnabled: boolean,
): void {
  const linkHeader = homepage?.linkHeader ?? "";
  const hasLlmsTxt = hasDiscoveryLink(
    linkHeader,
    "/llms.txt",
    "describedby",
    "text/plain",
  );
  const hasSitemap = hasDiscoveryLink(
    linkHeader,
    "/sitemap.xml",
    "sitemap",
    "application/xml",
  );
  const passed = llmsTxtEnabled
    ? hasLlmsTxt && hasSitemap
    : !hasLlmsTxt && !hasSitemap;

  record(
    "LLM-01",
    passed ? "PASS" : "FAIL",
    "homepage Link header",
    llmsTxtEnabled
      ? passed
        ? "Advertises /llms.txt and /sitemap.xml"
        : "Expected describedby /llms.txt and sitemap /sitemap.xml discovery links"
      : passed
        ? "Discovery links are absent with the removed llms.txt feature"
        : "Remove llms.txt and sitemap discovery links when llms.txt is not applicable",
  );
}

async function crawl(): Promise<Map<string, Page>> {
  const pages = new Map<string, Page>();
  const queue = [normalizePageUrl(baseUrl)];
  const queued = new Set(queue);

  while (queue.length > 0 && pages.size < maxPages) {
    const requested = queue.shift();
    if (!requested) break;
    const page = await fetchPage(requested);
    pages.set(requested, page);

    if (page.status >= 200 && page.status < 300 && /<html\b/i.test(page.html)) {
      for (const link of internalLinks(page.html, page.finalUrl)) {
        if (!queued.has(link)) {
          queued.add(link);
          queue.push(link);
        }
      }
    }
  }

  return pages;
}

function auditPage(page: Page, sitemapUrls: Set<string>): void {
  const subject = new URL(page.requestedUrl).pathname || "/";

  if (page.status < 200 || page.status >= 400) {
    record(
      "ROUTE-01",
      "FAIL",
      subject,
      `Expected a working route; received ${page.status || "network error"}`,
    );
    return;
  }

  record("ROUTE-01", "PASS", subject, `HTTP ${page.status}`);

  if (normalizePageUrl(page.finalUrl) !== normalizePageUrl(page.requestedUrl)) {
    record("SEO-07", "INFO", subject, `Redirected to ${page.finalUrl}`);
  }

  const noIndex = isNoIndex(page.html);
  const indexable = !noIndex;
  const title = titleText(page.html);
  const description = metadataContent(page.html, "name", "description");
  const headings = headingTexts(page.html, 1);
  const canonical = linkHref(page.html, "canonical");
  const bodyWords = words(plainText(page.html));

  if (subject === "/contact") {
    const deliveryTag = firstTag(
      page.html,
      /<[^>]+\bdata-contact-delivery=["'][^"']+["'][^>]*>/i,
    );
    const deliveryState = deliveryTag
      ? attr(deliveryTag, "data-contact-delivery")
      : undefined;
    const hasForm = /<form\b/i.test(page.html);

    record(
      "FORM-01",
      hasForm ? "PASS" : "FAIL",
      subject,
      hasForm ? "Server-rendered form markup present" : "Contact form missing",
    );
    record(
      "FORM-01",
      deliveryState === "configured"
        ? "PASS"
        : mode === "production"
          ? "FAIL"
          : "INFO",
      subject,
      deliveryState === "configured"
        ? "Delivery configuration present; verify the production recipient end to end"
        : "Delivery is intentionally unavailable until all server-only mail values are set",
    );
  }

  if (indexable) {
    if (title) record("SEO-02", "PASS", subject, `Title: ${title}`);
    else record("SEO-02", "FAIL", subject, "Missing meta title");

    if (description) {
      record("SEO-02", "PASS", subject, `Description: ${description}`);
    } else {
      record("SEO-02", "FAIL", subject, "Missing meta description");
    }

    if (headings.length === 1 && headings[0]) {
      record("SEO-02", "PASS", subject, `H1: ${headings[0]}`);
    } else {
      record(
        "SEO-02",
        "FAIL",
        subject,
        `Expected one clear H1; found ${headings.length}`,
      );
    }

    record(
      "SEO-02",
      bodyWords.length >= 200 ? "PASS" : "WARN",
      subject,
      `${bodyWords.length} visible words; human-review the first ${Math.min(200, bodyWords.length)}`,
    );

    if (!canonical) {
      record("SEO-03", "FAIL", subject, "Missing canonical URL");
    } else {
      try {
        const canonicalUrl = new URL(canonical, page.finalUrl).toString();
        const productionMismatch =
          mode === "production" &&
          new URL(canonicalUrl).origin !== new URL(baseUrl).origin;
        record(
          "SEO-03",
          productionMismatch ? "FAIL" : "PASS",
          subject,
          productionMismatch
            ? `Canonical uses another origin: ${canonicalUrl}`
            : `Canonical: ${canonicalUrl}`,
        );
        if (!sitemapUrls.has(canonicalUrl)) {
          record(
            "SEO-05",
            "FAIL",
            subject,
            `Indexable canonical is absent from sitemap: ${canonicalUrl}`,
          );
        }
      } catch {
        record("SEO-03", "FAIL", subject, `Invalid canonical: ${canonical}`);
      }
    }
  } else {
    record("SEO-01", "INFO", subject, "Page is noindex");
  }

  const langTag = firstTag(page.html, /<html\b[^>]*>/i);
  const lang = langTag ? attr(langTag, "lang") : undefined;
  record(
    "A11Y-01",
    lang ? "PASS" : "WARN",
    subject,
    lang ? `Document language: ${lang}` : "Missing document language",
  );

  const socialFields = [
    metadataContent(page.html, "property", "og:title"),
    metadataContent(page.html, "property", "og:description"),
    metadataContent(page.html, "property", "og:image"),
    metadataContent(page.html, "name", "twitter:card"),
  ];
  record(
    "SOCIAL-01",
    socialFields.every(Boolean) ? "PASS" : "WARN",
    subject,
    socialFields.every(Boolean)
      ? "Core social preview metadata present"
      : "Social preview metadata is incomplete",
  );

  const jsonLd = jsonLdBlocks(page.html);
  if (
    jsonLd.some(
      (value) =>
        typeof value === "object" &&
        value !== null &&
        (value as { __invalid?: boolean }).__invalid,
    )
  ) {
    record("SEO-08", "WARN", subject, "Invalid JSON-LD block");
  }
  const types = jsonLd.flatMap(structuredTypes);
  const isArticle = types.some((type) =>
    ["Article", "BlogPosting", "NewsArticle"].includes(type),
  );
  if (isArticle && !jsonLd.some(hasArticleDate)) {
    record(
      "SEO-02",
      "WARN",
      subject,
      "Article JSON-LD has no published or updated date; verify source availability",
    );
  }

  if (
    mode === "production" &&
    /Launch Template|next-launch-template/i.test(
      `${title ?? ""} ${plainText(page.html)}`,
    )
  ) {
    record(
      "BRAND-01",
      "FAIL",
      subject,
      "Template identity is visible in production",
    );
  }
}

async function liveAudit(checklist: LaunchChecklist): Promise<void> {
  const llmsTxtEnabled =
    allChecklistItems(checklist).find((item) => item.id === "LLM-01")
      ?.status !== "not_applicable";
  const [robots, sitemap, llmsTxt] = await Promise.all([
    fetchPage(`${baseUrl}/robots.txt`),
    fetchPage(`${baseUrl}/sitemap.xml`),
    fetchPage(`${baseUrl}/llms.txt`),
  ]);

  if (llmsTxtEnabled) {
    await auditLlmsTxt(llmsTxt);
  } else {
    record(
      "LLM-01",
      llmsTxt.status === 404 ? "PASS" : "FAIL",
      "/llms.txt",
      llmsTxt.status === 404
        ? "Deliberately removed"
        : `Expected 404 after deliberate removal; received HTTP ${llmsTxt.status}`,
    );
  }

  if (robots.status !== 200) {
    record("SEO-04", "FAIL", "/robots.txt", `HTTP ${robots.status}`);
  } else if (mode === "production") {
    const blocked = /disallow:\s*\/\s*$/im.test(robots.html);
    const sitemapLine = /sitemap:\s*https?:\/\//i.test(robots.html);
    record(
      "SEO-01",
      blocked ? "FAIL" : "PASS",
      "/robots.txt",
      blocked
        ? "Production is blocked from crawling"
        : "Production crawl is allowed",
    );
    record(
      "SEO-04",
      sitemapLine ? "PASS" : "FAIL",
      "/robots.txt",
      sitemapLine
        ? "Absolute sitemap directive present"
        : "Missing absolute sitemap directive",
    );
  } else {
    const blocked = /disallow:\s*\/\s*$/im.test(robots.html);
    record(
      "SEO-01",
      blocked ? "PASS" : "FAIL",
      "/robots.txt",
      blocked
        ? `${mode} crawling is blocked`
        : `${mode} must be blocked from crawling`,
    );
  }

  const sitemapUrls = new Set<string>();
  if (sitemap.status === 200) {
    for (const match of sitemap.html.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)) {
      sitemapUrls.add(decode(match[1].trim()));
    }
    record(
      "SEO-05",
      sitemapUrls.size > 0 ? "PASS" : "FAIL",
      "/sitemap.xml",
      `${sitemapUrls.size} canonical HTML URL(s) listed`,
    );
  } else {
    record("SEO-05", "FAIL", "/sitemap.xml", `HTTP ${sitemap.status}`);
  }

  const pages = await crawl();
  auditDiscoveryLinkHeader(
    pages.get(normalizePageUrl(baseUrl)),
    llmsTxtEnabled,
  );
  for (const page of pages.values()) auditPage(page, sitemapUrls);

  const missing = await fetchPage(
    `${baseUrl}/__launch-audit-missing-${Date.now().toString(36)}`,
  );
  record(
    "ROUTE-02",
    missing.status === 404 ? "PASS" : "FAIL",
    "unknown route",
    `Expected 404; received ${missing.status}`,
  );

  if (pages.size >= maxPages) {
    record(
      "ROUTE-01",
      "WARN",
      "crawl",
      `Stopped at --max-pages ${maxPages}; increase it for full coverage`,
    );
  }
}

function printResults(): void {
  const order: Record<Level, number> = { FAIL: 0, WARN: 1, INFO: 2, PASS: 3 };
  results.sort(
    (a, b) => order[a.level] - order[b.level] || a.id.localeCompare(b.id),
  );

  for (const result of results) {
    const label = result.level.padEnd(4);
    console.log(
      `${label} ${result.id.padEnd(10)} ${result.subject} — ${result.message}`,
    );
  }

  const counts = Object.fromEntries(
    (["PASS", "FAIL", "WARN", "INFO"] as Level[]).map((level) => [
      level,
      results.filter((result) => result.level === level).length,
    ]),
  );
  console.log(
    `\n${counts.PASS} passed · ${counts.WARN} warnings · ${counts.INFO} info · ${counts.FAIL} failed`,
  );
}

async function saveReport(checklist: ChecklistSummary): Promise<void> {
  await mkdir("artifacts", { recursive: true });
  await writeFile(
    "artifacts/launch-audit.json",
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        baseUrl,
        mode,
        checklist,
        results,
      },
      null,
      2,
    )}\n`,
  );
}

async function main(): Promise<void> {
  const checklist = await loadChecklist();
  const checklistSummary = auditChecklist(checklist);
  await auditAutomatedChecks(checklist);
  await staticAudit();
  await liveAudit(checklist);
  validateAuditIds(checklist);
  printResults();
  await saveReport(checklistSummary);
  if (results.some((result) => result.level === "FAIL")) process.exitCode = 1;
}

void main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
