import {
  buildWispClient,
  type GetPostResult,
  type GetPostsResult,
  type GetRelatedPostsResult,
} from "@wisp-cms/client";

import { env } from "@/config/env";

export const BLOG_PAGE_SIZE = 12;

export type BlogPostSummary = GetPostsResult["posts"][number];
export type BlogPost = NonNullable<GetPostResult["post"]>;
export type RelatedBlogPost = GetRelatedPostsResult["posts"][number];

export const isWispConfigured = Boolean(env.wispBlogId);

const emptyPosts: GetPostsResult = {
  posts: [],
  pagination: {
    page: 1,
    limit: BLOG_PAGE_SIZE,
    totalPages: 0,
    totalPosts: 0,
    nextPage: null,
    prevPage: null,
  },
};

export async function getBlogPosts({
  page = 1,
  query = null,
  tag = null,
  limit = BLOG_PAGE_SIZE,
}: {
  page?: number;
  query?: string | null;
  tag?: string | null;
  limit?: number;
} = {}): Promise<GetPostsResult> {
  if (!env.wispBlogId)
    return {
      ...emptyPosts,
      pagination: { ...emptyPosts.pagination, page, limit },
    };
  return buildWispClient({ blogId: env.wispBlogId }).getPosts({
    page,
    limit,
    ...(query ? { query } : {}),
    ...(tag ? { tags: [tag] } : {}),
  });
}

export async function getBlogPost(slug: string): Promise<GetPostResult> {
  if (!env.wispBlogId) return { post: null };
  return buildWispClient({ blogId: env.wispBlogId }).getPost(slug);
}

export async function getRelatedBlogPosts(
  slug: string,
  limit = 3,
): Promise<GetRelatedPostsResult> {
  if (!env.wispBlogId) return { posts: [] };
  return buildWispClient({ blogId: env.wispBlogId }).getRelatedPosts({
    slug,
    limit,
  });
}

export async function getAllBlogPosts(): Promise<GetPostsResult> {
  if (!env.wispBlogId) {
    return {
      ...emptyPosts,
      pagination: { ...emptyPosts.pagination, limit: "all" },
    };
  }
  return buildWispClient({ blogId: env.wispBlogId }).getPosts({ limit: "all" });
}
