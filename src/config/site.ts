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
    { label: "Use Cases", href: "/uses" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ] satisfies NavigationItem[],
  socialLinks,
});

export type SiteConfig = typeof siteConfig;
