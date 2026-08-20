import type { NextConfig } from "next";

import { redirects } from "./src/config/redirects";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return redirects;
  },
};

export default nextConfig;
