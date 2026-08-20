import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-canvas/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link
          href="/"
          className="group inline-flex items-center gap-2.5 font-semibold tracking-tight"
          aria-label={`${siteConfig.name} home`}
        >
          <span
            aria-hidden="true"
            className="grid size-7 place-items-center rounded-full bg-ink text-[10px] font-black text-canvas transition-transform group-hover:-rotate-6"
          >
            LT
          </span>
          <span>{siteConfig.name}</span>
        </Link>

        <nav aria-label="Primary navigation" className="hidden md:block">
          <ul className="flex items-center gap-7 text-sm text-ink-muted">
            {siteConfig.navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="transition-colors hover:text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link
          href="/#workflow"
          className={buttonVariants({
            size: "sm",
            className:
              "h-auto rounded-full bg-signal px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_28px_rgba(224,78,34,0.22)] hover:-translate-y-0.5 hover:bg-signal-strong",
          })}
        >
          See the workflow
          <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
        </Link>
      </div>
    </header>
  );
}
