import { NextResponse } from "next/server";

import { isHumanPaced } from "@/lib/form-timing";

import { parseContactPayload } from "@/lib/contact";
import {
  deliverContactSubmission,
  isContactDeliveryConfigured,
} from "@/lib/contact-delivery";
import { TURNSTILE_CONTACT_ACTION, verifyTurnstile } from "@/lib/turnstile";

import { checkContactRateLimit } from "./_lib/rate-limit";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 20_000;

function clientKey(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "unknown"
  );
}

function sameOriginRequest(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

function safeError(
  message: string,
  status: number,
  extra?: Record<string, unknown>,
) {
  return NextResponse.json(
    { success: false, error: message, ...extra },
    { status },
  );
}

export async function POST(request: Request) {
  if (!sameOriginRequest(request)) {
    return safeError("This request could not be verified.", 403);
  }

  const contentLength = Number.parseInt(
    request.headers.get("content-length") ?? "0",
    10,
  );
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return safeError("The submission is too large.", 413);
  }

  let rawPayload: string;
  try {
    rawPayload = await request.text();
  } catch {
    return safeError("The form could not be read.", 400);
  }
  if (Buffer.byteLength(rawPayload, "utf8") > MAX_BODY_BYTES) {
    return safeError("The submission is too large.", 413);
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawPayload);
  } catch {
    return safeError("The form could not be read.", 400);
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return safeError("Invalid request.", 400);
  }

  const source = payload as Record<string, unknown>;
  if (typeof source.companyWebsite === "string" && source.companyWebsite) {
    return NextResponse.json({ success: true });
  }

  if (!isHumanPaced(source.elapsedMs)) {
    return safeError("Please reload the page and try again.", 400);
  }

  const parsed = parseContactPayload(payload, new URL(request.url).origin);
  if (!parsed.ok) {
    return safeError(parsed.error, 400, {
      fieldErrors: parsed.fieldErrors ?? {},
    });
  }

  const rateLimit = checkContactRateLimit(clientKey(request));
  if (!rateLimit.ok) {
    return NextResponse.json(
      {
        success: false,
        error: "Too many submissions. Please wait and try again.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      },
    );
  }

  if (!isContactDeliveryConfigured()) {
    return safeError(
      "Form delivery is not configured yet. Please try another contact method.",
      503,
    );
  }

  const contactClientKey = clientKey(request);
  const turnstile = await verifyTurnstile({
    expectedAction: TURNSTILE_CONTACT_ACTION,
    expectedHostname: new URL(request.url).hostname,
    remoteIp: contactClientKey === "unknown" ? undefined : contactClientKey,
    token: source.turnstileToken,
  });
  if (!turnstile.ok) {
    console.warn("Contact form Turnstile verification rejected", {
      reason: turnstile.reason,
    });
    return safeError(
      "Bot verification failed. Please refresh and try again.",
      403,
    );
  }

  try {
    await deliverContactSubmission(parsed.submission);
  } catch (error) {
    const code =
      error && typeof error === "object" && "code" in error
        ? String(error.code)
        : "unknown";
    console.error("Contact delivery failed", { code });
    return safeError(
      "Your message could not be sent. Please wait and try again.",
      502,
    );
  }

  return NextResponse.json({ success: true });
}
