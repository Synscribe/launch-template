import sanitizeHtml from "sanitize-html";

export type BlogDate = Date | string;

export type BlogTableOfContentsItem = {
  id: string;
  level: 2 | 3;
  text: string;
};

const namedEntities: Record<string, string> = {
  amp: "&",
  apos: "'",
  gt: ">",
  hellip: "…",
  ldquo: "“",
  lsquo: "‘",
  lt: "<",
  mdash: "—",
  nbsp: " ",
  ndash: "–",
  quot: '"',
  rdquo: "”",
  rsquo: "’",
};

function decodeHtmlEntities(value: string): string {
  return value.replace(
    /&(#x[\da-f]+|#\d+|[a-z]+);/gi,
    (entity, code: string) => {
      if (code.startsWith("#")) {
        const codePoint = code.startsWith("#x")
          ? Number.parseInt(code.slice(2), 16)
          : Number.parseInt(code.slice(1), 10);
        return Number.isInteger(codePoint) && codePoint <= 0x10ffff
          ? String.fromCodePoint(codePoint)
          : entity;
      }
      return namedEntities[code.toLowerCase()] ?? entity;
    },
  );
}

function textFromHtml(html: string): string {
  return decodeHtmlEntities(
    sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }),
  )
    .replace(/\s+/g, " ")
    .trim();
}

export function formatBlogDate(value: BlogDate, locale = "en-SG"): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export function estimateReadingMinutes(html: string): number {
  const words = textFromHtml(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function descriptionFromPost(
  description: string | null,
  content: string,
): string {
  if (description?.trim()) return description.trim();

  const text = textFromHtml(content);
  if (text.length <= 155) return text;
  return `${text.slice(0, 152).trimEnd()}…`;
}

function removeDuplicateLeadImage(
  html: string,
  headerImage?: string | null,
): string {
  if (!headerImage) return html;

  const firstImage = html.match(/<img\b[^>]*>/i);
  const source = firstImage?.[0].match(/\bsrc=["']([^"']+)["']/i)?.[1];
  if (!firstImage || source !== headerImage) return html;

  return html.replace(firstImage[0], "").replace(/<p>(\s|&nbsp;)*<\/p>/i, "");
}

export function sanitizeBlogContent(
  html: string,
  headerImage?: string | null,
  sourceOrigin?: string,
): string {
  return sanitizeHtml(removeDuplicateLeadImage(html, headerImage), {
    allowedTags: [
      "p",
      "br",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "strong",
      "b",
      "em",
      "i",
      "a",
      "ul",
      "ol",
      "li",
      "blockquote",
      "code",
      "pre",
      "figure",
      "figcaption",
      "img",
      "table",
      "thead",
      "tbody",
      "tfoot",
      "tr",
      "th",
      "td",
      "iframe",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      h2: ["id"],
      h3: ["id"],
      h4: ["id"],
      img: ["src", "alt", "width", "height", "loading", "decoding"],
      iframe: ["src", "title", "allow", "allowfullscreen", "loading"],
      td: ["colspan", "rowspan"],
      th: ["colspan", "rowspan", "scope"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedIframeHostnames: ["www.youtube.com", "www.youtube-nocookie.com"],
    transformTags: {
      h1: "h2",
      a(tagName, attributes) {
        const href = attributes.href ?? "";
        const malformedLocalBlogLink =
          href.startsWith("/blog/") &&
          !/^\/blog\/[a-z0-9]+(?:-[a-z0-9]+)*\/?(?:[?#].*)?$/.test(href);

        if (malformedLocalBlogLink) {
          return { tagName: "span", attribs: {} };
        }

        const sourceRelative =
          sourceOrigin &&
          href.startsWith("/") &&
          !href.startsWith("//") &&
          !/^\/blog(?:[/?#]|$)/.test(href);
        const resolvedHref = sourceRelative
          ? new URL(href, `${sourceOrigin}/`).toString()
          : href;
        const external = /^https?:\/\//i.test(resolvedHref);

        return {
          tagName,
          attribs: external
            ? {
                ...attributes,
                href: resolvedHref,
                target: "_blank",
                rel: "noopener noreferrer",
              }
            : { ...attributes, href: resolvedHref },
        };
      },
      img(tagName, attributes) {
        return {
          tagName,
          attribs: {
            ...attributes,
            loading: attributes.loading ?? "lazy",
            decoding: attributes.decoding ?? "async",
          },
        };
      },
      iframe(tagName, attributes) {
        return {
          tagName,
          attribs: {
            ...attributes,
            loading: attributes.loading ?? "lazy",
            title: attributes.title ?? "Embedded video",
          },
        };
      },
    },
  });
}

function headingId(text: string): string {
  return (
    text
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "section"
  );
}

export function addBlogHeadingAnchors(html: string): {
  html: string;
  tableOfContents: BlogTableOfContentsItem[];
} {
  const tableOfContents: BlogTableOfContentsItem[] = [];
  const usedIds = new Map<string, number>();
  const headingPattern = /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi;

  const anchoredHtml = html.replace(
    headingPattern,
    (heading, rawLevel: string, rawAttributes: string, innerHtml: string) => {
      const text = textFromHtml(innerHtml);
      if (!text) return heading;

      const existingId = rawAttributes.match(/\bid="([^"]+)"/i)?.[1];
      const baseId = existingId?.trim() || headingId(text);
      const previousUses = usedIds.get(baseId) ?? 0;
      const id = previousUses === 0 ? baseId : `${baseId}-${previousUses + 1}`;
      usedIds.set(baseId, previousUses + 1);

      const level = Number(rawLevel) as 2 | 3;
      const attributesWithoutId = rawAttributes.replace(/\s*\bid="[^"]*"/i, "");
      tableOfContents.push({ id, level, text });

      return `<h${level}${attributesWithoutId} id="${id}">${innerHtml}</h${level}>`;
    },
  );

  return { html: anchoredHtml, tableOfContents };
}
