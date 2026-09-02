import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { VISUAL_IDS } from "../../lib/visuals";

import {
  getVisualSource,
  ProjectVisual,
  VISUAL_ENTRIES,
} from "./project-visual";

describe("project visual inventory", () => {
  it("keeps one exhaustive source for every validated visual ID", () => {
    expect(VISUAL_ENTRIES.map((entry) => entry.id)).toEqual(VISUAL_IDS);

    for (const id of VISUAL_IDS) {
      expect(getVisualSource(id).label).toBeTruthy();
      expect(
        renderToStaticMarkup(createElement(ProjectVisual, { id })),
      ).toContain(`data-visual-id="${id}"`);
    }
  });

  it("does not repeat named motion patterns", () => {
    const patterns = VISUAL_ENTRIES.flatMap((entry) =>
      entry.motionPattern ? [entry.motionPattern] : [],
    );

    expect(new Set(patterns).size).toBe(patterns.length);
  });
});
