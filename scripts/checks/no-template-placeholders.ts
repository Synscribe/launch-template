import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

import type { ChecklistItem } from "../launch-checklist";
import type { AutomatedCheckFinding } from "./types";

const PLACEHOLDER_MARKER =
  /\bplaceholder-[a-z0-9]|PlaceholderOpenGraphImage|TEMPLATE_PLACEHOLDER/i;
const SCANNABLE_FILE =
  /(?:\.(?:ts|tsx|js|mjs|json|md|css|svg)|package\.json|\.env\.example)$/;

async function pathExists(target: string): Promise<boolean> {
  try {
    await stat(target);
    return true;
  } catch {
    return false;
  }
}

async function walkFiles(target: string): Promise<string[]> {
  const targetStat = await stat(target);
  if (targetStat.isFile()) return [target];
  if (!targetStat.isDirectory()) return [];

  const entries = await readdir(target, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const entryPath = path.join(target, entry.name);
    if (entry.isDirectory()) files.push(...(await walkFiles(entryPath)));
    else if (entry.isFile()) files.push(entryPath);
  }

  return files;
}

async function referencedFiles(item: ChecklistItem, cwd: string) {
  const files: string[] = [];

  for (const reference of item.files ?? []) {
    const target = path.resolve(cwd, reference);
    if (!(await pathExists(target))) continue;
    files.push(...(await walkFiles(target)));
  }

  return [...new Set(files)].sort();
}

export async function checkNoTemplatePlaceholders(
  item: ChecklistItem,
  cwd: string,
): Promise<AutomatedCheckFinding[]> {
  const findings: AutomatedCheckFinding[] = [];

  for (const file of await referencedFiles(item, cwd)) {
    const relativeFile = path.relative(cwd, file);
    const placeholderFilename = path
      .basename(file)
      .toLowerCase()
      .includes("placeholder");
    const placeholderContent =
      SCANNABLE_FILE.test(file) &&
      PLACEHOLDER_MARKER.test(await readFile(file, "utf8"));

    if (placeholderFilename || placeholderContent) {
      findings.push({
        subject: relativeFile,
        message: "Replace or remove this template placeholder before launch",
      });
    }
  }

  return findings;
}
