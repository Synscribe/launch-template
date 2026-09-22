import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  appendVary,
  negotiateDocumentRepresentation,
} from "@/lib/content-negotiation";
import {
  MARKDOWN_BYPASS_HEADER,
  MARKDOWN_CACHE_KEY_PARAM,
  MARKDOWN_EXPLICIT_HEADER,
  MARKDOWN_EXPLICIT_PARAM,
  MARKDOWN_ROUTE,
  MARKDOWN_SOURCE_HEADER,
  sourcePathnameFromMarkdownAlias,
} from "@/lib/markdown-routing";

function nextHtmlResponse(): NextResponse {
  const response = NextResponse.next();
  appendVary(response.headers, "Accept");
  return response;
}

function rewriteMarkdownResponse(
  request: NextRequest,
  sourcePath: string,
  explicit: boolean,
): NextResponse {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(MARKDOWN_SOURCE_HEADER, sourcePath);
  // Route handlers see the public URL, not the rewrite, so the alias flag
  // travels as a header. The query parameter only separates cache entries.
  if (explicit) requestHeaders.set(MARKDOWN_EXPLICIT_HEADER, "1");
  else requestHeaders.delete(MARKDOWN_EXPLICIT_HEADER);

  const destination = new URL(MARKDOWN_ROUTE, request.url);
  destination.searchParams.set(MARKDOWN_CACHE_KEY_PARAM, sourcePath);
  if (explicit) destination.searchParams.set(MARKDOWN_EXPLICIT_PARAM, "1");

  const response = NextResponse.rewrite(destination, {
    request: { headers: requestHeaders },
  });
  appendVary(response.headers, "Accept");
  return response;
}

export function proxy(request: NextRequest): Response {
  if (
    !["GET", "HEAD"].includes(request.method) ||
    request.headers.get(MARKDOWN_BYPASS_HEADER) === "1"
  ) {
    return NextResponse.next();
  }

  const explicitSourcePathname = sourcePathnameFromMarkdownAlias(
    request.nextUrl.pathname,
  );
  if (explicitSourcePathname !== undefined) {
    return rewriteMarkdownResponse(
      request,
      `${explicitSourcePathname}${request.nextUrl.search}`,
      true,
    );
  }

  const representation = negotiateDocumentRepresentation(
    request.headers.get("accept"),
  );
  if (representation === "html") return nextHtmlResponse();

  if (representation === null) {
    return new Response(
      request.method === "HEAD"
        ? null
        : "Not Acceptable\n\nAvailable: text/html, text/markdown\n",
      {
        status: 406,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          Vary: "Accept",
        },
      },
    );
  }

  const sourcePath = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  return rewriteMarkdownResponse(request, sourcePath, false);
}

export const config = {
  matcher: [
    "/((?!api/|_next/|_vercel/|favicon.ico|icon.svg|opengraph-image|robots.txt|sitemap.xml|feed.xml|llms.txt|.*\\.(?!md$)[^/]+$).*)",
  ],
};
