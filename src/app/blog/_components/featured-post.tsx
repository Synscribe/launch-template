import { ArrowUpRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/lib/blog";

export function FeaturedPost({
  post,
  label,
}: {
  post: BlogPost;
  label: string | null;
}) {
  return (
    <Link
      className="group grid overflow-hidden rounded-3xl border border-ink/10 bg-paper shadow-[var(--shadow-card)] md:grid-cols-2"
      href={`/blog/${post.slug}`}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted md:aspect-auto md:min-h-[24rem]">
        {post.image ? (
          <Image
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            src={post.image}
            alt=""
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        ) : null}
      </div>

      <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
        {label ? (
          <Badge className="bg-mint/55 px-3 py-1 text-ink hover:bg-mint/55">
            {label}
          </Badge>
        ) : null}
        <h2 className="mt-5 text-balance font-display text-3xl leading-[1.08] tracking-[-0.03em] text-ink sm:text-4xl">
          {post.title}
        </h2>
        {post.description ? (
          <p className="mt-5 line-clamp-3 text-base leading-7 text-ink-muted">
            {post.description}
          </p>
        ) : null}
        <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-signal-strong">
          Read article
          <ArrowUpRightIcon className="size-4" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
