# Step 10.1 — Version history on Pages (no drafts yet)

Add version history to the Pages collection. Every save creates a
snapshot you can browse and restore.

---

## 1. The story

An editor rewrites half a page, saves, and immediately regrets it. In
a CMS without versioning, that content is gone. Version history gives
you a timeline of every save — click any version to see what the
document looked like at that point, and restore it with one button.

This step adds version history **without** the draft/publish workflow.
We'll add drafts in the next step. Separating them helps you understand
that versions and drafts are two different features that Payload bundles
under one config.

---

## 2. What you'll learn — Payload

> **Official docs:** [Versions](https://payloadcms.com/docs/versions/overview)

**Versions vs Drafts:**

| Feature | What it does | Config |
|---|---|---|
| **Versions** | Saves a snapshot on every save, browse & restore | `versions: true` |
| **Drafts** | Adds draft/publish workflow + `_status` field | `versions: { drafts: true }` |

You can have versions without drafts. You cannot have drafts without
versions — drafts are built on top of the version system.

**`versions: true` gives you:**

- Version history panel in the admin (sidebar → "Versions")
- Each save creates a timestamped snapshot
- Click any version to view it
- "Restore" button to revert to that version
- Versions are stored in a separate database table/collection

**`maxPerDoc`:**

Without a limit, versions grow forever. `maxPerDoc: 25` means Payload
keeps the 25 most recent versions per document and deletes older ones
automatically. This prevents your database from bloating.

---

## 3. What you'll learn — TypeScript

- `versions` config type and its options
- How generated types stay the same (versions don't add fields)

---

## 4. Builds on

- [Step 09.1 — Pages collection](09-1-first-block.md)

---

## 5. Steps

### 5a. Enable versions on Pages

Open `src/collections/Pages.ts` and add `versions`:

```ts
export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: 'Content',
  },
  versions: {
    maxPerDoc: 25,
  },
  // ... fields stay the same
}
```

That's it. No fields change, no hooks needed.

### 5b. Understand what happened in the database

When you enable `versions`, Payload creates a second table/collection:

| Database | What it creates |
|---|---|
| MongoDB | `pages_versions` collection |
| PostgreSQL / SQLite | `pages_versions` table |

Every time you save a page, the current state is copied into the
versions table before the update. The versions table has:

- `parent` — reference to the original document ID
- `version` — the full document snapshot at that point in time
- `createdAt` — when this version was saved
- `updatedAt` — when this version was saved

### 5c. Test version history in the admin

1. Edit your existing page → change the title → save
2. Change the title again → save
3. Click "Versions" in the sidebar (or the version history tab)
4. You should see 2-3 versions with timestamps
5. Click an older version → you see the document at that point
6. Click "Restore this version" → the document reverts

### 5d. Test via the API

The versions REST API:

```
GET /api/pages/:id/versions         → list all versions of a page
GET /api/pages/:id/versions/:versionId  → get a specific version
POST /api/pages/:id/versions/:versionId → restore a version
```

Try in the browser (while logged in):

```
http://localhost:3000/api/pages/1/versions
```

You'll see an array of version objects, each with the full document
snapshot and a timestamp.

Local API equivalent:

```ts
const versions = await payload.findVersions({
  collection: 'pages',
  where: {
    parent: { equals: pageId },
  },
})
```

---

## 6. Verify

- [ ] Dev server starts without errors
- [ ] Edit a page and save twice → "Versions" panel shows 2 versions
- [ ] Click an older version → see the old content
- [ ] Restore an older version → document reverts
- [ ] `/api/pages/1/versions` returns version list
- [ ] After 25+ saves, oldest versions are pruned (if you want to test)

---

## 7. Commit

```bash
git add src/collections/Pages.ts
git commit -m "step 10.1 — version history on Pages"
```

---

## 8. Unlocks

- **Step 10.2** — Add drafts (the draft/publish workflow)

---

| Nav | |
|---|---|
| ← Previous | [Step 09.3 — generate types + render blocks](09-3-generate-types-blocks.md) |
| → Next | [Step 10.2 — drafts on Pages](10-2-drafts-pages.md) |
