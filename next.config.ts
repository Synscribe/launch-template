import type { NextConfig } from "next";

import { redirects } from "./src/config/redirects";

function contentImageRemotePattern():
  { protocol: "http" | "https"; hostname: string; port?: string } | undefined {
  if (!process.env.WISP_CONTENT_ORIGIN) return undefined;

  try {
    const url = new URL(process.env.WISP_CONTENT_ORIGIN);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;

    return {
      protocol: url.protocol === "https:" ? "https" : "http",
      hostname: url.hostname,
      ...(url.port ? { port: url.port } : {}),
    };
  } catch {
    return undefined;
  }
}

const wispContentImagePattern = contentImageRemotePattern();

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "imagedelivery.net" },
      ...(wispContentImagePattern ? [wispContentImagePattern] : []),
    ],
  },
  async redirects() {
    return redirects;
  },
};

export default nextConfig;
