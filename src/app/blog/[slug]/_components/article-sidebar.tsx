import Link from "next/link";

import type { BlogTableOfContentsItem } from "@/lib/blog-content";

function FacebookIcon() {
  return (
    <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24">
      <path
        d="M14 8h3V4h-3c-3.3 0-5 2-5 5v2H6v4h3v7h4v-7h3.5l.5-4h-4V9c0-.7.3-1 1-1Z"
        fill="currentColor"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24">
      <path
        d="M6.5 8.3H3V21h3.5V8.3ZM4.8 3A2.1 2.1 0 1 0 4.8 7.2 2.1 2.1 0 0 0 4.8 3ZM21 13.7c0-3.8-2-5.6-4.7-5.6-2.2 0-3.2 1.2-3.7 2V8.3H9.1V21h3.5v-6.3c0-1.7.3-3.3 2.4-3.3 2 0 2.1 1.9 2.1 3.4V21H21v-7.3Z"
        fill="currentColor"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24">
      <path
        d="M18.9 2H22l-6.8 7.8L23 22h-6.1l-4.8-6.3L6.6 22H3.5l7.1-8.1L3 2h6.3l4.3 5.7L18.9 2Zm-1.1 17.8h1.7L8.4 4H6.6l11.2 15.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ContentsLinks({ items }: { items: BlogTableOfContentsItem[] }) {
  return (
    <nav aria-label="Article contents">
      <ol className="space-y-2.5">
        {items.map((item) => (
          <li className={item.level === 3 ? "pl-4" : undefined} key={item.id}>
            <a
              className="block text-sm leading-5 text-ink-muted transition-colors hover:text-signal-strong"
              href={`#${item.id}`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function ArticleSidebar({
  items,
  title,
  url,
}: {
  items: BlogTableOfContentsItem[];
  title: string;
  url: string;
}) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const shareLinks = [
    {
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: <LinkedInIcon />,
    },
    {
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: <XIcon />,
    },
    {
      label: "Share on Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: <FacebookIcon />,
    },
  ];

  return (
    <aside
      className="order-1 lg:order-2 lg:col-span-4"
      aria-label="Article tools"
    >
      <div className="lg:sticky lg:top-24">
        {items.length > 0 ? (
          <>
            <details className="group rounded-2xl border border-ink/10 bg-canvas p-5 lg:hidden">
              <summary className="cursor-pointer list-none text-sm font-bold tracking-[0.12em] text-ink uppercase marker:content-none">
                <span className="flex items-center justify-between gap-4">
                  On this page
                  <span
                    aria-hidden="true"
                    className="text-xl leading-none text-signal-strong group-open:rotate-45"
                  >
                    +
                  </span>
                </span>
              </summary>
              <div className="mt-5 max-h-80 overflow-y-auto border-t border-ink/10 pt-5">
                <ContentsLinks items={items} />
              </div>
            </details>

            <div className="hidden lg:block">
              <h2 className="text-xs font-bold tracking-[0.14em] text-ink-faint uppercase">
                On this page
              </h2>
              <div className="mt-5 max-h-[55vh] overflow-y-auto pr-4">
                <ContentsLinks items={items} />
              </div>
            </div>
          </>
        ) : null}

        <div className="mt-7 border-t border-ink/10 pt-7">
          <h2 className="text-xs font-bold tracking-[0.14em] text-ink-faint uppercase">
            Share this article
          </h2>
          <ul className="mt-4 flex gap-2.5">
            {shareLinks.map((shareLink) => (
              <li key={shareLink.label}>
                <a
                  aria-label={shareLink.label}
                  className="grid size-10 place-items-center rounded-full border border-ink/10 bg-canvas text-ink-muted transition-colors hover:border-ink hover:bg-ink hover:text-paper"
                  href={shareLink.href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {shareLink.icon}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-7 border-t border-ink/10 pt-7">
          <Link
            className="text-sm font-semibold text-signal-strong hover:underline"
            href="/blog"
          >
            ← Back to all articles
          </Link>
        </div>
      </div>
    </aside>
  );
}
