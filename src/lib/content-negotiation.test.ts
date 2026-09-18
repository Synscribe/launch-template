import { describe, expect, it } from "vitest";

import {
  appendVary,
  negotiateDocumentRepresentation,
} from "./content-negotiation";

describe("document content negotiation", () => {
  it.each([
    [null, "html"],
    ["", "html"],
    ["*/*", "html"],
    ["text/html", "html"],
    ["text/markdown", "markdown"],
    ["text/markdown, text/html;q=0.8", "markdown"],
    ["text/html, text/markdown;q=0.8", "html"],
    ["text/html;q=0.5, text/markdown;q=0.9", "markdown"],
    ["text/*, text/markdown", "markdown"],
    ["text/markdown;q=0, text/*;q=0.8", "html"],
    ["application/json", null],
    ["*/*;q=0", null],
  ])("selects %s as %s", (header, expected) => {
    expect(negotiateDocumentRepresentation(header)).toBe(expected);
  });

  it("appends Accept to Vary without losing existing values or duplicating it", () => {
    const headers = new Headers({ Vary: "RSC, Accept-Encoding" });
    appendVary(headers, "Accept");
    appendVary(headers, "accept");

    expect(headers.get("vary")).toBe("RSC, Accept-Encoding, Accept");
  });
});
