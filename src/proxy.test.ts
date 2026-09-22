import {
  getRewrittenUrl,
  isRewrite,
  unstable_doesMiddlewareMatch,
} from "next/experimental/testing/server";
import { NextRequest, type NextResponse } from "next/server";
import { describe, expect, it } from "vitest";

import {
  MARKDOWN_CACHE_KEY_PARAM,
  MARKDOWN_EXPLICIT_PARAM,
  MARKDOWN_ROUTE,
  MARKDOWN_SOURCE_HEADER,
} from "@/lib/markdown-routing";

import { config, proxy } from "./proxy";

describe("Markdown negotiation proxy", () => {
  it("runs for documents but skips internal and static resources", () => {
    expect(
      unstable_doesMiddlewareMatch({
        config,
        nextConfig: {},
        url: "/uses/example",
      }),
    ).toBe(true);
    expect(
      unstable_doesMiddlewareMatch({
        config,
        nextConfig: {},
        url: "/api/contact",
      }),
    ).toBe(false);
    expect(
      unstable_doesMiddlewareMatch({
        config,
        nextConfig: {},
        url: "/uses.md",
      }),
    ).toBe(true);
    expect(
      unstable_doesMiddlewareMatch({
        config,
        nextConfig: {},
        url: "/guide.pdf",
      }),
    ).toBe(false);
    expect(
      unstable_doesMiddlewareMatch({
        config,
        nextConfig: {},
        url: "/icon.svg",
      }),
    ).toBe(false);
    expect(
      unstable_doesMiddlewareMatch({
        config,
        nextConfig: {},
        url: "/_vercel/speed-insights/vitals",
      }),
    ).toBe(false);
  });

  it("rewrites a Markdown request while preserving its public path", () => {
    const request = new NextRequest(
      "https://example.com/uses/example?ref=agent",
      {
        headers: {
          Accept: "text/markdown",
          "x-agent-markdown-explicit": "1",
        },
      },
    );
    const response = proxy(request);

    expect(isRewrite(response as NextResponse)).toBe(true);
    const rewrittenUrl = getRewrittenUrl(response as NextResponse);
    expect(rewrittenUrl).not.toBeNull();
    const rewritten = new URL(rewrittenUrl!);
    expect(rewritten.pathname).toBe(MARKDOWN_ROUTE);
    expect(rewritten.searchParams.get(MARKDOWN_CACHE_KEY_PARAM)).toBe(
      "/uses/example?ref=agent",
    );
    expect(rewritten.searchParams.has(MARKDOWN_EXPLICIT_PARAM)).toBe(false);
    expect(
      response.headers.get("x-middleware-request-x-agent-markdown-explicit"),
    ).toBeNull();
    expect(response.headers.get("vary")).toContain("Accept");
    expect(
      response.headers.get("x-middleware-request-x-agent-markdown-source"),
    ).toBe("/uses/example?ref=agent");
  });

  it("serves an explicit .md alias regardless of the Accept header", () => {
    const request = new NextRequest(
      "https://example.com/uses/example.md?ref=agent",
      { headers: { Accept: "text/html" } },
    );
    const response = proxy(request);

    expect(isRewrite(response as NextResponse)).toBe(true);
    const rewrittenUrl = getRewrittenUrl(response as NextResponse);
    expect(rewrittenUrl).not.toBeNull();
    const rewritten = new URL(rewrittenUrl!);
    expect(rewritten.pathname).toBe(MARKDOWN_ROUTE);
    expect(rewritten.searchParams.get(MARKDOWN_CACHE_KEY_PARAM)).toBe(
      "/uses/example?ref=agent",
    );
    expect(rewritten.searchParams.get(MARKDOWN_EXPLICIT_PARAM)).toBe("1");
    expect(
      response.headers.get("x-middleware-request-x-agent-markdown-explicit"),
    ).toBe("1");
    expect(
      response.headers.get("x-middleware-request-x-agent-markdown-source"),
    ).toBe("/uses/example?ref=agent");
  });

  it("keeps HTML requests on the existing route and varies by Accept", () => {
    const response = proxy(
      new NextRequest("https://example.com/", {
        headers: { Accept: "text/html" },
      }),
    );

    expect(isRewrite(response as NextResponse)).toBe(false);
    expect(response.headers.get("vary")).toBe("Accept");
  });

  it("returns 406 when neither document representation is acceptable", async () => {
    const response = proxy(
      new NextRequest("https://example.com/", {
        headers: { Accept: "application/pdf" },
      }),
    );

    expect(response.status).toBe(406);
    expect(response.headers.get("vary")).toBe("Accept");
    await expect(response.text()).resolves.toContain("text/markdown");
  });

  it("uses the shared source header name", () => {
    expect(MARKDOWN_SOURCE_HEADER).toBe("x-agent-markdown-source");
  });
});
