// Bots submit forms instantly. The browser measures how long the visitor took
// with its monotonic clock and sends only the duration: comparing a browser
// timestamp with the server clock rejected every visitor whose device clock
// ran fast.
const MIN_COMPLETION_MS = 1_200;
const MAX_COMPLETION_MS = 12 * 60 * 60 * 1000;

/** Milliseconds since `start`, a `performance.now()` reading from mount. */
export function elapsedSince(start: number): number {
  return Math.round(performance.now() - start);
}

export function isHumanPaced(elapsedMs: unknown): boolean {
  return (
    typeof elapsedMs === "number" &&
    Number.isFinite(elapsedMs) &&
    elapsedMs >= MIN_COMPLETION_MS &&
    elapsedMs <= MAX_COMPLETION_MS
  );
}
