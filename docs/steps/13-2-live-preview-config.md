# Step 13.2 — Add livePreview config to payload.config.ts

Add the `admin.livePreview` configuration so the admin panel knows
which collections support Live Preview and what URL to load in the
iframe.

---

## 1. The story

Live Preview starts with one config block in `payload.config.ts`. You
tell Payload: "these collections support preview, load this URL in the
iframe, and offer these device breakpoints." Without this config, the
admin has no "Live Preview" button — the feature doesn't exist.

---

## 2. What you'll learn — Payload

> **Official docs:** [Live Preview Overview](https://payloadcms.com/docs/live-preview/overview)

### The `admin.livePreview` config

Lives inside `admin` in your `buildConfig`:

```ts
admin: {
  livePreview: {
    url: 'http://localhost:3000',   // iframe src
    collections: ['pages'],         // which collections get the button
    breakpoints: [                  // optional device sizes
      { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
      { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
      { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
    ],
  },
},
```

### Config options explained

| Option | Type | What it does |
|---|---|---|
| `url` | `string` or `function` | The URL loaded in the iframe. Can be static or dynamic (we'll make it dynamic in step 13.5) |
| `collections` | `string[]` | Collection slugs that get the "Live Preview" button |
| `globals` | `string[]` | Global slugs that get the button (optional) |
| `breakpoints` | `array` | Device sizes shown in the preview toolbar |

### Breakpoint properties

Each breakpoint needs:

| Property | Required | What it does |
|---|---|---|
| `label` | Yes | Text shown in the dropdown ("Mobile", "Tablet", etc.) |
| `name` | Yes | Internal identifier |
| `width` | Yes | iframe width in pixels |
| `height` | Yes | iframe height in pixels |

A **"Responsive"** option (100% width/height) is always available
automatically — you don't need to define it.

### What's a static URL good for?

A static URL like `http://localhost:3000` loads your homepage in the
iframe regardless of which page you're editing. That's not ideal —
if you're editing `/about`, you want to see `/about`, not `/home`.

We'll fix this in step 13.5 with a dynamic URL function. For now,
a static URL gets us the button and the iframe working.

---

## 3. What you'll learn — TypeScript

- The `admin.livePreview` type is part of `Config['admin']`
- Breakpoints use a typed array of objects — autocomplete shows you
  all required properties

---

## 4. Builds on

- [Step 13.1 — What is Live Preview](13-1-what-is-live-preview.md)

---

## 5. Steps

### 5a. Add livePreview to payload.config.ts

Open `src/payload.config.ts`. Find the `admin` block and add
`livePreview`:

```ts
admin: {
  user: Users.slug,
  importMap: {
    baseDir: path.resolve(dirname),
  },
  livePreview: {
    url: 'http://localhost:3000',
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

The admin panel needs to pick up the new config.

### 5c. Verify the button appears

1. Go to `http://localhost:3000/admin`
2. Click into any Page document (e.g. "Home")
3. You should see a **"Live Preview"** button at the top of the edit view
4. Click it — the admin splits into form (left) + iframe (right)
5. The iframe loads `http://localhost:3000` (your homepage)

### 5d. Test the breakpoints

1. In the Live Preview toolbar, click the breakpoint dropdown
2. Select "Mobile" → iframe resizes to 375×667
3. Select "Tablet" → iframe resizes to 768×1024
4. Select "Responsive" → iframe fills the available space
5. Try the manual width/height inputs in the toolbar

### 5e. What you'll notice (and what's wrong)

At this point:

- The iframe loads, but it **always shows the same page** regardless of
  which document you're editing (because `url` is static)
- Changes you make in the form **don't appear** in the iframe (because
  we haven't added the `RefreshRouteOnSave` component yet)

Both issues are fixed in the next steps.

---

## 6. Verify

- [ ] Dev server starts without errors
- [ ] "Live Preview" button appears on Page edit views
- [ ] Clicking it opens the split view with an iframe
- [ ] Breakpoint selector shows Mobile, Tablet, Desktop, Responsive
- [ ] Selecting a breakpoint resizes the iframe
- [ ] "Live Preview" does NOT appear on Posts (only Pages is configured)

---

## 7. Commit

```bash
git add src/payload.config.ts
git commit -m "step 13.2 — add livePreview config to payload.config.ts"
```

---

## 8. Unlocks

- **Step 13.3** — Enable drafts + autosave on Pages (required for live updates)

---

| Nav | |
|---|---|
| <- Previous | [Step 13.1 — what is Live Preview](13-1-what-is-live-preview.md) |
| -> Next | [Step 13.3 — drafts + autosave on Pages](13-3-drafts-autosave-pages.md) |
