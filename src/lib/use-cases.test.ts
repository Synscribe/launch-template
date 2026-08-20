import { describe, expect, it } from "vitest";

import {
  getAllUseCases,
  getGroupedUseCases,
  getUseCaseBySlug,
  getUseCaseGroups,
} from "./use-cases";

describe("use-case content", () => {
  it("loads every drop-in JSON file as validated content", async () => {
    const useCases = await getAllUseCases();

    expect(useCases).toHaveLength(1);
    expect(useCases[0]).toMatchObject({
      slug: "website-migrations",
      shortTitle: "Website migrations",
      groups: ["migrations-and-rebuilds", "technical-seo"],
    });
    expect(useCases[0]).not.toHaveProperty("order");
    expect(useCases[0]?.solution.items).toHaveLength(5);
    expect(useCases[0]?.solution.items.map((item) => item.id)).toEqual([
      "url-inventory",
      "url-decisions",
      "page-meaning",
      "release-gates",
      "post-launch-monitoring",
    ]);
    expect(useCases[0]?.solution.items[0]).not.toHaveProperty("evidence");
    expect(useCases[0]?.faq.items).toHaveLength(4);
  });

  it("uses the group manifest order and resolves group memberships", async () => {
    const groups = await getUseCaseGroups();
    const groupedUseCases = await getGroupedUseCases();

    expect(groups.map((group) => group.slug)).toEqual([
      "migrations-and-rebuilds",
      "technical-seo",
    ]);
    expect(
      groupedUseCases.map((group) => ({
        slug: group.slug,
        useCases: group.useCases.map((useCase) => useCase.slug),
      })),
    ).toEqual([
      {
        slug: "migrations-and-rebuilds",
        useCases: ["website-migrations"],
      },
      {
        slug: "technical-seo",
        useCases: ["website-migrations"],
      },
    ]);
  });

  it("returns undefined for a slug that has no JSON document", async () => {
    await expect(getUseCaseBySlug("missing-use-case")).resolves.toBeUndefined();
  });
});
