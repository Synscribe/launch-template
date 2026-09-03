import { existsSync } from "node:fs";
import path from "node:path";

import type { NextConfig } from "next";

import { buildDiscoveryHeaderRules } from "./src/config/discovery";
import { redirects } from "./src/config/redirects";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "imagedelivery.net" }],
  },
  async redirects() {
    return redirects;
  },
  async headers() {
    return buildDiscoveryHeaderRules(
      existsSync(path.join(process.cwd(), "public/llms.txt")),
    );
  },
};

export default nextConfig;
