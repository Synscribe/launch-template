#!/usr/bin/env node

import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gunzipSync } from "node:zlib";

const DEFAULT_MAX_SITEMAPS = 1_000;
const DEFAULT_MAX_URLS = 100_000;

function usage() {
  return `Usage:
  node inventory-sitemap.mjs --site <origin> --url-map <file> --route-groups <file> [options]

Options:
  --sitemap <url>       Start from this sitemap instead of robots.txt or /sitemap.xml
  --min-group <count>   Minimum sibling routes before emitting /parent/* (default: 2)
  --max-sitemaps <n>    Safety limit for recursive sitemap indexes (default: ${DEFAULT_MAX_SITEMAPS})
  --max-urls <n>        Safety limit for discovered page URLs (default: ${DEFAULT_MAX_URLS})
  --force               Replace output files when they already exist
  --help                Show this message
`;
}

function positiveInteger(value, flag) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isSafeInteger(parsed) || parsed < 1) {
    throw new Error(`${flag} must be a positive integer`);
  }
  return parsed;
}

export function parseArgs(argv) {
  const options = {
    site: undefined,
    sitemap: undefined,
    urlMap: undefined,
    routeGroups: undefined,
    minGroup: 2,
    maxSitemaps: DEFAULT_MAX_SITEMAPS,
    maxUrls: DEFAULT_MAX_URLS,
    force: false,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--force") options.force = true;
    else if (arg === "--help") options.help = true;
    else if (arg === "--site") options.site = argv[++index];
    else if (arg === "--sitemap") options.sitemap = argv[++index];
    else if (arg === "--url-map") options.urlMap = argv[++index];
    else if (arg === "--route-groups") options.routeGroups = argv[++index];
    else if (arg === "--min-group") {
      options.minGroup = positiveInteger(argv[++index], arg);
    } else if (arg === "--max-sitemaps") {
      options.maxSitemaps = positiveInteger(argv[++index], arg);
    } else if (arg === "--max-urls") {
      options.maxUrls = positiveInteger(argv[++index], arg);
    } else {
      throw new Error(`Unknown or incomplete option: ${arg ?? "(missing)"}`);
    }
  }

  if (options.help) return options;
  if (!options.site && !options.sitemap) {
    throw new Error("Provide --site or --sitemap");
  }
  if (!options.urlMap || !options.routeGroups) {
    throw new Error("Provide both --url-map and --route-groups");
  }

  if (options.site) options.site = new URL(options.site).origin;
  if (options.sitemap) options.sitemap = new URL(options.sitemap).toString();
  return options;
}

function decodeXml(value) {
  return value
    .replace(/^<!\[CDATA\[([\s\S]*)\]\]>$/, "$1")
    .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    )
    .replace(/&#(\d+);/g, (_, code) =>
      String.fromCodePoint(Number.parseInt(code, 10)),
    )
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .trim();
}

export function extractLocs(xml) {
  return [...xml.matchAll(/<loc(?:\s[^>]*)?>([\s\S]*?)<\/loc>/gi)]
    .map((match) => decodeXml(match[1]))
    .filter(Boolean);
}

function normalizeHttpUrl(value, base) {
  const url = new URL(value, base);
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`Unsupported URL protocol: ${value}`);
  }
  url.hash = "";
  return url.toString();
}

export function decodeSitemapBody(value) {
  const body = Buffer.isBuffer(value) ? value : Buffer.from(value);
  const isGzip = body[0] === 0x1f && body[1] === 0x8b;
  return (isGzip ? gunzipSync(body) : body).toString("utf8");
}

async function defaultFetchText(url) {
  const response = await fetch(url, {
    redirect: "follow",
    headers: {
      accept: "application/xml,text/xml,text/plain;q=0.9,*/*;q=0.8",
      "user-agent": "launch-template-site-inventory/1.0",
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: HTTP ${response.status}`);
  }
  return decodeSitemapBody(Buffer.from(await response.arrayBuffer()));
}

export async function discoverSitemaps(site, fetchText = defaultFetchText) {
  const robotsUrl = new URL("/robots.txt", site).toString();
  try {
    const robots = await fetchText(robotsUrl);
    const declared = [...robots.matchAll(/^\s*sitemap:\s*(\S+)\s*$/gim)].map(
      (match) => normalizeHttpUrl(match[1], site),
    );
    if (declared.length > 0) return [...new Set(declared)];
  } catch {
    // Fall through to the conventional sitemap location.
  }
  return [new URL("/sitemap.xml", site).toString()];
}

function plainTextUrls(value) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^https?:\/\//i.test(line));
}

export async function crawlSitemaps(
  initialSitemaps,
  {
    fetchText = defaultFetchText,
    maxSitemaps = DEFAULT_MAX_SITEMAPS,
    maxUrls = DEFAULT_MAX_URLS,
  } = {},
) {
  const queue = initialSitemaps.map((value) => normalizeHttpUrl(value));
  const queued = new Set(queue);
  const visitedSitemaps = [];
  const pageUrls = new Set();

  while (queue.length > 0) {
    if (visitedSitemaps.length >= maxSitemaps) {
      throw new Error(`Sitemap count exceeded --max-sitemaps ${maxSitemaps}`);
    }

    const sitemapUrl = queue.shift();
    const body = await fetchText(sitemapUrl);
    visitedSitemaps.push(sitemapUrl);

    const locs = extractLocs(body);
    const isIndex = /<sitemapindex\b/i.test(body);
    const isUrlSet = /<urlset\b/i.test(body);
    const values = locs.length > 0 ? locs : plainTextUrls(body);

    if (isIndex) {
      for (const value of values) {
        const child = normalizeHttpUrl(value, sitemapUrl);
        if (!queued.has(child)) {
          queued.add(child);
          queue.push(child);
        }
      }
      continue;
    }

    if (
      !isUrlSet &&
      locs.length > 0 &&
      values.every((url) => /\.xml(?:\.gz)?(?:\?|$)/i.test(url))
    ) {
      for (const value of values) {
        const child = normalizeHttpUrl(value, sitemapUrl);
        if (!queued.has(child)) {
          queued.add(child);
          queue.push(child);
        }
      }
      continue;
    }

    for (const value of values) {
      pageUrls.add(normalizeHttpUrl(value, sitemapUrl));
      if (pageUrls.size > maxUrls) {
        throw new Error(`URL count exceeded --max-urls ${maxUrls}`);
      }
    }
  }

  return {
    sitemapUrls: visitedSitemaps,
    pageUrls: [...pageUrls].sort((left, right) => left.localeCompare(right)),
  };
}

function routePath(value) {
  const url = new URL(value);
  const pathname =
    url.pathname === "/" ? "/" : url.pathname.replace(/\/+$/, "");
  return `${pathname}${url.search}`;
}

export function groupRouteFamilies(urls, minGroup = 2) {
  const siblings = new Map();

  for (const value of urls) {
    const url = new URL(value);
    const segments = url.pathname.split("/").filter(Boolean);
    if (segments.length < 2) continue;
    const parent = `/${segments.slice(0, -1).join("/")}`;
    const key = `${url.origin}\n${parent}`;
    const members = siblings.get(key) ?? [];
    members.push(value);
    siblings.set(key, members);
  }

  const families = [...siblings.entries()]
    .filter(([, members]) => members.length >= minGroup)
    .map(([key, members]) => {
      const [origin, parent] = key.split("\n");
      return {
        origin,
        pattern: `${parent}/*`,
        urls: members.sort((left, right) => left.localeCompare(right)),
      };
    })
    .sort(
      (left, right) =>
        left.origin.localeCompare(right.origin) ||
        left.pattern.localeCompare(right.pattern),
    );

  const grouped = new Set(families.flatMap((family) => family.urls));
  const standalone = urls
    .filter((url) => !grouped.has(url))
    .sort((left, right) => left.localeCompare(right));

  return { families, standalone };
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function renderUrlMap(urls) {
  const rows = [
    [
      "old_url",
      "source",
      "priority",
      "disposition",
      "new_url",
      "implementation_status",
      "verification_status",
      "notes",
    ],
    ...urls.map((url) => [
      url,
      "sitemap",
      "",
      "",
      "",
      "pending",
      "pending",
      "",
    ]),
  ];
  return `${rows.map((row) => row.map(csvCell).join(",")).join("\n")}\n`;
}

export function renderRouteGroups({ source, sitemapUrls, pageUrls, minGroup }) {
  const { families, standalone } = groupRouteFamilies(pageUrls, minGroup);
  const lines = [
    "# Source route inventory",
    "",
    `- Source: ${source}`,
    `- Sitemaps read: ${sitemapUrls.length}`,
    `- Exact URLs: ${pageUrls.length}`,
    "",
    "Wildcards below are page-archetype candidates. Keep every exact URL in `docs/launch/url-map.csv`.",
    "",
    "## Route families",
    "",
  ];

  if (families.length === 0) lines.push("No repeated route families detected.");
  else {
    lines.push(
      "| Origin | Pattern | URLs | Representative paths |",
      "| --- | --- | ---: | --- |",
    );
    for (const family of families) {
      const samples = family.urls
        .slice(0, 3)
        .map(routePath)
        .join("<br>")
        .replaceAll("|", "\\|");
      lines.push(
        `| ${family.origin} | \`${family.pattern}\` | ${family.urls.length} | ${samples} |`,
      );
    }
  }

  lines.push("", "## Standalone routes", "");
  if (standalone.length === 0) lines.push("None.");
  else lines.push(...standalone.map((url) => `- ${routePath(url)}`));

  lines.push(
    "",
    "## Review",
    "",
    "Visit every standalone route and representative members of every family. Split a wildcard when its members use materially different layouts, content models, or behavior.",
    "",
  );
  return lines.join("\n");
}

async function ensureWritable(file, force) {
  try {
    await access(file);
    if (!force) throw new Error(`${file} exists; pass --force to replace it`);
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    )
      return;
    throw error;
  }
}

async function writeOutput(file, content) {
  await mkdir(path.dirname(path.resolve(file)), { recursive: true });
  await writeFile(file, content);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(usage());
    return;
  }

  const initialSitemaps = options.sitemap
    ? [options.sitemap]
    : await discoverSitemaps(options.site);
  const inventory = await crawlSitemaps(initialSitemaps, options);
  if (inventory.pageUrls.length === 0) {
    throw new Error("No page URLs found in the supplied sitemap surface");
  }

  if (path.resolve(options.urlMap) === path.resolve(options.routeGroups)) {
    throw new Error("--url-map and --route-groups must be different files");
  }

  await Promise.all([
    ensureWritable(options.urlMap, options.force),
    ensureWritable(options.routeGroups, options.force),
  ]);

  await writeOutput(options.urlMap, renderUrlMap(inventory.pageUrls));
  await writeOutput(
    options.routeGroups,
    renderRouteGroups({
      source: options.site ?? options.sitemap,
      ...inventory,
      minGroup: options.minGroup,
    }),
  );

  const { families } = groupRouteFamilies(inventory.pageUrls, options.minGroup);
  console.log(
    `Inventoried ${inventory.pageUrls.length} exact URL(s) from ${inventory.sitemapUrls.length} sitemap(s); found ${families.length} route family candidate(s).`,
  );
  console.log(`URL map: ${options.urlMap}`);
  console.log(`Route groups: ${options.routeGroups}`);
}

const isDirectRun =
  process.argv[1] &&
  path.resolve(process.argv[1]) ===
    path.resolve(fileURLToPath(import.meta.url));

if (isDirectRun) {
  void main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
