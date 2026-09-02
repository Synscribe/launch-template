import { readFile } from "node:fs/promises";
import path from "node:path";

import type { ChecklistItem } from "../launch-checklist";
import type { AutomatedCheckFinding } from "./types";

export const ORGANIZATION_LOGO_PATH = "public/brand/logo.svg";

const TEMPLATE_MARKER = /\bTEMPLATE_PLACEHOLDER_LOGO\b/;
const CLIENT_SENTINEL = /\bTODO_CLIENT_[A-Z0-9_]+\b/;
const TEMPLATE_WORDMARK = /Launch Template/i;
const SVG_ROOT = /<svg\b[^>]*>/i;
const RASTER_DIMENSION = /\b(width|height)\s*=\s*["'](\d+(?:\.\d+)?)/gi;

function finding(message: string): AutomatedCheckFinding {
  return { subject: ORGANIZATION_LOGO_PATH, message };
}

export async function checkOrganizationLogoReady(
  _item: ChecklistItem,
  cwd: string,
): Promise<AutomatedCheckFinding[]> {
  const filePath = path.resolve(cwd, ORGANIZATION_LOGO_PATH);
  let content: string;

  try {
    content = await readFile(filePath, "utf8");
  } catch {
    return [
      finding(
        `Add ${ORGANIZATION_LOGO_PATH} so Organization JSON-LD resolves a real logo`,
      ),
    ];
  }

  const findings: AutomatedCheckFinding[] = [];

  if (TEMPLATE_MARKER.test(content)) {
    findings.push(
      finding(
        "Replace the template brand mark and remove its TEMPLATE_PLACEHOLDER_LOGO marker",
      ),
    );
  }
  if (TEMPLATE_WORDMARK.test(content)) {
    findings.push(
      finding("Replace the Launch Template name inside the logo artwork"),
    );
  }
  if (CLIENT_SENTINEL.test(content)) {
    findings.push(
      finding("Replace every TODO_CLIENT_* value with approved client artwork"),
    );
  }

  const root = content.match(SVG_ROOT)?.[0];
  if (!root) {
    findings.push(finding("File must be a valid SVG with an <svg> root"));
    return findings;
  }

  if (!/\bviewBox\s*=/i.test(root)) {
    findings.push(finding("Add a viewBox so the logo scales without cropping"));
  }

  const dimensions = [...root.matchAll(RASTER_DIMENSION)].map((match) =>
    Number(match[2]),
  );
  if (dimensions.length === 2 && dimensions.some((value) => value < 112)) {
    findings.push(
      finding("Render the logo at 112px or larger on its shortest side"),
    );
  }

  return findings;
}
