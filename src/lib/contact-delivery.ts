import nodemailer from "nodemailer";

import { siteConfig } from "../config/site";
import type { ContactSubmission } from "./contact";

const requiredVariables = [
  "MAIL_HOST",
  "MAIL_PORT",
  "MAIL_USER",
  "MAIL_PASS",
  "MAIL_FROM",
  "CONTACT_TO_EMAIL",
] as const;

type ContactDeliveryVariable = (typeof requiredVariables)[number];

function configuredValue(name: ContactDeliveryVariable): string | undefined {
  const value = process.env[name]?.trim();
  return value || undefined;
}

function configuredPort(): number | null {
  const value = Number.parseInt(configuredValue("MAIL_PORT") ?? "", 10);
  return Number.isInteger(value) && value > 0 && value <= 65_535 ? value : null;
}

export function missingContactDeliveryVariables(): ContactDeliveryVariable[] {
  return requiredVariables.filter((name) => {
    if (name === "MAIL_PORT") return configuredPort() === null;
    return !configuredValue(name);
  });
}

export function isContactDeliveryConfigured(): boolean {
  return missingContactDeliveryVariables().length === 0;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function display(value: string | null | undefined): string {
  return value || "Not provided";
}

function safeSubjectValue(value: string): string {
  return value.replace(/[\r\n\u0000-\u001f\u007f]+/g, " ").trim();
}

function attributionRows(submission: ContactSubmission): [string, string][] {
  const { attribution } = submission;
  return [
    ["External referrer", display(attribution.referrerUrl)],
    ["First landing page", display(attribution.firstVisitUrl)],
    ["First visit", display(attribution.firstVisitAt)],
    ["UTM source", display(attribution.firstUtm?.source)],
    ["UTM medium", display(attribution.firstUtm?.medium)],
    ["UTM campaign", display(attribution.firstUtm?.campaign)],
    ["UTM term", display(attribution.firstUtm?.term)],
    ["UTM content", display(attribution.firstUtm?.content)],
    [
      "Recent pages",
      attribution.recentPages.length > 0
        ? attribution.recentPages.join("\n")
        : "Not provided",
    ],
  ];
}

export function renderContactEmail(submission: ContactSubmission): {
  subject: string;
  text: string;
  html: string;
} {
  const formRows: [string, string][] = [
    ["Name", submission.name],
    ["Email", submission.email],
    ["Company", display(submission.company)],
    ["Website", display(submission.website)],
    ["Message", submission.message],
  ];
  const contextRows = attributionRows(submission);
  const textRows = [...formRows, ...contextRows]
    .map(([label, value]) => `${label}:\n${value}`)
    .join("\n\n");
  const htmlRows = (rows: [string, string][]) =>
    rows
      .map(
        ([label, value]) =>
          `<tr><th align="left" valign="top" style="padding:8px 16px 8px 0">${escapeHtml(label)}</th><td style="padding:8px 0;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`,
      )
      .join("");

  return {
    subject: `New website enquiry — ${safeSubjectValue(submission.name)}`,
    text: `${siteConfig.name} received a new website enquiry.\n\n${textRows}`,
    html: [
      `<h1 style="font:600 24px/1.3 sans-serif">New website enquiry</h1>`,
      `<table style="border-collapse:collapse;font:14px/1.5 sans-serif"><tbody>${htmlRows(formRows)}</tbody></table>`,
      `<h2 style="font:600 18px/1.3 sans-serif;margin-top:32px">Attribution</h2>`,
      `<table style="border-collapse:collapse;font:14px/1.5 sans-serif"><tbody>${htmlRows(contextRows)}</tbody></table>`,
    ].join(""),
  };
}

export async function deliverContactSubmission(
  submission: ContactSubmission,
): Promise<void> {
  const missing = missingContactDeliveryVariables();
  if (missing.length > 0) {
    throw new Error(
      `Contact delivery is not configured: ${missing.join(", ")}`,
    );
  }

  const port = configuredPort();
  if (!port) throw new Error("Contact delivery port is invalid.");

  const transporter = nodemailer.createTransport({
    host: configuredValue("MAIL_HOST"),
    port,
    secure: port === 465,
    auth: {
      user: configuredValue("MAIL_USER"),
      pass: configuredValue("MAIL_PASS"),
    },
  });
  const email = renderContactEmail(submission);

  await transporter.sendMail({
    from: configuredValue("MAIL_FROM"),
    to: configuredValue("CONTACT_TO_EMAIL"),
    replyTo: submission.email,
    ...email,
  });
}
