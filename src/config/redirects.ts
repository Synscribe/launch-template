export type RedirectRule = {
  source: string;
  destination: string;
  permanent: boolean;
};

/**
 * Migration projects: add reviewed redirects here from docs/launch/url-map.csv.
 * Keep the destination final to avoid redirect chains.
 */
export const redirects: RedirectRule[] = [];
