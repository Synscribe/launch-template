import { readFile } from "node:fs/promises";
import path from "node:path";

import TurndownService from "turndown";

export const MARKDOWN_OVERRIDE_ROOT = path.join(
  process.cwd(),
  "src/content/markdown",
);

function decodedSegments(pathname: string): string[] {
  let decoded: string;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    throw new Error(`Invalid encoded pathname: ${pathname}`);
  }

  if (!decoded.startsWith("/") || decoded.includes("\0")) {
    throw new Error(`Invalid pathname: ${pathname}`);
  }

  const segments = decoded.split("/").filter(Boolean);
  if (segments.some((segment) => segment === "." || segment === "..")) {
    throw new Error(`Unsafe pathname: ${pathname}`);
  }
  return segments;
}

export function markdownOverridePath(
  pathname: string,
  root = MARKDOWN_OVERRIDE_ROOT,
): string {
  const segments = decodedSegments(pathname);
  const relativePath =
    segments.length === 0 ? "index.md" : `${segments.join("/")}.md`;
  const resolvedRoot = path.resolve(root);
  const resolvedPath = path.resolve(resolvedRoot, relativePath);

  if (
    resolvedPath !== resolvedRoot &&
    !resolvedPath.startsWith(`${resolvedRoot}${path.sep}`)
  ) {
    throw new Error(`Unsafe Markdown override path: ${pathname}`);
  }
  return resolvedPath;
}

export async function readMarkdownOverride(
  pathname: string,
  root = MARKDOWN_OVERRIDE_ROOT,
): Promise<string | undefined> {
  try {
    const content = await readFile(
      markdownOverridePath(pathname, root),
      "utf8",
    );
    if (!content.trim()) {
      throw new Error(`Markdown override for ${pathname} is empty`);
    }
    return content.trimEnd();
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT" || code === "ENOTDIR") return undefined;
    throw error;
  }
}

export function extractMainHtml(html: string): string {
  return (
    html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ??
    html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] ??
    html
  );
}

function markdownLinkDestination(destination: string): string {
  const escaped = destination.replace(/([<>()])/g, "\\$1");
  return escaped.includes(" ") ? `<${escaped}>` : escaped;
}

function markdownLinkTitle(title: string | null): string {
  const cleaned = title?.replace(/(\n+\s*)+/g, "\n") ?? "";
  return cleaned ? ` "${cleaned.replace(/"/g, '\\"')}"` : "";
}

function originalImageSource(source: string): string {
  try {
    const url = new URL(source, "https://markdown.invalid");
    if (url.pathname !== "/_next/image") return source;
    return url.searchParams.get("url") || source;
  } catch {
    return source;
  }
}

function headingLink(content: string, node: HTMLElement): string | undefined {
  const heading = node.querySelector("h1, h2, h3, h4, h5, h6");
  const href = node.getAttribute("href");
  if (!heading || !href) return undefined;

  const level = Number(heading.tagName.slice(1));
  const headingPattern = new RegExp(`(^|\\n)(#{${level}}[ \\t]+)([^\\n]+)`);
  const title = markdownLinkTitle(node.getAttribute("title"));
  const destination = markdownLinkDestination(href);

  const normalized = content.replace(
    headingPattern,
    (_match, boundary: string, prefix: string, headingContent: string) =>
      `${boundary}${prefix}[${headingContent.trim()}](${destination}${title})`,
  );
  return normalized === content ? undefined : normalized;
}

export function htmlToMarkdown(html: string): string {
  const turndown = new TurndownService({
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
    emDelimiter: "_",
    headingStyle: "atx",
    strongDelimiter: "**",
  });

  turndown.remove(["script", "style", "template", "noscript"]);
  turndown.addRule("remove-svg", {
    filter: (node) => node.nodeName.toLowerCase() === "svg",
    replacement: () => "",
  });
  turndown.addRule("readable-image", {
    filter: "img",
    replacement: (_content, node) => {
      const alt = node.getAttribute("alt")?.trim() ?? "";
      if (!alt) return "";

      const source = originalImageSource(node.getAttribute("src") ?? "");
      if (!source) return "";

      return `![${turndown.escape(alt)}](${markdownLinkDestination(source)}${markdownLinkTitle(node.getAttribute("title"))})`;
    },
  });
  turndown.addRule("linked-card", {
    filter: (node) =>
      node.nodeName === "A" &&
      Boolean(node.getAttribute("href")) &&
      Boolean(node.querySelector("h1, h2, h3, h4, h5, h6")),
    replacement: (content, node) => {
      const normalized = headingLink(content, node);
      return normalized ? `\n\n${normalized.trim()}\n\n` : content;
    },
  });
  turndown.addRule("remove-aria-hidden", {
    filter: (node) => node.getAttribute("aria-hidden") === "true",
    replacement: () => "",
  });

  return turndown
    .turndown(extractMainHtml(html))
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
