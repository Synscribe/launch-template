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
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>("a[href]")?.focus();
  }, [open]);

  return (
    <div
      className="relative md:hidden"
      onKeyDown={(event) => {
        if (!open) return;

        if (event.key === "Escape") {
          event.preventDefault();
          setOpen(false);
          triggerRef.current?.focus();
          return;
        }

        if (event.key !== "Tab") return;

        const panelControls = panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        const focusable = [
          triggerRef.current,
          ...(panelControls ? Array.from(panelControls) : []),
        ].filter((element): element is HTMLElement => Boolean(element));
        const first = focusable[0];
        const last = focusable.at(-1);

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
    >
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
          <button
            aria-hidden="true"
            className="fixed inset-0 z-40 cursor-default bg-ink/5"
            onClick={() => {
              setOpen(false);
              triggerRef.current?.focus();
            }}
            tabIndex={-1}
            type="button"
          />
          <div
            aria-label="Site navigation"
            aria-modal="true"
            className="absolute top-12 right-0 z-50 w-64 rounded-2xl border border-ink/10 bg-paper p-3 shadow-[var(--shadow-card)]"
            id={menuId}
            ref={panelRef}
            role="dialog"
          >
            <nav aria-label="Mobile navigation">
              <ul className="space-y-1">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      className="block rounded-xl px-3 py-2.5 text-sm font-medium text-ink-muted hover:bg-canvas hover:text-ink"
                      href={item.href}
                      onClick={() => setOpen(false)}
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
