import type { ComponentType, ReactNode } from "react";
import {
  ArrowRightIcon,
  CheckIcon,
  FileSearchIcon,
  LinkIcon,
  SearchIcon,
  ShieldCheckIcon,
  TrendingUpIcon,
} from "lucide-react";

import type { UseCaseFeatureId } from "@/lib/use-cases";

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
            <ArrowRightIcon className="size-4 text-signal" />
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
              className="flex-1 rounded-t-md bg-mint-strong/70"
              key={`${height}-${index}`}
              style={{ height: `${height}%` }}
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

const FEATURE_VISUALS: Record<UseCaseFeatureId, ComponentType> = {
  "url-inventory": UrlInventoryVisual,
  "url-decisions": UrlDecisionsVisual,
  "page-meaning": PageMeaningVisual,
  "release-gates": ReleaseGatesVisual,
  "post-launch-monitoring": MonitoringVisual,
};

export function FeatureVisual({ id }: { id: UseCaseFeatureId }) {
  const Visual = FEATURE_VISUALS[id];
  return <Visual />;
}
