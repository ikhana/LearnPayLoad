# Step 10.3 — Drafts on Posts (replace manual status)

Add drafts to Posts and remove the manual `status` field. This is the
real-world migration: moving from a hand-rolled draft system to
Payload's built-in one.

---

## 1. The story

Back in Step 01.8, you added a `status` select field to Posts —
`draft` or `published`. It worked, but it was just a field. No version
history, no "Save Draft" button, no API filtering, no autosave. Now
that you know Payload's versioning system, you can replace your
hand-rolled solution with the real thing.

This is a common migration pattern — you'll hit it in production
projects. The tricky part isn't enabling drafts, it's cleaning up
everything that depended on the old `status` field.

---

## 2. What you'll learn — Payload

> **Official docs:** [Drafts](https://payloadcms.com/docs/versions/drafts)

**What you're replacing:**

| Before (manual) | After (built-in) |
|---|---|
| `status` select field you defined | `_status` field Payload injects |
| Just a data field — no UI workflow | "Save Draft" / "Publish" buttons |
| No version history | Full version timeline with restore |
| Access control checks `status` | Access control checks `_status` |
| `autoPublishedDate` checks `data.status` | Hook checks `data._status` |
| `StatusCell` custom component | Payload's built-in status indicator |
| Manual filtering in queries | Automatic API filtering |

**Autosave:**

Posts already has autosave configured:

```ts
versions: {
  drafts: {
    autosave: { interval: 10000 },
  },
  maxPerDoc: 50,
},
```

Autosave means Payload automatically saves a draft version every 10
seconds while the editor is working. The editor sees "Auto-saved"
in the admin bar. This prevents losing work if the browser crashes or
the editor navigates away.

| Autosave option | What it means |
|---|---|
| `autosave: true` | Auto-save with Payload's default interval |
| `autosave: { interval: 10000 }` | Auto-save every 10 seconds |
| `autosave: false` | No auto-save (editor must click Save manually) |

When to use autosave vs not:
- **Pages / Blog posts** → yes, autosave — long-form editing
- **Products** → maybe not — product changes (especially pricing) should be intentional
- **Settings** → no — changes are quick and deliberate

---

## 3. What you'll learn — TypeScript

- Removing a field and its types from the codebase
- Updating hook types when the data shape changes
- Finding all references to a removed field

---

## 4. Builds on

- [Step 10.2 — Drafts on Pages](10-2-drafts-pages.md)
- [Step 01.8 — status field](01-8-status.md) — the field we're removing
- [Step 06.2 — autoPublishedDate hook](06-2-after-change-hook.md) — needs updating
- [Step 07.3 — StatusCell component](07-3-custom-cell-component.md) — no longer needed

---

## 5. Steps

### 5a. Remove the manual `status` field from Posts

Open `src/collections/Posts.ts` and **delete** the entire `status`
field block (lines 98-119 in your current file):

```ts
// DELETE this entire block:
{
  name: 'status',
  type: 'select',
  options: [
    {
      label: 'Draft',
      value: 'draft',
    },
    {
      label: 'Published',
      value: 'published',
    },
  ],
  defaultValue: 'draft',
  required: true,
  admin: {
    position: 'sidebar',
    components: {
      Cell: '/components/StatusCell#StatusCell',
    },
  },
},
```

Payload's `_status` field replaces everything this field did — and
does it better.

### 5b. Update `defaultColumns`

In the same file, change `defaultColumns` to use `_status`:

```ts
admin: {
  useAsTitle: 'title',
  defaultColumns: ['title', '_status', 'publishedAt', 'updatedAt'],
  group: 'Content',
  description:
    'Blog posts and articles — the canonical content type our AI SEO plugin will analyze.',
},
```

`'status'` → `'_status'`. Payload renders its own status column
automatically — you don't need the `StatusCell` custom component.

### 5c. Update the `autoPublishedDate` hook

Open `src/hooks/autoPublishDate.ts` — it currently checks
`data.status`. Change it to `data._status`:

```ts
import { CollectionBeforeChangeHook } from 'payload'

export const autoPublishedDate: CollectionBeforeChangeHook = ({
  data,
  operation,
  originalDoc,
}) => {
  if (data._status === 'published') {
    if (operation === 'create' || originalDoc?._status !== 'published') {
      data.publishedAt = new Date().toISOString()
    }
  }

  return data
}
```

**What changed:**
- `data.status` → `data._status`
- `originalDoc.status` → `originalDoc?._status` (added optional chaining)

**Why this still works:** The `_status` field behaves exactly like your
old `status` field — it's `'draft'` or `'published'`. The hook logic
is the same: "when a post transitions to published, set the published
date."

### 5d. Verify the access control

Open `src/access/isAuthenticatedOrPublished.ts` — this was already
updated in a previous commit:

```ts
export const isAuthenticatedOrPublished: Access = ({ req: { user } }) => {
  if (user) return true
  return { _status: { equals: 'published' } }
}
```

If it still says `status` instead of `_status`, update it now.

### 5e. Clean up the StatusCell component (optional)

The `StatusCell` component at `src/components/StatusCell.tsx` was built
for the manual `status` field. With `_status`, Payload renders its own
status indicator. You can keep the file for reference (it's a good
learning artifact from Step 07.3), but it's no longer used.

If you want to clean up, remove the `StatusCell` import and Cell
component reference — but since we already deleted the `status` field
that used it, there's no reference to it anymore.

### 5f. Generate types

```bash
pnpm generate:types
```

Open `payload-types.ts` and check the `Post` interface:

- `status` field should be **gone** (your manual select)
- `_status?: ('draft' | 'published') | null` should be **present** (Payload's injected field)

### 5g. Handle existing data

Your existing posts have `status: 'draft'` or `status: 'published'`
but NOT `_status`. After this change:

- The old `status` field data stays in the database but is ignored
- The new `_status` field is `null` for existing posts
- Existing posts won't appear in public API queries until published

Open each post in the admin and click "Publish" to set `_status`. For
a production migration with thousands of posts, you'd write a script:

```ts
const posts = await payload.find({
  collection: 'posts',
  limit: 0,
  draft: true,
})

for (const post of posts.docs) {
  await payload.update({
    collection: 'posts',
    id: post.id,
    data: { _status: 'published' },
    draft: true,
  })
}
```

---

## 6. Verify

- [ ] Dev server starts without errors
- [ ] Posts list view — `_status` column instead of old `status`
- [ ] Edit a post → "Save Draft" / "Publish" buttons (no manual status dropdown)
- [ ] The old `status` select field is gone from the edit view
- [ ] Save a post as draft → it doesn't appear on the public API
- [ ] Publish it → it appears
- [ ] Autosave works — edit a post, wait 10 seconds, see "Auto-saved" indicator
- [ ] `autoPublishedDate` still works — publish a post, `publishedAt` gets set
- [ ] Version history — click "Versions" tab, see the timeline
- [ ] `payload-types.ts` — `Post` has `_status`, no longer has `status`

---

## 7. Commit

```bash
git add src/collections/Posts.ts src/hooks/autoPublishDate.ts src/payload-types.ts
git commit -m "step 10.3 — replace manual status with _status drafts on Posts"
```

---

## 8. Unlocks

- **Step 10.4** — Draft preview with Next.js (optional, advanced)
- **Step 11** — Localization
- You now have a proper editorial workflow on both Pages and Posts.

---

## Step 10 Summary

| Sub-step | What we built |
|---|---|
| 10.1 | Version history on Pages (snapshots, restore) |
| 10.2 | Drafts on Pages (`_status`, Save Draft / Publish) |
| 10.3 | Drafts on Posts (replaced manual `status`, updated hooks) |

**The key takeaway:** Versions and drafts are separate concerns.
Versions = history. Drafts = workflow. You get both with one config,
but understanding them separately matters.

---

| Nav | |
|---|---|
| ← Previous | [Step 10.2 — drafts on Pages](10-2-drafts-pages.md) |
| → Next | [Step 11.1 — localization](11-1-localization.md) |
