export type BlogFilter = {
  label: string;
  value: string;
  tag: string;
};

// Optional filters map a stable URL value to a real Wisp tag. Remove an entry
// when the publication does not use it; "All" is added by the page itself.
export const BLOG_FILTERS: readonly BlogFilter[] = [];

// The hero is pinned by slug. The smaller cards are selected by a Wisp tag.
// Either value can be null when a project does not want that surface.
export const BLOG_FEATURED = {
  heroSlug: null,
  tag: null,
  limit: 3,
} satisfies {
  heroSlug: string | null;
  tag: string | null;
  limit: number;
};

export function getBlogFilter(value: string): BlogFilter | undefined {
  return BLOG_FILTERS.find((filter) => filter.value === value);
}

export function labelForBlogTags(
  tags: ReadonlyArray<{ name: string }>,
): string | null {
  const tag = tags[0]?.name;
  if (!tag) return null;

  return (
    BLOG_FILTERS.find((filter) => filter.tag === tag)?.label ??
    tag
      .split("-")
      .filter(Boolean)
      .map((word) => `${word[0]?.toUpperCase() ?? ""}${word.slice(1)}`)
      .join(" ")
  );
}
