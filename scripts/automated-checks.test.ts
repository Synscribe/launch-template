import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import type { ChecklistItem } from "./launch-checklist";
import {
  checkNoTemplatePlaceholders,
  runAutomatedCheck,
} from "./automated-checks";

const temporaryDirectories: string[] = [];

async function temporaryDirectory(): Promise<string> {
  const directory = await mkdtemp(path.join(tmpdir(), "launch-check-"));
  temporaryDirectories.push(directory);
  return directory;
}

const item: ChecklistItem = {
  id: "BRAND-02",
  title: "template placeholder visuals are removed",
  priority: "P0",
  group: "every site",
  status: "auto",
  files: ["src", "public/media"],
  check: "no-template-placeholders",
  details: [],
};

describe("automated launch checks", () => {
  afterEach(async () => {
    await Promise.all(
      temporaryDirectories
        .splice(0)
        .map((directory) => rm(directory, { recursive: true, force: true })),
    );
  });

  it("reports placeholder filenames and explicit source markers", async () => {
    const cwd = await temporaryDirectory();
    await mkdir(path.join(cwd, "src"), { recursive: true });
    await mkdir(path.join(cwd, "public/media"), { recursive: true });
    await writeFile(
      path.join(cwd, "src/opengraph-image.tsx"),
      "export default function PlaceholderOpenGraphImage() {}",
    );
    await writeFile(
      path.join(cwd, "public/media/placeholder-hero.svg"),
      "<svg />",
    );

    const findings = await checkNoTemplatePlaceholders(item, cwd);

    expect(findings.map((finding) => finding.subject)).toEqual([
      "public/media/placeholder-hero.svg",
      "src/opengraph-image.tsx",
    ]);
  });

  it("passes after placeholder files and markers are replaced", async () => {
    const cwd = await temporaryDirectory();
    await mkdir(path.join(cwd, "src"), { recursive: true });
    await writeFile(
      path.join(cwd, "src/opengraph-image.tsx"),
      "export default function OpenGraphImage() {}",
    );

    await expect(runAutomatedCheck(item, cwd)).resolves.toMatchObject({
      id: "BRAND-02",
      passed: true,
      findings: [],
    });
  });

  it("rejects unknown check names", async () => {
    await expect(
      runAutomatedCheck({ ...item, check: "unknown-check" }),
    ).rejects.toThrow("BRAND-02 references unknown automated check");
  });
});
