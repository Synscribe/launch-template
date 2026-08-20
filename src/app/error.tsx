"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main
      id="main-content"
      className="mx-auto grid min-h-[70vh] w-full max-w-3xl place-items-center px-5 py-24 text-center sm:px-8"
    >
      <div>
        <p className="text-sm font-bold tracking-[0.18em] text-signal uppercase">
          Something failed
        </p>
        <h1 className="mt-5 font-display text-5xl tracking-[-0.04em] sm:text-7xl">
          The page hit an unexpected error.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-ink-muted">
          Try the request once more. Production errors should also be captured
          by the monitoring system selected for this client.
        </p>
        <Button
          type="button"
          size="lg"
          onClick={reset}
          className="mt-9 h-auto rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper hover:-translate-y-0.5 hover:bg-ink/85"
        >
          Try again
        </Button>
      </div>
    </main>
  );
}
