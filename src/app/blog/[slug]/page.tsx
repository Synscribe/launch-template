import { ArrowLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { env } from "@/config/env";
import {
  getBlogPost,
  getRelatedBlogPosts,
  type RelatedBlogPost,
} from "@/lib/blog";
import {
  descriptionFromPost,
  estimateReadingMinutes,
  formatBlogDate,
  sanitizeBlogContent,
} from "@/lib/blog-content";
import {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  createPageMetadata,
  serializeJsonLd,
} from "@/lib/seo";

import { PostCard } from "../_components/post-card";
import styles from "./article.module.css";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

function isoDate(value: Date | string | null): string | undefined {
  return value ? new Date(value).toISOString() : undefined;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { post } = await getBlogPost(slug);
  if (!post) notFound();

  return createPageMetadata({
    title: post.title,
    description: descriptionFromPost(post.description, post.content),
    path: `/blog/${post.slug}`,
    imagePath: post.image ?? undefined,
  });
}

async function Article({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const { post } = await getBlogPost(slug);
  if (!post) notFound();

  const path = `/blog/${post.slug}`;
  const description = descriptionFromPost(post.description, post.content);
  const publishedAt = isoDate(post.publishedAt);
  const updatedAt = isoDate(post.updatedAt);
  const content = sanitizeBlogContent(
    post.content,
    post.image,
    env.wispContentOrigin,
  );
  const articleJsonLd = buildArticleJsonLd({
    headline: post.title,
    description,
    path,
    authorName: post.author.name ?? undefined,
    publishedAt,
    updatedAt,
    imagePath: post.image ?? undefined,
  });
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path },
  ]);

  let relatedPosts: RelatedBlogPost[] = [];
  try {
    relatedPosts = (await getRelatedBlogPosts(post.slug, 3)).posts;
  } catch {
    // Related content is optional. The article remains useful without it.
  }

  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />

      <article>
        <header className={`${styles.articleHero} border-b border-ink/10`}>
          <div className="mx-auto w-full max-w-5xl px-5 py-14 sm:px-8 sm:py-20 lg:py-24">
            <Link
              className="inline-flex items-center gap-2 text-sm font-semibold text-signal-strong"
              href="/blog"
            >
              <ArrowLeftIcon className="size-4" aria-hidden="true" />
              All articles
            </Link>

            <h1 className="mt-8 max-w-4xl text-balance font-display text-[clamp(2.8rem,6vw,5.4rem)] leading-[0.96] tracking-[-0.04em]">
              {post.title}
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-ink-muted sm:text-xl sm:leading-9">
              {description}
            </p>

            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-muted">
              {post.publishedAt ? (
                <p>
                  Published{" "}
                  <time dateTime={publishedAt}>
                    {formatBlogDate(post.publishedAt)}
                  </time>
                </p>
              ) : null}
              {post.author.name ? <p>By {post.author.name}</p> : null}
              <p>{estimateReadingMinutes(post.content)} min read</p>
              {publishedAt !== updatedAt ? (
                <p>
                  Updated{" "}
                  <time dateTime={updatedAt}>
                    {formatBlogDate(post.updatedAt)}
                  </time>
                </p>
              ) : null}
            </div>

            {post.image ? (
              <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl bg-muted shadow-[var(--shadow-card)] sm:mt-12">
                <Image
                  className="object-cover"
                  src={post.image}
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 1024px) 960px, 100vw"
                />
              </div>
            ) : null}
          </div>
        </header>

        <div className="bg-paper py-16 sm:py-20 lg:py-24">
          <div
            className={`${styles.prose} mx-auto w-full max-w-3xl px-5 sm:px-8`}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </article>

      {relatedPosts.length > 0 ? (
        <section className="border-t border-ink/10 py-16 sm:py-20 lg:py-24">
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
            <div className="mb-9 flex items-end justify-between gap-6">
              <h2 className="font-display text-4xl tracking-[-0.035em] sm:text-5xl">
                Keep reading
              </h2>
              <Link
                className={buttonVariants({
                  variant: "outline",
                  className:
                    "hidden h-auto rounded-full bg-paper px-5 py-2.5 sm:flex",
                })}
                href="/blog"
              >
                All articles
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <PostCard
                  headingLevel={3}
                  key={relatedPost.id}
                  post={relatedPost}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  return Article({ params });
}
