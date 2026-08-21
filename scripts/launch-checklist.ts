import { access, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { format } from "prettier";

import { validateAutomatedChecks } from "./checks";

export const CHECKLIST_JSON_PATH = "docs/launch/checklist.json";
export const CHECKLIST_MARKDOWN_PATH = "docs/launch/checklist.md";

export const CHECKLIST_STATUSES = [
  "todo",
  "done",
  "not_applicable",
  "auto",
] as const;
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
  files?: string[];
  check?: string;
};

export type LaunchChecklist = {
  schemaVersion: 1;
  description: string;
  items: ChecklistItem[];
  projectItems: ChecklistItem[];
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

  const parseItems = (
    rawValue: unknown,
    collection: "items" | "projectItems",
    required: boolean,
  ): ChecklistItem[] => {
    const rawItems = Array.isArray(rawValue) ? rawValue : [];
    if (!Array.isArray(rawValue)) {
      errors.push(`${collection} must be an array`);
    } else if (required && rawItems.length === 0) {
      errors.push(`${collection} must not be empty`);
    }

    return rawItems.map((rawItem, index): ChecklistItem => {
      const field = `${collection}[${index}]`;
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
      if (
        !CHECKLIST_PRIORITIES.includes(rawItem.priority as ChecklistPriority)
      ) {
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
      const files = Array.isArray(rawItem.files)
        ? rawItem.files.map((file, fileIndex) =>
            requiredString(file, `${field}.files[${fileIndex}]`, errors),
          )
        : [];
      if (rawItem.files !== undefined && !Array.isArray(rawItem.files)) {
        errors.push(`${field}.files must be an array of repository paths`);
      }
      for (const file of files) {
        if (path.isAbsolute(file) || file.split(/[\\/]/).includes("..")) {
          errors.push(`${field}.files must contain repository-relative paths`);
        }
      }

      const check =
        rawItem.check === undefined
          ? undefined
          : requiredString(rawItem.check, `${field}.check`, errors);
      if (status === "auto" && !check) {
        errors.push(`${field}.check is required when status is auto`);
      }
      if (check && status !== "auto" && status !== "not_applicable") {
        errors.push(
          `${field}.status must be auto or not_applicable when check is present`,
        );
      }

      return {
        id,
        title: requiredString(rawItem.title, `${field}.title`, errors),
        priority,
        group: requiredString(rawItem.group, `${field}.group`, errors),
        status,
        details,
        ...(recipe ? { recipe } : {}),
        ...(files.length > 0 ? { files } : {}),
        ...(check ? { check } : {}),
      };
    });
  };

  const description = requiredString(value.description, "description", errors);
  const items = parseItems(value.items, "items", true);
  const projectItems = parseItems(
    value.projectItems ?? [],
    "projectItems",
    false,
  );

  const ids = [...items, ...projectItems]
    .map((item) => item.id)
    .filter(Boolean);
  if (new Set(ids).size !== ids.length)
    errors.push("Checklist IDs must be unique across items and projectItems");

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
    projectItems,
    primaryReferences,
  };
}

export function allChecklistItems(checklist: LaunchChecklist): ChecklistItem[] {
  return [...checklist.items, ...checklist.projectItems];
}

export async function loadChecklist(
  filePath = CHECKLIST_JSON_PATH,
): Promise<LaunchChecklist> {
  return parseChecklist(JSON.parse(await readFile(filePath, "utf8")));
}

function statusLabel(status: ChecklistStatus): string {
  if (status === "not_applicable") return "Not applicable";
  if (status === "auto") return "Automated";
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
    "- Edit `docs/launch/checklist.json`, or run `pnpm launch:checklist --set <ID> <todo|done|not_applicable|auto>`.",
    "- Keep reusable template checks in `items`; keep requirements discovered for this client/project in `projectItems`.",
    "- Add a project check with `pnpm launch:checklist --add-project <ID> <P0|P1|P2> <title> --detail <Markdown>`; repeat `--detail` for multiple lines.",
    "- `P0` blocks launch when applicable.",
    "- `P1` is a non-blocking quality check or a feature-dependent expectation.",
    "- `P2` is an enhancement to add after the core is stable.",
    "- Use `not_applicable` explicitly when a conditional check does not belong to the project.",
    "- `auto` items are resolved by named checks. Run `pnpm launch:verify` for file-level checks and `pnpm launch:audit` for the complete live audit.",
  ];

  const items = allChecklistItems(checklist);
  let previousGroup = "";
  for (const priority of CHECKLIST_PRIORITIES) {
    for (const item of items.filter(
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

      if (item.check) {
        lines.push(`- Automated check: \`${item.check}\``);
      }

      if (item.files && item.files.length > 0) {
        lines.push("- Files:");
        for (const file of item.files) lines.push(`  - \`${file}\``);
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
    ...new Set(
      allChecklistItems(checklist).flatMap((item) => item.recipe ?? []),
    ),
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
  const item = allChecklistItems(checklist).find(
    (candidate) => candidate.id === id,
  );
  if (!item) throw new Error(`Unknown checklist ID: ${id}`);
  if (item.check && status !== "auto" && status !== "not_applicable") {
    throw new Error(
      `${id} is automated; use auto or not_applicable instead of setting a manual result`,
    );
  }
  if (!item.check && status === "auto") {
    throw new Error(`${id} cannot use auto without a named check`);
  }
  item.status = status;

  await writeChecklistSource(checklist);
  return checklist;
}

async function writeChecklistSource(checklist: LaunchChecklist): Promise<void> {
  const json = await format(`${JSON.stringify(checklist, null, 2)}\n`, {
    parser: "json",
  });
  await writeFile(CHECKLIST_JSON_PATH, json);
}

function printSummary(checklist: LaunchChecklist): void {
  const checklistItems = allChecklistItems(checklist);
  for (const priority of CHECKLIST_PRIORITIES) {
    const items = checklistItems.filter((item) => item.priority === priority);
    const remaining = items.filter((item) => !isResolved(item.status));
    console.log(
      `${priority}: ${items.length - remaining.length}/${items.length} resolved`,
    );
    for (const item of remaining) {
      console.log(`  [ ] ${item.id} — ${item.title} (${item.status})`);
    }
  }
}

function argumentValues(args: string[], name: string): string[] {
  return args.flatMap((argument, index) => {
    const value = args[index + 1];
    return argument === name && value && !value.startsWith("--") ? [value] : [];
  });
}

function argumentValue(args: string[], name: string): string | undefined {
  return argumentValues(args, name)[0];
}

export function projectChecklistItemFromArgs(
  args: string[],
): ChecklistItem | undefined {
  const addProjectIndex = args.indexOf("--add-project");
  if (addProjectIndex === -1) return undefined;

  const id = args[addProjectIndex + 1];
  const priority = args[addProjectIndex + 2] as ChecklistPriority | undefined;
  const title = args[addProjectIndex + 3];
  const details = argumentValues(args, "--detail");
  if (
    !id ||
    !priority ||
    !CHECKLIST_PRIORITIES.includes(priority) ||
    !title ||
    title.startsWith("--") ||
    details.length === 0
  ) {
    throw new Error(
      "Use --add-project <ID> <P0|P1|P2> <title> --detail <Markdown> [--detail <Markdown>...] [--group <group>] [--recipe <path>]",
    );
  }

  const group =
    argumentValue(args, "--group") ?? "project-specific launch checks";
  const recipe = argumentValue(args, "--recipe");
  return {
    id,
    title,
    priority,
    group,
    status: "todo",
    details,
    ...(recipe ? { recipe } : {}),
  };
}

async function main(): Promise<void> {
  let checklist = await loadChecklist();
  await validateRecipePaths(checklist);
  validateAutomatedChecks(checklist);

  const args = process.argv.slice(2);
  const setIndex = args.indexOf("--set");
  const addProjectIndex = args.indexOf("--add-project");
  const actionCount = [setIndex, addProjectIndex].filter(
    (index) => index !== -1,
  ).length;
  if (actionCount > 1) {
    throw new Error("Use only one checklist mutation at a time");
  }

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

  if (addProjectIndex !== -1) {
    const projectItem = projectChecklistItemFromArgs(args);
    if (!projectItem) throw new Error("Project checklist item is missing");
    checklist = parseChecklist({
      ...checklist,
      projectItems: [...checklist.projectItems, projectItem],
    });
    await validateRecipePaths(checklist);
    await writeChecklistSource(checklist);
    await writeGeneratedChecklist(checklist);
    console.log(`${projectItem.id} added to projectItems as todo`);
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
      `Checklist valid: ${allChecklistItems(checklist).length} unique items (${checklist.projectItems.length} project-specific); generated Markdown is current`,
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
