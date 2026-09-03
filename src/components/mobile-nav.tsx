"use client";

import { ArrowRightIcon, MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

import type { NavigationItem } from "@/config/site";

type MobileNavProps = {
  navigation: readonly NavigationItem[];
  primaryAction: {
    href: string;
    label: string;
  };
};

export function MobileNav({ navigation, primaryAction }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    firstLinkRef.current?.focus();

    function closeOnOutsidePointer(event: PointerEvent) {
      const root = rootRef.current;
      if (root && !root.contains(event.target as Node)) setOpen(false);
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    }

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div className="relative md:hidden" ref={rootRef}>
      <button
        aria-controls={menuId}
        aria-expanded={open}
        aria-label={open ? "Close navigation" : "Open navigation"}
        className="relative z-[60] grid size-10 place-items-center rounded-full border border-ink/10 bg-paper text-ink"
        onClick={() => setOpen((current) => !current)}
        ref={triggerRef}
        type="button"
      >
        {open ? (
          <XIcon className="size-5" aria-hidden="true" />
        ) : (
          <MenuIcon className="size-5" aria-hidden="true" />
        )}
      </button>

      {open ? (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-40 bg-ink/5"
          />
          <div
            className="absolute top-12 right-0 z-50 w-64 rounded-2xl border border-ink/10 bg-paper p-3 shadow-[var(--shadow-card)]"
            id={menuId}
          >
            <nav aria-label="Mobile navigation">
              <ul className="space-y-1">
                {navigation.map((item, index) => (
                  <li key={item.href}>
                    <Link
                      className="block rounded-xl px-3 py-2.5 text-sm font-medium text-ink-muted hover:bg-canvas hover:text-ink"
                      href={item.href}
                      onClick={() => setOpen(false)}
                      ref={index === 0 ? firstLinkRef : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <Link
              className="mt-3 flex items-center justify-between rounded-xl bg-signal px-3 py-2.5 text-sm font-semibold text-white"
              href={primaryAction.href}
              onClick={() => setOpen(false)}
            >
              {primaryAction.label}
              <ArrowRightIcon className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </>
      ) : null}
    </div>
  );
}
