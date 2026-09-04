# IndexNow key

Use a unique IndexNow key for each production website. The key is public, but
copying a key from another site breaks ownership verification.

Generate or rotate the key from the repository root:

```bash
pnpm indexnow:key
```

The command creates:

- `indexnow-key.json`, which records the active key and generated file;
- `public/<key>.txt`, whose contents are exactly `<key>` with no newline.

Commit both files with the site. Next.js serves the public file at
`https://yourdomain.com/<key>.txt`. Open that production URL and confirm the
response contains only the key before submitting URLs.

Running the command again creates a cryptographically random 32-character key,
updates the config, and removes only the previously recorded key file. Deploy
the new file before submitting with the new key.

The generator verifies ownership only. Add URL submission automation when the
site publishes or removes content often enough to justify it. Continue to use
the XML sitemap for complete URL discovery.
