import { describe, expect, it } from "vitest";

import {
  BLOG_FEATURED,
  BLOG_FILTERS,
  getBlogFilter,
  labelForBlogTags,
} from "./blog.config";

describe("blog index configuration", () => {
  it("keeps optional filter URL values and tags unique", () => {
    expect(new Set(BLOG_FILTERS.map((filter) => filter.value)).size).toBe(
      BLOG_FILTERS.length,
    );
    expect(new Set(BLOG_FILTERS.map((filter) => filter.tag)).size).toBe(
      BLOG_FILTERS.length,
    );
  });

  it("maps configured values and tags to their public label", () => {
    expect(getBlogFilter("press-release")?.tag).toBe("press-release");
    expect(labelForBlogTags([{ name: "press-release" }])).toBe("Press Release");
  });

  it("uses real unconfigured tag names and omits missing tags", () => {
    expect(labelForBlogTags([{ name: "featured" }])).toBe("Featured");
    expect(labelForBlogTags([])).toBeNull();
  });

  it("keeps optional featured settings explicit", () => {
    expect(BLOG_FEATURED.limit).toBeGreaterThan(0);
    expect(BLOG_FEATURED.tag).toBe("featured");
  });
});
