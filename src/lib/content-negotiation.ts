export type DocumentRepresentation = "html" | "markdown";

type AcceptEntry = {
  position: number;
  quality: number;
  subtype: string;
  type: string;
};

type Candidate = {
  position: number;
  quality: number;
  representation: DocumentRepresentation;
  specificity: number;
};

const DOCUMENT_TYPES: Record<DocumentRepresentation, string> = {
  html: "text/html",
  markdown: "text/markdown",
};

function parseQuality(parameters: string[]): number {
  const qualityParameter = parameters.find((parameter) =>
    /^q\s*=/i.test(parameter),
  );
  if (!qualityParameter) return 1;

  const value = Number(qualityParameter.split("=", 2)[1]?.trim());
  return Number.isFinite(value) && value >= 0 && value <= 1 ? value : 0;
}

function parseAccept(header: string): AcceptEntry[] {
  return header
    .split(",")
    .map((raw, position) => {
      const [mediaRange = "", ...parameters] = raw
        .trim()
        .split(";")
        .map((part) => part.trim());
      const [type = "", subtype = ""] = mediaRange.toLowerCase().split("/", 2);

      return {
        position,
        quality: parseQuality(parameters),
        subtype,
        type,
      };
    })
    .filter(
      (entry) =>
        (entry.type === "*" || /^[a-z0-9!#$&^_.+-]+$/.test(entry.type)) &&
        (entry.subtype === "*" || /^[a-z0-9!#$&^_.+-]+$/.test(entry.subtype)),
    );
}

function matchSpecificity(
  entry: AcceptEntry,
  candidateType: string,
): number | undefined {
  const [type, subtype] = candidateType.split("/", 2);
  if (entry.type === "*" && entry.subtype === "*") return 0;
  if (entry.type === type && entry.subtype === "*") return 1;
  if (entry.type === type && entry.subtype === subtype) return 2;
  return undefined;
}

function scoreCandidate(
  entries: AcceptEntry[],
  representation: DocumentRepresentation,
): Candidate | undefined {
  const matches = entries
    .map((entry) => {
      const specificity = matchSpecificity(
        entry,
        DOCUMENT_TYPES[representation],
      );
      return specificity === undefined ? undefined : { ...entry, specificity };
    })
    .filter((entry): entry is AcceptEntry & { specificity: number } =>
      Boolean(entry),
    )
    .sort(
      (left, right) =>
        right.specificity - left.specificity || left.position - right.position,
    );

  const match = matches[0];
  if (!match) return undefined;
  return {
    position: match.position,
    quality: match.quality,
    representation,
    specificity: match.specificity,
  };
}

/**
 * Select the best document representation using the Accept header's quality
 * values and media-range specificity. HTML is the default for an absent or
 * fully wildcard header so ordinary browser and command-line requests retain
 * the current site behavior.
 */
export function negotiateDocumentRepresentation(
  acceptHeader: string | null,
): DocumentRepresentation | null {
  if (!acceptHeader?.trim()) return "html";

  const entries = parseAccept(acceptHeader);
  const candidates = (["html", "markdown"] as const)
    .map((representation) => scoreCandidate(entries, representation))
    .filter((candidate): candidate is Candidate => Boolean(candidate))
    .filter((candidate) => candidate.quality > 0)
    .sort(
      (left, right) =>
        right.quality - left.quality ||
        right.specificity - left.specificity ||
        left.position - right.position ||
        (left.representation === "html" ? -1 : 1),
    );

  return candidates[0]?.representation ?? null;
}

export function appendVary(headers: Headers, name: string): void {
  const existing = headers.get("vary");
  if (!existing) {
    headers.set("Vary", name);
    return;
  }

  const values = existing.split(",").map((value) => value.trim());
  if (!values.some((value) => value.toLowerCase() === name.toLowerCase())) {
    headers.set("Vary", `${existing}, ${name}`);
  }
}
