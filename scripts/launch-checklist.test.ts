import { readFile } from "node:fs/promises";

import { describe, expect, it } from "vitest";

import {
  CHECKLIST_JSON_PATH,
  parseChecklist,
  renderChecklist,
} from "./launch-checklist";

describe("launch checklist", () => {
  it("loads every canonical checklist item once", async () => {
    const checklist = parseChecklist(
      JSON.parse(await readFile(CHECKLIST_JSON_PATH, "utf8")),
    );

    expect(checklist.items).toHaveLength(38);
    expect(new Set(checklist.items.map((item) => item.id)).size).toBe(38);
    expect(checklist.items.find((item) => item.id === "SEO-02")?.priority).toBe(
      "P0",
    );
  });

  it("renders status and guidance from the same item", async () => {
    const checklist = parseChecklist(
      JSON.parse(await readFile(CHECKLIST_JSON_PATH, "utf8")),
    );
    checklist.items[0].status = "done";

    const markdown = await renderChecklist(checklist);
    expect(markdown).toContain(
      "### BRAND-01 — production identity is intentional",
    );
    expect(markdown).toContain("- [x] **Done**");
    expect(markdown).toContain("Why it matters: inherited names");
  });

  it("rejects duplicate IDs", () => {
    expect(() =>
      parseChecklist({
        schemaVersion: 1,
        description: "Example",
        items: [
          {
            id: "SEO-01",
            title: "First",
            priority: "P0",
            group: "every site",
            status: "todo",
            details: [],
          },
          {
            id: "SEO-01",
            title: "Second",
            priority: "P1",
            group: "quality",
            status: "todo",
            details: [],
          },
        ],
        primaryReferences: [],
      }),
    ).toThrow("Checklist IDs must be unique");
  });
});
