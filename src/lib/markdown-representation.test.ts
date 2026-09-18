import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import {
  htmlToMarkdown,
  markdownOverridePath,
  readMarkdownOverride,
} from "./markdown-representation";

const temporaryDirectories: string[] = [];

async function temporaryDirectory(): Promise<string> {
  const directory = await mkdtemp(path.join(tmpdir(), "markdown-overrides-"));
  temporaryDirectories.push(directory);
  return directory;
}

describe("Markdown representations", () => {
  afterEach(async () => {
    await Promise.all(
      temporaryDirectories
        .splice(0)
        .map((directory) => rm(directory, { recursive: true, force: true })),
    );
  });

  it("converts only the main page content to readable Markdown", () => {
    const markdown = htmlToMarkdown(`<!doctype html>
      <html><body>
        <nav>Global navigation</nav>
        <main>
          <script type="application/ld+json">{"name":"Hidden"}</script>
          <h1>Useful page</h1>
          <p>Read the <a href="/guide">guide</a>.</p>
          <svg><text>Decoration</text></svg>
        </main>
        <footer>Global footer</footer>
      </body></html>`);

    expect(markdown).toContain("# Useful page");
    expect(markdown).toContain("[guide](/guide)");
    expect(markdown).not.toContain("Global navigation");
    expect(markdown).not.toContain("Global footer");
    expect(markdown).not.toContain("Hidden");
    expect(markdown).not.toContain("Decoration");
  });

  it("maps canonical paths to optional nested Markdown overrides", () => {
    const root = "/tmp/example-markdown-root";

    expect(markdownOverridePath("/", root)).toBe(path.join(root, "index.md"));
    expect(markdownOverridePath("/uses/example/", root)).toBe(
      path.join(root, "uses/example.md"),
    );
    expect(() => markdownOverridePath("/%2e%2e/private", root)).toThrow(
      /Unsafe pathname/,
    );
  });

  it("uses a custom override when present and otherwise returns undefined", async () => {
    const root = await temporaryDirectory();
    await mkdir(path.join(root, "uses"), { recursive: true });
    await writeFile(
      path.join(root, "uses/example.md"),
      "# Custom representation\n",
    );

    await expect(readMarkdownOverride("/uses/example", root)).resolves.toBe(
      "# Custom representation",
    );
    await expect(
      readMarkdownOverride("/missing", root),
    ).resolves.toBeUndefined();
  });

  it("rejects an empty override instead of hiding generated content", async () => {
    const root = await temporaryDirectory();
    await writeFile(path.join(root, "index.md"), "   \n");

    await expect(readMarkdownOverride("/", root)).rejects.toThrow(/is empty/);
  });
});
