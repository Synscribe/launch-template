import type { Metadata } from "next";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="mx-auto grid min-h-[70vh] w-full max-w-3xl place-items-center px-5 py-24 text-center sm:px-8"
    >
      <div>
        <p className="text-sm font-bold tracking-[0.18em] text-signal uppercase">
          404 · Route not found
        </p>
        <h1 className="mt-5 font-display text-5xl tracking-[-0.04em] sm:text-7xl">
          This page did not make the launch map.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-ink-muted">
          The URL may have moved, been removed intentionally, or never existed.
          A real 404 is better than sending every missing page back to home.
        </p>
        <Link
          href="/"
          className={buttonVariants({
            size: "lg",
            className:
              "mt-9 h-auto rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper hover:-translate-y-0.5 hover:bg-ink/85",
          })}
        >
          Return home
        </Link>
      </div>
    </main>
  );
}
