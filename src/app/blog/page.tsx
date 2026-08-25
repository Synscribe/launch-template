import { SearchIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { getBlogPost, getBlogPosts, isWispConfigured } from "@/lib/blog";
import { createPageMetadata } from "@/lib/seo";

import { BlogPagination } from "./_components/blog-pagination";
import { FeaturedPost } from "./_components/featured-post";
import { PostCard } from "./_components/post-card";
import {
  BLOG_FEATURED,
  BLOG_FILTERS,
  getBlogFilter,
  labelForBlogTags,
} from "./blog.config";
import styles from "./blog.module.css";

type BlogPageProps = {
  searchParams: Promise<{
    category?: string | string[];
    page?: string | string[];
    query?: string | string[];
  }>;
};

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Blog",
    description:
      "Read practical articles from the publication connected to this website.",
    path: "/blog",
  }),
  alternates: {
    canonical: "/blog",
    types: { "application/rss+xml": "/feed.xml" },
  },
};

function firstValue(value?: string | string[]): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

function filterHref(category: string, query: string): string {
  const params = new URLSearchParams();
  if (category !== "all") params.set("category", category);
  if (query) params.set("query", query);
  const suffix = params.toString();
  return suffix ? `/blog?${suffix}` : "/blog";
}

async function BlogResults({ searchParams }: BlogPageProps) {
  const rawParams = await searchParams;
  const requestedPage = Number.parseInt(firstValue(rawParams.page), 10);
  const page =
    Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const query = firstValue(rawParams.query).trim().slice(0, 120);
  const selectedFilter = getBlogFilter(firstValue(rawParams.category));
  const category = selectedFilter?.value ?? "all";
  const tag = selectedFilter?.tag ?? null;
  const showFeatured = page === 1 && category === "all" && !query;

  if (!isWispConfigured) {
    return (
      <div className="rounded-2xl border border-ink/10 bg-paper px-6 py-10 sm:px-10">
        <h2 className="text-2xl font-semibold tracking-tight">
          Connect the publication
        </h2>
        <p className="mt-3 max-w-2xl leading-7 text-ink-muted">
          Set <code>WISP_BLOG_ID</code> to load articles from Wisp. The blog is
          included by default and can be deleted when a project does not need
          it.
        </p>
      </div>
    );
  }

  const [gridOutcome, featuredOutcome, heroOutcome] = await Promise.allSettled([
    getBlogPosts({ page, query: query || null, tag }),
    showFeatured && BLOG_FEATURED.tag
      ? getBlogPosts({
          page: 1,
          tag: BLOG_FEATURED.tag,
          limit: BLOG_FEATURED.limit,
        })
      : Promise.resolve(null),
    showFeatured && BLOG_FEATURED.heroSlug
      ? getBlogPost(BLOG_FEATURED.heroSlug)
      : Promise.resolve(null),
  ]);

  if (gridOutcome.status === "rejected") {
    return (
      <div className="rounded-2xl border border-ink/10 bg-paper px-6 py-10 sm:px-10">
        <h2 className="text-2xl font-semibold tracking-tight">
          Articles are temporarily unavailable
        </h2>
        <p className="mt-3 text-ink-muted">
          Please check back in a little while.
        </p>
      </div>
    );
  }

  const result = gridOutcome.value;
  const hero =
    heroOutcome.status === "fulfilled" ? heroOutcome.value?.post : null;
  const featuredPosts =
    featuredOutcome.status === "fulfilled"
      ? (featuredOutcome.value?.posts ?? [])
          .filter((post) => post.slug !== hero?.slug)
          .slice(0, BLOG_FEATURED.limit)
      : [];
  const pinnedSlugs = new Set([
    ...(hero ? [hero.slug] : []),
    ...featuredPosts.map((post) => post.slug),
  ]);
  const posts = showFeatured
    ? result.posts.filter((post) => !pinnedSlugs.has(post.slug))
    : result.posts;
  const clearSearchHref = filterHref(category, "");

  return (
    <>
      {showFeatured && (hero || featuredPosts.length > 0) ? (
        <section aria-label="Featured articles" className="mb-16 sm:mb-20">
          {hero ? (
            <FeaturedPost post={hero} label={labelForBlogTags(hero.tags)} />
          ) : null}

          {featuredPosts.length > 0 ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  label={labelForBlogTags(post.tags)}
                  post={post}
                />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      <div className="mb-9 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        {BLOG_FILTERS.length > 0 ? (
          <nav aria-label="Filter articles by tag">
            <ul className="flex flex-wrap gap-3">
              <li>
                <Link
                  aria-current={category === "all" ? "page" : undefined}
                  className={buttonVariants({
                    variant: category === "all" ? "default" : "outline",
                    className:
                      "h-auto rounded-full bg-paper px-4 py-2 text-sm aria-[current=page]:bg-ink aria-[current=page]:text-paper",
                  })}
                  href={filterHref("all", query)}
                >
                  All
                </Link>
              </li>
              {BLOG_FILTERS.map((filter) => (
                <li key={filter.value}>
                  <Link
                    aria-current={
                      category === filter.value ? "page" : undefined
                    }
                    className={buttonVariants({
                      variant:
                        category === filter.value ? "default" : "outline",
                      className:
                        "h-auto rounded-full bg-paper px-4 py-2 text-sm aria-[current=page]:bg-ink aria-[current=page]:text-paper",
                    })}
                    href={filterHref(filter.value, query)}
                  >
                    {filter.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : (
          <span />
        )}

        <form action="/blog" className="relative w-full sm:w-72" role="search">
          {category !== "all" ? (
            <input name="category" type="hidden" value={category} />
          ) : null}
          <label className="sr-only" htmlFor="blog-search">
            Search articles
          </label>
          <SearchIcon
            className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink-faint"
            aria-hidden="true"
          />
          <input
            className={styles.searchInput}
            defaultValue={query}
            id="blog-search"
            name="query"
            placeholder="Search articles"
            type="search"
          />
          <button className="sr-only" type="submit">
            Search
          </button>
        </form>
      </div>

      {query || category !== "all" ? (
        <div
          className="mb-7 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-ink-muted"
          aria-live="polite"
        >
          <p>
            {result.pagination.totalPosts} result
            {result.pagination.totalPosts === 1 ? "" : "s"}
            {query ? ` for “${query}”` : ""}
            {selectedFilter ? ` in ${selectedFilter.label}` : ""}
          </p>
          {query ? (
            <Link
              className="font-semibold text-signal-strong"
              href={clearSearchHref}
            >
              Clear search
            </Link>
          ) : null}
        </div>
      ) : null}

      {posts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              label={labelForBlogTags(post.tags)}
              post={post}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-ink/10 bg-paper px-6 py-10 sm:px-10">
          <h2 className="text-2xl font-semibold tracking-tight">
            No articles found
          </h2>
          <p className="mt-3 text-ink-muted">
            Try a shorter search or browse all articles.
          </p>
        </div>
      )}

      <BlogPagination
        category={category}
        currentPage={result.pagination.page}
        query={query}
        totalPages={result.pagination.totalPages}
      />
    </>
  );
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const results = await BlogResults({ searchParams });

  return (
    <main id="main-content">
      <section className={`${styles.hero} border-b border-ink/10`}>
        <div className="mx-auto w-full max-w-7xl px-5 pt-14 pb-14 sm:px-8 sm:pt-16 sm:pb-16 lg:pt-20 lg:pb-20">
          <div className="max-w-4xl">
            <p className="text-sm font-bold tracking-[0.16em] text-signal-strong uppercase">
              Blog
            </p>
            <h1 className="mt-5 max-w-3xl text-balance font-display text-[clamp(3.2rem,6vw,5.6rem)] leading-[0.95] tracking-[-0.04em]">
              Useful ideas, clearly explained.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-muted">
              The latest articles from the publication connected to this
              website.
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16 lg:py-20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">{results}</div>
      </section>
    </main>
  );
}
