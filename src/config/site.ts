import { env } from "./env";

export type NavigationItem = {
  label: string;
  href: string;
};

export const siteConfig = Object.freeze({
  name: "Launch Template",
  description:
    "Launch Template is a Next.js website foundation for developers and business owners building with Claude Code, Codex, or another AI coding tool.",
  url: env.siteUrl,
  locale: "en-SG",
  navigation: [
    { label: "Use Cases", href: "/uses" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ] satisfies NavigationItem[],
});

export type SiteConfig = typeof siteConfig;
