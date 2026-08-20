import { describe, expect, it } from "vitest";

import { paginationItems } from "./blog-pagination";

describe("blog pagination", () => {
  it("shows the beginning and final page", () => {
    expect(paginationItems(1, 40)).toEqual([1, 2, 3, 4, "gap", 40]);
  });

  it("uses a window around the current page", () => {
    expect(paginationItems(20, 40)).toEqual([
      1,
      "gap",
      18,
      19,
      20,
      21,
      22,
      "gap",
      40,
    ]);
  });

  it("shows the final window without duplicate pages", () => {
    expect(paginationItems(40, 40)).toEqual([1, "gap", 37, 38, 39, 40]);
  });

  it("omits pagination for one page", () => {
    expect(paginationItems(1, 1)).toEqual([]);
  });
});
