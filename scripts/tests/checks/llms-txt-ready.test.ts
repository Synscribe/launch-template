import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { runAutomatedCheck } from "../../checks";
import { checkLlmsTxtReady } from "../../checks/llms-txt-ready";
import type { ChecklistItem } from "../../launch-checklist";

const temporaryDirectories: string[] = [];

async function temporaryDirectory(): Promise<string> {
  const directory = await mkdtemp(path.join(tmpdir(), "llms-txt-check-"));
  temporaryDirectories.push(directory);
  return directory;
}

async function writeLlmsTxt(cwd: string, content: string): Promise<void> {
  await mkdir(path.join(cwd, "public"), { recursive: true });
  await writeFile(path.join(cwd, "public/llms.txt"), content);
}

const item: ChecklistItem = {
  id: "LLM-01",
  title: "llms.txt is replaced and valid",
  priority: "P2",
  group: "later enhancements",
  status: "auto",
  files: ["public/llms.txt"],
  check: "llms-txt-ready",
  details: [],
};

describe("llms.txt readiness check", () => {
  afterEach(async () => {
    await Promise.all(
      temporaryDirectories
        .splice(0)
        .map((directory) => rm(directory, { recursive: true, force: true })),
    );
  });

  it("fails when the file is missing", async () => {
    const cwd = await temporaryDirectory();

    await expect(checkLlmsTxtReady(item, cwd)).resolves.toEqual([
      {
        subject: "public/llms.txt",
        message: "Add public/llms.txt so it is served at /llms.txt",
      },
    ]);
  });

  it("rejects the unchanged Launch Template example", async () => {
    const cwd = await temporaryDirectory();
    await writeLlmsTxt(
      cwd,
      `# Launch Template

<!-- TEMPLATE_LLMS_TXT: Replace this example. -->

> Launch Template helps teams ship production-minded Next.js websites.
> Last reviewed: 2026-08-25.

## Important pages

- [Project overview](https://example.com/README.md): Install the template and understand its launch workflow.
`,
    );

    const findings = await checkLlmsTxtReady(item, cwd);

    expect(findings.map((entry) => entry.message)).toEqual(
      expect.arrayContaining([
        "Replace the Launch Template example and remove its TEMPLATE_LLMS_TXT marker",
      ]),
    );
  });

  it("rejects unfilled values copied from the recipe template", async () => {
    const cwd = await temporaryDirectory();
    await writeLlmsTxt(
      cwd,
      `# {SITE_OR_PRODUCT_NAME}

> Example helps teams publish accurate product documentation.
> Last reviewed: 2026-08-25.

## Guides

- [Getting started](https://example.com/start): Install and configure Example for a first project.
`,
    );

    await expect(checkLlmsTxtReady(item, cwd)).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message:
            "Replace every brace-delimited value from the llms.txt template",
        }),
      ]),
    );
  });

  it("rejects bare, relative, or undescribed link lines", async () => {
    const cwd = await temporaryDirectory();
    await writeLlmsTxt(
      cwd,
      `# Example

> Example helps teams publish accurate product documentation.
> Last reviewed: 2026-08-25.

## Guides

- [Start here](/start)
`,
    );

    await expect(checkLlmsTxtReady(item, cwd)).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: expect.stringContaining("must use"),
        }),
      ]),
    );
  });

  it("passes a reviewed, described index", async () => {
    const cwd = await temporaryDirectory();
    await writeLlmsTxt(
      cwd,
      `# Example

> Example helps teams publish accurate product documentation.
> Last reviewed: 2026-08-25.

## Guides

- [Getting started](https://example.com/docs/start.md): Install and configure Example for a first project.
- [API reference](https://example.com/docs/api.md): Find current endpoints, parameters, and response fields.
`,
    );

    await expect(runAutomatedCheck(item, cwd)).resolves.toMatchObject({
      id: "LLM-01",
      passed: true,
      findings: [],
    });
  });
});
