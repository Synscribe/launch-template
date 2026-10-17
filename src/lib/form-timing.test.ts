import { describe, expect, it } from "vitest";

import { isHumanPaced } from "./form-timing";

describe("isHumanPaced", () => {
  it("accepts a form filled in at human speed", () => {
    expect(isHumanPaced(36_000)).toBe(true);
  });

  it("rejects instant, stale, and missing durations", () => {
    expect(isHumanPaced(300)).toBe(false);
    expect(isHumanPaced(13 * 60 * 60 * 1000)).toBe(false);
    expect(isHumanPaced(undefined)).toBe(false);
    expect(isHumanPaced("36000")).toBe(false);
    expect(isHumanPaced(Number.NaN)).toBe(false);
  });
});
