import { execFile } from "node:child_process";
import { constants } from "node:fs";
import { access, mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

import { describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);
const repositoryRoot = fileURLToPath(new URL("../..", import.meta.url));
const scriptPath = path.join(
  repositoryRoot,
  "scripts/generate-indexnow-key.mjs",
);

describe("IndexNow key generator", () => {
  it("creates an exact public key file and safely rotates it", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "indexnow-key-"));

    await execFileAsync(process.execPath, [scriptPath, "--root", root]);
    const first = JSON.parse(
      await readFile(path.join(root, "indexnow-key.json"), "utf8"),
    ) as { key: string; keyFile: string };

    expect(first.key).toMatch(/^[a-f0-9]{32}$/);
    expect(first.keyFile).toBe(`public/${first.key}.txt`);
    expect(await readFile(path.join(root, first.keyFile), "utf8")).toBe(
      first.key,
    );

    await execFileAsync(process.execPath, [scriptPath, "--root", root]);
    const second = JSON.parse(
      await readFile(path.join(root, "indexnow-key.json"), "utf8"),
    ) as { key: string; keyFile: string };

    expect(second.key).toMatch(/^[a-f0-9]{32}$/);
    expect(second.key).not.toBe(first.key);
    expect(await readFile(path.join(root, second.keyFile), "utf8")).toBe(
      second.key,
    );
    await expect(
      access(path.join(root, first.keyFile), constants.F_OK),
    ).rejects.toMatchObject({ code: "ENOENT" });
  });
});
