# Step 04.3 — Generate types + test uploads

Generate types to see the Media interface with image sizes, then verify
the upload API end-to-end.

---

## 1. The story

You've configured image sizes and admin polish. Time to see what Payload
generated in the types — the `sizes` object with each named size as a
nested type.

---

## 2. What you'll learn — Payload

> **Official docs:** [TypeScript — Generating Types](https://payloadcms.com/docs/typescript/generating-types)

When you define `imageSizes`, the generated `Media` type includes a
`sizes` object. Each size name becomes a property with `url`, `width`,
`height`, and other metadata.

---

## 3. What you'll learn — TypeScript

> **TS Lessons:** [02.3 — Nested objects](../ts-lessons/02-object-shapes/02-3-nested-objects.md)
>
> The `sizes` object is nested objects three levels deep:
> `media.sizes.thumbnail.url` — same concept as lesson 02.3.

---

## 4. Builds on

- **Steps 04.1–04.2** — Media collection fully configured.
- **Step 01.10** — `generate:types` pattern.

---

## 5. Steps

### 5.1 — Generate types

```bash
pnpm generate:types
```

### 5.2 — Read the Media interface

Open `src/payload-types.ts`. Find the `Media` interface. You should see:

- `alt: string` (required)
- `caption?: string | null` (optional)
- `sizes` object with `thumbnail`, `card`, `og` — each containing
  `url`, `width`, `height`, `mimeType`, `filesize`, `filename`
- Standard upload fields: `url`, `filename`, `mimeType`, `filesize`,
  `width`, `height`, `focalX`, `focalY`

Notice `focalX` and `focalY` — those are the focal point coordinates
the editor sets. The frontend can use these for CSS `object-position`.

### 5.3 — Test the API

With `pnpm dev` running:

**List all media:**
```
GET http://localhost:3000/api/media
```

**Upload a new image** (from the admin UI — easier than curl for file
uploads). Then check the API response — each document should have the
`sizes` object with URLs for each generated size.

### 5.4 — Verify sizes are generated

Look at the file system. Payload stores generated sizes alongside the
original in the `media/` directory (or wherever `staticDir` points).
You should see multiple versions of each uploaded image.

---

## 6. Verify

- [ ] `pnpm generate:types` ran without errors
- [ ] `payload-types.ts` has `Media` interface with `sizes` object
- [ ] Each size (thumbnail, card, og) has its own type with url/width/height
- [ ] `focalX` and `focalY` appear in the generated type
- [ ] API response includes sizes with URLs for each generated size
- [ ] Multiple size files exist on disk for uploaded images

Commit:

```bash
git add .
git commit -m "step 04.3 — generate types, verify uploads with image sizes"
```

---

## 7. Unlocks

- **Step 05** — Access control. Now that you have collections (Posts,
  Categories, Tags, Media) and globals (Header, Footer, Site Settings),
  you'll control who can read, create, update, and delete.
- The `og` image size is ready for the SEO plugin to reference.
- Media is now production-grade: typed, sized, with focal point support.
