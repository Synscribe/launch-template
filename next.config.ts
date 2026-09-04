import { existsSync } from "node:fs";
import path from "node:path";

import type { NextConfig } from "next";

import { buildDiscoveryHeaderRules } from "./src/config/discovery";
import { redirects } from "./src/config/redirects";

const securityHeaders = [
  { key: "Content-Security-Policy", value: "frame-ancestors 'none';" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), geolocation=(), microphone=()",
  },
] as const;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "imagedelivery.net" }],
  },
  async redirects() {
    return redirects;
  },
  async headers() {
    return [
      ...buildDiscoveryHeaderRules(
        existsSync(path.join(process.cwd(), "public/llms.txt")),
      ),
      {
        source: "/(.*)",
        headers: [...securityHeaders],
      },
    ];
  },
};

export default nextConfig;
