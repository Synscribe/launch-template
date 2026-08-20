export type UtmParams = {
  source: string | null;
  medium: string | null;
  campaign: string | null;
  term: string | null;
  content: string | null;
};

export type VisitorContext = {
  referrerUrl: string | null;
  referrerDomain: string | null;
  firstVisitUrl: string | null;
  firstVisitAt: string | null;
  firstUtm: UtmParams | null;
  recentPages: string[];
};

export const VISITOR_CONTEXT_STORAGE_KEY = "visitor_context_v1";
export const MAX_RECENT_PAGES = 5;
export const ATTRIBUTION_RETENTION_DAYS = 90;

const ATTRIBUTION_RETENTION_MS =
  ATTRIBUTION_RETENTION_DAYS * 24 * 60 * 60 * 1000;

const EMPTY_CONTEXT: VisitorContext = {
  referrerUrl: null,
  referrerDomain: null,
  firstVisitUrl: null,
  firstVisitAt: null,
  firstUtm: null,
  recentPages: [],
};

const utmKeys = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

export function isAttributionExpired(
  firstVisitAt: string | null,
  now = new Date(),
): boolean {
  if (!firstVisitAt) return false;
  const timestamp = Date.parse(firstVisitAt);
  return (
    !Number.isFinite(timestamp) ||
    timestamp > now.getTime() + 5 * 60_000 ||
    now.getTime() - timestamp > ATTRIBUTION_RETENTION_MS
  );
}

function boundedCampaignValue(value: string | null): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed.slice(0, 120) : null;
}

export function parseUtm(url: string): UtmParams | null {
  try {
    const searchParams = new URL(url).searchParams;
    const values = {
      source: boundedCampaignValue(searchParams.get("utm_source")),
      medium: boundedCampaignValue(searchParams.get("utm_medium")),
      campaign: boundedCampaignValue(searchParams.get("utm_campaign")),
      term: boundedCampaignValue(searchParams.get("utm_term")),
      content: boundedCampaignValue(searchParams.get("utm_content")),
    };
    return Object.values(values).some(Boolean) ? values : null;
  } catch {
    return null;
  }
}

function safeHttpUrl(value: string): URL | null {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}

function cleanPageUrl(value: string, keepUtm: boolean): string | null {
  const url = safeHttpUrl(value);
  if (!url) return null;

  const clean = new URL(url.pathname, url.origin);
  if (keepUtm) {
    for (const key of utmKeys) {
      const campaignValue = boundedCampaignValue(url.searchParams.get(key));
      if (campaignValue) clean.searchParams.set(key, campaignValue);
    }
  }
  return clean.toString();
}

function cleanExternalReferrer(
  referrerUrl: string,
  siteOrigin: string,
): { url: string | null; domain: string | null } {
  const referrer = safeHttpUrl(referrerUrl);
  if (!referrer || referrer.origin === siteOrigin) {
    return { url: null, domain: null };
  }
  referrer.username = "";
  referrer.password = "";
  referrer.search = "";
  referrer.hash = "";
  return { url: referrer.toString(), domain: referrer.hostname };
}

export function updateVisitorContext(
  current: VisitorContext,
  {
    pageUrl,
    referrerUrl = "",
    visitedAt = new Date(),
  }: {
    pageUrl: string;
    referrerUrl?: string;
    visitedAt?: Date;
  },
): VisitorContext {
  const page = safeHttpUrl(pageUrl);
  if (!page) return current;

  const next: VisitorContext = {
    ...current,
    recentPages: [...current.recentPages].slice(-MAX_RECENT_PAGES),
  };

  if (!next.firstVisitUrl) {
    const referrer = cleanExternalReferrer(referrerUrl, page.origin);
    next.referrerUrl = referrer.url;
    next.referrerDomain = referrer.domain;
    next.firstVisitUrl = cleanPageUrl(pageUrl, true);
    next.firstVisitAt = visitedAt.toISOString();
    next.firstUtm = parseUtm(pageUrl);
  }

  const recentPage = cleanPageUrl(pageUrl, false);
  if (
    recentPage &&
    next.recentPages[next.recentPages.length - 1] !== recentPage
  ) {
    next.recentPages = [...next.recentPages, recentPage].slice(
      -MAX_RECENT_PAGES,
    );
  }

  return next;
}

function readContext(): VisitorContext {
  if (typeof window === "undefined") return { ...EMPTY_CONTEXT };

  try {
    const stored = window.localStorage.getItem(VISITOR_CONTEXT_STORAGE_KEY);
    if (!stored) return { ...EMPTY_CONTEXT };
    const parsed = JSON.parse(stored) as Partial<VisitorContext>;
    if (
      isAttributionExpired(
        typeof parsed.firstVisitAt === "string" ? parsed.firstVisitAt : null,
      )
    ) {
      return { ...EMPTY_CONTEXT, recentPages: [] };
    }
    return {
      referrerUrl:
        typeof parsed.referrerUrl === "string" ? parsed.referrerUrl : null,
      referrerDomain:
        typeof parsed.referrerDomain === "string"
          ? parsed.referrerDomain
          : null,
      firstVisitUrl:
        typeof parsed.firstVisitUrl === "string" ? parsed.firstVisitUrl : null,
      firstVisitAt:
        typeof parsed.firstVisitAt === "string" ? parsed.firstVisitAt : null,
      firstUtm: parsed.firstUtm ?? null,
      recentPages: Array.isArray(parsed.recentPages)
        ? parsed.recentPages
            .filter((page): page is string => typeof page === "string")
            .slice(-MAX_RECENT_PAGES)
        : [],
    };
  } catch {
    return { ...EMPTY_CONTEXT };
  }
}

export function recordPageview(pageUrl: string): void {
  if (typeof window === "undefined") return;

  const context = updateVisitorContext(readContext(), {
    pageUrl,
    referrerUrl: document.referrer,
  });

  try {
    window.localStorage.setItem(
      VISITOR_CONTEXT_STORAGE_KEY,
      JSON.stringify(context),
    );
  } catch {
    // Storage can be unavailable in private browsing or after consent changes.
  }
}

export function getVisitorContext(): VisitorContext {
  return readContext();
}
