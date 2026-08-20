import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

type ContentItem = {
  title: string;
  description: string;
};

type MethodStep = ContentItem & {
  number: string;
};

export const USE_CASE_VISUAL_IDS = [
  "website-migration-overview",
  "saas-rebuild-overview",
  "startup-launch-overview",
  "seo-landing-page-overview",
  "url-inventory",
  "url-decisions",
  "page-meaning",
  "release-gates",
  "post-launch-monitoring",
  "offer-and-audience",
  "conversion-path",
  "proof-and-trust",
  "measurement-plan",
  "buyer-journeys",
  "information-architecture",
  "reusable-pages",
  "search-intent",
  "internal-links",
] as const;

export type UseCaseVisualId = (typeof USE_CASE_VISUAL_IDS)[number];

export type UseCaseCapability = {
  visualId: UseCaseVisualId;
  category: string;
  title: string;
  description: string;
  highlights: string[];
};

type FaqItem = {
  question: string;
  answer: string;
};

export type UseCaseGroup = {
  slug: string;
  name: string;
  description: string;
};

export type UseCaseContent = {
  slug: string;
  shortTitle: string;
  groups: string[];
  seo: {
    title: string;
    description: string;
  };
  hero: {
    title: string;
    summary: string;
    visualId: UseCaseVisualId;
  };
  risks: {
    title: string;
    introduction: string;
    items: ContentItem[];
  };
  solution: {
    title: string;
    introduction: string;
    items: UseCaseCapability[];
  };
  method: {
    title: string;
    introduction: string;
    steps: MethodStep[];
  };
  outcomes: {
    title: string;
    items: ContentItem[];
  };
  faq: {
    title: string;
    introduction: string;
    items: FaqItem[];
  };
  closing: {
    title: string;
    description: string;
    cta: {
      label: string;
      href: string;
    };
  };
};

export type GroupedUseCases = UseCaseGroup & {
  useCases: UseCaseContent[];
};

const contentDirectory = path.join(process.cwd(), "src/content/use-cases");
const groupsFileName = "groups.json";

function fail(fileName: string, field: string, expectation: string): never {
  throw new Error(`${fileName}: ${field} must be ${expectation}`);
}

function record(
  value: unknown,
  fileName: string,
  field: string,
): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    fail(fileName, field, "an object");
  }
  return value as Record<string, unknown>;
}

function text(value: unknown, fileName: string, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    fail(fileName, field, "a non-empty string");
  }
  return value.trim();
}

function slug(value: unknown, fileName: string, field: string): string {
  const result = text(value, fileName, field);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(result)) {
    fail(fileName, field, "a lowercase, hyphenated identifier");
  }
  return result;
}

function visualId(
  value: unknown,
  fileName: string,
  field: string,
): UseCaseVisualId {
  const result = slug(value, fileName, field);
  if (!(USE_CASE_VISUAL_IDS as readonly string[]).includes(result)) {
    fail(fileName, field, `one of ${USE_CASE_VISUAL_IDS.join(", ")}`);
  }
  return result as UseCaseVisualId;
}

function textList(value: unknown, fileName: string, field: string): string[] {
  if (!Array.isArray(value) || value.length === 0) {
    fail(fileName, field, "a non-empty string array");
  }
  return value.map((item, index) => text(item, fileName, `${field}[${index}]`));
}

function uniqueSlugList(
  value: unknown,
  fileName: string,
  field: string,
): string[] {
  if (!Array.isArray(value) || value.length === 0) {
    fail(fileName, field, "a non-empty identifier array");
  }

  const values = value.map((item, index) =>
    slug(item, fileName, `${field}[${index}]`),
  );
  if (new Set(values).size !== values.length) {
    fail(fileName, field, "an array of unique identifiers");
  }
  return values;
}

function contentItems(
  value: unknown,
  fileName: string,
  field: string,
): ContentItem[] {
  if (!Array.isArray(value) || value.length === 0) {
    fail(fileName, field, "a non-empty content-item array");
  }
  return value.map((item, index) => {
    const itemRecord = record(item, fileName, `${field}[${index}]`);
    return {
      title: text(itemRecord.title, fileName, `${field}[${index}].title`),
      description: text(
        itemRecord.description,
        fileName,
        `${field}[${index}].description`,
      ),
    };
  });
}

function methodSteps(
  value: unknown,
  fileName: string,
  field: string,
): MethodStep[] {
  if (!Array.isArray(value) || value.length === 0) {
    fail(fileName, field, "a non-empty method-step array");
  }
  return value.map((item, index) => {
    const itemRecord = record(item, fileName, `${field}[${index}]`);
    return {
      number: text(itemRecord.number, fileName, `${field}[${index}].number`),
      title: text(itemRecord.title, fileName, `${field}[${index}].title`),
      description: text(
        itemRecord.description,
        fileName,
        `${field}[${index}].description`,
      ),
    };
  });
}

function capabilities(
  value: unknown,
  fileName: string,
  field: string,
): UseCaseCapability[] {
  if (!Array.isArray(value) || value.length === 0) {
    fail(fileName, field, "a non-empty capability array");
  }

  const items = value.map((item, index) => {
    const itemField = `${field}[${index}]`;
    const itemRecord = record(item, fileName, itemField);

    return {
      visualId: visualId(
        itemRecord.visualId,
        fileName,
        `${itemField}.visualId`,
      ),
      category: text(itemRecord.category, fileName, `${itemField}.category`),
      title: text(itemRecord.title, fileName, `${itemField}.title`),
      description: text(
        itemRecord.description,
        fileName,
        `${itemField}.description`,
      ),
      highlights: textList(
        itemRecord.highlights,
        fileName,
        `${itemField}.highlights`,
      ),
    };
  });

  const ids = items.map((item) => item.visualId);
  if (new Set(ids).size !== ids.length) {
    fail(fileName, field, "an array with unique visual IDs");
  }
  return items;
}

function faqItems(value: unknown, fileName: string, field: string): FaqItem[] {
  if (!Array.isArray(value) || value.length === 0) {
    fail(fileName, field, "a non-empty FAQ-item array");
  }
  return value.map((item, index) => {
    const itemRecord = record(item, fileName, `${field}[${index}]`);
    return {
      question: text(
        itemRecord.question,
        fileName,
        `${field}[${index}].question`,
      ),
      answer: text(itemRecord.answer, fileName, `${field}[${index}].answer`),
    };
  });
}

function parseUseCase(value: unknown, fileName: string): UseCaseContent {
  const source = record(value, fileName, "root");
  const seo = record(source.seo, fileName, "seo");
  const hero = record(source.hero, fileName, "hero");
  const risks = record(source.risks, fileName, "risks");
  const solution = record(source.solution, fileName, "solution");
  const method = record(source.method, fileName, "method");
  const outcomes = record(source.outcomes, fileName, "outcomes");
  const faq = record(source.faq, fileName, "faq");
  const closing = record(source.closing, fileName, "closing");
  const cta = record(closing.cta, fileName, "closing.cta");
  const useCaseSlug = slug(source.slug, fileName, "slug");

  if (fileName !== `${useCaseSlug}.json`) {
    throw new Error(`${fileName}: filename must match slug ${useCaseSlug}`);
  }

  const href = text(cta.href, fileName, "closing.cta.href");
  if (!href.startsWith("/")) {
    fail(fileName, "closing.cta.href", "an internal path beginning with /");
  }

  return {
    slug: useCaseSlug,
    shortTitle: text(source.shortTitle, fileName, "shortTitle"),
    groups: uniqueSlugList(source.groups, fileName, "groups"),
    seo: {
      title: text(seo.title, fileName, "seo.title"),
      description: text(seo.description, fileName, "seo.description"),
    },
    hero: {
      title: text(hero.title, fileName, "hero.title"),
      summary: text(hero.summary, fileName, "hero.summary"),
      visualId: visualId(hero.visualId, fileName, "hero.visualId"),
    },
    risks: {
      title: text(risks.title, fileName, "risks.title"),
      introduction: text(risks.introduction, fileName, "risks.introduction"),
      items: contentItems(risks.items, fileName, "risks.items"),
    },
    solution: {
      title: text(solution.title, fileName, "solution.title"),
      introduction: text(
        solution.introduction,
        fileName,
        "solution.introduction",
      ),
      items: capabilities(solution.items, fileName, "solution.items"),
    },
    method: {
      title: text(method.title, fileName, "method.title"),
      introduction: text(method.introduction, fileName, "method.introduction"),
      steps: methodSteps(method.steps, fileName, "method.steps"),
    },
    outcomes: {
      title: text(outcomes.title, fileName, "outcomes.title"),
      items: contentItems(outcomes.items, fileName, "outcomes.items"),
    },
    faq: {
      title: text(faq.title, fileName, "faq.title"),
      introduction: text(faq.introduction, fileName, "faq.introduction"),
      items: faqItems(faq.items, fileName, "faq.items"),
    },
    closing: {
      title: text(closing.title, fileName, "closing.title"),
      description: text(closing.description, fileName, "closing.description"),
      cta: {
        label: text(cta.label, fileName, "closing.cta.label"),
        href,
      },
    },
  };
}

function parseGroups(value: unknown, fileName: string): UseCaseGroup[] {
  if (!Array.isArray(value) || value.length === 0) {
    fail(fileName, "root", "a non-empty group array");
  }

  const groups = value.map((item, index) => {
    const itemRecord = record(item, fileName, `root[${index}]`);
    return {
      slug: slug(itemRecord.slug, fileName, `root[${index}].slug`),
      name: text(itemRecord.name, fileName, `root[${index}].name`),
      description: text(
        itemRecord.description,
        fileName,
        `root[${index}].description`,
      ),
    };
  });

  const slugs = groups.map((group) => group.slug);
  if (new Set(slugs).size !== slugs.length) {
    fail(fileName, "root", "an array with unique group slugs");
  }
  return groups;
}

async function readJson(fileName: string): Promise<unknown> {
  const source = await readFile(path.join(contentDirectory, fileName), "utf8");

  try {
    return JSON.parse(source) as unknown;
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`${fileName}: invalid JSON (${detail})`);
  }
}

async function readUseCase(fileName: string): Promise<UseCaseContent> {
  return parseUseCase(await readJson(fileName), fileName);
}

export async function getUseCaseGroups(): Promise<UseCaseGroup[]> {
  return parseGroups(await readJson(groupsFileName), groupsFileName);
}

export async function getAllUseCases(): Promise<UseCaseContent[]> {
  const entries = await readdir(contentDirectory, { withFileTypes: true });
  const files = entries
    .filter(
      (entry) =>
        entry.isFile() &&
        entry.name.endsWith(".json") &&
        entry.name !== groupsFileName,
    )
    .map((entry) => entry.name)
    .sort();
  const [groups, useCases] = await Promise.all([
    getUseCaseGroups(),
    Promise.all(files.map(readUseCase)),
  ]);
  const groupSlugs = new Set(groups.map((group) => group.slug));
  const useCaseSlugs = new Set<string>();

  for (const useCase of useCases) {
    if (useCaseSlugs.has(useCase.slug)) {
      throw new Error(`Duplicate use-case slug: ${useCase.slug}`);
    }
    useCaseSlugs.add(useCase.slug);

    for (const group of useCase.groups) {
      if (!groupSlugs.has(group)) {
        throw new Error(
          `${useCase.slug}.json: groups references unknown group ${group}`,
        );
      }
    }
  }

  return useCases.sort((left, right) =>
    left.shortTitle.localeCompare(right.shortTitle),
  );
}

export async function getGroupedUseCases(): Promise<GroupedUseCases[]> {
  const [groups, useCases] = await Promise.all([
    getUseCaseGroups(),
    getAllUseCases(),
  ]);

  return groups
    .map((group) => ({
      ...group,
      useCases: useCases.filter((useCase) =>
        useCase.groups.includes(group.slug),
      ),
    }))
    .filter((group) => group.useCases.length > 0);
}

export async function getUseCaseBySlug(
  useCaseSlug: string,
): Promise<UseCaseContent | undefined> {
  const useCases = await getAllUseCases();
  return useCases.find((useCase) => useCase.slug === useCaseSlug);
}
