import { readFile } from "node:fs/promises";
import path from "node:path";

import type { ChecklistItem } from "../launch-checklist";
import type { AutomatedCheckFinding } from "./types";

const CLIENT_SENTINEL = /\bTODO_CLIENT_[A-Z0-9_]+\b/;
const TEMPLATE_MARKER = /\bTEMPLATE_LLMS_TXT\b/;
const TEMPLATE_VALUE = /\{[A-Z][A-Z0-9_]*\}/;
const DESCRIBED_LINK =
  /^- \[([^\]]+)]\((https:\/\/[^\s)]+)\):\s+(\S(?:.*\S)?)$/;
const REVIEW_DATE =
  /^>\s+.*(?:last (?:reviewed|updated)|docs version).*\b\d{4}-\d{2}-\d{2}\b/i;

function finding(message: string): AutomatedCheckFinding {
  return { subject: "public/llms.txt", message };
}

export async function checkLlmsTxtReady(
  _item: ChecklistItem,
  cwd: string,
): Promise<AutomatedCheckFinding[]> {
  const filePath = path.resolve(cwd, "public/llms.txt");
  let content: string;

  try {
    content = await readFile(filePath, "utf8");
  } catch {
    return [finding("Add public/llms.txt so it is served at /llms.txt")];
  }

  const findings: AutomatedCheckFinding[] = [];
  const lines = content.split(/\r?\n/);

  if (CLIENT_SENTINEL.test(content)) {
    findings.push(
      finding("Replace every TODO_CLIENT_* value with reviewed client content"),
    );
  }
  if (TEMPLATE_MARKER.test(content)) {
    findings.push(
      finding(
        "Replace the Launch Template example and remove its TEMPLATE_LLMS_TXT marker",
      ),
    );
  }
  if (TEMPLATE_VALUE.test(content)) {
    findings.push(
      finding("Replace every brace-delimited value from the llms.txt template"),
    );
  }

  const h1Lines = lines.filter((line) => /^# (?!#)\S/.test(line));
  if (h1Lines.length !== 1) {
    findings.push(
      finding("Use exactly one H1 containing the site or product name"),
    );
  }

  const firstContentLine = lines.findIndex((line) => line.trim().length > 0);
  if (firstContentLine === -1 || !/^# (?!#)\S/.test(lines[firstContentLine])) {
    findings.push(finding("Place the H1 before every other content block"));
  }

  const blockquoteLines = lines.filter((line) => /^>\s+\S/.test(line));
  if (blockquoteLines.length === 0) {
    findings.push(finding("Add a blockquote summary below the H1"));
  }
  if (!blockquoteLines.some((line) => REVIEW_DATE.test(line))) {
    findings.push(
      finding(
        "Add an ISO review date to the summary, such as `> Last reviewed: 2026-08-25.`",
      ),
    );
  }

  if (!lines.some((line) => /^## (?!#)\S/.test(line))) {
    findings.push(finding("Group the curated links under at least one H2"));
  }

  const linkLines = lines
    .map((line, index) => ({ line: line.trim(), number: index + 1 }))
    .filter(({ line }) => /^-\s+\[/.test(line));

  if (linkLines.length === 0) {
    findings.push(finding("Add at least one described absolute HTTPS link"));
  }

  const urls = new Set<string>();
  for (const { line, number } of linkLines) {
    const match = line.match(DESCRIBED_LINK);
    if (!match) {
      findings.push(
        finding(
          `Line ${number} must use \`- [Title](https://example.com/page): task-shaped description\``,
        ),
      );
      continue;
    }

    const [, title, url, description] = match;
    if (title.trim().length < 2 || description.trim().length < 8) {
      findings.push(
        finding(`Line ${number} needs a specific title and useful description`),
      );
    }
    if (urls.has(url)) {
      findings.push(finding(`Line ${number} repeats ${url}`));
    }
    urls.add(url);
  }

  return findings;
}
