"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { recordPageview } from "@/lib/visitor-context";

export function VisitorContextTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    const query = searchParams.toString();
    recordPageview(
      `${window.location.origin}${pathname}${query ? `?${query}` : ""}`,
    );
  }, [pathname, searchParams]);

  return null;
}
