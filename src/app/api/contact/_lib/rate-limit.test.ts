import { beforeEach, describe, expect, it } from "vitest";

import {
  checkContactRateLimit,
  resetContactRateLimitForTests,
} from "./rate-limit";

describe("contact rate limit", () => {
  beforeEach(resetContactRateLimitForTests);

  it("allows five submissions in one window", () => {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      expect(checkContactRateLimit("visitor", 1_000)).toEqual({ ok: true });
    }

    expect(checkContactRateLimit("visitor", 1_000)).toMatchObject({
      ok: false,
      retryAfterSeconds: 600,
    });
  });

  it("starts a new window after ten minutes", () => {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      checkContactRateLimit("visitor", 1_000);
    }

    expect(checkContactRateLimit("visitor", 601_000)).toEqual({ ok: true });
  });
});
