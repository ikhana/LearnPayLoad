# Step 13.5 — Dynamic preview URL

Replace the static URL with a function that routes the iframe to the
correct page based on the document being edited.

---

## 1. The story

Right now, editing the "About" page shows `http://localhost:3000` in
the iframe — your homepage. That's useless. You want to see the actual
page you're editing. The `url` option in `livePreview` accepts a
function that receives the document data, so you can build the URL
dynamically: editing `/about` → iframe loads `/about`.

---

## 2. What you'll learn — Payload

> **Official docs:** [Live Preview Overview — URL](https://payloadcms.com/docs/live-preview/overview)

### The URL function signature

Instead of a static string, `url` can be a function:

```ts
url: ({ data, collectionConfig, locale }) => string | null | undefined
```

The function receives:

| Parameter | Type | What it is |
|---|---|---|
| `data` | `object` | The document being edited (includes unsaved changes) |
| `collectionConfig` | `object` | The collection's admin config |
| `globalConfig` | `object` | The global's admin config (if editing a global) |
| `locale` | `object` | Current locale (if localization is enabled) |
| `req` | `PayloadRequest` | The Payload request object |

### Building the URL from slug

For our Pages collection, every page has a `slug` field. The homepage
has `slug: 'home'` and renders at `/`. Other pages render at `/{slug}`.

```ts
url: ({ data }) => {
  const slug = data?.slug
  if (!slug) return 'http://localhost:3000'
  return slug === 'home'
    ? 'http://localhost:3000'
    : `http://localhost:3000/${slug}`
}
```

### Using environment variables

Hardcoding `http://localhost:3000` breaks in production. Use the
same env var from the previous step:

```ts
const serverURL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'

url: ({ data }) => {
  const slug = data?.slug
  if (!slug) return serverURL
  return slug === 'home' ? serverURL : `${serverURL}/${slug}`
}
```

### Returning null to disable preview

If you return `null` or `undefined`, the Live Preview button
**disappears** for that document. Use this for conditional preview:

```ts
url: ({ data, req }) => {
  // Only admins can preview
  if (req.user?.role !== 'admin') return null

  const slug = data?.slug
  return slug === 'home' ? serverURL : `${serverURL}/${slug}`
}
```

We won't use this, but it's good to know.

### Adding locale support

Since we have localization (English + German), we can pass the
current locale to the URL:

```ts
url: ({ data, locale }) => {
  const slug = data?.slug
  const base = slug === 'home' ? serverURL : `${serverURL}/${slug}`
  return locale?.code ? `${base}?locale=${locale.code}` : base
}
```

This way, switching to German in the admin shows the German version
in the preview.

---

## 3. What you'll learn — TypeScript

- **Function as a config value**: the `url` property accepts
  `string | (args) => string | null`. TypeScript narrows the args
  type automatically.
- **Optional chaining with `data?.slug`**: the document data might
  be partially filled (the editor just started a new page), so
  fields can be undefined.
- **Template literals**: `` `${serverURL}/${slug}` `` builds URLs
  cleanly without string concatenation.

---

## 4. Builds on

- [Step 13.2 — livePreview config](13-2-live-preview-config.md)
- [Step 13.4 — RefreshRouteOnSave](13-4-refresh-route-on-save.md)

---

## 5. Steps

### 5a. Update the livePreview URL in payload.config.ts

Open `src/payload.config.ts`. Replace the static `url` with a
function:

```ts
admin: {
  user: Users.slug,
  importMap: {
    baseDir: path.resolve(dirname),
  },
  livePreview: {
    url: ({ data, locale }) => {
      const baseURL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'
      const slug = data?.slug

      const path = !slug || slug === 'home' ? '' : `/${slug}`
      const localeParam = locale?.code ? `?locale=${locale.code}` : ''

      return `${baseURL}${path}${localeParam}`
    },
    collections: ['pages'],
    breakpoints: [
      {
        label: 'Mobile',
        name: 'mobile',
        width: 375,
        height: 667,
      },
      {
        label: 'Tablet',
        name: 'tablet',
        width: 768,
        height: 1024,
      },
      {
        label: 'Desktop',
        name: 'desktop',
        width: 1440,
        height: 900,
      },
    ],
  },
},
```

### 5b. Restart the dev server

```bash
pnpm dev
```

### 5c. Test with multiple pages

1. **Create a second page** if you only have "Home":
   - Go to Admin → Pages → Create
   - Title: "About", Slug: "about"
   - Add a Hero block with some text
   - Click "Publish"

2. **Test the Home page**:
   - Edit the Home page → click Live Preview
   - The iframe should load `http://localhost:3000` (root)
   - Verify by checking the iframe URL in the toolbar

3. **Test the About page**:
   - Edit the About page → click Live Preview
   - The iframe should load `http://localhost:3000/about`
   - Change the title → autosave → iframe refreshes with new title

4. **Test locale switching** (if you want):
   - Switch the admin locale to German
   - The iframe URL should include `?locale=de`

### 5d. Test edge case — new unsaved page

1. Go to Admin → Pages → Create (new page, no slug yet)
2. Click Live Preview
3. The iframe should load `http://localhost:3000` (fallback to root)
4. Type a slug → autosave → iframe should update to the correct URL

---

## 6. Verify

- [ ] Editing "Home" → iframe loads `/` (root)
- [ ] Editing "About" → iframe loads `/about`
- [ ] Creating a new page with no slug → iframe falls back to root
- [ ] Typing a slug on a new page → iframe updates to correct URL after autosave
- [ ] Locale switch changes the iframe URL (if tested)
- [ ] Changes in the form still appear in the iframe after autosave

---

## 7. Commit

```bash
git add src/payload.config.ts
git commit -m "step 13.5 — dynamic preview URL based on document slug and locale"
```

---

## 8. Unlocks

- **Step 13.6** — Full end-to-end testing and verification

---

| Nav | |
|---|---|
| <- Previous | [Step 13.4 — RefreshRouteOnSave](13-4-refresh-route-on-save.md) |
| -> Next | [Step 13.6 — test the full loop](13-6-test-full-loop.md) |
