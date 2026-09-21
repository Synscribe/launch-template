import { describe, expect, it } from "vitest";

import {
  markdownAliasPathname,
  sourcePathnameFromMarkdownAlias,
} from "./markdown-routing";

describe("explicit Markdown aliases", () => {
  it.each([
    ["/uses.md", "/uses"],
    ["/uses/example.md", "/uses/example"],
    ["/index.md", "/"],
    ["/.md", "/"],
    ["/uses", undefined],
    ["/notes.MD", undefined],
  ])("maps %s to %s", (pathname, expected) => {
    expect(sourcePathnameFromMarkdownAlias(pathname)).toBe(expected);
  });

  it.each([
    ["/uses", "/uses.md"],
    ["/uses/", "/uses.md"],
    ["/uses/example", "/uses/example.md"],
    ["/", "/index.md"],
    ["/uses.md", "/uses.md"],
    ["/guide.pdf", "/guide.pdf"],
  ])("maps the source %s to %s", (pathname, expected) => {
    expect(markdownAliasPathname(pathname)).toBe(expected);
  });
});
