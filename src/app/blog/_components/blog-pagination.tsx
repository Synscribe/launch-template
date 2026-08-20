import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";

export type PaginationItem = number | "gap";

export function paginationItems(
  currentPage: number,
  totalPages: number,
): PaginationItem[] {
  if (totalPages <= 1) return [];

  const visiblePages = 5;
  const sidePages = Math.floor((visiblePages - 1) / 2);
  const items: PaginationItem[] = [1];
  let start = Math.max(2, currentPage - sidePages);
  let end = Math.min(totalPages - 1, currentPage + sidePages);

  if (currentPage <= sidePages + 1) {
    end = Math.min(totalPages - 1, visiblePages - 1);
  } else if (currentPage >= totalPages - sidePages) {
    start = Math.max(2, totalPages - visiblePages + 2);
  }

  if (start > 2) items.push("gap");
  for (let page = start; page <= end; page += 1) items.push(page);
  if (end < totalPages - 1) items.push("gap");
  items.push(totalPages);

  return items;
}

function blogPageHref({
  page,
  category,
  query,
}: {
  page: number;
  category: string;
  query: string;
}): string {
  const params = new URLSearchParams();
  if (category !== "all") params.set("category", category);
  if (query) params.set("query", query);
  if (page > 1) params.set("page", String(page));
  const suffix = params.toString();
  return suffix ? `/blog?${suffix}` : "/blog";
}

export function BlogPagination({
  currentPage,
  totalPages,
  category,
  query,
}: {
  currentPage: number;
  totalPages: number;
  category: string;
  query: string;
}) {
  const items = paginationItems(currentPage, totalPages);
  if (items.length === 0) return null;

  const sharedArrowClass =
    "inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-sm font-semibold text-ink-muted transition-colors hover:text-ink";

  return (
    <nav
      aria-label="Blog pagination"
      className="mt-14 flex items-center justify-center gap-1 sm:gap-2"
    >
      {currentPage > 1 ? (
        <Link
          className={`${sharedArrowClass} mr-1 sm:mr-2`}
          href={blogPageHref({ page: currentPage - 1, category, query })}
          rel="prev"
        >
          <ChevronLeftIcon className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">Previous</span>
        </Link>
      ) : (
        <span
          className={`${sharedArrowClass} mr-1 opacity-35 sm:mr-2`}
          aria-disabled="true"
        >
          <ChevronLeftIcon className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">Previous</span>
        </span>
      )}

      {items.map((item, index) =>
        item === "gap" ? (
          <span
            className="grid size-11 place-items-center text-sm tracking-[0.2em] text-ink-faint"
            aria-hidden="true"
            key={`gap-${index}`}
          >
            •••
          </span>
        ) : item === currentPage ? (
          <span
            aria-current="page"
            className="grid size-11 place-items-center rounded-lg border border-ink bg-paper text-sm font-semibold text-ink"
            key={item}
          >
            {item}
          </span>
        ) : (
          <Link
            aria-label={`Go to blog page ${item}`}
            className="grid size-11 place-items-center rounded-lg border border-transparent text-sm text-ink-muted transition-colors hover:bg-paper hover:text-ink"
            href={blogPageHref({ page: item, category, query })}
            key={item}
          >
            {item}
          </Link>
        ),
      )}

      {currentPage < totalPages ? (
        <Link
          className={`${sharedArrowClass} ml-1 sm:ml-2`}
          href={blogPageHref({ page: currentPage + 1, category, query })}
          rel="next"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRightIcon className="size-4" aria-hidden="true" />
        </Link>
      ) : (
        <span
          className={`${sharedArrowClass} ml-1 opacity-35 sm:ml-2`}
          aria-disabled="true"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRightIcon className="size-4" aria-hidden="true" />
        </span>
      )}
    </nav>
  );
}
