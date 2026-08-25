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

    expect(useCases).toHaveLength(4);
    expect(useCases.map((useCase) => useCase.metadata.slug)).toEqual([
      "saas-website-rebuilds",
      "seo-landing-pages",
      "startup-launches",
      "website-migrations",
    ]);

    const websiteMigration = useCases.find(
      (useCase) => useCase.metadata.slug === "website-migrations",
    );
    expect(websiteMigration).toMatchObject({
      metadata: {
        slug: "website-migrations",
        anchor: "Website migrations",
        group: "migrations-and-rebuilds",
        title: "Website migrations that protect SEO and working URLs",
      },
      cta: {
        label: "See the launch workflow",
      },
    });
    expect(websiteMigration).not.toHaveProperty("order");
    expect(websiteMigration).not.toHaveProperty("seo");
    expect(websiteMigration).not.toHaveProperty("risks");
    expect(websiteMigration).not.toHaveProperty("closing");
    expect(websiteMigration?.cta).not.toHaveProperty("href");
    expect(websiteMigration?.hero.visualId).toBe(
      "placeholder-website-migration-overview",
    );
    expect(websiteMigration?.solution.items).toHaveLength(5);
    expect(
      websiteMigration?.solution.items.map((item) => item.visualId),
    ).toEqual([
      "url-inventory",
      "url-decisions",
      "page-meaning",
      "release-gates",
      "post-launch-monitoring",
    ]);
    expect(websiteMigration?.solution.items[0]).not.toHaveProperty("evidence");
    expect(websiteMigration?.faq.items).toHaveLength(4);

    for (const useCase of useCases) {
      expect(useCase.hero.visualId).toBeTruthy();
      expect(useCase.solution.items).toHaveLength(5);
      expect(useCase.faq.items).toHaveLength(4);
    }
  });

  it("uses the group manifest order and resolves group memberships", async () => {
    const groups = await getUseCaseGroups();
    const groupedUseCases = await getGroupedUseCases();

    expect(groups.map((group) => group.slug)).toEqual([
      "migrations-and-rebuilds",
      "startup-launches",
      "technical-seo",
    ]);
    expect(
      groupedUseCases.map((group) => ({
        slug: group.slug,
        useCases: group.useCases.map((useCase) => useCase.metadata.slug),
      })),
    ).toEqual([
      {
        slug: "migrations-and-rebuilds",
        useCases: ["saas-website-rebuilds", "website-migrations"],
      },
      {
        slug: "startup-launches",
        useCases: ["startup-launches"],
      },
      {
        slug: "technical-seo",
        useCases: ["seo-landing-pages"],
      },
    ]);
  });

  it("returns undefined for a slug that has no JSON document", async () => {
    await expect(getUseCaseBySlug("missing-use-case")).resolves.toBeUndefined();
  });
});
