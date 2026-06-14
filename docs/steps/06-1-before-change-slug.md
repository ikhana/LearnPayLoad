# Step 06.1 — beforeChange hook — auto-generate slugs

Write your first hook: automatically generate a URL slug from the post
title every time a post is created.

---

## 1. The story

Right now editors type the slug manually. That's error-prone — typos,
inconsistent formatting, forgetting to fill it in. A `beforeChange`
hook can auto-generate the slug from the title on create, so editors
never think about it.

This is the most common hook in any Payload project. Every CMS you've
worked on has it.

---

## 2. What you'll learn — Payload

> **Official docs:** [Hooks — beforeChange](https://payloadcms.com/docs/hooks/overview)
> **Skill reference:** `.claude/skills/payload/reference/HOOKS.md`

**Hook basics:**

| Hook | When it runs | Common use |
|---|---|---|
| `beforeValidate` | Before field validation | Data formatting |
| `beforeChange` | After validation, before save | Business logic, computed values |
| `afterChange` | After save | Side effects (notifications, cache) |
| `afterRead` | When document is read | Computed fields, data transformation |
| `beforeDelete` | Before deletion | Cleanup related data |

**Key concepts:**

- Hooks are **arrays** — you can have multiple hooks per event
- Each hook is an **async function** that receives args and returns data
- `beforeChange` receives `{ data, req, operation, originalDoc }`:
  - `data` — the incoming data (what the user submitted)
  - `req` — the Payload request (includes `user`, `payload` instance)
  - `operation` — `'create'` or `'update'`
  - `originalDoc` — the existing document (only on update)
- You **must return `data`** from `beforeChange` — it's the modified
  data that gets saved

---

## 3. What you'll learn — TypeScript

> **TS Lesson:** [06-4 — async-await](../ts-lessons/06-narrowing/06-4-async-await.md)
>
> Hooks are async functions. Read the lesson to understand
> `async`/`await` and `Promise<T>`.

The hook function type is:

```ts
type CollectionBeforeChangeHook = (args: {
  data: Record<string, unknown>
  req: PayloadRequest
  operation: 'create' | 'update'
  originalDoc?: Document
}) => Promise<Record<string, unknown>> | Record<string, unknown>
```

Notice `operation: 'create' | 'update'` — that's a union of literals.
You check it to know whether the document is new or being updated.

---

## 4. Builds on

- **Step 01.3** — `slug` field on Posts.
- **Step 05** — access control. Hooks run *after* access is checked.

---

## 5. Steps

### 5.1 — Create the hooks directory

Create `src/hooks/` — this is where all hooks live.

### 5.2 — Write the slugify hook

Create `src/hooks/slugify.ts`:

```ts
import type { CollectionBeforeChangeHook } from 'payload'

export const slugify: CollectionBeforeChangeHook = ({ data, operation }) => {
  if (operation === 'create' && data.title) {
    data.slug = (data.title as string)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }
  return data
}
```

**What this does:**

1. Only runs on `create` — doesn't overwrite existing slugs on update
2. Takes the title, lowercases it, replaces non-alphanumeric chars with
   hyphens, trims leading/trailing hyphens
3. Returns the modified `data` — **you must return data**

### 5.3 — Register the hook on Posts

Open `src/collections/Posts.ts`. Add the import and hook:

```ts
import { slugify } from '../hooks/slugify'
```

Add `hooks` to the collection config (after `access`, before `fields`):

```ts
hooks: {
  beforeChange: [slugify],
},
```

### 5.4 — Restart and test

1. Restart `pnpm dev`
2. Create a new post with title "My First Blog Post"
3. Leave the slug field **empty**
4. Save — check the slug field. It should be `my-first-blog-post`

### 5.5 — Test: update doesn't overwrite

1. Edit that post, change the title to "My Updated Post"
2. Save — the slug should **stay** `my-first-blog-post`
3. That's because the hook only runs on `operation === 'create'`

### 5.6 — Break it: forget to return data

In `slugify.ts`, comment out `return data`:

```ts
// return data
```

Save and create a new post. The post saves but **all data is lost** —
the document is empty. That's because `beforeChange` expects you to
return the data. If you return nothing (`undefined`), Payload saves
nothing.

Uncomment `return data`. This is the most common hook bug.

---

## 6. Verify

- [ ] `src/hooks/slugify.ts` exists with `CollectionBeforeChangeHook` type
- [ ] Posts config has `hooks: { beforeChange: [slugify] }`
- [ ] Creating a post auto-generates the slug from the title
- [ ] Updating a post doesn't overwrite the existing slug
- [ ] You saw what happens when you forget `return data` (5.6)
- [ ] You understand `operation === 'create'` as union narrowing

Commit:

```bash
git add src/hooks/slugify.ts src/collections/Posts.ts
git commit -m "step 06.1 — beforeChange hook for auto-slug generation"
```

---

## 7. Unlocks

- **Step 06.2** — `afterChange` hook for side effects.
- **Step 06.3** — hook context and preventing infinite loops.
- The slugify hook is reusable — you can add it to Categories, Tags,
  or any collection with a slug field.
