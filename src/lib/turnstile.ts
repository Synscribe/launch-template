const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const MAX_TOKEN_LENGTH = 2_048;

export const TURNSTILE_CONTACT_ACTION = "contact";

type TurnstileConfiguration =
  { enabled: false } | { enabled: true; siteKey: string };

export type TurnstileVerificationResult =
  { ok: true; skipped: boolean } | { ok: false; reason: string };

type SiteverifyResponse = {
  success?: boolean;
  action?: string;
  hostname?: string;
  "error-codes"?: string[];
};

function configuredValue(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value || undefined;
}

export function turnstileConfiguration(): TurnstileConfiguration {
  const siteKey = configuredValue("NEXT_PUBLIC_TURNSTILE_SITE_KEY");
  const secretKey = configuredValue("TURNSTILE_SECRET_KEY");

  return siteKey && secretKey ? { enabled: true, siteKey } : { enabled: false };
}

export async function verifyTurnstile({
  expectedAction,
  expectedHostname,
  remoteIp,
  token,
}: {
  expectedAction: string;
  expectedHostname: string;
  remoteIp?: string;
  token: unknown;
}): Promise<TurnstileVerificationResult> {
  const configuration = turnstileConfiguration();
  if (!configuration.enabled) return { ok: true, skipped: true };

  const secretKey = configuredValue("TURNSTILE_SECRET_KEY");
  if (!secretKey) return { ok: true, skipped: true };

  if (
    typeof token !== "string" ||
    token.length === 0 ||
    token.length > MAX_TOKEN_LENGTH
  ) {
    return { ok: false, reason: "missing-or-invalid-token" };
  }

  const body = new URLSearchParams({
    secret: secretKey,
    response: token,
    idempotency_key: crypto.randomUUID(),
  });
  if (remoteIp) body.set("remoteip", remoteIp);

  let response: Response;
  try {
    response = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    return { ok: false, reason: "verification-unavailable" };
  }

  if (!response.ok) {
    return { ok: false, reason: `siteverify-http-${response.status}` };
  }

  let responseValue: unknown;
  try {
    responseValue = await response.json();
  } catch {
    return { ok: false, reason: "invalid-siteverify-response" };
  }
  if (
    !responseValue ||
    typeof responseValue !== "object" ||
    Array.isArray(responseValue)
  ) {
    return { ok: false, reason: "invalid-siteverify-response" };
  }
  const result = responseValue as SiteverifyResponse;

  if (!result.success) {
    const errors = Array.isArray(result["error-codes"])
      ? result["error-codes"].filter(
          (errorCode): errorCode is string => typeof errorCode === "string",
        )
      : [];
    return {
      ok: false,
      reason: errors.join(",") || "token-rejected",
    };
  }
  if (result.action !== expectedAction) {
    return { ok: false, reason: "action-mismatch" };
  }
  if (result.hostname !== expectedHostname) {
    return { ok: false, reason: "hostname-mismatch" };
  }

  return { ok: true, skipped: false };
}
