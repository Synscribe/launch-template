import type { NextRequest } from "next/server";

import { appendVary } from "@/lib/content-negotiation";
import {
  htmlToMarkdown,
  readMarkdownOverride,
} from "@/lib/markdown-representation";
import {
  MARKDOWN_BYPASS_HEADER,
  MARKDOWN_SOURCE_HEADER,
} from "@/lib/markdown-routing";

export const dynamic = "force-dynamic";

function sourceRequestHeaders(request: NextRequest): Headers {
  const headers = new Headers({
    Accept: "text/html",
    [MARKDOWN_BYPASS_HEADER]: "1",
  });

  for (const name of [
    "accept-language",
    "authorization",
    "cookie",
    "user-agent",
  ]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  return headers;
}

function responseHeaders(source: Response): Headers {
  const headers = new Headers({
    "Content-Type": "text/markdown; charset=utf-8",
  });
  appendVary(headers, "Accept");

  for (const name of ["cache-control", "content-language", "link"]) {
    const value = source.headers.get(name);
    if (value) headers.set(name, value);
  }
  return headers;
}

async function markdownResponse(
  request: NextRequest,
  includeBody: boolean,
): Promise<Response> {
  const sourcePath = request.headers.get(MARKDOWN_SOURCE_HEADER);
  if (!sourcePath?.startsWith("/")) {
    return new Response(includeBody ? "Not found\n" : null, {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const sourceUrl = new URL(sourcePath, request.nextUrl.origin);
  if (sourceUrl.origin !== request.nextUrl.origin) {
    return new Response(includeBody ? "Invalid source path\n" : null, {
      status: 400,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const source = await fetch(sourceUrl, {
    method: includeBody ? "GET" : "HEAD",
    headers: sourceRequestHeaders(request),
    redirect: "manual",
  });

  if (source.status >= 300 && source.status < 400) {
    const location = source.headers.get("location");
    return new Response(null, {
      status: source.status,
      headers: location ? { Location: location, Vary: "Accept" } : undefined,
    });
  }

  const contentType = source.headers.get("content-type") ?? "";
  if (!/^text\/html(?:;|$)/i.test(contentType)) {
    return new Response(includeBody ? "Not Acceptable\n" : null, {
      status: 406,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        Vary: "Accept",
      },
    });
  }

  let body: string | null = null;
  if (includeBody) {
    body =
      (await readMarkdownOverride(sourceUrl.pathname)) ??
      htmlToMarkdown(await source.text());
    if (!body) body = "# No readable content\n";
  }

  return new Response(body, {
    status: source.status,
    headers: responseHeaders(source),
  });
}

export function GET(request: NextRequest): Promise<Response> {
  return markdownResponse(request, true);
}

export function HEAD(request: NextRequest): Promise<Response> {
  return markdownResponse(request, false);
}
