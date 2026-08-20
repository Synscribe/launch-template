import sanitizeHtml from "sanitize-html";

export type BlogDate = Date | string;

function textFromHtml(html: string): string {
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
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
