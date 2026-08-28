import { afterEach, describe, expect, it, vi } from "vitest";

import { turnstileConfiguration, verifyTurnstile } from "./turnstile";

function configureTurnstile({
  secretKey = "",
  siteKey = "",
}: {
  secretKey?: string;
  siteKey?: string;
} = {}) {
  vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", siteKey);
  vi.stubEnv("TURNSTILE_SECRET_KEY", secretKey);
}

describe("Turnstile", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("stays disabled unless both keys are configured", () => {
    configureTurnstile();
    expect(turnstileConfiguration()).toEqual({ enabled: false });

    configureTurnstile({ siteKey: "public-key" });
    expect(turnstileConfiguration()).toEqual({ enabled: false });

    configureTurnstile({ secretKey: "secret-key" });
    expect(turnstileConfiguration()).toEqual({ enabled: false });

    configureTurnstile({
      secretKey: "secret-key",
      siteKey: "public-key",
    });
    expect(turnstileConfiguration()).toEqual({
      enabled: true,
      siteKey: "public-key",
    });
  });

  it("skips verification without a complete configuration", async () => {
    configureTurnstile({ siteKey: "public-key" });
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    await expect(
      verifyTurnstile({
        expectedAction: "contact",
        expectedHostname: "example.com",
        token: undefined,
      }),
    ).resolves.toEqual({ ok: true, skipped: true });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("rejects a missing token when configured", async () => {
    configureTurnstile({
      secretKey: "secret-key",
      siteKey: "public-key",
    });

    await expect(
      verifyTurnstile({
        expectedAction: "contact",
        expectedHostname: "example.com",
        token: undefined,
      }),
    ).resolves.toEqual({ ok: false, reason: "missing-or-invalid-token" });
  });

  it("fails closed when Siteverify is unavailable", async () => {
    configureTurnstile({
      secretKey: "secret-key",
      siteKey: "public-key",
    });
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"));

    await expect(
      verifyTurnstile({
        expectedAction: "contact",
        expectedHostname: "example.com",
        token: "solved-token",
      }),
    ).resolves.toEqual({ ok: false, reason: "verification-unavailable" });
  });

  it("verifies a token with action, hostname, IP, and an idempotency key", async () => {
    configureTurnstile({
      secretKey: "secret-key",
      siteKey: "public-key",
    });
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          action: "contact",
          hostname: "example.com",
        }),
        { status: 200 },
      ),
    );

    await expect(
      verifyTurnstile({
        expectedAction: "contact",
        expectedHostname: "example.com",
        remoteIp: "192.0.2.1",
        token: "solved-token",
      }),
    ).resolves.toEqual({ ok: true, skipped: false });

    expect(fetchSpy).toHaveBeenCalledOnce();
    const request = fetchSpy.mock.calls[0]?.[1];
    const body = request?.body as URLSearchParams;
    expect(body.get("secret")).toBe("secret-key");
    expect(body.get("response")).toBe("solved-token");
    expect(body.get("remoteip")).toBe("192.0.2.1");
    expect(body.get("idempotency_key")).toMatch(/^[0-9a-f]{8}-[0-9a-f-]{27}$/);
  });

  it.each([
    [
      "action",
      { success: true, action: "newsletter", hostname: "example.com" },
    ],
    [
      "hostname",
      { success: true, action: "contact", hostname: "other.example" },
    ],
  ])("rejects a mismatched %s", async (field, response) => {
    configureTurnstile({
      secretKey: "secret-key",
      siteKey: "public-key",
    });
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(response), { status: 200 }),
    );

    await expect(
      verifyTurnstile({
        expectedAction: "contact",
        expectedHostname: "example.com",
        token: "solved-token",
      }),
    ).resolves.toEqual({ ok: false, reason: `${field}-mismatch` });
  });
});
