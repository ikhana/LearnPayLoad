# Step 10.1 — Versions and drafts

Enable version history and draft/publish workflow on Pages and Posts.

---

## 1. The story

You've been using a manual `status` select field on Posts — `draft` or
`published`. It works, but it has no history. If an editor accidentally
publishes a half-written page, there's no way to revert. And there's no
"save my work without going live" workflow.

Payload's built-in versioning solves both: every save creates a version
you can restore, and drafts let editors save work without publishing.

---

## 2. What you'll learn — Payload

> **Official docs:** [Versions](https://payloadcms.com/docs/versions/overview)
> **Skill reference:** `.claude/skills/payload/reference/COLLECTIONS.md` → Versioning & Drafts

**Core concepts:**

| Concept | What it means |
|---|---|
| `versions: true` | Saves a snapshot on every save, restoreable |
| `versions: { drafts: true }` | Adds draft/publish workflow + version history |
| `_status` | Auto-injected field — `'draft'` or `'published'` |
| `autosave` | Saves drafts automatically on an interval |
| `maxPerDoc` | Limits how many versions to keep per document |

**What `drafts: true` gives you in the admin:**

- "Save Draft" button — saves without publishing
- "Publish" button — makes the document live
- Version history panel — see all previous versions
- Restore button — revert to any previous version

**Important:** When drafts are enabled, the REST API only returns
published documents by default. To include drafts, pass `?draft=true`.
The Local API works the same: `draft: true` in the options.

---

## 3. What you'll learn — TypeScript

> **TS lesson:** [05 — Utility types](../ts-lessons/05-utility-types/05-1-partial-pick-omit.md)

- `_status` is auto-injected — you'll see it in generated types
- `Partial<T>` — drafts can have incomplete data
- `Pick<T, K>` and `Omit<T, K>` — selecting/excluding fields

---

## 4. Builds on

- [Step 09.1 — Pages collection](09-1-first-block.md) — the collection we're adding versions to
- [Step 01.8 — status field](01-8-status.md) — the manual status field we'll replace

---

## 5. Steps

### 5a. Add versions to Pages

Open `src/collections/Pages.ts` and add `versions` and `_status` to
the default columns:

```ts
export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    group: 'Content',
  },
  versions: {
    drafts: true,
    maxPerDoc: 25,
  },
  // ... fields stay the same
}
```

That's it. Three lines added:
- `versions: { drafts: true, maxPerDoc: 25 }` — enable drafts, keep up to 25 versions
- `'_status'` in `defaultColumns` — show draft/published in the list view

### 5b. Add versions to Posts

Posts already has a manual `status` select field. When you enable
`drafts: true`, Payload injects its own `_status` field that does the
same thing — but with proper version history and draft/publish buttons.

Open `src/collections/Posts.ts`:

**1. Add the `versions` config:**

```ts
export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', '_status', 'publishedAt', 'updatedAt'],
    group: 'Content',
    description:
      'Blog posts and articles — the canonical content type our AI SEO plugin will analyze.',
  },
  versions: {
    drafts: true,
    maxPerDoc: 25,
  },
  // ... rest stays the same
}
```

**2. Remove the manual `status` field** from the `fields` array — the
whole block from `name: 'status'` through its closing brace. Payload's
`_status` replaces it.

**3. Update the access control.** Your `isAuthenticatedOrPublished`
access function currently checks `status: { equals: 'published' }`.
Update it to check `_status` instead:

Open `src/access/isAuthenticatedOrPublished.ts`:

```ts
import type { Access } from 'payload'

export const isAuthenticatedOrPublished: Access = ({ req }) => {
  if (req.user) return true

  return {
    _status: { equals: 'published' },
  }
}
```

**4. Update the `autoPublishedDate` hook** if it references the old
`status` field — it should check `_status` instead, or better yet,
check the `operation` and let the draft/publish system handle status:

```ts
// In the hook, change:
if (data.status === 'published')
// to:
if (data._status === 'published')
```

**What's happening:**

| Before (manual) | After (built-in) |
|---|---|
| `status` select field you created | `_status` field Payload injects |
| Just a field — no history | Full version history with restore |
| "Save" button only | "Save Draft" + "Publish" buttons |
| Manual status change | Proper workflow with state management |

### 5c. Understand the version options

SGT uses different version configs for different collections:

```ts
// Pages — autosave on, keep 50 versions
versions: {
  drafts: { autosave: true },
  maxPerDoc: 50,
}

// Products — no autosave, keep only 1 version
versions: {
  drafts: { autosave: false },
  maxPerDoc: 1,
}

// Blog Posts — autosave every 30 seconds, validate before saving
versions: {
  drafts: {
    autosave: { interval: 30000 },
    validate: true,
  },
  maxPerDoc: 50,
}
```

| Option | What it does | When to use |
|---|---|---|
| `drafts: true` | Simple on/off | Most collections |
| `drafts: { autosave: true }` | Auto-saves drafts as you type | Long-form content (pages, blog posts) |
| `drafts: { autosave: { interval: 30000 } }` | Custom autosave interval (ms) | Control save frequency |
| `drafts: { validate: true }` | Validates fields on draft save too | When drafts must be valid |
| `maxPerDoc: 25` | Keep max 25 versions per document | Prevent database bloat |

For our learning project, `drafts: true` with `maxPerDoc: 25` is enough.

### 5d. Update the frontend query

Your `[slug]/page.tsx` needs to know about drafts. Right now it uses
`overrideAccess: true` which returns everything including drafts. For
a proper setup, you'd only show published pages on the frontend:

```tsx
const result = await payload.find({
  collection: 'pages',
  where: {
    slug: { equals: slug },
    _status: { equals: 'published' },
  },
  limit: 1,
})
```

Or if you want draft preview support (like SGT does with Next.js
draft mode):

```tsx
import { draftMode } from 'next/headers'

// Inside the page component:
const { isEnabled: isDraftMode } = await draftMode()

const result = await payload.find({
  collection: 'pages',
  where: { slug: { equals: slug } },
  draft: isDraftMode,
  limit: 1,
})
```

For now, keep `overrideAccess: true` so you can see everything while
developing.

### 5e. Generate types

```bash
pnpm generate:types
```

Open `src/payload-types.ts` — the `Page` and `Post` interfaces now
have `_status?: ('draft' | 'published') | null`. The `Post` interface
no longer has the manual `status` field.

---

## 6. Verify

- [ ] Dev server starts without errors
- [ ] Pages collection — edit a page → you see "Save Draft" and "Publish" buttons
- [ ] Pages list view — `_status` column shows draft/published
- [ ] Save a draft → it's not visible via the REST API (`/api/pages`) unless you add `?draft=true`
- [ ] Publish the page → it appears in the REST API
- [ ] Version history tab — shows previous versions with timestamps
- [ ] Restore a previous version → content reverts
- [ ] Posts collection — same draft/publish workflow works
- [ ] Posts list view — `_status` column replaces the old `status` column
- [ ] `payload-types.ts` — `_status` field present, old `status` field gone from Post

---

## 7. Commit

```bash
git add src/collections/Pages.ts src/collections/Posts.ts src/access/isAuthenticatedOrPublished.ts src/payload-types.ts
git commit -m "step 10.1 — versions and drafts on Pages and Posts"
```

---

## 8. Unlocks

- **Step 11** — Localization (i18n)
- You now have a proper editorial workflow. Content goes through
  draft → published with full version history.
- **Interview connection:** "How do you handle content workflows?" →
  Payload's built-in versioning with `_status`, autosave, and
  `maxPerDoc` to control storage. SGT uses different version configs
  per collection — aggressive autosave for pages, minimal versions
  for products.

---

| Nav | |
|---|---|
| ← Previous | [Step 09.3 — generate types + render blocks](09-3-generate-types-blocks.md) |
| → Next | [Step 11 — localization](11-1-localization.md) |
