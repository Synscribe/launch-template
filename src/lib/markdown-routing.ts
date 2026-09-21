export const MARKDOWN_SOURCE_HEADER = "x-agent-markdown-source";
export const MARKDOWN_BYPASS_HEADER = "x-agent-markdown-bypass";
export const MARKDOWN_ROUTE = "/api/agent-markdown";
export const MARKDOWN_CACHE_KEY_PARAM = "_agent_source";
export const MARKDOWN_EXPLICIT_PARAM = "_agent_explicit";

export function sourcePathnameFromMarkdownAlias(
  pathname: string,
): string | undefined {
  if (!pathname.endsWith(".md")) return undefined;

  const sourcePathname = pathname.slice(0, -3) || "/";
  return sourcePathname === "/index" ? "/" : sourcePathname;
}

export function markdownAliasPathname(pathname: string): string {
  if (pathname.endsWith(".md")) return pathname;
  if (/\.[^/]+$/.test(pathname)) return pathname;
  if (pathname === "/") return "/index.md";

  return `${pathname.replace(/\/+$/, "")}.md`;
}
