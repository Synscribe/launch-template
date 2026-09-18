import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  MARKDOWN_BYPASS_HEADER,
  MARKDOWN_SOURCE_HEADER,
} from "@/lib/markdown-routing";

import { GET, HEAD } from "./route";

describe("Markdown representation route", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("converts the rendered page and preserves its status", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        "<!doctype html><html><body><main><h1>Rendered once</h1><p>Shared copy.</p></main></body></html>",
        {
          status: 200,
          headers: {
            "Cache-Control": "public, max-age=60",
            "Content-Type": "text/html; charset=utf-8",
          },
        },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const response = await GET(
      new NextRequest("https://example.com/api/agent-markdown", {
        headers: { [MARKDOWN_SOURCE_HEADER]: "/" },
      }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe(
      "text/markdown; charset=utf-8",
    );
    expect(response.headers.get("vary")).toBe("Accept");
    expect(response.headers.get("cache-control")).toBe("public, max-age=60");
    await expect(response.text()).resolves.toContain("# Rendered once");

    const [, options] = fetchMock.mock.calls[0];
    const headers = options.headers as Headers;
    expect(headers.get("accept")).toBe("text/html");
    expect(headers.get(MARKDOWN_BYPASS_HEADER)).toBe("1");
  });

  it("keeps a source 404 while returning a Markdown body", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          '<!doctype html><html><body><main><h1>Page not found</h1><p>Choose another page.</p><a href="/sitemap.xml">Sitemap</a></main></body></html>',
          {
            status: 404,
            headers: { "Content-Type": "text/html; charset=utf-8" },
          },
        ),
      ),
    );

    const response = await GET(
      new NextRequest("https://example.com/api/agent-markdown", {
        headers: { [MARKDOWN_SOURCE_HEADER]: "/missing" },
      }),
    );

    expect(response.status).toBe(404);
    expect(await response.text()).toContain("[Sitemap](/sitemap.xml)");
  });

  it("supports bodyless HEAD negotiation", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(null, {
          status: 200,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }),
      ),
    );

    const response = await HEAD(
      new NextRequest("https://example.com/api/agent-markdown", {
        method: "HEAD",
        headers: { [MARKDOWN_SOURCE_HEADER]: "/" },
      }),
    );

    expect(response.status).toBe(200);
    expect(response.body).toBeNull();
    expect(response.headers.get("content-type")).toBe(
      "text/markdown; charset=utf-8",
    );
  });

  it("does not expose the internal route without a source path", async () => {
    const response = await GET(
      new NextRequest("https://example.com/api/agent-markdown"),
    );

    expect(response.status).toBe(404);
  });
});
