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

  return turndown
    .turndown(extractMainHtml(html))
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
