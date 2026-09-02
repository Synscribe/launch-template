import type { MetadataRoute } from "next";

import { isProduction } from "@/config/env";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  if (!isProduction) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/dev/"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
