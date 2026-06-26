# Step 13.3 — Enable drafts + autosave on Pages

Live Preview needs drafts (so saves don't go live) and autosave (so
the editor doesn't have to manually save). Pages currently has no
versioning at all — we add it now.

---

## 1. The story

Without drafts, every save goes straight to production. If an editor
is typing mid-sentence and Live Preview triggers a save, visitors see
a half-finished page. Drafts solve this — saves go to a draft state
until the editor explicitly clicks "Publish."

Without autosave, the editor has to click "Save Draft" every time
they want to see their changes in the preview. That kills the
"live" feeling. Autosave saves automatically at a set interval,
so changes flow to the preview without manual action.

For Live Preview to feel responsive, we set a short autosave interval.
The Payload docs recommend **375ms** for Live Preview — fast enough to
feel real-time, slow enough to not hammer the database.

---

## 2. What you'll learn — Payload

> **Official docs:**
> - [Versions](https://payloadcms.com/docs/versions/overview)
> - [Drafts](https://payloadcms.com/docs/versions/drafts)
> - [Autosave](https://payloadcms.com/docs/versions/autosave)

### The autosave interval for Live Preview

In Step 10.2, you learned that autosave fires at a configurable
interval. Posts uses `interval: 10000` (10 seconds) — fine for normal
editing, too slow for Live Preview.

For Live Preview, **375ms** is the sweet spot:

```ts
versions: {
  drafts: {
    autosave: {
      interval: 375,  // ms — fast enough for near-real-time preview
    },
  },
  maxPerDoc: 25,
}
```

### Why 375ms specifically?

- **Too fast (50-100ms)**: floods the database with saves, performance
  drops, especially on SQLite
- **Too slow (5000-10000ms)**: editor waits seconds before seeing
  changes — doesn't feel "live"
- **375ms**: Payload's recommended sweet spot — feels responsive,
  doesn't overload the server

### What autosave adds to the admin UI

With autosave enabled, the admin shows:

- **"Saving..."** indicator while autosave is in progress
- **"Last saved at [time]"** after each autosave completes
- The "Save Draft" button still works for manual saves
- The "Publish" button publishes the current draft state

### The `_status` field on Pages

When you enable drafts, Payload injects a `_status` field:

- `_status: 'draft'` — saved but not published
- `_status: 'published'` — live on the frontend

Your frontend query already handles this — the `[slug]/page.tsx` has
`_status: { equals: 'published' }` in the `where` clause, and
`draft: isDraftMode` for preview mode.

---

## 3. What you'll learn — TypeScript

- The `versions` config type accepts nested `drafts.autosave.interval`
- Generated types will now include `_status` on the Page type

---

## 4. Builds on

- [Step 10.1 — Versions](10-1-versions-drafts.md)
- [Step 10.2 — Drafts on Pages](10-2-drafts-pages.md)
- [Step 13.2 — livePreview config](13-2-live-preview-config.md)

---

## 5. Steps

### 5a. Add versions + drafts + autosave to Pages

Open `src/collections/Pages.ts`. Add the `versions` config:

```ts
export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    group: 'Content',
  },
  versions: {
    drafts: {
      autosave: {
        interval: 375,
      },
    },
    maxPerDoc: 25,
  },
  fields: [
    // ... fields stay the same
  ],
}
```

Note: `defaultColumns` now includes `_status` so you can see
draft/published state in the list view.

### 5b. Restart the dev server

```bash
pnpm dev
```

Payload creates the `pages_versions` table on restart.

### 5c. Handle existing documents

If you have existing pages, they won't have `_status` set. Open each
page in the admin and click **"Publish"** to set them to published.
Otherwise they'll disappear from your frontend (which filters by
`_status: 'published'`).

### 5d. Verify autosave in the admin

1. Open a Page in the admin
2. Change the title
3. **Don't click Save** — wait ~1 second
4. You should see "Saving..." appear briefly, then "Last saved at..."
5. The document is auto-saved as a draft

### 5e. Verify draft vs published on frontend

1. Open a Page → change the title to something obvious like
   "DRAFT TEST" → wait for autosave
2. Visit `http://localhost:3000/home` → you should still see the
   **old** title (because the frontend filters by `_status: 'published'`)
3. Go back to admin → click **"Publish"**
4. Refresh the frontend → now you see "DRAFT TEST"
5. This confirms drafts are working — autosaved changes don't leak
   to the public frontend

### 5f. Generate types

```bash
pnpm payload generate:types
```

Check `src/payload-types.ts` — the `Page` interface should now include
`_status?: ('draft' | 'published') | null`.

---

## 6. Verify

- [ ] Dev server starts without errors
- [ ] Pages list view shows `_status` column
- [ ] Editing a page triggers autosave within ~1 second
- [ ] Autosaved changes appear as "draft" status
- [ ] Frontend only shows published pages
- [ ] Clicking "Publish" makes the page appear on frontend
- [ ] `payload-types.ts` has `_status` on the Page type

---

## 7. Commit

```bash
git add src/collections/Pages.ts src/payload-types.ts
git commit -m "step 13.3 — drafts + autosave on Pages for Live Preview"
```

---

## 8. Unlocks

- **Step 13.4** — Add the `RefreshRouteOnSave` component to the frontend

---

| Nav | |
|---|---|
| <- Previous | [Step 13.2 — livePreview config](13-2-live-preview-config.md) |
| -> Next | [Step 13.4 — RefreshRouteOnSave component](13-4-refresh-route-on-save.md) |
