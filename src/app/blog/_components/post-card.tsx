import { ArrowUpRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export type BlogCardPost = {
  slug: string;
  title: string;
  image: string | null;
};

export function PostCard({
  post,
  label = null,
  headingLevel = 2,
}: {
  post: BlogCardPost;
  label?: string | null;
  headingLevel?: 2 | 3;
}) {
  const Heading = `h${headingLevel}` as "h2" | "h3";

  return (
    <Card className="relative h-full gap-0 rounded-2xl py-0 ring-ink/10 transition-transform duration-200 hover:-translate-y-1">
      {post.image ? (
        <Link
          className="relative block aspect-[16/9] overflow-hidden bg-muted"
          href={`/blog/${post.slug}`}
          tabIndex={-1}
          aria-hidden="true"
        >
          <Image
            className="object-cover transition-transform duration-300 group-hover/card:scale-[1.02]"
            src={post.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
          />
        </Link>
      ) : null}

      <CardContent className="flex flex-1 flex-col px-6 py-6 sm:px-7 sm:py-7">
        {label ? (
          <Badge className="bg-mint/55 px-3 py-1 text-ink hover:bg-mint/55">
            {label}
          </Badge>
        ) : null}

        <Heading
          className={`${label ? "mt-4" : "mt-0"} text-balance font-display text-2xl leading-[1.15] font-normal tracking-[-0.025em]`}
        >
          <Link
            className="outline-none after:absolute after:inset-0 focus-visible:underline"
            href={`/blog/${post.slug}`}
          >
            {post.title}
          </Link>
        </Heading>

        <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-signal-strong">
          Read article
          <ArrowUpRightIcon className="size-4" aria-hidden="true" />
        </span>
      </CardContent>
    </Card>
  );
}
