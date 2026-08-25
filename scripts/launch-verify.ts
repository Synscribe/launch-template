import { runAutomatedChecks, validateAutomatedChecks } from "./checks";
import { loadChecklist } from "./launch-checklist";

async function main(): Promise<void> {
  const checklist = await loadChecklist();
  validateAutomatedChecks(checklist);
  const results = await runAutomatedChecks(checklist);

  if (results.length === 0) {
    console.log("No automated checklist items are configured.");
    return;
  }

  for (const result of results) {
    if (result.passed) {
      console.log(`PASS ${result.id} — ${result.check}`);
      continue;
    }

    console.log(`FAIL ${result.id} — ${result.check}`);
    for (const finding of result.findings) {
      console.log(`  ${finding.subject} — ${finding.message}`);
    }
  }

  const failed = results.filter((result) => !result.passed).length;
  console.log(`\n${results.length - failed} passed · ${failed} failed`);
  if (failed > 0) process.exitCode = 1;
}

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
