export type DeploymentEnvironment = "local" | "preview" | "production";

const DEFAULT_SITE_URL = "http://localhost:3000";

function optional(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function deploymentEnvironment(
  value: string | undefined,
): DeploymentEnvironment {
  if (value === "preview" || value === "production") return value;
  return "local";
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
  siteName: optional(process.env.NEXT_PUBLIC_SITE_NAME) ?? "Launch Template",
  siteUrl: normalizedUrl(process.env.NEXT_PUBLIC_SITE_URL),
  siteDescription:
    optional(process.env.NEXT_PUBLIC_SITE_DESCRIPTION) ??
    "A practical Next.js foundation for agentic websites, client migrations, rebuilds, and new launches.",
  deploymentEnvironment: deploymentEnvironment(
    process.env.NEXT_PUBLIC_DEPLOYMENT_ENV,
  ),
  contactEmail: optional(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  linkedinUrl: optional(process.env.NEXT_PUBLIC_LINKEDIN_URL),
  xUrl: optional(process.env.NEXT_PUBLIC_X_URL),
});

export const isProduction = env.deploymentEnvironment === "production";
export const usesTemplateIdentity =
  env.siteName === "Launch Template" || env.siteUrl === DEFAULT_SITE_URL;
