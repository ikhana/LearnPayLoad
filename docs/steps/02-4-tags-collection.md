# Step 02.4 — Tags collection (skeleton + fields)

Create the Tags collection in one shot — skeleton and fields together.
You've done this twice now (Posts, Categories). This time, do it faster.

---

## 1. The story

Categories are broad buckets: "JavaScript," "DevOps," "Career." Tags
are narrow labels: "react-hooks," "docker-compose," "salary-negotiation."
A post has **one** category but **many** tags.

For the SEO plugin, tags become keyword signals. A post tagged
"react-hooks" and "useEffect" tells the plugin what specific topics the
content covers — much more granular than the category alone.

This sub-step creates the Tags collection. The next sub-step (02.5)
connects it to Posts with `hasMany: true`.

---

## 2. What you'll learn — Payload

> **Official docs:** [Collections](https://payloadcms.com/docs/configuration/collections)

Nothing new. You're repeating the collection creation pattern for the
third time:

1. Create the file in `src/collections/`
2. Define slug + fields
3. Import and register in `payload.config.ts`
4. Restart dev server

Tags has the same three fields as Categories: title, slug, description.
The difference comes in how Posts *relates* to Tags (02.5), not in
Tags itself.

---

## 3. What you'll learn — TypeScript

> **TS Lessons:** No new lesson. Review [01.2](../ts-lessons/01-2-type-annotations.md) and [04.2](../ts-lessons/04-2-import-type.md) if needed.

No new TS concept. This is a **speed round**. You're writing a
collection skeleton for the third time. If you can type
`import type { CollectionConfig } from 'payload'` and the full skeleton
without pausing, the pattern is internalized.

Preview for 02.5: the `tags` relationship with `hasMany: true` will
generate `(number | Tag)[]` — an array. The `[]` is the `Array<T>`
generic from 02.2 in shorthand.

---

## 4. Builds on

- **Step 02.1** — same creation pattern (Categories skeleton)
- **Step 02.2** — same fields pattern (title, slug, description)
- **Step 01.1** — original pattern (Posts skeleton)

---

## 5. Steps

### 5.1 — Create Tags collection

Create `src/collections/Tags.ts`:

```ts
import type { CollectionConfig } from 'payload'

export const Tags: CollectionConfig = {
  slug: 'tags',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
  ],
}
```

### 5.2 — Register in payload.config.ts

Open `src/payload.config.ts`:

```ts
import { Tags } from './collections/Tags'
```

Add to the collections array:

```ts
collections: [Users, Media, Posts, Categories, Tags],
```

Save both files.

### 5.3 — Restart and verify

Restart `pnpm dev`. Open `/admin`. Tags should appear in the sidebar.
Click it. Empty list. Click **Create New** — three fields: Title, Slug,
Description.

Create a few test tags:
- `react-hooks` / `react-hooks`
- `typescript` / `typescript`
- `payload-cms` / `payload-cms`

### 5.4 — Time yourself (optional)

How long did 5.1–5.3 take? If it was under 5 minutes, the pattern is
sticking. Step 01.1 probably took 15–20 minutes because everything was
new. The speed increase is the learning.

---

## 6. Verify

- [ ] `src/collections/Tags.ts` exists with slug `'tags'` and three fields
- [ ] `payload.config.ts` imports and registers `Tags`
- [ ] `/admin` shows Tags in the sidebar
- [ ] You created at least one test tag
- [ ] You noticed this was faster than creating Categories (which was faster than creating Posts)

Commit:

```bash
git add .
git commit -m "step 02.4 — Tags collection (title, slug, description)"
```

---

## 7. Unlocks

- **Step 02.5** — add a `tags` relationship field to Posts with
  `hasMany: true`. This is where the many-to-many pattern lives — a post
  can have multiple tags, and a tag can appear on multiple posts.
