import {
  ATTRIBUTION_RETENTION_DAYS,
  MAX_RECENT_PAGES,
  parseUtm,
  type UtmParams,
} from "./visitor-context";

export const CONTACT_LIMITS = {
  name: 80,
  email: 254,
  company: 120,
  website: 300,
  message: 3000,
} as const;

export type ContactFields = {
  name: string;
  email: string;
  company: string;
  website: string;
  message: string;
};

export type ContactFieldErrors = Partial<Record<keyof ContactFields, string>>;

export type ContactAttribution = {
  referrerUrl: string | null;
  referrerDomain: string | null;
  firstVisitUrl: string | null;
  firstVisitAt: string | null;
  firstUtm: UtmParams | null;
  recentPages: string[];
};

export type ContactSubmission = ContactFields & {
  attribution: ContactAttribution;
};

type ContactPayloadResult =
  | { ok: true; submission: ContactSubmission }
  | { ok: false; error: string; fieldErrors?: ContactFieldErrors };

function stringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function validEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizedWebsite(value: string): string | null {
  if (!value) return "";
  try {
    const url = new URL(
      /^https?:\/\//i.test(value) ? value : `https://${value}`,
    );
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

export function validateContactFields(fields: ContactFields): {
  data: ContactFields | null;
  fieldErrors: ContactFieldErrors;
} {
  const values: ContactFields = {
    name: fields.name.trim(),
    email: fields.email.trim().toLowerCase(),
    company: fields.company.trim(),
    website: fields.website.trim(),
    message: fields.message.trim(),
  };
  const fieldErrors: ContactFieldErrors = {};

  if (values.name.length < 2 || values.name.length > CONTACT_LIMITS.name) {
    fieldErrors.name = `Enter a name between 2 and ${CONTACT_LIMITS.name} characters.`;
  }
  if (!validEmail(values.email) || values.email.length > CONTACT_LIMITS.email) {
    fieldErrors.email = "Enter a valid email address.";
  }
  if (values.company.length > CONTACT_LIMITS.company) {
    fieldErrors.company = `Keep the company name under ${CONTACT_LIMITS.company} characters.`;
  }

  const website = normalizedWebsite(values.website);
  if (website === null || website.length > CONTACT_LIMITS.website) {
    fieldErrors.website = "Enter a valid website URL.";
  } else {
    values.website = website;
  }

  if (
    values.message.length < 10 ||
    values.message.length > CONTACT_LIMITS.message
  ) {
    fieldErrors.message = `Enter between 10 and ${CONTACT_LIMITS.message} characters.`;
  }

  return {
    data: Object.keys(fieldErrors).length === 0 ? values : null,
    fieldErrors,
  };
}

function safeHttpUrl(value: unknown): URL | null {
  if (typeof value !== "string" || value.length > 600) return null;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}

function sameOriginPage(value: unknown, requestOrigin: string): string | null {
  const url = safeHttpUrl(value);
  if (!url || url.origin !== requestOrigin) return null;
  url.hash = "";

  const clean = new URL(url.pathname, url.origin);
  for (const key of [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
  ]) {
    const campaignValue = url.searchParams.get(key)?.trim().slice(0, 120);
    if (campaignValue) clean.searchParams.set(key, campaignValue);
  }
  return clean.toString();
}

function recentPage(value: unknown, requestOrigin: string): string | null {
  const url = safeHttpUrl(value);
  if (!url || url.origin !== requestOrigin) return null;
  return new URL(url.pathname, url.origin).toString();
}

function validVisitDate(value: unknown): string | null {
  if (typeof value !== "string" || value.length > 40) return null;
  const timestamp = Date.parse(value);
  if (
    !Number.isFinite(timestamp) ||
    timestamp > Date.now() + 5 * 60_000 ||
    timestamp < Date.now() - ATTRIBUTION_RETENTION_DAYS * 24 * 60 * 60 * 1000
  ) {
    return null;
  }
  return new Date(timestamp).toISOString();
}

function parseAttribution(
  value: unknown,
  requestOrigin: string,
): ContactAttribution {
  const source =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};
  const firstVisitAt = validVisitDate(source.firstVisitAt);
  const candidateReferrer = firstVisitAt
    ? safeHttpUrl(source.referrerUrl)
    : null;
  const referrer =
    candidateReferrer?.origin !== requestOrigin ? candidateReferrer : null;
  if (referrer) {
    referrer.username = "";
    referrer.password = "";
    referrer.search = "";
    referrer.hash = "";
  }
  const firstVisitUrl = firstVisitAt
    ? sameOriginPage(source.firstVisitUrl, requestOrigin)
    : null;
  const pages = Array.isArray(source.recentPages)
    ? source.recentPages
        .map((page) => recentPage(page, requestOrigin))
        .filter((page): page is string => Boolean(page))
        .slice(-MAX_RECENT_PAGES)
    : [];

  return {
    referrerUrl: referrer?.toString() ?? null,
    referrerDomain: referrer?.hostname ?? null,
    firstVisitUrl,
    firstVisitAt,
    firstUtm: firstVisitUrl ? parseUtm(firstVisitUrl) : null,
    recentPages: [...new Set(pages)],
  };
}

export function parseContactPayload(
  value: unknown,
  requestOrigin: string,
): ContactPayloadResult {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ok: false, error: "Invalid request." };
  }

  const source = value as Record<string, unknown>;
  const allowedKeys = new Set([
    "name",
    "email",
    "company",
    "website",
    "message",
    "attribution",
    "startedAt",
    "companyWebsite",
    "turnstileToken",
  ]);
  if (Object.keys(source).some((key) => !allowedKeys.has(key))) {
    return { ok: false, error: "Unexpected form fields." };
  }

  const validation = validateContactFields({
    name: stringValue(source.name),
    email: stringValue(source.email),
    company: stringValue(source.company),
    website: stringValue(source.website),
    message: stringValue(source.message),
  });

  if (!validation.data) {
    return {
      ok: false,
      error: "Check the highlighted fields.",
      fieldErrors: validation.fieldErrors,
    };
  }

  return {
    ok: true,
    submission: {
      ...validation.data,
      attribution: parseAttribution(source.attribution, requestOrigin),
    },
  };
}
