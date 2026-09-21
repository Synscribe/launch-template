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

  it("turns a linked card into ordinary blocks with a linked heading", () => {
    const markdown = htmlToMarkdown(`<main>
      <ul>
        <li>
          <a href="/uses/website-migrations" title="Open use case">
            <article>
              <h3>Website migrations</h3>
              <p>Protect important URLs and search traffic.</p>
            </article>
            <span>View use case <svg><path /></svg></span>
          </a>
        </li>
      </ul>
    </main>`);

    expect(markdown).toContain(
      '### [Website migrations](/uses/website-migrations "Open use case")',
    );
    expect(markdown).toContain("Protect important URLs and search traffic.");
    expect(markdown).toContain("View use case");
    expect(markdown).not.toMatch(/\[\s*#{1,6}\s/);
  });

  it("removes decorative images and accessibility-hidden content", () => {
    const markdown = htmlToMarkdown(`<main>
      <a aria-hidden="true" href="/blog/example">
        <img alt="" src="/_next/image?url=%2Fcover.png&amp;w=1200&amp;q=75">
        Hidden image link
      </a>
      <a href="/blog/example">
        <div><img alt="" src="/_next/image?url=%2Fcover.png&amp;w=1200&amp;q=75"></div>
        <div><h2>Example article</h2><p>A useful summary.</p></div>
      </a>
    </main>`);

    expect(markdown).toContain("## [Example article](/blog/example)");
    expect(markdown).toContain("A useful summary.");
    expect(markdown).not.toContain("Hidden image link");
    expect(markdown).not.toContain("![](");
    expect(markdown).not.toContain("/_next/image");
  });

  it("uses the original source for meaningful optimized images", () => {
    const markdown = htmlToMarkdown(`<main>
      <img
        alt="Migration flow"
        title="Page redirects"
        src="/_next/image?url=https%3A%2F%2Fimages.example.com%2Fflow.png&amp;w=1920&amp;q=75"
      >
    </main>`);

    expect(markdown).toBe(
      '![Migration flow](https://images.example.com/flow.png "Page redirects")',
    );
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
