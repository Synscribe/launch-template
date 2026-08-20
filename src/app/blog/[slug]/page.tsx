import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { env } from "@/config/env";
import {
  getBlogPost,
  getRelatedBlogPosts,
  type RelatedBlogPost,
} from "@/lib/blog";
import {
  addBlogHeadingAnchors,
  descriptionFromPost,
  estimateReadingMinutes,
  formatBlogDate,
  sanitizeBlogContent,
} from "@/lib/blog-content";
import {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  createPageMetadata,
  absoluteUrl,
  serializeJsonLd,
} from "@/lib/seo";

import { labelForBlogTags } from "../blog.config";
import { PostCard } from "../_components/post-card";
import { ArticleSidebar } from "./_components/article-sidebar";
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
  const sanitizedContent = sanitizeBlogContent(
    post.content,
    post.image,
    env.wispContentOrigin,
  );
  const { html: content, tableOfContents } =
    addBlogHeadingAnchors(sanitizedContent);
  const category = labelForBlogTags(post.tags);
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
          <div
            className={`mx-auto grid w-full max-w-7xl items-center gap-10 px-5 py-14 sm:px-8 sm:py-16 lg:gap-14 lg:py-20 ${post.image ? "lg:grid-cols-2" : ""}`}
          >
            <div>
              {category ? (
                <Badge className="bg-mint px-3 py-1 text-ink hover:bg-mint">
                  {category}
                </Badge>
              ) : null}

              <h1 className="mt-6 max-w-3xl text-balance font-display text-[clamp(2.4rem,3vw,3.25rem)] leading-[1.03] tracking-[-0.035em] text-paper">
                {post.title}
              </h1>

              <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-paper/75">
                {updatedAt ? (
                  <p>
                    Last updated:{" "}
                    <time dateTime={updatedAt}>
                      {formatBlogDate(post.updatedAt)}
                    </time>
                  </p>
                ) : null}
                {updatedAt ? (
                  <span aria-hidden="true" className="text-paper/35">
                    •
                  </span>
                ) : null}
                <p>{estimateReadingMinutes(post.content)} min read</p>
                {post.publishedAt ? (
                  <>
                    <span aria-hidden="true" className="text-paper/35">
                      •
                    </span>
                    <p>
                      Published:{" "}
                      <time dateTime={publishedAt}>
                        {formatBlogDate(post.publishedAt)}
                      </time>
                    </p>
                  </>
                ) : null}
              </div>
            </div>

            {post.image ? (
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted shadow-[var(--shadow-card)]">
                <Image
                  className="object-cover"
                  src={post.image}
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              </div>
            ) : null}
          </div>
        </header>

        <div className="bg-paper py-14 sm:py-18 lg:py-20">
          <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:gap-14">
            <ArticleSidebar
              items={tableOfContents}
              title={post.title}
              url={absoluteUrl(path)}
            />
            <div
              className={`${styles.prose} order-2 min-w-0 lg:order-1 lg:col-span-8`}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
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
