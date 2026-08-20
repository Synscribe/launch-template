import { CheckIcon } from "lucide-react";
import type { Metadata } from "next";

import { isContactDeliveryConfigured } from "@/lib/contact-delivery";
import { createPageMetadata } from "@/lib/seo";

import { ContactForm } from "./_components/contact-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  description:
    "Tell us about the website you want to migrate, rebuild, or launch.",
  path: "/contact",
});

const usefulDetails = [
  "What you are building or changing",
  "Your current website, if there is one",
  "Any launch date or constraint that matters",
];

export default function ContactPage() {
  const deliveryConfigured = isContactDeliveryConfigured();

  return (
    <main
      className="overflow-hidden"
      data-contact-delivery={deliveryConfigured ? "configured" : "missing"}
      id="main-content"
    >
      <section className="py-12 sm:py-20 lg:py-28">
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
          <div className="lg:pt-5">
            <p className="text-sm font-semibold tracking-[0.16em] text-signal-strong uppercase">
              Start a project
            </p>
            <h1 className="mt-5 max-w-2xl text-balance font-display text-5xl leading-[0.96] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              Tell us what you&apos;re building.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-ink-muted">
              Moving an old site? Rebuilding one? Starting fresh? Share the
              basics so we can understand the work.
            </p>

            <div className="mt-10 hidden border-t border-ink/15 pt-7 lg:block">
              <p className="text-sm font-semibold">It helps to include:</p>
              <ul className="mt-5 space-y-4">
                {usefulDetails.map((detail) => (
                  <li
                    className="flex items-start gap-3 text-sm leading-6 text-ink-muted"
                    key={detail}
                  >
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-mint text-ink">
                      <CheckIcon className="size-3" aria-hidden="true" />
                    </span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="self-start overflow-hidden rounded-[var(--radius-card)] border border-ink/10 bg-paper p-5 shadow-[var(--shadow-card)] sm:p-8 lg:p-10">
            <ContactForm deliveryConfigured={deliveryConfigured} />
          </div>
        </div>
      </section>
    </main>
  );
}
