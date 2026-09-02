import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { runAutomatedCheck } from "../../checks";
import {
  ORGANIZATION_LOGO_PATH,
  checkOrganizationLogoReady,
} from "../../checks/organization-logo-ready";
import type { ChecklistItem } from "../../launch-checklist";

const temporaryDirectories: string[] = [];

async function temporaryDirectory(): Promise<string> {
  const directory = await mkdtemp(path.join(tmpdir(), "logo-check-"));
  temporaryDirectories.push(directory);
  return directory;
}

async function writeLogo(cwd: string, content: string): Promise<void> {
  await mkdir(path.join(cwd, path.dirname(ORGANIZATION_LOGO_PATH)), {
    recursive: true,
  });
  await writeFile(path.join(cwd, ORGANIZATION_LOGO_PATH), content);
}

const clientLogo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <title>Northwind Freight</title>
  <rect width="512" height="512" fill="#0b3d2c" />
</svg>`;

const item: ChecklistItem = {
  id: "BRAND-03",
  title: "organization logo is client artwork",
  priority: "P0",
  group: "every site",
  status: "auto",
  files: [ORGANIZATION_LOGO_PATH],
  check: "organization-logo-ready",
  details: [],
};

describe("organization logo readiness check", () => {
  afterEach(async () => {
    await Promise.all(
      temporaryDirectories
        .splice(0)
        .map((directory) => rm(directory, { recursive: true, force: true })),
    );
  });

  it("fails when the logo file is missing", async () => {
    const cwd = await temporaryDirectory();
    const findings = await checkOrganizationLogoReady(item, cwd);

    expect(findings).toHaveLength(1);
    expect(findings[0].subject).toBe(ORGANIZATION_LOGO_PATH);
    expect(findings[0].message).toMatch(/Add public\/brand\/logo\.svg/);
  });

  it("flags the shipped template mark and its marker", async () => {
    const cwd = await temporaryDirectory();
    await writeLogo(
      cwd,
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
        <title>Launch Template</title>
        <desc>TEMPLATE_PLACEHOLDER_LOGO — replace before launch.</desc>
      </svg>`,
    );

    const messages = (await checkOrganizationLogoReady(item, cwd)).map(
      (finding) => finding.message,
    );

    expect(messages).toContain(
      "Replace the template brand mark and remove its TEMPLATE_PLACEHOLDER_LOGO marker",
    );
    expect(messages).toContain(
      "Replace the Launch Template name inside the logo artwork",
    );
  });

  it("flags an unresolved client sentinel", async () => {
    const cwd = await temporaryDirectory();
    await writeLogo(
      cwd,
      clientLogo.replace("Northwind Freight", "TODO_CLIENT_LOGO"),
    );

    const messages = (await checkOrganizationLogoReady(item, cwd)).map(
      (finding) => finding.message,
    );

    expect(messages).toContain(
      "Replace every TODO_CLIENT_* value with approved client artwork",
    );
  });

  it("requires a viewBox and a usable rendered size", async () => {
    const cwd = await temporaryDirectory();
    await writeLogo(
      cwd,
      `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" /></svg>`,
    );

    const messages = (await checkOrganizationLogoReady(item, cwd)).map(
      (finding) => finding.message,
    );

    expect(messages).toContain(
      "Add a viewBox so the logo scales without cropping",
    );
    expect(messages).toContain(
      "Render the logo at 112px or larger on its shortest side",
    );
  });

  it("reports a non-SVG file once and stops", async () => {
    const cwd = await temporaryDirectory();
    await writeLogo(cwd, "not markup");

    await expect(checkOrganizationLogoReady(item, cwd)).resolves.toEqual([
      {
        subject: ORGANIZATION_LOGO_PATH,
        message: "File must be a valid SVG with an <svg> root",
      },
    ]);
  });

  it("passes for replaced client artwork through the check registry", async () => {
    const cwd = await temporaryDirectory();
    await writeLogo(cwd, clientLogo);

    await expect(runAutomatedCheck(item, cwd)).resolves.toMatchObject({
      id: "BRAND-03",
      check: "organization-logo-ready",
      passed: true,
      findings: [],
    });
  });
});
