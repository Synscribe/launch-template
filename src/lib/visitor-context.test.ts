import { describe, expect, it } from "vitest";

import {
  MAX_RECENT_PAGES,
  isAttributionExpired,
  parseUtm,
  type VisitorContext,
  updateVisitorContext,
} from "./visitor-context";

const emptyContext: VisitorContext = {
  referrerUrl: null,
  referrerDomain: null,
  firstVisitUrl: null,
  firstVisitAt: null,
  firstUtm: null,
  recentPages: [],
};

describe("visitor context", () => {
  it("keeps first-touch UTMs while dropping unrelated query values", () => {
    const context = updateVisitorContext(emptyContext, {
      pageUrl:
        "https://example.com/uses/startup-launches?utm_source=linkedin&utm_campaign=launch&token=secret",
      referrerUrl:
        "https://private:secret@www.linkedin.com/feed/?tracking=private",
      visitedAt: new Date("2026-08-20T10:00:00.000Z"),
    });

    expect(context.firstVisitUrl).toBe(
      "https://example.com/uses/startup-launches?utm_source=linkedin&utm_campaign=launch",
    );
    expect(context.firstUtm).toMatchObject({
      source: "linkedin",
      campaign: "launch",
    });
    expect(context.referrerUrl).toBe("https://www.linkedin.com/feed/");
    expect(context.recentPages).toEqual([
      "https://example.com/uses/startup-launches",
    ]);
  });

  it("ignores same-site referrers and bounds the recent journey", () => {
    let context = updateVisitorContext(emptyContext, {
      pageUrl: "https://example.com/one",
      referrerUrl: "https://example.com/home",
    });

    for (let page = 2; page <= 8; page += 1) {
      context = updateVisitorContext(context, {
        pageUrl: `https://example.com/${page}?private=value`,
      });
    }

    expect(context.referrerUrl).toBeNull();
    expect(context.recentPages).toHaveLength(MAX_RECENT_PAGES);
    expect(context.recentPages[0]).toBe("https://example.com/4");
    expect(context.recentPages.at(-1)).toBe("https://example.com/8");
  });

  it("returns null when no UTM value exists", () => {
    expect(parseUtm("https://example.com/?query=website")).toBeNull();
  });

  it("expires stored attribution after 90 days", () => {
    expect(
      isAttributionExpired(
        "2026-01-01T00:00:00.000Z",
        new Date("2026-04-02T00:00:01.000Z"),
      ),
    ).toBe(true);
    expect(
      isAttributionExpired(
        "2026-01-01T00:00:00.000Z",
        new Date("2026-03-01T00:00:00.000Z"),
      ),
    ).toBe(false);
  });
});
