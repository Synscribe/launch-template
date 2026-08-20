import Link from "next/link";

type LegalTemplateProps = {
  eyebrow: string;
  title: string;
  introduction: string;
  sections: Array<{ title: string; body: string }>;
};

export function LegalTemplate({
  eyebrow,
  title,
  introduction,
  sections,
}: LegalTemplateProps) {
  return (
    <main id="main-content" className="bg-paper">
      <article className="mx-auto w-full max-w-3xl px-5 py-20 sm:px-8 sm:py-28">
        <p className="text-xs font-bold tracking-[0.2em] text-signal uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-5 font-display text-5xl tracking-[-0.045em] sm:text-7xl">
          {title}
        </h1>
        <div className="mt-8 rounded-2xl border border-signal/20 bg-signal/5 p-5 text-sm leading-6 text-ink-muted">
          <strong className="text-ink">Template status:</strong>{" "}
          TODO_CLIENT_LEGAL_REVIEW. This page is an implementation scaffold, not
          approved legal advice. Replace it with terms reviewed for the actual
          organization, product, data practices, and markets before production.
        </div>
        <p className="mt-10 text-lg leading-8 text-ink-muted">{introduction}</p>

        <div className="mt-14 space-y-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-2xl font-semibold tracking-tight">
                {section.title}
              </h2>
              <p className="mt-4 leading-7 text-ink-muted">{section.body}</p>
            </section>
          ))}
        </div>

        <p className="mt-16 border-t border-ink/10 pt-8 text-sm text-ink-muted">
          Return to the{" "}
          <Link className="underline" href="/">
            homepage
          </Link>{" "}
          or review <code>docs/launch/checklist.md</code> before approving this
          route.
        </p>
      </article>
    </main>
  );
}
