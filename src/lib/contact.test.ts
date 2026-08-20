import { afterEach, describe, expect, it, vi } from "vitest";

import { parseContactPayload, validateContactFields } from "./contact";

const validFields = {
  name: "Raymond Yeh",
  email: "raymond@example.com",
  company: "Synscribe",
  website: "example.com",
  message: "We need to rebuild our website before the next launch.",
};

describe("contact validation", () => {
  afterEach(() => vi.useRealTimers());

  it("normalizes a valid submission", () => {
    const result = validateContactFields(validFields);

    expect(result.fieldErrors).toEqual({});
    expect(result.data?.website).toBe("https://example.com/");
  });

  it("returns field-specific errors", () => {
    const result = validateContactFields({
      ...validFields,
      name: "x",
      email: "not-an-email",
      message: "short",
    });

    expect(result.data).toBeNull();
    expect(result.fieldErrors).toMatchObject({
      name: expect.any(String),
      email: expect.any(String),
      message: expect.any(String),
    });
  });

  it("keeps only same-origin attribution and approved UTM values", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-20T12:00:00.000Z"));

    const result = parseContactPayload(
      {
        ...validFields,
        startedAt: Date.now() - 5_000,
        companyWebsite: "",
        attribution: {
          referrerUrl: "https://private:secret@google.com/search?q=private",
          firstVisitUrl:
            "https://example.com/uses?utm_source=google&private=value",
          firstVisitAt: "2026-08-20T10:00:00.000Z",
          recentPages: [
            "https://malicious.example/steal",
            "https://example.com/blog?token=private",
            "https://example.com/contact",
          ],
        },
      },
      "https://example.com",
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.submission.attribution).toMatchObject({
      referrerUrl: "https://google.com/search",
      referrerDomain: "google.com",
      firstVisitUrl: "https://example.com/uses?utm_source=google",
      firstUtm: { source: "google" },
      recentPages: ["https://example.com/blog", "https://example.com/contact"],
    });
  });

  it("rejects unexpected fields", () => {
    expect(
      parseContactPayload(
        { ...validFields, role: "admin" },
        "https://example.com",
      ),
    ).toMatchObject({ ok: false, error: "Unexpected form fields." });
  });
});
