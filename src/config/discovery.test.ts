import { describe, expect, it } from "vitest";

import {
  AGENT_DISCOVERY_LINK_HEADER,
  buildDiscoveryHeaderRules,
} from "./discovery";

describe("agent discovery headers", () => {
  it("advertises llms.txt and the sitemap from the homepage", () => {
    expect(buildDiscoveryHeaderRules(true)).toEqual([
      {
        source: "/",
        headers: [
          {
            key: "Link",
            value:
              '</llms.txt>; rel="describedby"; type="text/plain", </sitemap.xml>; rel="sitemap"; type="application/xml"',
          },
        ],
      },
    ]);
    expect(AGENT_DISCOVERY_LINK_HEADER).toContain("</llms.txt>");
    expect(AGENT_DISCOVERY_LINK_HEADER).toContain("</sitemap.xml>");
  });

  it("removes the entire header rule when llms.txt is deleted", () => {
    expect(buildDiscoveryHeaderRules(false)).toEqual([]);
  });
});
