import { readFile } from "node:fs/promises";

import { describe, expect, it } from "vitest";

import {
  allChecklistItems,
  CHECKLIST_JSON_PATH,
  parseChecklist,
  projectChecklistItemFromArgs,
  renderChecklist,
} from "../launch-checklist";

describe("launch checklist", () => {
  it("loads every canonical checklist item once", async () => {
    const checklist = parseChecklist(
      JSON.parse(await readFile(CHECKLIST_JSON_PATH, "utf8")),
    );

    expect(checklist.items).toHaveLength(43);
    expect(checklist.projectItems).toEqual([]);
    expect(
      new Set(allChecklistItems(checklist).map((item) => item.id)).size,
    ).toBe(43);
    expect(checklist.items.find((item) => item.id === "SEO-02")?.priority).toBe(
      "P0",
    );
    expect(checklist.items.find((item) => item.id === "LLM-01")).toMatchObject({
      status: "auto",
      check: "llms-txt-ready",
      recipe: "docs/recipes/llms-txt.md",
    });
    expect(checklist.items.find((item) => item.id === "LLM-01")?.files).toEqual(
      expect.arrayContaining([
        "public/llms.txt",
        "src/config/discovery.ts",
        "next.config.ts",
        "scripts/launch-audit.ts",
      ]),
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

  it("renders declared files and automated checks", async () => {
    const checklist = parseChecklist(
      JSON.parse(await readFile(CHECKLIST_JSON_PATH, "utf8")),
    );
    const item = checklist.items.find(
      (candidate) => candidate.id === "BRAND-02",
    );

    expect(item).toMatchObject({
      status: "auto",
      check: "no-template-placeholders",
    });
    expect(item?.files).toContain("src/app/opengraph-image.tsx");

    const markdown = await renderChecklist(checklist);
    expect(markdown).toContain("- [ ] **Automated**");
    expect(markdown).toContain("- Automated check: `no-template-placeholders`");
    expect(markdown).toContain("- `src/app/opengraph-image.tsx`");
  });

  it("requires a check for automated status and relative file paths", () => {
    const baseItem = {
      id: "BRAND-02",
      title: "replace placeholders",
      priority: "P0",
      group: "every site",
      status: "auto",
      details: [],
    };

    expect(() =>
      parseChecklist({
        schemaVersion: 1,
        description: "Example",
        items: [baseItem],
        primaryReferences: [],
      }),
    ).toThrow("check is required when status is auto");

    expect(() =>
      parseChecklist({
        schemaVersion: 1,
        description: "Example",
        items: [
          {
            ...baseItem,
            check: "no-template-placeholders",
            files: ["../outside"],
          },
        ],
        primaryReferences: [],
      }),
    ).toThrow("files must contain repository-relative paths");
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

  it("renders project-specific checks with the reusable checks", async () => {
    const checklist = parseChecklist(
      JSON.parse(await readFile(CHECKLIST_JSON_PATH, "utf8")),
    );
    const expanded = parseChecklist({
      ...checklist,
      projectItems: [
        {
          id: "WIDGET-01",
          title: "cookie consent behavior is production-ready",
          priority: "P0",
          group: "project-specific launch checks",
          status: "todo",
          details: [
            "The visual clone exists, but consent persistence is not wired.",
          ],
        },
      ],
    });

    expect(allChecklistItems(expanded)).toHaveLength(44);
    expect(await renderChecklist(expanded)).toContain(
      "### WIDGET-01 — cookie consent behavior is production-ready",
    );
  });

  it("rejects a project-specific ID that duplicates a reusable ID", async () => {
    const checklist = parseChecklist(
      JSON.parse(await readFile(CHECKLIST_JSON_PATH, "utf8")),
    );

    expect(() =>
      parseChecklist({
        ...checklist,
        projectItems: [
          {
            ...checklist.items[0],
            title: "Project duplicate",
          },
        ],
      }),
    ).toThrow("Checklist IDs must be unique across items and projectItems");
  });

  it("parses a project-specific CLI item with repeated details", () => {
    expect(
      projectChecklistItemFromArgs([
        "--add-project",
        "WIDGET-01",
        "P0",
        "cookie consent behavior is production-ready",
        "--detail",
        "The visual shell is cloned.",
        "--detail",
        "Consent persistence is not wired.",
        "--recipe",
        "docs/launch/clone-journal.md",
      ]),
    ).toEqual({
      id: "WIDGET-01",
      title: "cookie consent behavior is production-ready",
      priority: "P0",
      group: "project-specific launch checks",
      status: "todo",
      details: [
        "The visual shell is cloned.",
        "Consent persistence is not wired.",
      ],
      recipe: "docs/launch/clone-journal.md",
    });
  });

  it("requires a detail when adding a project-specific CLI item", () => {
    expect(() =>
      projectChecklistItemFromArgs([
        "--add-project",
        "WIDGET-01",
        "P0",
        "cookie consent behavior is production-ready",
      ]),
    ).toThrow("Use --add-project");
  });
});
