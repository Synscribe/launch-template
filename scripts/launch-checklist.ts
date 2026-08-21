import { access, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { format } from "prettier";

export const CHECKLIST_JSON_PATH = "docs/launch/checklist.json";
export const CHECKLIST_MARKDOWN_PATH = "docs/launch/checklist.md";

export const CHECKLIST_STATUSES = ["todo", "done", "not_applicable"] as const;
export const CHECKLIST_PRIORITIES = ["P0", "P1", "P2"] as const;

export type ChecklistStatus = (typeof CHECKLIST_STATUSES)[number];
export type ChecklistPriority = (typeof CHECKLIST_PRIORITIES)[number];

export type ChecklistItem = {
  id: string;
  title: string;
  priority: ChecklistPriority;
  group: string;
  status: ChecklistStatus;
  details: string[];
  recipe?: string;
};

export type LaunchChecklist = {
  schemaVersion: 1;
  description: string;
  items: ChecklistItem[];
  primaryReferences: Array<{
    label: string;
    url: string;
  }>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredString(
  value: unknown,
  field: string,
  errors: string[],
): string {
  if (typeof value === "string" && value.trim()) return value.trim();
  errors.push(`${field} must be a non-empty string`);
  return "";
}

export function parseChecklist(value: unknown): LaunchChecklist {
  const errors: string[] = [];
  if (!isRecord(value)) throw new Error("Checklist root must be an object");

  if (value.schemaVersion !== 1) {
    errors.push("schemaVersion must be 1");
  }

  const description = requiredString(value.description, "description", errors);
  const rawItems = Array.isArray(value.items) ? value.items : [];
  if (rawItems.length === 0) errors.push("items must not be empty");

  const items = rawItems.map((rawItem, index): ChecklistItem => {
    const field = `items[${index}]`;
    if (!isRecord(rawItem)) {
      errors.push(`${field} must be an object`);
      return {
        id: "",
        title: "",
        priority: "P2",
        group: "",
        status: "todo",
        details: [],
      };
    }

    const id = requiredString(rawItem.id, `${field}.id`, errors);
    if (id && !/^[A-Z][A-Z0-9]+-\d{2}$/.test(id)) {
      errors.push(`${field}.id must look like SEO-02`);
    }

    const priority = CHECKLIST_PRIORITIES.includes(
      rawItem.priority as ChecklistPriority,
    )
      ? (rawItem.priority as ChecklistPriority)
      : "P2";
    if (!CHECKLIST_PRIORITIES.includes(rawItem.priority as ChecklistPriority)) {
      errors.push(`${field}.priority must be P0, P1, or P2`);
    }

    const status = CHECKLIST_STATUSES.includes(
      rawItem.status as ChecklistStatus,
    )
      ? (rawItem.status as ChecklistStatus)
      : "todo";
    if (!CHECKLIST_STATUSES.includes(rawItem.status as ChecklistStatus)) {
      errors.push(`${field}.status must be ${CHECKLIST_STATUSES.join(", ")}`);
    }

    const details = Array.isArray(rawItem.details)
      ? rawItem.details.filter(
          (line): line is string => typeof line === "string",
        )
      : [];
    if (!Array.isArray(rawItem.details)) {
      errors.push(`${field}.details must be an array of Markdown lines`);
    }

    const recipe =
      rawItem.recipe === undefined
        ? undefined
        : requiredString(rawItem.recipe, `${field}.recipe`, errors);

    return {
      id,
      title: requiredString(rawItem.title, `${field}.title`, errors),
      priority,
      group: requiredString(rawItem.group, `${field}.group`, errors),
      status,
      details,
      ...(recipe ? { recipe } : {}),
    };
  });

  const ids = items.map((item) => item.id).filter(Boolean);
  if (new Set(ids).size !== ids.length)
    errors.push("Checklist IDs must be unique");

  const rawReferences = Array.isArray(value.primaryReferences)
    ? value.primaryReferences
    : [];
  const primaryReferences = rawReferences.map((rawReference, index) => {
    const field = `primaryReferences[${index}]`;
    if (!isRecord(rawReference)) {
      errors.push(`${field} must be an object`);
      return { label: "", url: "" };
    }
    return {
      label: requiredString(rawReference.label, `${field}.label`, errors),
      url: requiredString(rawReference.url, `${field}.url`, errors),
    };
  });

  if (errors.length > 0) {
    throw new Error(`Invalid launch checklist:\n- ${errors.join("\n- ")}`);
  }

  return {
    schemaVersion: 1,
    description,
    items,
    primaryReferences,
  };
}

export async function loadChecklist(
  filePath = CHECKLIST_JSON_PATH,
): Promise<LaunchChecklist> {
  return parseChecklist(JSON.parse(await readFile(filePath, "utf8")));
}

function statusLabel(status: ChecklistStatus): string {
  if (status === "not_applicable") return "Not applicable";
  return `${status[0].toUpperCase()}${status.slice(1)}`;
}

function isResolved(status: ChecklistStatus): boolean {
  return status === "done" || status === "not_applicable";
}

function relativeRecipeLink(recipe: string): string {
  const relative = path.relative(path.dirname(CHECKLIST_MARKDOWN_PATH), recipe);
  return relative.startsWith(".") ? relative : `./${relative}`;
}

export async function renderChecklist(
  checklist: LaunchChecklist,
): Promise<string> {
  const lines = [
    "<!-- Generated from docs/launch/checklist.json. Do not edit this file directly. -->",
    "",
    "# Launch checklist and technical SEO guide",
    "",
    checklist.description,
    "",
    "## How to use this document",
    "",
    "- Edit `docs/launch/checklist.json`, or run `pnpm launch:checklist --set <ID> <todo|done|not_applicable>`.",
    "- `P0` blocks launch when applicable.",
    "- `P1` is a non-blocking quality check or a feature-dependent expectation.",
    "- `P2` is an enhancement to add after the core is stable.",
    "- Use `not_applicable` explicitly when a conditional check does not belong to the project.",
    "- Automation reports useful signals; it does not edit checklist status.",
  ];

  let previousGroup = "";
  for (const priority of CHECKLIST_PRIORITIES) {
    for (const item of checklist.items.filter(
      (candidate) => candidate.priority === priority,
    )) {
      const groupKey = `${priority}:${item.group}`;
      if (groupKey !== previousGroup) {
        lines.push("", `## ${priority} — ${item.group}`);
        previousGroup = groupKey;
      }

      const checkbox = isResolved(item.status) ? "x" : " ";
      lines.push(
        "",
        `### ${item.id} — ${item.title}`,
        "",
        `- [${checkbox}] **${statusLabel(item.status)}**`,
      );

      if (item.recipe) {
        lines.push(
          `- Recipe: [${item.recipe}](${relativeRecipeLink(item.recipe)})`,
        );
      }

      if (item.details.length > 0) {
        lines.push("", ...item.details);
      }
    }
  }

  if (checklist.primaryReferences.length > 0) {
    lines.push("", "## Primary references", "");
    for (const reference of checklist.primaryReferences) {
      lines.push(`- [${reference.label}](${reference.url})`);
    }
  }

  return format(`${lines.join("\n")}\n`, { parser: "markdown" });
}

async function validateRecipePaths(checklist: LaunchChecklist): Promise<void> {
  const recipes = [
    ...new Set(checklist.items.flatMap((item) => item.recipe ?? [])),
  ];
  const missing: string[] = [];
  for (const recipe of recipes) {
    try {
      await access(recipe);
    } catch {
      missing.push(recipe);
    }
  }
  if (missing.length > 0) {
    throw new Error(`Missing checklist recipes:\n- ${missing.join("\n- ")}`);
  }
}

async function writeGeneratedChecklist(
  checklist: LaunchChecklist,
): Promise<void> {
  await writeFile(CHECKLIST_MARKDOWN_PATH, await renderChecklist(checklist));
}

async function updateStatus(
  checklist: LaunchChecklist,
  id: string,
  status: ChecklistStatus,
): Promise<LaunchChecklist> {
  const item = checklist.items.find((candidate) => candidate.id === id);
  if (!item) throw new Error(`Unknown checklist ID: ${id}`);
  item.status = status;

  const json = await format(`${JSON.stringify(checklist, null, 2)}\n`, {
    parser: "json",
  });
  await writeFile(CHECKLIST_JSON_PATH, json);
  return checklist;
}

function printSummary(checklist: LaunchChecklist): void {
  for (const priority of CHECKLIST_PRIORITIES) {
    const items = checklist.items.filter((item) => item.priority === priority);
    const remaining = items.filter((item) => !isResolved(item.status));
    console.log(
      `${priority}: ${items.length - remaining.length}/${items.length} resolved`,
    );
    for (const item of remaining) {
      console.log(`  [ ] ${item.id} — ${item.title} (${item.status})`);
    }
  }
}

async function main(): Promise<void> {
  let checklist = await loadChecklist();
  await validateRecipePaths(checklist);

  const args = process.argv.slice(2);
  const setIndex = args.indexOf("--set");
  if (setIndex !== -1) {
    const id = args[setIndex + 1];
    const status = args[setIndex + 2] as ChecklistStatus | undefined;
    if (!id || !status || !CHECKLIST_STATUSES.includes(status)) {
      throw new Error(`Use --set <ID> <${CHECKLIST_STATUSES.join("|")}>`);
    }
    checklist = await updateStatus(checklist, id, status);
    await writeGeneratedChecklist(checklist);
    console.log(`${id} set to ${status}`);
    return;
  }

  if (args.includes("--write")) {
    await writeGeneratedChecklist(checklist);
    console.log(`Wrote ${CHECKLIST_MARKDOWN_PATH}`);
    return;
  }

  if (args.includes("--check")) {
    const expected = await renderChecklist(checklist);
    const actual = await readFile(CHECKLIST_MARKDOWN_PATH, "utf8");
    if (actual !== expected) {
      throw new Error(
        `${CHECKLIST_MARKDOWN_PATH} is stale. Run pnpm launch:checklist --write`,
      );
    }
    console.log(
      `Checklist valid: ${checklist.items.length} unique items; generated Markdown is current`,
    );
    return;
  }

  printSummary(checklist);
}

const isDirectRun =
  process.argv[1] &&
  path.resolve(process.argv[1]) ===
    path.resolve(fileURLToPath(import.meta.url));

if (isDirectRun) {
  void main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
