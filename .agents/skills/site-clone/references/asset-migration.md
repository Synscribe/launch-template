# Asset migration

Migrate only customer-owned or explicitly licensed files required by the clone. Preserve the original visual result while making ownership and paths understandable in the new project.

## Find every asset source

Inspect more than `<img src>`:

- `src`, `srcset`, `<picture>`, preload links, favicons, and manifests;
- CSS `background-image`, masks, pseudo-elements, and `@font-face` URLs;
- inline and external SVG;
- video posters, video sources, Lottie/animation files, and downloadable documents;
- agent-browser network requests filtered to image, font, and media files.

Lazy-loaded media may not appear until its section enters the viewport. Scroll through the source page before treating the network list as complete.

## Download safely

Resolve relative URLs against the final source URL. Preserve query parameters when they select a real rendition, but remove tracking-only parameters from the local filename. Use redirects and fail on HTTP errors:

```bash
curl --fail --location "https://customer.example/path/asset.webp" \
  --output /tmp/source-asset.webp
```

Never put cookies, bearer tokens, vendor account IDs, or signed private URLs into commands, manifests, commits, or chat. For protected assets, ask the user for a safe authenticated export rather than copying browser secrets. Do not download or reuse assets from a third-party widget unless the client has the right to migrate them.

Check content type and file signature; an image CDN URL may omit the extension. Do not change formats or recompress until the original renders correctly.

## Organize and rename

Prefer stable, descriptive lowercase names:

```text
hero-team.webp
logo-acme-dark.svg
integration-slack.svg
background-security-grid.webp
inter-variable-latin.woff2
```

Avoid source hashes, `image-12-final-final`, and names containing query strings. Suggested boundaries:

```text
public/fonts/              # self-hosted source fonts
public/media/brand/        # logos and brand marks
public/media/shared/       # assets used by multiple routes
public/media/home/         # homepage-only media
public/media/<route>/      # route-family media
```

Deduplicate byte-identical assets. Promote a route asset to `shared` only after a second real use. For a large migration, maintain a small CSV with `source_url,local_path,used_by,notes` so renamed files remain traceable.

## Preserve rendering

- Keep original intrinsic dimensions or aspect ratio.
- Match `object-fit`, `object-position`, background size/position, masks, clipping, and overlays.
- Preserve responsive variants when one source file cannot serve every crop.
- Recreate `@font-face` families with the real weight/style mapping; a mislabeled font weight causes fake bolding and different line wraps.
- Use `next/image` when it preserves the source behavior; use CSS backgrounds when the source depends on cover/position/layering.
- Give meaningful images appropriate alt text and decorative duplicates an empty alt.

Do not redraw logos, use AI-generated replacements, hotlink the source domain, or invent a “close enough” stock asset during 1:1 cloning.

## Verify

After moving files:

- search for remaining old-origin asset URLs in source/CSS;
- verify every local file returns 200 and has the intended MIME type;
- compare desktop and mobile crops against the source;
- confirm fonts report `loaded` and exact weights are used;
- check build output for missing media and case-sensitive path errors;
- run the image, performance, brand, and accessibility checks referenced by the canonical launch checklist.
