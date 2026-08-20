import { env } from "./env";

export type NavigationItem = {
  label: string;
  href: string;
};

const socialLinks = [
  env.linkedinUrl ? { label: "LinkedIn", href: env.linkedinUrl } : undefined,
  env.xUrl ? { label: "X", href: env.xUrl } : undefined,
].filter((item): item is NavigationItem => Boolean(item));

export const siteConfig = Object.freeze({
  name: env.siteName,
  description: env.siteDescription,
  url: env.siteUrl,
  locale: "en-SG",
  contactEmail: env.contactEmail,
  navigation: [
    { label: "Principles", href: "/#principles" },
    { label: "Priorities", href: "/#priorities" },
    { label: "Workflow", href: "/#workflow" },
    { label: "Uses", href: "/uses" },
  ] satisfies NavigationItem[],
  socialLinks,
});

export type SiteConfig = typeof siteConfig;
