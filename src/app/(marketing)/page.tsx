import { PlusIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { buildFaqJsonLd, createPageMetadata, serializeJsonLd } from "@/lib/seo";

import styles from "./home.module.css";

export const metadata: Metadata = createPageMetadata({
  title: "A practical Next.js template for agentic websites",
  description: siteConfig.description,
  path: "/",
});

const signals = [
  ["Identity", "Client brand is set"],
  ["Routes", "Every URL has a home"],
  ["Search", "Pages can be crawled"],
  ["Migration", "Old URLs are mapped"],
  ["Launch", "Checks are recorded"],
];

const trustStack = ["Next.js", "TypeScript", "shadcn/ui", "PostHog"];

const principles = [
  {
    number: "01",
    title: "Pages are easy to find",
    body: "Open a route and see its copy, metadata, and layout. No catch-all renderer or hidden block registry.",
  },
  {
    number: "02",
    title: "Features are easy to remove",
    body: "Blog, use cases, and PostHog are ordinary code. Delete the files and links when a project does not need them.",
  },
  {
    number: "03",
    title: "Important checks come first",
    body: "Brand, indexability, routes, redirects, and forms can block launch. Nice-to-have experiments can wait.",
  },
];

const priorities = [
  {
    tier: "P0",
    label: "Protect the launch",
    description:
      "Fix anything that can lose traffic, break trust, or stop a visitor from completing the main action.",
    items: [
      "Brand and production domain",
      "Indexability",
      "Routes and redirects",
    ],
  },
  {
    tier: "P1",
    label: "Polish the experience",
    description:
      "Improve the experience once the launch risks are under control.",
    items: ["Structured data", "Social previews", "Accessibility review"],
  },
  {
    tier: "P2",
    label: "Add what the project needs",
    description:
      "Add advanced discovery and content tools only when there is a real use for them.",
    items: [".md pages", "LLM discovery", "Experiments"],
  },
];

const workflow = [
  {
    number: "01",
    title: "Inventory",
    body: "List the old URLs, traffic, content, forms, analytics, and design patterns before you replace them.",
  },
  {
    number: "02",
    title: "Build",
    body: "Finish one route at a time. Keep its copy, metadata, links, and layout together.",
  },
  {
    number: "03",
    title: "Audit",
    body: "Crawl the preview. Check the URL map, first 200 words, forms, analytics, and launch blockers.",
  },
  {
    number: "04",
    title: "Launch",
    body: "Switch to production with redirects, rollback ownership, and post-launch checks ready.",
  },
];

const questions = [
  {
    question: "Is this only for brand-new websites?",
    answer:
      "No. Use it for a new launch, a rebuild, or a migration. Migration projects start with the existing URL inventory and redirect map before routes change.",
  },
  {
    question: "Do I need to keep every included feature?",
    answer:
      "No. Blog, use cases, PostHog, and the contact flow are ordinary code. Delete what the project does not need.",
  },
  {
    question: "Can I bring my own design system?",
    answer:
      "Yes. Replace the semantic tokens first, then change the shared shell and route-level composition. The routing and launch checks can stay underneath.",
  },
  {
    question: "What does the launch review check?",
    answer:
      "It checks identity, routes, indexing, metadata, the sitemap, redirects, forms, analytics, and the launch risks recorded in the checklist.",
  },
];

export default function HomePage() {
  const faqJsonLd = buildFaqJsonLd(questions);

  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqJsonLd) }}
      />

      <section className={`${styles.hero} border-b border-ink/10`}>
        <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-start gap-14 px-5 pt-14 pb-20 sm:px-8 sm:pt-16 lg:grid-cols-[1.08fr_0.92fr] lg:pt-20 lg:pb-24">
          <div>
            <p
              className={`${styles.kicker} flex items-center gap-3 text-xs font-bold tracking-[0.2em] text-ink-muted uppercase`}
            >
              A practical Next.js foundation
            </p>
            <h1
              className={`${styles.displayTitle} mt-7 max-w-4xl font-display text-[clamp(3.6rem,8vw,7.4rem)] leading-[0.9] tracking-[-0.065em]`}
            >
              Launch a new agentic website.
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-ink-muted sm:text-xl sm:leading-9">
              Start with a practical Next.js foundation for agentic websites,
              migrations, and rebuilds. Technical SEO, redirects, analytics, and
              launch checks stay close to the code. The design stays yours.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className={buttonVariants({
                  size: "lg",
                  className:
                    "h-auto rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-paper hover:-translate-y-0.5 hover:bg-ink/85",
                })}
              >
                Launch Website
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
                See how it is built
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
                ["3", "Priority levels"],
                ["1", "Launch checklist"],
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

      <section
        aria-label="Technology trust bar"
        className="border-b border-ink/10 bg-paper"
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-5 py-7 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm font-semibold text-ink-muted">
            Built on a stack your team can inspect and own.
          </p>
          <ul className="flex flex-wrap gap-x-7 gap-y-3">
            {trustStack.map((item) => (
              <li
                className="font-display text-lg tracking-[-0.02em] text-ink"
                key={item}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Customer proof belongs below this trust bar once approved logos, outcomes, or quotes exist. */}

      <section className="bg-paper py-24 sm:py-32">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <p className="text-xs font-bold tracking-[0.2em] text-signal uppercase">
            What Launch Template is
          </p>
          <h2 className="mt-6 max-w-6xl text-balance font-display text-4xl leading-[1.04] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
            {siteConfig.description}
          </h2>
          <p className="mt-8 max-w-3xl text-lg leading-8 text-ink-muted">
            It keeps pages, metadata, redirects, analytics, forms, and launch
            checks in one codebase, ready to change one route at a time.
          </p>
        </div>
      </section>

      <section
        id="principles"
        className="scroll-mt-24 border-t border-ink/10 bg-paper py-24 sm:py-32"
      >
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-signal uppercase">
                How it works
              </p>
              <h2 className="mt-5 max-w-lg font-display text-5xl leading-[0.98] tracking-[-0.045em] sm:text-6xl">
                Clear rules. Flexible design.
              </h2>
            </div>
            <p className="max-w-2xl self-end text-lg leading-8 text-ink-muted">
              Every route owns its copy and metadata. The launch checklist lives
              in one place. You can change the design without rebuilding the
              SEO, routing, and launch foundation.
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
              Start with the real risks
            </p>
            <h2 className="mt-5 font-display text-5xl leading-[0.98] tracking-[-0.045em] sm:text-6xl">
              Know what must be fixed before launch.
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

      <section className="bg-paper py-24 sm:py-32">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-signal uppercase">
              A checklist that points to the work
            </p>
            <h2 className="mt-5 font-display text-5xl leading-[0.98] tracking-[-0.045em] sm:text-6xl">
              Every rule links to code or a check.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-ink-muted">
              Checklist IDs point to the code, command, evidence, and reason
              behind each check. Teams can copy the document and fix the
              highest-risk gaps first.
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

      <section
        id="workflow"
        className="scroll-mt-24 bg-night py-24 text-paper sm:py-32"
      >
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-mint uppercase">
                Build one page at a time
              </p>
              <h2 className="mt-5 font-display text-5xl leading-[0.98] tracking-[-0.045em] sm:text-6xl">
                Four steps anyone can follow.
              </h2>
              <p className="mt-6 max-w-xl text-base leading-7 text-white/60">
                Use the same order for every project. Each finished page leaves
                behind code, decisions, and launch evidence.
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

      <section className="border-t border-ink/10 bg-paper py-24 sm:py-32">
        <div className="mx-auto grid w-full max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-24">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-signal uppercase">
              Common questions
            </p>
            <h2 className="mt-5 max-w-xl font-display text-5xl leading-[0.98] tracking-[-0.045em] sm:text-6xl">
              Start with a clear answer.
            </h2>
          </div>

          <div className="border-t border-ink/15">
            {questions.map((item) => (
              <details className={styles.faqItem} key={item.question}>
                <summary className="grid cursor-pointer grid-cols-[1fr_1.5rem] gap-4 py-6">
                  <span className="text-lg leading-7 font-semibold">
                    {item.question}
                  </span>
                  <PlusIcon
                    className={`${styles.faqMarker} mt-1 size-5 text-ink-faint`}
                    aria-hidden="true"
                  />
                </summary>
                <p className="max-w-2xl pr-8 pb-7 text-base leading-8 text-ink-muted">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-ink/10 py-20 sm:py-24">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <Card
            className={`${styles.closingCard} gap-0 rounded-[2rem] border-0 p-8 py-8 text-paper ring-0 sm:p-12 sm:py-12`}
          >
            <CardContent className="grid gap-10 px-0 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="text-xs font-bold tracking-[0.2em] text-mint uppercase">
                  Ready when you are
                </p>
                <h2 className="mt-5 max-w-4xl text-balance font-display text-4xl leading-[1] tracking-[-0.04em] sm:text-6xl">
                  Build the website you want. Keep the launch under control.
                </h2>
              </div>
              <Link
                href="/contact"
                className={buttonVariants({
                  size: "lg",
                  className:
                    "h-auto shrink-0 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-signal-strong hover:-translate-y-0.5 hover:bg-white/90",
                })}
              >
                Launch Website
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
