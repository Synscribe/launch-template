import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import { VISUAL_IDS, type VisualId } from "./visuals";

type ContentItem = {
  title: string;
  description: string;
};

type MethodStep = ContentItem & {
  number: string;
};

export const USE_CASE_VISUAL_IDS = VISUAL_IDS;
export type UseCaseVisualId = VisualId;

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
  metadata: {
    slug: string;
    anchor: string;
    group: string;
    title: string;
    description: string;
  };
  hero: {
    title: string;
    summary: string;
    visualId: UseCaseVisualId;
  };
  problem: {
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
  cta: {
    title: string;
    description: string;
    label: string;
    href?: string;
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
  const metadata = record(source.metadata, fileName, "metadata");
  const hero = record(source.hero, fileName, "hero");
  const problem = record(source.problem, fileName, "problem");
  const solution = record(source.solution, fileName, "solution");
  const method = record(source.method, fileName, "method");
  const outcomes = record(source.outcomes, fileName, "outcomes");
  const faq = record(source.faq, fileName, "faq");
  const cta = record(source.cta, fileName, "cta");
  const useCaseSlug = slug(metadata.slug, fileName, "metadata.slug");

  if (fileName !== `${useCaseSlug}.json`) {
    throw new Error(`${fileName}: filename must match slug ${useCaseSlug}`);
  }

  let href: string | undefined;
  if (cta.href !== undefined) {
    href = text(cta.href, fileName, "cta.href");
    if (!href.startsWith("/")) {
      fail(fileName, "cta.href", "an internal path beginning with /");
    }
  }

  return {
    metadata: {
      slug: useCaseSlug,
      anchor: text(metadata.anchor, fileName, "metadata.anchor"),
      group: slug(metadata.group, fileName, "metadata.group"),
      title: text(metadata.title, fileName, "metadata.title"),
      description: text(metadata.description, fileName, "metadata.description"),
    },
    hero: {
      title: text(hero.title, fileName, "hero.title"),
      summary: text(hero.summary, fileName, "hero.summary"),
      visualId: visualId(hero.visualId, fileName, "hero.visualId"),
    },
    problem: {
      title: text(problem.title, fileName, "problem.title"),
      introduction: text(
        problem.introduction,
        fileName,
        "problem.introduction",
      ),
      items: contentItems(problem.items, fileName, "problem.items"),
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
    cta: {
      title: text(cta.title, fileName, "cta.title"),
      description: text(cta.description, fileName, "cta.description"),
      label: text(cta.label, fileName, "cta.label"),
      ...(href ? { href } : {}),
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
    if (useCaseSlugs.has(useCase.metadata.slug)) {
      throw new Error(`Duplicate use-case slug: ${useCase.metadata.slug}`);
    }
    useCaseSlugs.add(useCase.metadata.slug);

    if (!groupSlugs.has(useCase.metadata.group)) {
      throw new Error(
        `${useCase.metadata.slug}.json: metadata.group references unknown group ${useCase.metadata.group}`,
      );
    }
  }

  return useCases.sort((left, right) =>
    left.metadata.anchor.localeCompare(right.metadata.anchor),
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
      useCases: useCases.filter(
        (useCase) => useCase.metadata.group === group.slug,
      ),
    }))
    .filter((group) => group.useCases.length > 0);
}

export async function getUseCaseBySlug(
  useCaseSlug: string,
): Promise<UseCaseContent | undefined> {
  const useCases = await getAllUseCases();
  return useCases.find((useCase) => useCase.metadata.slug === useCaseSlug);
}
