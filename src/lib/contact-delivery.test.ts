import { describe, expect, it } from "vitest";

import type { ContactSubmission } from "@/lib/contact";

import { renderContactEmail } from "./contact-delivery";

const submission: ContactSubmission = {
  name: "Raymond <script>alert(1)</script>",
  email: "raymond@example.com",
  company: "Synscribe",
  website: "https://example.com/",
  message: "Please rebuild <b>this website</b>.",
  attribution: {
    referrerUrl: "https://google.com/",
    referrerDomain: "google.com",
    firstVisitUrl: "https://example.com/uses?utm_source=google",
    firstVisitAt: "2026-08-20T10:00:00.000Z",
    firstUtm: {
      source: "google",
      medium: null,
      campaign: null,
      term: null,
      content: null,
    },
    recentPages: ["https://example.com/uses", "https://example.com/contact"],
  },
};

describe("contact email", () => {
  it("escapes submitted HTML and keeps useful attribution", () => {
    const email = renderContactEmail(submission);

    expect(email.subject).not.toContain("\n");
    expect(email.html).not.toContain("<script>");
    expect(email.html).not.toContain("<b>this website</b>");
    expect(email.html).toContain("&lt;script&gt;");
    expect(email.text).toContain("UTM source:\ngoogle");
    expect(email.text).toContain("https://example.com/contact");
  });
});
