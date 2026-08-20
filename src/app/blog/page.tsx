import { SearchIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { BLOG_PAGE_SIZE, getBlogPosts, isWispConfigured } from "@/lib/blog";
import { createPageMetadata } from "@/lib/seo";

import { PostCard } from "./_components/post-card";
import styles from "./blog.module.css";

type BlogPageProps = {
  searchParams: Promise<{
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

function pageHref(page: number, query: string): string {
  const params = new URLSearchParams();
  if (query) params.set("query", query);
  if (page > 1) params.set("page", String(page));
  const suffix = params.toString();
  return suffix ? `/blog?${suffix}` : "/blog";
}

async function BlogResults({ searchParams }: BlogPageProps) {
  const rawParams = await searchParams;
  const requestedPage = Number.parseInt(firstValue(rawParams.page), 10);
  const page =
    Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const query = firstValue(rawParams.query).trim().slice(0, 120);

  let result;
  let unavailable = false;

  try {
    result = await getBlogPosts({ page, query: query || null });
  } catch {
    unavailable = true;
    result = {
      posts: [],
      pagination: {
        page,
        limit: BLOG_PAGE_SIZE,
        totalPages: 0,
        totalPosts: 0,
        nextPage: null,
        prevPage: null,
      },
    };
  }

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

  if (unavailable) {
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

  return (
    <>
      <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-muted" aria-live="polite">
          {query
            ? `${result.pagination.totalPosts} result${result.pagination.totalPosts === 1 ? "" : "s"} for “${query}”`
            : `${result.pagination.totalPosts} articles`}
        </p>
        {query ? (
          <Link
            className="text-sm font-semibold text-signal-strong"
            href="/blog"
          >
            Clear search
          </Link>
        ) : null}
      </div>

      {result.posts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {result.posts.map((post) => (
            <PostCard
              key={post.id}
              post={{ ...post, authorName: post.author.name }}
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

      {result.pagination.totalPages > 1 ? (
        <nav
          aria-label="Blog pagination"
          className="mt-12 flex items-center justify-between gap-4 border-t border-ink/10 pt-8"
        >
          {result.pagination.prevPage ? (
            <Link
              className={buttonVariants({
                variant: "outline",
                className: "h-auto rounded-full bg-paper px-5 py-2.5",
              })}
              href={pageHref(result.pagination.prevPage, query)}
            >
              Previous
            </Link>
          ) : (
            <span />
          )}
          <p className="text-sm text-ink-muted">
            Page {result.pagination.page} of {result.pagination.totalPages}
          </p>
          {result.pagination.nextPage ? (
            <Link
              className={buttonVariants({
                variant: "outline",
                className: "h-auto rounded-full bg-paper px-5 py-2.5",
              })}
              href={pageHref(result.pagination.nextPage, query)}
            >
              Next
            </Link>
          ) : (
            <span />
          )}
        </nav>
      ) : null}
    </>
  );
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const results = await BlogResults({ searchParams });

  return (
    <main id="main-content">
      <section className={`${styles.hero} border-b border-ink/10`}>
        <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
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

            <form
              action="/blog"
              className="mt-9 flex max-w-2xl flex-col gap-3 sm:flex-row"
              role="search"
            >
              <label className="sr-only" htmlFor="blog-search">
                Search articles
              </label>
              <input
                className={styles.searchInput}
                id="blog-search"
                name="query"
                placeholder="Search articles"
                type="search"
              />
              <button
                className={buttonVariants({
                  size: "lg",
                  className:
                    "h-12 rounded-full bg-ink px-6 text-paper hover:bg-ink/85",
                })}
                type="submit"
              >
                <SearchIcon aria-hidden="true" />
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">{results}</div>
      </section>
    </main>
  );
}
