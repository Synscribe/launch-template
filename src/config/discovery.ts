export type DiscoveryHeaderRule = {
  source: string;
  headers: Array<{
    key: string;
    value: string;
  }>;
};

export const AGENT_DISCOVERY_LINK_HEADER = [
  '</llms.txt>; rel="describedby"; type="text/plain"',
  '</sitemap.xml>; rel="sitemap"; type="application/xml"',
].join(", ");

/**
 * Advertise the machine-readable discovery surfaces from the homepage only
 * while the project actually publishes llms.txt.
 */
export function buildDiscoveryHeaderRules(
  llmsTxtExists: boolean,
): DiscoveryHeaderRule[] {
  if (!llmsTxtExists) return [];

  return [
    {
      source: "/",
      headers: [
        {
          key: "Link",
          value: AGENT_DISCOVERY_LINK_HEADER,
        },
      ],
    },
  ];
}
