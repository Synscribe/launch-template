import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isVisualReviewEnabled, VISUAL_REVIEW_ENV } from "./_lib/visual-review";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Visual workshop",
  robots: "noindex, nofollow, noarchive",
};

export default function DevLayout({ children }: { children: React.ReactNode }) {
  if (!isVisualReviewEnabled(process.env[VISUAL_REVIEW_ENV])) notFound();

  return children;
}
