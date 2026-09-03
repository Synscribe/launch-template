import type { Metadata } from "next";

import { LegalTemplate } from "@/components/legal-template";
import { usesDefaultSiteUrl } from "@/config/env";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Terms of service",
  description:
    "Terms-of-service implementation scaffold for this Next.js launch template.",
  path: "/terms",
  noIndex: usesDefaultSiteUrl,
});

export default function TermsPage() {
  return (
    <LegalTemplate
      eyebrow="Legal scaffold"
      title="Terms of service"
      introduction="The final terms should describe the actual company, offer, customer relationship, acceptable use, payment model, risk allocation, and governing law. A marketing-site template cannot make those decisions safely."
      sections={[
        {
          title: "Using the site or service",
          body: "Define eligibility, account responsibilities, acceptable use, prohibited conduct, and the distinction between browsing the marketing site and purchasing or using the product.",
        },
        {
          title: "Commercial terms",
          body: "Add the real subscription, payment, renewal, cancellation, refund, service-level, intellectual-property, and feedback terms that apply to the client's offer.",
        },
        {
          title: "Disclaimers and disputes",
          body: "Have qualified counsel review warranties, liability limits, indemnities, termination, notices, dispute resolution, and governing law for the organization and its markets.",
        },
      ]}
    />
  );
}
