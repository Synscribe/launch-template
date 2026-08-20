import {
  ArrowDownIcon,
  ArrowRightIcon,
  CheckIcon,
  PlusIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  buildBreadcrumbJsonLd,
  createPageMetadata,
  serializeJsonLd,
} from "@/lib/seo";
import { getAllUseCases, getUseCaseBySlug } from "@/lib/use-cases";

import { FeatureVisual } from "./_components/feature-visuals";
import styles from "./use-case.module.css";

type UseCasePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const useCases = await getAllUseCases();
  return useCases.map((useCase) => ({ slug: useCase.slug }));
}

export async function generateMetadata({
  params,
}: UseCasePageProps): Promise<Metadata> {
  const { slug } = await params;
  const useCase = await getUseCaseBySlug(slug);
  if (!useCase) notFound();

  return createPageMetadata({
    title: useCase.seo.title,
    description: useCase.seo.description,
    path: `/use-cases/${useCase.slug}`,
  });
}

export default async function UseCasePage({ params }: UseCasePageProps) {
  const { slug } = await params;
  const useCase = await getUseCaseBySlug(slug);
  if (!useCase) notFound();

  const path = `/use-cases/${useCase.slug}`;
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: useCase.shortTitle, path },
  ]);

  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />

      <section className={`${styles.hero} border-b border-ink/10`}>
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pt-7 pb-24 sm:px-8 sm:pt-9 sm:pb-28">
          <nav aria-label="Breadcrumb" className="text-sm text-ink-muted">
            <ol className="flex items-center gap-2">
              <li>
                <Link className="transition-colors hover:text-ink" href="/">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-ink-faint">
                /
              </li>
              <li aria-current="page">{useCase.shortTitle}</li>
            </ol>
          </nav>

          <div className="mt-12 grid items-start gap-14 lg:grid-cols-[1.18fr_0.82fr] lg:gap-20">
            <div>
              <h1 className="max-w-4xl text-balance font-display text-[clamp(3rem,5.6vw,5.5rem)] leading-[0.94] tracking-[-0.04em]">
                {useCase.hero.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 font-medium text-ink sm:text-xl sm:leading-9">
                {useCase.hero.summary}
              </p>

              <div className="mt-8">
                <Link
                  href="#solution"
                  className={buttonVariants({
                    size: "lg",
                    className:
                      "h-auto rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-paper hover:-translate-y-0.5 hover:bg-ink/85",
                  })}
                >
                  See what gets delivered
                  <ArrowDownIcon data-icon="inline-end" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <Card
              className={`${styles.briefCard} gap-0 rounded-2xl border-0 p-7 py-7 text-paper ring-0 sm:p-8 sm:py-8`}
            >
              <CardContent className="px-0">
                <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
                  <div>
                    <p className="text-xs font-bold tracking-[0.18em] text-mint uppercase">
                      {useCase.hero.brief.label}
                    </p>
                    <p className="mt-1 text-xl font-semibold">
                      {useCase.hero.brief.title}
                    </p>
                  </div>
                  <Badge className="border-0 bg-mint/10 text-mint hover:bg-mint/10">
                    {useCase.hero.brief.badge}
                  </Badge>
                </div>

                <div className="border-b border-white/10 py-5">
                  <p className="text-xs tracking-[0.15em] text-white/60 uppercase">
                    Primary goal
                  </p>
                  <p className="mt-2 text-base leading-7 text-paper">
                    {useCase.hero.primaryGoal}
                  </p>
                </div>

                <div className="pt-5">
                  <p className="text-xs tracking-[0.15em] text-white/60 uppercase">
                    Good fit for
                  </p>
                  <ul className="mt-3 space-y-3">
                    {useCase.hero.fit.map((item) => (
                      <li className="flex gap-3 text-sm leading-6" key={item}>
                        <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-mint/10 text-mint">
                          <CheckIcon className="size-3" aria-hidden="true" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="risks" className="scroll-mt-24 bg-paper py-24 sm:py-32">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-24">
            <div>
              <h2 className="max-w-xl text-balance font-display text-4xl leading-[1] tracking-[-0.035em] sm:text-5xl">
                {useCase.risks.title}
              </h2>
            </div>
            <p className="max-w-2xl self-end text-lg leading-8 text-ink-muted">
              {useCase.risks.introduction}
            </p>
          </div>

          <div className="mt-16 grid border-y border-ink/10 md:grid-cols-3">
            {useCase.risks.items.map((item) => (
              <article
                className="border-b border-ink/10 py-8 last:border-b-0 md:border-r md:border-b-0 md:px-8 md:py-10 md:last:border-r-0 md:first:pl-0"
                key={item.title}
              >
                <h3 className="text-lg font-semibold tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-ink-muted">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="solution"
        className={`${styles.solution} scroll-mt-24 border-y border-ink/10 py-24 sm:py-32`}
      >
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
            <div>
              <h2 className="max-w-3xl text-balance font-display text-4xl leading-[1] tracking-[-0.035em] sm:text-5xl">
                {useCase.solution.title}
              </h2>
            </div>
            <p className="max-w-2xl self-end text-lg leading-8 text-ink-muted">
              {useCase.solution.introduction}
            </p>
          </div>

          <div className="mt-20 border-t border-ink/10">
            {useCase.solution.items.map((capability) => (
              <article
                className={`${styles.capabilityRow} scroll-mt-24 py-20 sm:py-28`}
                id={capability.id}
                key={capability.id}
              >
                <div className={styles.capabilityCopy}>
                  <h3 className="max-w-xl text-balance font-display text-3xl leading-[1.04] tracking-[-0.03em] sm:text-4xl">
                    {capability.title}
                  </h3>
                  <p className="mt-4 text-xs font-bold tracking-[0.14em] text-signal-strong uppercase">
                    {capability.category}
                  </p>
                  <p className="mt-5 max-w-xl text-base leading-8 text-ink-muted">
                    {capability.description}
                  </p>
                  <ul className="mt-7 space-y-4">
                    {capability.highlights.map((highlight) => (
                      <li
                        className="flex max-w-xl gap-3 text-sm leading-6 text-ink"
                        key={highlight}
                      >
                        <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-mint text-ink">
                          <CheckIcon className="size-3" aria-hidden="true" />
                        </span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                <FeatureVisual id={capability.id} />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="method"
        className={`${styles.method} scroll-mt-24 py-24 text-paper sm:py-32`}
      >
        <div className="mx-auto grid w-full max-w-7xl gap-16 px-5 sm:px-8 lg:grid-cols-[0.76fr_1.24fr] lg:gap-24">
          <div>
            <h2 className="max-w-xl text-balance font-display text-4xl leading-[1] tracking-[-0.035em] sm:text-5xl">
              {useCase.method.title}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/70">
              {useCase.method.introduction}
            </p>
          </div>

          <ol className="border-t border-white/15">
            {useCase.method.steps.map((step) => (
              <li
                className="grid grid-cols-[3.5rem_1fr] gap-4 border-b border-white/15 py-7 sm:grid-cols-[4.5rem_0.7fr_1fr] sm:gap-7 sm:py-8"
                key={step.number}
              >
                <span className="font-display text-3xl text-mint sm:text-4xl">
                  {step.number}
                </span>
                <h3 className="text-base font-semibold sm:pt-1.5">
                  {step.title}
                </h3>
                <p className="col-start-2 text-sm leading-6 text-white/70 sm:col-start-3 sm:pt-1.5">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="outcomes" className="scroll-mt-24 py-24 sm:py-32">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <div className="max-w-4xl">
            <h2 className="text-balance font-display text-4xl leading-[1] tracking-[-0.035em] sm:text-5xl">
              {useCase.outcomes.title}
            </h2>
          </div>

          <div className="mt-14 grid overflow-hidden rounded-2xl border border-ink/10 bg-paper md:grid-cols-3">
            {useCase.outcomes.items.map((item) => (
              <article
                className="border-b border-ink/10 p-8 last:border-0 md:border-r md:border-b-0 md:p-9 md:last:border-r-0"
                key={item.title}
              >
                <h3 className="text-lg font-semibold tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-ink-muted">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="faq"
        className={`${styles.faq} scroll-mt-24 border-y border-ink/10 py-24 sm:py-32`}
      >
        <div className="mx-auto grid w-full max-w-7xl gap-16 px-5 sm:px-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-24">
          <div>
            <h2 className="max-w-xl text-balance font-display text-4xl leading-[1] tracking-[-0.035em] sm:text-5xl">
              {useCase.faq.title}
            </h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-ink-muted">
              {useCase.faq.introduction}
            </p>
          </div>

          <div className="border-t border-ink/15">
            {useCase.faq.items.map((item) => (
              <details className={styles.faqItem} key={item.question}>
                <summary className="grid cursor-pointer grid-cols-[1fr_1.5rem] gap-4 py-5 sm:py-6">
                  <span className="text-base leading-7 font-semibold sm:text-lg">
                    {item.question}
                  </span>
                  <PlusIcon
                    className={`${styles.faqIcon} mt-1 size-5 text-ink-faint`}
                    aria-hidden="true"
                  />
                </summary>
                <p className="max-w-2xl pr-8 pb-6 text-sm leading-7 text-ink-muted sm:text-base sm:leading-8">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-28">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <Card
            className={`${styles.closingCard} gap-0 rounded-2xl border-0 p-7 py-7 text-white ring-0 sm:p-10 sm:py-10`}
          >
            <CardContent className="grid gap-10 px-0 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <h2 className="max-w-4xl text-balance font-display text-3xl leading-[1.02] tracking-[-0.035em] sm:text-5xl">
                  {useCase.closing.title}
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-7 text-white">
                  {useCase.closing.description}
                </p>
              </div>
              <Link
                href={useCase.closing.cta.href}
                className={buttonVariants({
                  size: "lg",
                  className:
                    "h-auto rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-signal-strong hover:-translate-y-0.5 hover:bg-white/90",
                })}
              >
                {useCase.closing.cta.label}
                <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
