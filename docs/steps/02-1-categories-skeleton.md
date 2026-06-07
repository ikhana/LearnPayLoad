# Step 02.1 — Categories collection skeleton

Create a new collection file, define the minimum config, register it in
`payload.config.ts`. Same pattern as 01.1 — but faster this time because
you've done it before.

---

## 1. The story

Every blog needs categories. "JavaScript," "DevOps," "Career" — they
give readers a way to browse by topic and give the SEO plugin a taxonomy
to analyze later (topic clusters, content gaps per category).

Before we can *relate* Posts to Categories, the Categories collection has
to exist. This sub-step creates the skeleton — slug, one placeholder
field, registered in config. No relationship yet.

---

## 2. What you'll learn — Payload

> **Official docs:** [Collections](https://payloadcms.com/docs/configuration/collections)
> **Skill reference:** `.claude/skills/payload/reference/COLLECTIONS.md`

Nothing new. You already know:

- A collection lives in its own file under `src/collections/`
- It needs a `slug` (URL-safe, lowercase, plural by convention)
- It needs at least one field
- It must be imported and added to the `collections` array in `payload.config.ts`

This is deliberate repetition. The second time you do something, it
sticks differently than the first.

---

## 3. What you'll learn — TypeScript

> **TS Lessons:** [01.2 — Type annotations](../ts-lessons/01-2-type-annotations.md), [04.2 — `import type`](../ts-lessons/04-2-import-type.md)
>
> You've read these before. This step is pure repetition.

One concept: **muscle memory through repetition**. You're writing
`import type { CollectionConfig } from 'payload'` for the second time.
It should feel more automatic than the first time. If it does, the
drilling is working. If not, re-read TS lessons 01 and 06.

Next step (02.2) introduces **generics** — types with a parameter like
`Array<string>`. If `: CollectionConfig` feels natural now, then
`: Array<string>` will make sense immediately — same idea, one extra
piece.

---

## 4. Builds on

- **Step 01.1** — you did this exact thing for Posts. Same file structure,
  same registration pattern.
- **Step 00** — the project scaffold created `Users.ts` and `Media.ts`
  using this same pattern.

---

## 5. Steps

### 5.1 — Create the file

Create `src/collections/Categories.ts`:

```ts
import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
  ],
}
```

One field for now — `title`. We'll add more in 02.2.

### 5.2 — Register in payload.config.ts

Open `src/payload.config.ts`. Add the import and register:

```ts
import { Categories } from './collections/Categories'
```

Add `Categories` to the collections array:

```ts
collections: [Users, Media, Posts, Categories],
```

Save both files.

### 5.3 — Restart dev server and verify

Stop and restart `pnpm dev` (new collection = SQLite schema change).

Open `/admin`. You should see **Categories** in the sidebar. Click it.
You'll see an empty list view. Click **Create New** — there's one field:
Title.

### 5.4 — Break it: forget the import

Comment out the import line in `payload.config.ts`:

```ts
// import { Categories } from './collections/Categories'
```

**Red squiggle on `Categories`** in the collections array. TypeScript
knows — you're referencing something that doesn't exist in this file's
scope.

Uncomment the import. Squiggle gone.

### 5.5 — Break it: wrong slug type

In `Categories.ts`, try:

```ts
slug: 123, // ← number instead of string
```

**Red squiggle.** `slug` must be a `string`. Fix it back to `'categories'`.

---

## 6. Verify

- [ ] `src/collections/Categories.ts` exists with `slug: 'categories'` and one `title` field
- [ ] `payload.config.ts` imports and registers `Categories`
- [ ] `/admin` shows Categories in the sidebar
- [ ] You can create a category with just a title
- [ ] You saw the red squiggle when the import was missing (5.4)
- [ ] You saw the red squiggle on `slug: 123` (5.5)

Commit:

```bash
git add .
git commit -m "step 02.1 — Categories collection skeleton"
```

---

## 7. Unlocks

- **Step 02.2** — add real fields to Categories (slug, description). The
  TS lesson introduces **generic types** — types that take a parameter.
- Categories now exists as a collection. Once it has fields, Posts can
  reference it via a relationship field (step 02.3).
