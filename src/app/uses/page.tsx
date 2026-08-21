import { ArrowDownIcon, ArrowRightIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import {
  buildBreadcrumbJsonLd,
  createPageMetadata,
  serializeJsonLd,
} from "@/lib/seo";
import { getGroupedUseCases } from "@/lib/use-cases";

import styles from "./uses.module.css";

export const metadata: Metadata = createPageMetadata({
  title: "Use cases for launches, rebuilds, and growth",
  description:
    "See how to plan website migrations, SaaS rebuilds, startup launches, and SEO landing pages without missing the work that matters.",
  path: "/uses",
});

export default async function UsesPage() {
  const groups = await getGroupedUseCases();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Uses", path: "/uses" },
  ]);

  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />

      <section className={`${styles.hero} border-b border-ink/10`}>
        <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
          <div className="max-w-5xl">
            <h1 className="max-w-4xl text-balance font-display text-[clamp(3.1rem,6.6vw,6rem)] leading-[0.94] tracking-[-0.04em]">
              Start with the job your website needs to do.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-muted sm:text-xl sm:leading-9">
              Choose the project closest to yours. Each use case shows the
              problems, the work, and what should be ready before launch.
            </p>
            <Link
              href="#all-uses"
              className={buttonVariants({
                size: "lg",
                className:
                  "mt-8 h-auto rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-paper hover:-translate-y-0.5 hover:bg-ink/85",
              })}
            >
              Find your starting point
              <ArrowDownIcon data-icon="inline-end" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <div id="all-uses" className="scroll-mt-20">
        {groups.map((group) => (
          <section
            className="border-b border-ink/10 py-20 sm:py-24"
            id={group.slug}
            key={group.slug}
          >
            <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.68fr_1.32fr] lg:gap-20">
              <div>
                <h2 className="max-w-md text-balance font-display text-3xl leading-[1] tracking-[-0.03em] sm:text-4xl">
                  {group.name}
                </h2>
                <p className="mt-4 max-w-md text-sm leading-7 text-ink-muted sm:text-base">
                  {group.description}
                </p>
              </div>

              <ul className="border-t border-ink/15">
                {group.useCases.map((useCase) => (
                  <li
                    className="border-b border-ink/15"
                    key={useCase.metadata.slug}
                  >
                    <Link
                      className={`${styles.useRow} group grid gap-5 py-7 sm:grid-cols-[1fr_auto] sm:items-center sm:px-5 sm:py-8`}
                      href={`/uses/${useCase.metadata.slug}`}
                    >
                      <article>
                        <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
                          {useCase.metadata.anchor}
                        </h3>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-ink-muted sm:text-base">
                          {useCase.hero.summary}
                        </p>
                      </article>

                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-signal-strong">
                        View use case
                        <ArrowRightIcon
                          className="size-4 transition-transform group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>

      <section className="py-20 sm:py-24">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 sm:px-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="max-w-2xl text-balance font-display text-3xl leading-[1] tracking-[-0.03em] sm:text-4xl">
              The page can change. The launch checks stay.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-ink-muted">
              Use the same checklist for a migration, rebuild, or brand-new
              site.
            </p>
          </div>
          <Link
            href="/#workflow"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className:
                "h-auto shrink-0 rounded-full border-ink/15 bg-paper px-6 py-3.5 text-sm font-semibold hover:border-ink/30 hover:bg-paper",
            })}
          >
            See the launch workflow
            <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
