"use client";

import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import posthog from "posthog-js";
import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import { Button } from "@/components/ui/button";
import {
  CONTACT_LIMITS,
  type ContactFieldErrors,
  type ContactFields,
  validateContactFields,
} from "@/lib/contact";
import { getVisitorContext } from "@/lib/visitor-context";

import { useTurnstile } from "./turnstile";

type ContactFormProps = {
  deliveryConfigured: boolean;
  turnstileAction?: string;
  turnstileSiteKey?: string;
};

type SubmissionState = "idle" | "sending" | "success" | "error";

const initialFields: ContactFields = {
  name: "",
  email: "",
  company: "",
  website: "",
  message: "",
};

const fieldClassName =
  "mt-2 w-full rounded-xl border border-ink/15 bg-paper px-4 py-3 text-base text-ink outline-none transition placeholder:text-ink-faint focus:border-signal focus:ring-3 focus:ring-signal/15 aria-invalid:border-signal";

export function ContactForm({
  deliveryConfigured,
  turnstileAction,
  turnstileSiteKey,
}: ContactFormProps) {
  const [fields, setFields] = useState<ContactFields>(initialFields);
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({});
  const [state, setState] = useState<SubmissionState>("idle");
  const [formError, setFormError] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const startedAt = useRef(0);
  const {
    enabled: turnstileEnabled,
    error: turnstileError,
    reset: resetTurnstile,
    token: turnstileToken,
    widget: turnstileWidget,
  } = useTurnstile({
    action: turnstileAction,
    siteKey: turnstileSiteKey,
  });

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  function updateField(name: keyof ContactFields, value: string) {
    setFields((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: undefined }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!deliveryConfigured || state === "sending") return;

    const validation = validateContactFields(fields);
    if (!validation.data) {
      setFieldErrors(validation.fieldErrors);
      setFormError("Check the highlighted fields.");
      setState("error");
      return;
    }

    setState("sending");
    setFormError("");
    setFieldErrors({});

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...validation.data,
          attribution: getVisitorContext(),
          companyWebsite,
          startedAt: startedAt.current,
          ...(turnstileEnabled ? { turnstileToken } : {}),
        }),
      });
      const result = (await response.json()) as {
        success?: boolean;
        error?: string;
        fieldErrors?: ContactFieldErrors;
      };

      if (!response.ok || !result.success) {
        setFieldErrors(result.fieldErrors ?? {});
        throw new Error(result.error || "Your message could not be sent.");
      }

      resetTurnstile();
      if (process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN) {
        posthog.capture("contact_form_submitted", { source: "contact" });
      }
      setFields(initialFields);
      setState("success");
    } catch (error) {
      resetTurnstile();
      setFormError(
        error instanceof Error
          ? error.message
          : "Your message could not be sent. Please try again.",
      );
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div
        className="-m-5 bg-mint/25 p-5 sm:-m-8 sm:p-8 lg:-m-10 lg:p-10"
        role="status"
      >
        <h2 className="max-w-lg font-display text-3xl leading-tight tracking-[-0.03em] sm:text-4xl">
          Thank you. We&apos;ve received your message.
        </h2>
        <p className="mt-4 max-w-md leading-7 text-ink-muted">
          We&apos;ll get back to you within 1–3 working days.
        </p>

        <div className="mt-8 border-t border-ink/10 pt-6">
          <Button
            className="h-auto rounded-full px-5 py-3"
            onClick={() => {
              startedAt.current = Date.now();
              setState("idle");
            }}
            type="button"
            variant="outline"
          >
            Send another message
            <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={submit}>
      {!deliveryConfigured ? (
        <div
          className="mb-6 rounded-xl border border-signal/25 bg-signal/8 px-4 py-3 text-sm leading-6 text-ink"
          role="status"
        >
          Form delivery is not configured in this template. Add the server-only
          mail settings before testing it.
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Name" error={fieldErrors.name} required>
          <input
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? "name-error" : undefined}
            autoComplete="name"
            className={fieldClassName}
            id="name"
            maxLength={CONTACT_LIMITS.name}
            name="name"
            onChange={(event) => updateField("name", event.target.value)}
            required
            type="text"
            value={fields.name}
          />
        </Field>

        <Field id="email" label="Work email" error={fieldErrors.email} required>
          <input
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
            autoComplete="email"
            className={fieldClassName}
            id="email"
            inputMode="email"
            maxLength={CONTACT_LIMITS.email}
            name="email"
            onChange={(event) => updateField("email", event.target.value)}
            required
            type="email"
            value={fields.email}
          />
        </Field>

        <Field id="company" label="Company" error={fieldErrors.company}>
          <input
            aria-invalid={Boolean(fieldErrors.company)}
            aria-describedby={fieldErrors.company ? "company-error" : undefined}
            autoComplete="organization"
            className={fieldClassName}
            id="company"
            maxLength={CONTACT_LIMITS.company}
            name="company"
            onChange={(event) => updateField("company", event.target.value)}
            type="text"
            value={fields.company}
          />
        </Field>

        <Field id="website" label="Current website" error={fieldErrors.website}>
          <input
            aria-invalid={Boolean(fieldErrors.website)}
            aria-describedby={fieldErrors.website ? "website-error" : undefined}
            autoComplete="url"
            className={fieldClassName}
            id="website"
            inputMode="url"
            maxLength={CONTACT_LIMITS.website}
            name="website"
            onChange={(event) => updateField("website", event.target.value)}
            placeholder="example.com"
            type="url"
            value={fields.website}
          />
        </Field>
      </div>

      <div className="mt-5">
        <Field
          id="message"
          label="What do you need?"
          error={fieldErrors.message}
          required
        >
          <textarea
            aria-invalid={Boolean(fieldErrors.message)}
            aria-describedby={
              fieldErrors.message
                ? "message-help message-error"
                : "message-help"
            }
            className={`${fieldClassName} min-h-40 resize-y`}
            id="message"
            maxLength={CONTACT_LIMITS.message}
            name="message"
            onChange={(event) => updateField("message", event.target.value)}
            placeholder="Tell us what you are launching, rebuilding, or moving."
            required
            value={fields.message}
          />
          <p
            className="mt-2 text-xs leading-5 text-ink-muted"
            id="message-help"
          >
            Please do not send passwords or other sensitive information.
          </p>
        </Field>
      </div>

      <div className="absolute -left-[10000px]" aria-hidden="true">
        <label htmlFor="company-website">Leave this field empty</label>
        <input
          autoComplete="off"
          id="company-website"
          name="companyWebsite"
          onChange={(event) => setCompanyWebsite(event.target.value)}
          tabIndex={-1}
          type="text"
          value={companyWebsite}
        />
      </div>

      {turnstileWidget}

      {turnstileError ? (
        <p className="mt-3 text-sm text-signal-strong" role="alert">
          {turnstileError}
        </p>
      ) : null}

      {formError ? (
        <p className="mt-5 text-sm font-medium text-signal-strong" role="alert">
          {formError}
        </p>
      ) : null}

      <Button
        className="mt-7 h-auto w-full rounded-full bg-signal px-6 py-3.5 text-base font-semibold text-white shadow-[0_8px_28px_rgba(224,78,34,0.2)] hover:bg-signal-strong sm:w-auto"
        disabled={
          !deliveryConfigured ||
          state === "sending" ||
          (turnstileEnabled && !turnstileToken)
        }
        type="submit"
      >
        {state === "sending" ? "Sending…" : "Send message"}
        {state !== "sending" ? (
          <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
        ) : null}
      </Button>
      <p className="mt-3 max-w-md text-xs leading-5 text-ink-muted">
        We use your details to respond to this enquiry. Read our{" "}
        <Link className="underline underline-offset-3" href="/privacy">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
}

function Field({
  children,
  error,
  id,
  label,
  required = false,
}: {
  children: ReactNode;
  error?: string;
  id: string;
  label: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-ink" htmlFor={id}>
        {label}
        {required ? <span className="text-signal"> *</span> : null}
      </label>
      {children}
      {error ? (
        <p className="mt-2 text-sm text-signal-strong" id={`${id}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
