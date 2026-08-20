import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  buildWebsiteJsonLd,
  createPageMetadata,
  serializeJsonLd,
} from "@/lib/seo";

import styles from "./home.module.css";

export const metadata: Metadata = createPageMetadata({
  title: "Launch websites without inherited mistakes",
  description:
    "A lean Next.js launch template for client migrations, rebuilds, and new startups—with technical SEO priorities, explicit pages, and evidence-based launch checks.",
  path: "/",
});

const signals = [
  ["Identity", "No inherited brands"],
  ["Routes", "No dead destinations"],
  ["Search", "Canonical and crawlable"],
  ["Migration", "Every old URL decided"],
  ["Launch", "Evidence attached"],
];

const principles = [
  {
    number: "01",
    title: "Pages stay visible",
    body: "Open a route and see its copy, composition, and metadata together. No registry, serialized block props, or catch-all renderer stands between an idea and the page.",
  },
  {
    number: "02",
    title: "Defaults can leave",
    body: "Blog, use cases, and PostHog are ordinary code—not a flag platform. Keep what the project needs. Delete the folder, link, and dependency when it does not.",
  },
  {
    number: "03",
    title: "Checks follow risk",
    body: "Indexability, identity, routes, redirects, and conversion paths can block launch. Experimental extras stay optional, and every exception has an owner.",
  },
];

const priorities = [
  {
    tier: "P0",
    label: "Protect the launch",
    description:
      "The failures that lose traffic, break trust, leak old defaults, or stop a user from converting.",
    items: ["Brand and domain", "Indexability", "Routes and redirects"],
  },
  {
    tier: "P1",
    label: "Raise the quality",
    description:
      "Professional polish and useful enhancements that matter, without pretending every preference is a blocker.",
    items: ["Structured data", "Social previews", "Accessibility review"],
  },
  {
    tier: "P2",
    label: "Extend with intent",
    description:
      "Advanced discovery, richer content tooling, and experiments added after the core path is stable.",
    items: [".md representations", "LLM discovery", "Experimentation"],
  },
];

const workflow = [
  {
    number: "01",
    title: "Inventory",
    body: "Understand the old URLs, search traffic, content, forms, tracking, and visual patterns before replacing any of them.",
  },
  {
    number: "02",
    title: "Build",
    body: "Finish one explicit route at a time. Keep components local until two pages prove the same abstraction is useful.",
  },
  {
    number: "03",
    title: "Audit",
    body: "Crawl the preview, compare the migration map, inspect the first 200 words, and attach evidence to every applicable P0 item.",
  },
  {
    number: "04",
    title: "Launch",
    body: "Cut over with production configuration, redirects, rollback ownership, and post-launch search monitoring already assigned.",
  },
];

export default function HomePage() {
  const websiteJsonLd = buildWebsiteJsonLd();

  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(websiteJsonLd) }}
      />

      <section className={`${styles.hero} border-b border-ink/10`}>
        <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:py-24">
          <div>
            <p
              className={`${styles.kicker} flex items-center gap-3 text-xs font-bold tracking-[0.2em] text-ink-muted uppercase`}
            >
              Reusable discipline · bespoke websites
            </p>
            <h1
              className={`${styles.displayTitle} mt-7 max-w-4xl font-display text-[clamp(3.6rem,8vw,7.4rem)] leading-[0.9] tracking-[-0.065em]`}
            >
              Build the right site. Keep the old mistakes out.
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-ink-muted sm:text-xl sm:leading-9">
              A lean Next.js reference for client migrations, careful rebuilds,
              and brand-new launches. It keeps technical SEO, URL decisions,
              production identity, and launch evidence close to the code—while
              leaving the page design completely open.
            </p>
            <p className="mt-4 max-w-2xl leading-7 text-ink-muted">
              The template gives a new developer a clear order of operations:
              get the title and description right, make the H1 and first 200
              words useful, preserve the URLs that matter, then prove the site
              is ready. Blog, use cases, and PostHog are present as normal,
              deletable code instead of a permanent module system.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="#priorities"
                className={buttonVariants({
                  size: "lg",
                  className:
                    "h-auto rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-paper hover:-translate-y-0.5 hover:bg-ink/85",
                })}
              >
                Explore the priorities
              </Link>
              <Link
                href="#principles"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className:
                    "h-auto rounded-full border-ink/15 bg-paper/70 px-6 py-3.5 text-sm font-semibold hover:border-ink/30 hover:bg-paper",
                })}
              >
                See the architecture
              </Link>
            </div>
          </div>

          <div className={`${styles.signalBoard} rounded-[2rem] p-5 sm:p-7`}>
            <div className="flex items-center justify-between border-b border-white/10 pb-5 text-paper">
              <div>
                <p className="text-xs font-bold tracking-[0.18em] text-mint uppercase">
                  Launch signal
                </p>
                <p className="mt-1 text-lg font-semibold">Production review</p>
              </div>
              <Badge className="h-auto gap-2 border-0 bg-white/8 px-3 py-1.5 text-xs font-medium text-mint hover:bg-white/8">
                <span className={styles.pulse} /> Live audit
              </Badge>
            </div>

            <div className="mt-4">
              {signals.map(([label, value], index) => (
                <div
                  className={`${styles.checkRow} flex items-center gap-4 border-b border-white/8 py-4 last:border-0`}
                  key={label}
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-full border border-mint/25 bg-mint/10 text-xs font-bold text-mint">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs tracking-[0.12em] text-white/45 uppercase">
                      {label}
                    </p>
                    <p className="mt-0.5 truncate text-sm font-medium text-paper">
                      {value}
                    </p>
                  </div>
                  <Badge className="h-auto border-0 bg-mint/10 px-2.5 py-1 text-[10px] font-bold tracking-[0.12em] text-mint uppercase hover:bg-mint/10">
                    Ready
                  </Badge>
                </div>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              {[
                ["0", "Dead links"],
                ["3", "Priority tiers"],
                ["1", "Source of truth"],
              ].map(([value, label]) => (
                <div className="rounded-2xl bg-white/6 p-3" key={label}>
                  <p className="font-display text-2xl text-paper">{value}</p>
                  <p className="mt-1 text-[10px] leading-4 text-white/45 uppercase">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="principles" className="scroll-mt-24 bg-paper py-24 sm:py-32">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-signal uppercase">
                The architecture
              </p>
              <h2 className="mt-5 max-w-lg font-display text-5xl leading-[0.98] tracking-[-0.045em] sm:text-6xl">
                Opinionated about outcomes. Loose about design.
              </h2>
            </div>
            <p className="max-w-2xl self-end text-lg leading-8 text-ink-muted">
              The old template tried to make every page interchangeable. This
              one makes the launch knowledge reusable instead. Routes stay
              explicit, the checklist explains the SEO priorities in context,
              and custom visual work can become as ambitious as the client needs
              without changing the foundation.
            </p>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {principles.map((principle) => (
              <article key={principle.number}>
                <Card
                  className={`${styles.principleCard} h-full gap-0 rounded-[1.5rem] border border-ink/10 bg-paper/70 p-7 py-7 ring-0`}
                >
                  <CardContent className="px-0">
                    <p className="font-display text-3xl text-signal">
                      {principle.number}
                    </p>
                    <h3 className="mt-12 text-xl font-semibold tracking-tight">
                      {principle.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-ink-muted">
                      {principle.body}
                    </p>
                  </CardContent>
                </Card>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="priorities"
        className="scroll-mt-24 border-y border-ink/10 py-24 sm:py-32"
      >
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-bold tracking-[0.2em] text-signal uppercase">
              Priority over accumulation
            </p>
            <h2 className="mt-5 font-display text-5xl leading-[0.98] tracking-[-0.045em] sm:text-6xl">
              Know what blocks launch—and what can wait.
            </h2>
          </div>

          <div className="mt-14 grid overflow-hidden rounded-[1.75rem] border border-ink/10 bg-paper md:grid-cols-3">
            {priorities.map((priority) => (
              <article
                className={`${styles.priorityCard} border-b border-ink/10 p-7 pt-16 last:border-0 md:border-r md:border-b-0 md:last:border-r-0`}
                key={priority.tier}
              >
                <p className="text-xs font-bold tracking-[0.16em] text-ink-faint uppercase">
                  {priority.tier}
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight">
                  {priority.label}
                </h3>
                <p className="mt-4 text-sm leading-6 text-ink-muted">
                  {priority.description}
                </p>
                <ul className="mt-10 space-y-3 border-t border-ink/10 pt-5 text-sm">
                  {priority.items.map((item) => (
                    <li className="flex items-center gap-3" key={item}>
                      <span
                        aria-hidden="true"
                        className="size-1.5 rounded-full bg-ink/35"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="workflow"
        className="scroll-mt-24 bg-night py-24 text-paper sm:py-32"
      >
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-mint uppercase">
                One page at a time
              </p>
              <h2 className="mt-5 font-display text-5xl leading-[0.98] tracking-[-0.045em] sm:text-6xl">
                A workflow the next developer can follow.
              </h2>
              <p className="mt-6 max-w-xl text-base leading-7 text-white/60">
                Reuse the sequence, not a pile of UI. Each page leaves behind
                code, evidence, and decisions that make the next page safer to
                build.
              </p>
            </div>

            <div className="border-t border-white/15">
              {workflow.map((step) => (
                <article
                  className="grid grid-cols-[5rem_1fr] gap-4 border-b border-white/15 py-7 sm:grid-cols-[7rem_0.55fr_1fr] sm:items-start"
                  key={step.number}
                >
                  <p className={`${styles.stepNumber} text-5xl leading-none`}>
                    {step.number}
                  </p>
                  <h3 className="pt-1 text-lg font-semibold">{step.title}</h3>
                  <p className="col-start-2 text-sm leading-6 text-white/55 sm:col-start-auto">
                    {step.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-paper py-24 sm:py-32">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-signal uppercase">
              Reference that stays concrete
            </p>
            <h2 className="mt-5 font-display text-5xl leading-[0.98] tracking-[-0.045em] sm:text-6xl">
              Every rule should lead somewhere useful.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-ink-muted">
              Checklist IDs point to code, commands, evidence, and the reason a
              check matters. Another website can copy the document, compare its
              implementation, and fix the highest-risk gaps without adopting
              this site&apos;s visual design.
            </p>
          </div>

          <div className={`${styles.codeWindow} rounded-[1.75rem] p-6 text-sm`}>
            <div className="flex items-center gap-2 border-b border-white/10 pb-4 text-white/40">
              <span className="size-2.5 rounded-full bg-signal" />
              <span className="size-2.5 rounded-full bg-[#e4b85b]" />
              <span className="size-2.5 rounded-full bg-mint-strong" />
              <span className="ml-2 font-mono text-xs">
                launch/checklist.md
              </span>
            </div>
            <div className="space-y-5 py-7 font-mono leading-6">
              <p>
                <span className="text-signal">SEO-02</span>
                <span className="text-white/35"> → </span>
                <span className="text-paper">meta title</span>
              </p>
              <p className="pl-20 text-white/55">meta description</p>
              <p className="pl-20 text-white/55">H1</p>
              <p className="pl-20 text-white/55">first 200 words</p>
              <p className="pl-20 text-white/55">dates when available</p>
              <div className="border-t border-white/10 pt-5 text-white/55">
                evidence: preview crawl + content review
                <br />
                code: src/lib/seo.ts
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
