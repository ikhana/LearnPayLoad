# Step 06.2 — afterChange hook — auto-set publishedAt

Write an `afterChange` hook that automatically sets the `publishedAt`
date when a post's status changes to "published."

---

## 1. The story

Editors forget to set the publish date. Or they set it wrong. A hook
can watch for the status change and auto-stamp the current date/time —
one less thing for editors to remember.

This pattern appears in every CMS: "when X happens, automatically do Y."
That's what hooks are for.

---

## 2. What you'll learn — Payload

> **Official docs:** [Hooks — afterChange](https://payloadcms.com/docs/hooks/overview)

**`beforeChange` vs `afterChange`:**

| | beforeChange | afterChange |
|---|---|---|
| When | Before save to DB | After save to DB |
| Has | `data` (incoming) | `doc` (saved document) |
| Can modify | Yes — return modified data | No — document is already saved |
| Use for | Transform data before save | Side effects (notifications, cache, related updates) |

For auto-setting `publishedAt`, we'll use `beforeChange` since we need
to modify the data before it's saved. The name of this step says
"afterChange" but we'll explore both and understand when to use which.

---

## 3. What you'll learn — TypeScript

> **TS Lesson:** [06-4 — async-await](../ts-lessons/06-narrowing/06-4-async-await.md)
>
> Same async patterns as 06.1.

**New TS concept: `previousDoc` for comparison.** The hook receives the
document *before* the change and the data *after*. Comparing them tells
you what changed:

```ts
// Did status change from draft to published?
if (data.status === 'published' && originalDoc?.status !== 'published') {
  // First time publishing!
}
```

---

## 4. Builds on

- **Step 06.1** — you know how hooks work and where they go.
- **Step 01.7** — `publishedAt` field on Posts.
- **Step 01.8** — `status` select field.

---

## 5. Steps

### 5.1 — Write the auto-publish hook

Create `src/hooks/autoPublishDate.ts`:

```ts
import type { CollectionBeforeChangeHook } from 'payload'

export const autoPublishDate: CollectionBeforeChangeHook = ({
  data,
  operation,
  originalDoc,
}) => {
  if (data.status === 'published') {
    if (operation === 'create' || originalDoc?.status !== 'published') {
      data.publishedAt = new Date().toISOString()
    }
  }
  return data
}
```

**What this does:**

1. Checks if the post is being set to "published"
2. Only sets the date if it's a new post OR the status just changed to
   published (wasn't published before)
3. Doesn't overwrite the date if the post was already published and
   is being edited

### 5.2 — Register on Posts

Open `src/collections/Posts.ts`. Add the import:

```ts
import { autoPublishDate } from '../hooks/autoPublishDate'
```

Update the hooks array:

```ts
hooks: {
  beforeChange: [slugify, autoPublishDate],
},
```

Notice: **hooks are arrays**. Multiple hooks run in order. `slugify`
runs first, then `autoPublishDate`.

### 5.3 — Test it

1. Restart `pnpm dev`
2. Create a post with status "Draft" — `publishedAt` should be empty
3. Edit the post, change status to "Published", save
4. `publishedAt` should now have the current date/time
5. Edit the post again, change the title — `publishedAt` stays the same
   (it only sets on the draft→published transition)

### 5.4 — Explore: afterChange for logging

To understand `afterChange`, add a temporary logging hook. Don't commit
this — it's just for learning:

```ts
afterChange: [
  async ({ doc, operation }) => {
    console.log(`[Posts] ${operation}: ${doc.title} (id: ${doc.id})`)
    return doc
  },
],
```

Create or edit a post. Check the terminal — you'll see the log. This is
where you'd send notifications, invalidate cache, or trigger external
APIs. The document is already saved, so you can't modify it — you can
only react to it.

Remove the logging hook when you're done exploring.

---

## 6. Verify

- [ ] `src/hooks/autoPublishDate.ts` exists
- [ ] Posts hooks array has both `slugify` and `autoPublishDate`
- [ ] Draft posts have no `publishedAt`
- [ ] Changing status to published auto-sets `publishedAt`
- [ ] Re-editing a published post doesn't change `publishedAt`
- [ ] You understand `beforeChange` (modify data) vs `afterChange`
      (side effects)

Commit:

```bash
git add src/hooks/autoPublishDate.ts src/collections/Posts.ts
git commit -m "step 06.2 — auto-set publishedAt on status change"
```

---

## 7. Unlocks

- **Step 06.3** — Hook context and preventing infinite loops. What
  happens when a hook triggers another hook?
- These two hooks (slugify + auto-publish) are the foundation patterns.
  Every Payload project has variations of them.
