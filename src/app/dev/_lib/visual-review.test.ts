import { describe, expect, it } from "vitest";

import { isVisualReviewEnabled } from "./visual-review";

describe("visual review access", () => {
  it("opens the workspace only for an explicit true value", () => {
    expect(isVisualReviewEnabled("true")).toBe(true);
    expect(isVisualReviewEnabled(undefined)).toBe(false);
    expect(isVisualReviewEnabled("false")).toBe(false);
    expect(isVisualReviewEnabled("TRUE")).toBe(false);
    expect(isVisualReviewEnabled("1")).toBe(false);
  });
});
