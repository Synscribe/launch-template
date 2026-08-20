import type { Metadata } from "next";

import { LegalTemplate } from "@/components/legal-template";
import { usesTemplateIdentity } from "@/config/env";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy policy",
  description:
    "Privacy-policy implementation scaffold for this Next.js launch template.",
  path: "/privacy",
  noIndex: usesTemplateIdentity,
});

export default function PrivacyPage() {
  return (
    <LegalTemplate
      eyebrow="Legal scaffold"
      title="Privacy policy"
      introduction="The final policy should describe the information the actual site collects, why it is processed, who receives it, how long it is retained, and which choices or rights are available to visitors."
      sections={[
        {
          title: "Information collected",
          body: "Document submitted form fields, analytics identifiers, cookies, server logs, account information, uploaded content, and any information received from integrations. Remove categories the production site does not collect.",
        },
        {
          title: "How information is used",
          body: "Explain the concrete purposes for processing, including responding to enquiries, operating the service, measuring site performance, preventing abuse, and meeting legal obligations where applicable.",
        },
        {
          title: "Providers, retention, and rights",
          body: "Name or categorize relevant processors, define retention periods, record international transfers where applicable, and provide the real contact and request process required for the client's operating markets.",
        },
      ]}
    />
  );
}
