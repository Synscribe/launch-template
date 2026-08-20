import type { ComponentType, ReactNode } from "react";
import {
  ArrowRightIcon,
  BadgeCheckIcon,
  BarChartIcon,
  CheckIcon,
  FileSearchIcon,
  GitBranchIcon,
  LayoutTemplateIcon,
  LinkIcon,
  MousePointerClickIcon,
  NetworkIcon,
  SearchIcon,
  SearchCheckIcon,
  ShieldCheckIcon,
  TargetIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react";

import type { UseCaseFeatureId } from "@/lib/use-cases";

import styles from "./feature-visuals.module.css";

function VisualShell({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div
      aria-hidden="true"
      className="relative min-h-[19rem] min-w-0 overflow-hidden rounded-[1.75rem] border border-ink/10 bg-paper p-5 shadow-[0_24px_70px_rgba(29,41,38,0.07)] sm:p-7"
    >
      <div className="absolute -top-20 -right-20 size-52 rounded-full bg-mint/45 blur-2xl" />
      <div className="relative">
        <p className="text-xs font-bold tracking-[0.14em] text-signal-strong uppercase">
          {label}
        </p>
        {children}
      </div>
    </div>
  );
}

function UrlInventoryVisual() {
  return (
    <VisualShell label="URL inventory">
      <div className="mt-5 flex items-center justify-between gap-4">
        <div>
          <p className="font-display text-3xl leading-none">
            One complete list
          </p>
          <p className="mt-2 text-sm text-ink-muted">All sources, one review</p>
        </div>
        <span className="grid size-11 place-items-center rounded-full bg-ink text-mint">
          <FileSearchIcon className="size-5" />
        </span>
      </div>

      <div className="mt-7 flex flex-wrap gap-2">
        {["Sitemap", "Analytics", "Search Console", "CMS"].map((source) => (
          <span
            className="rounded-full border border-ink/10 bg-canvas px-3 py-1.5 text-xs font-semibold"
            key={source}
          >
            {source}
          </span>
        ))}
      </div>

      <div className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
        {[
          ["/services", "Keep"],
          ["/old-guide", "Review"],
          ["/campaign.pdf", "File"],
        ].map(([path, state]) => (
          <div className="flex items-center justify-between py-3" key={path}>
            <span className="font-mono text-xs text-ink-muted">{path}</span>
            <span className="text-xs font-bold text-ink">{state}</span>
          </div>
        ))}
      </div>
    </VisualShell>
  );
}

function UrlDecisionsVisual() {
  return (
    <VisualShell label="URL map">
      <div className="mt-5 flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-full bg-ink text-mint">
          <LinkIcon className="size-5" />
        </span>
        <div>
          <p className="font-display text-3xl leading-none">
            Every path decided
          </p>
          <p className="mt-2 text-sm text-ink-muted">No launch-day guessing</p>
        </div>
      </div>

      <div className="mt-7 space-y-3">
        {[
          ["/old-service", "/services", "Redirect"],
          ["/about-us", "/about", "Move"],
          ["/expired-offer", "No replacement", "Remove"],
        ].map(([from, to, action]) => (
          <div
            className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-xl border border-ink/10 bg-canvas p-3"
            key={from}
          >
            <span className="truncate font-mono text-xs text-ink-muted">
              {from}
            </span>
            <ArrowRightIcon
              className={`${styles.handoffArrow} size-4 text-signal`}
            />
            <div className="min-w-0 text-right">
              <p className="truncate font-mono text-xs text-ink">{to}</p>
              <p className="mt-1 text-[11px] font-bold text-ink-faint uppercase">
                {action}
              </p>
            </div>
          </div>
        ))}
      </div>
    </VisualShell>
  );
}

function PageMeaningVisual() {
  return (
    <VisualShell label="Page review">
      <div className="mt-5 rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-ink/10 pb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-ink-muted">
            <SearchIcon className="size-4 text-signal" />
            Search preview
          </div>
          <span className="rounded-full bg-mint px-2.5 py-1 text-[11px] font-bold">
            Clear
          </span>
        </div>

        <div className="mt-5 space-y-5">
          <div>
            <p className="text-[11px] font-bold tracking-[0.12em] text-ink-faint uppercase">
              Title
            </p>
            <p className="mt-1 text-sm font-semibold">
              One page, one clear topic
            </p>
          </div>
          <div>
            <p className="text-[11px] font-bold tracking-[0.12em] text-ink-faint uppercase">
              H1
            </p>
            <p className="mt-1 font-display text-2xl leading-tight">
              Say what the page is for.
            </p>
          </div>
          <div className="space-y-2">
            <div className="h-2 w-full rounded-full bg-ink/10" />
            <div className="h-2 w-5/6 rounded-full bg-ink/10" />
            <div className="h-2 w-2/3 rounded-full bg-mint-strong/55" />
          </div>
        </div>
      </div>
    </VisualShell>
  );
}

function ReleaseGatesVisual() {
  return (
    <VisualShell label="Launch check">
      <div className="mt-5 flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-full bg-ink text-mint">
          <ShieldCheckIcon className="size-5" />
        </span>
        <div>
          <p className="font-display text-3xl leading-none">
            Ready means tested
          </p>
          <p className="mt-2 text-sm text-ink-muted">
            Check the final environment
          </p>
        </div>
      </div>

      <div className="mt-7 divide-y divide-ink/10 rounded-2xl border border-ink/10 bg-canvas px-4">
        {[
          "Routes and redirects",
          "Canonicals and robots",
          "Forms and analytics",
          "404 and rollback",
        ].map((check) => (
          <div className="flex items-center gap-3 py-3.5" key={check}>
            <span className="grid size-6 place-items-center rounded-full bg-mint text-ink">
              <CheckIcon className="size-3.5" />
            </span>
            <span className="text-sm font-semibold">{check}</span>
          </div>
        ))}
      </div>
    </VisualShell>
  );
}

function MonitoringVisual() {
  return (
    <VisualShell label="After launch">
      <div className="mt-5 flex items-center justify-between gap-4">
        <div>
          <p className="font-display text-3xl leading-none">Watch the pages</p>
          <p className="mt-2 text-sm text-ink-muted">Find changes early</p>
        </div>
        <span className="grid size-11 place-items-center rounded-full bg-ink text-mint">
          <TrendingUpIcon className="size-5" />
        </span>
      </div>

      <div className="mt-7 rounded-2xl border border-ink/10 bg-canvas p-4">
        <div className="flex h-28 items-end gap-3 border-b border-ink/10 px-2">
          {[44, 58, 52, 72, 66, 82, 88].map((height, index) => (
            <div
              className={`${styles.monitorBar} flex-1 rounded-t-md bg-mint-strong/70`}
              key={`${height}-${index}`}
              style={{
                animationDelay: `${180 + index * 65}ms`,
                height: `${height}%`,
              }}
            />
          ))}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          {["Old URLs", "Landing pages", "Conversions"].map((label) => (
            <div key={label}>
              <p className="text-[11px] font-bold text-ink-faint uppercase">
                {label}
              </p>
              <p className="mt-1 text-sm font-semibold">Watching</p>
            </div>
          ))}
        </div>
      </div>
    </VisualShell>
  );
}

function OfferAndAudienceVisual() {
  return (
    <VisualShell label="Message check">
      <div className="mt-5 flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-full bg-ink text-mint">
          <TargetIcon className="size-5" />
        </span>
        <div>
          <p className="font-display text-3xl leading-none">Say it plainly</p>
          <p className="mt-2 text-sm text-ink-muted">
            One buyer, one problem, one promise
          </p>
        </div>
      </div>

      <div className="mt-7 divide-y divide-ink/10 border-y border-ink/10">
        {[
          ["For", "Operations teams"],
          ["Who need", "Fewer manual handoffs"],
          ["We help", "Keep work moving"],
        ].map(([label, value]) => (
          <div className="grid grid-cols-[5.5rem_1fr] gap-4 py-3.5" key={label}>
            <span className="text-xs font-bold text-ink-faint uppercase">
              {label}
            </span>
            <span className="text-sm font-semibold">{value}</span>
          </div>
        ))}
      </div>
    </VisualShell>
  );
}

function ConversionPathVisual() {
  return (
    <VisualShell label="Conversion path">
      <div className="mt-5 flex items-center justify-between gap-4">
        <div>
          <p className="font-display text-3xl leading-none">
            One clear next step
          </p>
          <p className="mt-2 text-sm text-ink-muted">
            Useful paths, not button clutter
          </p>
        </div>
        <span className="grid size-11 place-items-center rounded-full bg-ink text-mint">
          <MousePointerClickIcon className="size-5" />
        </span>
      </div>

      <div className="mt-7 grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2">
        {["Land", "Learn", "Act"].map((step, index) => (
          <div className="contents" key={step}>
            <div className="rounded-xl border border-ink/10 bg-canvas px-2 py-4 text-center text-xs font-bold">
              {step}
            </div>
            {index < 2 ? (
              <ArrowRightIcon className="size-4 text-signal" />
            ) : null}
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between rounded-xl bg-ink p-4 text-paper">
        <div>
          <p className="text-xs text-white/55 uppercase">Primary action</p>
          <p className="mt-1 text-sm font-semibold">Start the conversation</p>
        </div>
        <ArrowRightIcon className="size-5 text-mint" />
      </div>
    </VisualShell>
  );
}

function ProofAndTrustVisual() {
  return (
    <VisualShell label="Trust plan">
      <div className="mt-5 flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-full bg-ink text-mint">
          <BadgeCheckIcon className="size-5" />
        </span>
        <div>
          <p className="font-display text-3xl leading-none">Show the proof</p>
          <p className="mt-2 text-sm text-ink-muted">
            Use what the team can back up
          </p>
        </div>
      </div>

      <div className="mt-7 space-y-3">
        {[
          ["Product", "A real workflow or demo"],
          ["Team", "Relevant experience"],
          ["Answers", "Clear limits and FAQs"],
        ].map(([label, value]) => (
          <div
            className="flex items-center gap-3 rounded-xl border border-ink/10 bg-canvas p-3.5"
            key={label}
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-mint text-ink">
              <CheckIcon className="size-3.5" />
            </span>
            <div>
              <p className="text-[11px] font-bold text-ink-faint uppercase">
                {label}
              </p>
              <p className="mt-0.5 text-sm font-semibold">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </VisualShell>
  );
}

function MeasurementPlanVisual() {
  return (
    <VisualShell label="Measurement plan">
      <div className="mt-5 flex items-center justify-between gap-4">
        <div>
          <p className="font-display text-3xl leading-none">
            Track useful actions
          </p>
          <p className="mt-2 text-sm text-ink-muted">
            A short event list with owners
          </p>
        </div>
        <span className="grid size-11 place-items-center rounded-full bg-ink text-mint">
          <BarChartIcon className="size-5" />
        </span>
      </div>

      <div className="mt-7 overflow-hidden rounded-xl border border-ink/10 bg-canvas">
        {[
          ["use_case_viewed", "Page"],
          ["cta_clicked", "Intent"],
          ["form_submitted", "Lead"],
        ].map(([event, stage]) => (
          <div
            className="flex items-center justify-between border-b border-ink/10 px-4 py-3 last:border-0"
            key={event}
          >
            <span className="font-mono text-xs text-ink-muted">{event}</span>
            <span className="rounded-full bg-mint px-2.5 py-1 text-[11px] font-bold">
              {stage}
            </span>
          </div>
        ))}
      </div>
    </VisualShell>
  );
}

function BuyerJourneysVisual() {
  return (
    <VisualShell label="Buyer journeys">
      <div className="mt-5 flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-full bg-ink text-mint">
          <UsersIcon className="size-5" />
        </span>
        <div>
          <p className="font-display text-3xl leading-none">Meet each buyer</p>
          <p className="mt-2 text-sm text-ink-muted">
            Send people to the right answer
          </p>
        </div>
      </div>

      <div className="mt-7 space-y-3">
        {[
          ["New visitor", "What it does"],
          ["Evaluator", "Why it fits"],
          ["Ready buyer", "How to start"],
        ].map(([visitor, destination]) => (
          <div
            className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-xl border border-ink/10 bg-canvas p-3"
            key={visitor}
          >
            <span className="text-xs font-semibold">{visitor}</span>
            <ArrowRightIcon className="size-4 text-signal" />
            <span className="text-right text-xs text-ink-muted">
              {destination}
            </span>
          </div>
        ))}
      </div>
    </VisualShell>
  );
}

function InformationArchitectureVisual() {
  return (
    <VisualShell label="Site structure">
      <div className="mt-5 flex items-center justify-between gap-4">
        <div>
          <p className="font-display text-3xl leading-none">
            A smaller, clearer tree
          </p>
          <p className="mt-2 text-sm text-ink-muted">
            Pages follow real questions
          </p>
        </div>
        <span className="grid size-11 place-items-center rounded-full bg-ink text-mint">
          <NetworkIcon className="size-5" />
        </span>
      </div>

      <div className="mt-7 rounded-xl border border-ink/10 bg-canvas p-4">
        <div className="inline-flex rounded-lg bg-ink px-3 py-2 font-mono text-xs text-paper">
          /
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 border-t border-ink/10 pt-4">
          {["/product", "/uses", "/resources"].map((route) => (
            <div
              className="rounded-lg border border-ink/10 bg-paper px-2 py-3 text-center font-mono text-[11px] text-ink-muted"
              key={route}
            >
              {route}
            </div>
          ))}
        </div>
      </div>
    </VisualShell>
  );
}

function ReusablePagesVisual() {
  return (
    <VisualShell label="Page system">
      <div className="mt-5 flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-full bg-ink text-mint">
          <LayoutTemplateIcon className="size-5" />
        </span>
        <div>
          <p className="font-display text-3xl leading-none">Repeat the rules</p>
          <p className="mt-2 text-sm text-ink-muted">
            Keep the message specific
          </p>
        </div>
      </div>

      <div className="mt-7 grid grid-cols-3 gap-3">
        {["Use", "Industry", "Compare"].map((page, index) => (
          <div
            className="rounded-xl border border-ink/10 bg-canvas p-3"
            key={page}
          >
            <div
              className={`h-2 rounded-full ${index === 1 ? "bg-signal/70" : "bg-mint-strong/65"}`}
            />
            <div className="mt-3 h-1.5 w-full rounded-full bg-ink/10" />
            <div className="mt-2 h-1.5 w-2/3 rounded-full bg-ink/10" />
            <p className="mt-5 text-xs font-bold">{page}</p>
          </div>
        ))}
      </div>
    </VisualShell>
  );
}

function SearchIntentVisual() {
  return (
    <VisualShell label="Search intent">
      <div className="mt-5 flex items-center justify-between gap-4">
        <div>
          <p className="font-display text-3xl leading-none">
            Match the question
          </p>
          <p className="mt-2 text-sm text-ink-muted">
            One page for one useful job
          </p>
        </div>
        <span className="grid size-11 place-items-center rounded-full bg-ink text-mint">
          <SearchCheckIcon className="size-5" />
        </span>
      </div>

      <div className="mt-7 overflow-hidden rounded-xl border border-ink/10 bg-canvas">
        {[
          ["How does it work?", "Guide"],
          ["Is it right for us?", "Use case"],
          ["What does it cost?", "Pricing"],
        ].map(([query, page]) => (
          <div
            className="flex items-center justify-between gap-4 border-b border-ink/10 px-4 py-3.5 last:border-0"
            key={query}
          >
            <span className="text-xs font-semibold">{query}</span>
            <span className="text-xs text-ink-muted">{page}</span>
          </div>
        ))}
      </div>
    </VisualShell>
  );
}

function InternalLinksVisual() {
  return (
    <VisualShell label="Internal links">
      <div className="mt-5 flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-full bg-ink text-mint">
          <GitBranchIcon className="size-5" />
        </span>
        <div>
          <p className="font-display text-3xl leading-none">
            Connect related pages
          </p>
          <p className="mt-2 text-sm text-ink-muted">
            Help readers keep moving
          </p>
        </div>
      </div>

      <div className="mt-7 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="space-y-2">
          {["Guide", "Use case", "Article"].map((page) => (
            <div
              className="rounded-lg border border-ink/10 bg-canvas px-3 py-2 text-xs font-semibold"
              key={page}
            >
              {page}
            </div>
          ))}
        </div>
        <ArrowRightIcon className="size-5 text-signal" />
        <div className="rounded-xl bg-ink px-4 py-8 text-center text-sm font-semibold text-paper">
          Main topic
        </div>
      </div>
    </VisualShell>
  );
}

const FEATURE_VISUALS: Record<UseCaseFeatureId, ComponentType> = {
  "url-inventory": UrlInventoryVisual,
  "url-decisions": UrlDecisionsVisual,
  "page-meaning": PageMeaningVisual,
  "release-gates": ReleaseGatesVisual,
  "post-launch-monitoring": MonitoringVisual,
  "offer-and-audience": OfferAndAudienceVisual,
  "conversion-path": ConversionPathVisual,
  "proof-and-trust": ProofAndTrustVisual,
  "measurement-plan": MeasurementPlanVisual,
  "buyer-journeys": BuyerJourneysVisual,
  "information-architecture": InformationArchitectureVisual,
  "reusable-pages": ReusablePagesVisual,
  "search-intent": SearchIntentVisual,
  "internal-links": InternalLinksVisual,
};

export function FeatureVisual({ id }: { id: UseCaseFeatureId }) {
  const Visual = FEATURE_VISUALS[id];
  return <Visual />;
}
