import type { ChecklistItem } from "../launch-checklist";

export type AutomatedCheckFinding = {
  subject: string;
  message: string;
};

export type AutomatedCheckResult = {
  id: string;
  check: string;
  passed: boolean;
  findings: AutomatedCheckFinding[];
};

export type AutomatedCheck = (
  item: ChecklistItem,
  cwd: string,
) => Promise<AutomatedCheckFinding[]>;
