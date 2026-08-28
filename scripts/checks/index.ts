import type { ChecklistItem, LaunchChecklist } from "../launch-checklist";

import { checkLlmsTxtReady } from "./llms-txt-ready";
import { checkNoTemplatePlaceholders } from "./no-template-placeholders";
import type { AutomatedCheck, AutomatedCheckResult } from "./types";

export type { AutomatedCheckFinding, AutomatedCheckResult } from "./types";

export const AUTOMATED_CHECKS = {
  "llms-txt-ready": checkLlmsTxtReady,
  "no-template-placeholders": checkNoTemplatePlaceholders,
} satisfies Record<string, AutomatedCheck>;

export function isAutomatedCheckName(
  value: string,
): value is keyof typeof AUTOMATED_CHECKS {
  return value in AUTOMATED_CHECKS;
}

export async function runAutomatedCheck(
  item: ChecklistItem,
  cwd = process.cwd(),
): Promise<AutomatedCheckResult> {
  if (!item.check || !isAutomatedCheckName(item.check)) {
    throw new Error(
      `${item.id} references unknown automated check: ${item.check ?? "none"}`,
    );
  }

  const findings = await AUTOMATED_CHECKS[item.check](item, cwd);
  return {
    id: item.id,
    check: item.check,
    passed: findings.length === 0,
    findings,
  };
}

export async function runAutomatedChecks(
  checklist: LaunchChecklist,
  cwd = process.cwd(),
): Promise<AutomatedCheckResult[]> {
  const automatedItems = [...checklist.items, ...checklist.projectItems].filter(
    (item) => item.status === "auto",
  );
  return Promise.all(
    automatedItems.map((item) => runAutomatedCheck(item, cwd)),
  );
}

export function validateAutomatedChecks(checklist: LaunchChecklist): void {
  for (const item of [...checklist.items, ...checklist.projectItems]) {
    if (item.check && !isAutomatedCheckName(item.check)) {
      throw new Error(
        `${item.id} references unknown automated check: ${item.check}`,
      );
    }
  }
}
