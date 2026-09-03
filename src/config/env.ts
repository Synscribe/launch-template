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

function optionalUrl(
  value: string | undefined,
  name: string,
): string | undefined {
  const candidate = optional(value);
  if (!candidate) return undefined;

  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:")
      throw new Error();
    return url.toString().replace(/\/$/, "");
  } catch {
    throw new Error(
      `${name} must be an absolute HTTP(S) URL. Received: ${candidate}`,
    );
  }
}

export const env = Object.freeze({
  siteName: optional(process.env.NEXT_PUBLIC_SITE_NAME) ?? "Launch Template",
  siteUrl: normalizedUrl(process.env.NEXT_PUBLIC_SITE_URL),
  siteDescription:
    optional(process.env.NEXT_PUBLIC_SITE_DESCRIPTION) ??
    "Launch Template is a Next.js website foundation for developers and business owners building with Claude Code, Codex, or another AI coding tool.",
  contactEmail: optional(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  linkedinUrl: optional(process.env.NEXT_PUBLIC_LINKEDIN_URL),
  xUrl: optional(process.env.NEXT_PUBLIC_X_URL),
  wispBlogId: optional(process.env.WISP_BLOG_ID),
  wispContentOrigin: optionalUrl(
    process.env.WISP_CONTENT_ORIGIN,
    "WISP_CONTENT_ORIGIN",
  ),
});

export const usesTemplateIdentity =
  env.siteName === "Launch Template" || env.siteUrl === DEFAULT_SITE_URL;
