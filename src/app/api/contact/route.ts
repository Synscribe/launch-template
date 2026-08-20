import { NextResponse } from "next/server";

import { parseContactPayload } from "@/lib/contact";
import {
  deliverContactSubmission,
  isContactDeliveryConfigured,
} from "@/lib/contact-delivery";

import { checkContactRateLimit } from "./_lib/rate-limit";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 20_000;
const MIN_COMPLETION_MS = 1_200;
const MAX_COMPLETION_MS = 12 * 60 * 60 * 1000;

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

  const startedAt =
    typeof source.startedAt === "number" ? source.startedAt : Number.NaN;
  const elapsed = Date.now() - startedAt;
  if (
    !Number.isFinite(startedAt) ||
    elapsed < MIN_COMPLETION_MS ||
    elapsed > MAX_COMPLETION_MS
  ) {
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
