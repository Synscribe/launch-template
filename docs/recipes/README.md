# Recipes

Recipes explain how to configure or delete defaults and how to add project-specific capabilities. They are instructions, not runtime modules.

Checklist priority, guidance, and status live only in `docs/launch/checklist.json`. A recipe may explain a longer workflow, but it links back to checklist IDs and never keeps its own completion state.

## Available now

- [`homepage.md`](homepage.md): compose the homepage, place real proof, keep one primary action, and verify the positioning sentence.
- [`posthog.md`](posthog.md): configure the default client analytics integration or remove it cleanly.
- [`use-cases.md`](use-cases.md): add validated JSON-backed pages, register React or local-file visuals, or remove the default cleanly.
- [`blog.md`](blog.md): connect the Wisp-backed blog or remove its routes, feed, dependencies, and navigation.
- [`contact.md`](contact.md): configure the contact delivery adapter, review minimized attribution and abuse controls, test it end to end, or remove it cleanly.
- [`llms-txt.md`](llms-txt.md): replace the root machine-readable index, keep its sources and directives current, verify every public target, or record a deliberate opt-out.

## Later add-ons

- animated route-local sections;
- docs/knowledge base;
- `.md` representations beyond those selected for `llms.txt`;
- internationalization and hreflang;
- IndexNow;
- real-user monitoring and performance budgets.

Every recipe must list files changed, environment values, checklist IDs, verification, and complete removal steps. Do not introduce a feature-flag framework.
