const DEFAULT_SITE_URL = "http://localhost:3000";

function optional(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function normalizedUrl(value: string | undefined): string {
  const candidate = optional(value) ?? DEFAULT_SITE_URL;

  try {
    const url = new URL(candidate);
    return url.toString().replace(/\/$/, "");
  } catch {
    throw new Error(
      `NEXT_PUBLIC_SITE_URL must be an absolute URL. Received: ${candidate}`,
    );
  }
}

export const env = Object.freeze({
  siteUrl: normalizedUrl(process.env.NEXT_PUBLIC_SITE_URL),
  wispBlogId: optional(process.env.WISP_BLOG_ID),
});

export const usesDefaultSiteUrl = env.siteUrl === DEFAULT_SITE_URL;
