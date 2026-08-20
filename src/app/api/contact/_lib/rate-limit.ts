const WINDOW_MS = 10 * 60 * 1000;
const MAX_SUBMISSIONS = 5;

type RateLimitEntry = {
  count: number;
  resetsAt: number;
};

const entries = new Map<string, RateLimitEntry>();

export type RateLimitResult =
  { ok: true } | { ok: false; retryAfterSeconds: number };

export function checkContactRateLimit(
  key: string,
  now = Date.now(),
): RateLimitResult {
  for (const [entryKey, entry] of entries) {
    if (entry.resetsAt <= now) entries.delete(entryKey);
  }

  const current = entries.get(key);
  if (!current || current.resetsAt <= now) {
    entries.set(key, { count: 1, resetsAt: now + WINDOW_MS });
    return { ok: true };
  }

  if (current.count >= MAX_SUBMISSIONS) {
    return {
      ok: false,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((current.resetsAt - now) / 1000),
      ),
    };
  }

  current.count += 1;
  return { ok: true };
}

export function resetContactRateLimitForTests(): void {
  entries.clear();
}
