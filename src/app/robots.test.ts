import { describe, expect, it } from "vitest";

import { siteConfig } from "@/config/site";

import robots from "./robots";

describe("robots", () => {
  it("always allows public routes and blocks only internal routes", () => {
    expect(robots()).toEqual({
      rules: {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dev/"],
      },
      sitemap: `${siteConfig.url}/sitemap.xml`,
    });
  });
});
