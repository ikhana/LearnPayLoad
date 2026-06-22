# Step 10.2 — Drafts on Pages

Add the draft/publish workflow to Pages. Editors can now save work
without it going live.

---

## 1. The story

Version history lets you go back. But it doesn't let you go forward
safely — every save is immediately live. An editor working on a page
redesign has to finish everything in one session, or the half-done
version goes live.

Drafts solve this. Save a draft, work on it over days, and only
publish when it's ready. The live site keeps showing the last published
version until you explicitly publish the new one.

---

## 2. What you'll learn — Payload

> **Official docs:** [Drafts](https://payloadcms.com/docs/versions/drafts)

**What `drafts: true` adds on top of versions:**

| Feature | What it does |
|---|---|
| `_status` field | Auto-injected — `'draft'` or `'published'` |
| "Save Draft" button | Saves without publishing |
| "Publish" button | Makes the document live |
| "Unpublish" action | Reverts a published doc back to draft |
| API filtering | REST API only returns published docs by default |

**The `_status` field:**

This is NOT a field you define — Payload injects it automatically when
`drafts: true` is enabled. It has two values: `'draft'` and
`'published'`. It appears in the admin sidebar and in your generated
types.

**API behavior with drafts:**

| Request | Returns |
|---|---|
| `GET /api/pages` | Only published pages |
| `GET /api/pages?draft=true` | Published AND draft pages |
| `payload.find({ collection: 'pages' })` | Only published (when access control uses `_status`) |
| `payload.find({ collection: 'pages', draft: true })` | Published AND drafts |

This is important: **enabling drafts changes what the API returns by
default.** If your frontend suddenly shows no pages after enabling
drafts, it's because your pages are in `draft` status and the API
is filtering them out.

---

## 3. What you'll learn — TypeScript

- `_status` appears in generated types: `_status?: ('draft' | 'published') | null`
- How `_status` works in access control query constraints
- `Partial<T>` concept — drafts can have incomplete data

---

## 4. Builds on

- [Step 10.1 — Version history on Pages](10-1-versions-drafts.md)
- [Step 05.1 — Access control](05-1-roles-and-basic-access.md)

---

## 5. Steps

### 5a. Enable drafts on Pages

Open `src/collections/Pages.ts` — change `versions` from plain object
to include `drafts`:

```ts
versions: {
  drafts: true,
  maxPerDoc: 25,
},
```

Also add `_status` to `defaultColumns` so you can see it in the list:

```ts
admin: {
  useAsTitle: 'title',
  defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
  group: 'Content',
},
```

### 5b. Understand the admin UI change

Before drafts: one "Save" button.

After drafts: the save button splits into:

- **"Save Draft"** — saves the document with `_status: 'draft'`
- **"Publish"** — saves with `_status: 'published'`

There's also a status indicator in the sidebar showing the current
status, and an "Unpublish" action to revert a published doc to draft.

### 5c. Understand what happens to existing documents

When you enable drafts on a collection that already has documents,
those existing documents have **no `_status` field** — it's `null` or
`undefined`. This means:

- They won't appear in API queries that filter by `_status: 'published'`
- You need to open each one and publish it, or run a migration script

Quick fix for development — open each page in the admin and click
"Publish." For production, you'd write a migration:

```ts
// One-time migration script (run manually, not a hook)
const pages = await payload.find({
  collection: 'pages',
  limit: 0, // all documents
  where: {
    _status: { exists: false },
  },
})

for (const page of pages.docs) {
  await payload.update({
    collection: 'pages',
    id: page.id,
    data: { _status: 'published' },
  })
}
```

You don't need to run this now — just understand that it's a concern
for production deployments.

### 5d. Update the frontend query

Your `[slug]/page.tsx` already has `_status` in the where clause. But
let's understand why each part matters:

```tsx
const result = await payload.find({
  collection: 'pages',
  where: {
    slug: { equals: slug },
    _status: { equals: 'published' },
  },
  overrideAccess: true,
  draft: isDraftMode,
  limit: 1,
})
```

| Option | What it does | Why |
|---|---|---|
| `_status: { equals: 'published' }` | Only fetch published pages | Don't show draft content to visitors |
| `draft: isDraftMode` | When Next.js draft mode is on, include drafts | For content preview |
| `overrideAccess: true` | Skip access control | This is server-side code we trust |

The `draft: isDraftMode` line overrides the `_status` filter when
Next.js draft mode is active. This is how editors preview unpublished
content — they activate draft mode (usually via a preview URL), and
the frontend shows draft documents.

### 5e. Generate types

```bash
pnpm generate:types
```

Open `payload-types.ts` — the `Page` interface now has:

```ts
_status?: ('draft' | 'published') | null
```

This field is optional because it can be `null` for documents created
before drafts were enabled.

---

## 6. Verify

- [ ] Dev server starts without errors
- [ ] Pages list view shows `_status` column
- [ ] Edit a page → you see "Save Draft" and "Publish" buttons
- [ ] Save as draft → the page shows `_status: draft` in the list
- [ ] Visit the frontend → draft pages don't show (404)
- [ ] Publish the page → it appears on the frontend
- [ ] `/api/pages` → only published pages appear
- [ ] `/api/pages?draft=true` → draft pages also appear
- [ ] `payload-types.ts` has `_status` on the `Page` interface

---

## 7. Commit

```bash
git add src/collections/Pages.ts src/payload-types.ts
git commit -m "step 10.2 — drafts on Pages with _status field"
```

---

## 8. Unlocks

- **Step 10.3** — Drafts on Posts (replace manual status field)

---

| Nav | |
|---|---|
| ← Previous | [Step 10.1 — version history](10-1-versions-drafts.md) |
| → Next | [Step 10.3 — drafts on Posts](10-3-drafts-posts.md) |
