# Step 02.6 — Admin polish for Categories and Tags

Add `useAsTitle`, `group`, `defaultColumns`, and `description` to both
taxonomy collections. Same pattern as 01.9 — pure repetition.

---

## 1. The story

Right now Categories and Tags show IDs in list views, aren't grouped in
the sidebar, and have no description. We polished Posts in 01.9. Now we
do the same for the two new collections.

The admin should feel organized. An editor looking at the sidebar should
see a clear "Content" group with Posts, Categories, and Tags — not a
flat list of random collection names.

---

## 2. What you'll learn — Payload

> **Official docs:** [Collections — Admin Options](https://payloadcms.com/docs/configuration/collections#admin-options)

Same four options as 01.9:

- `useAsTitle: 'title'` — display the title instead of the ID
- `defaultColumns: [...]` — which columns show in the list
- `group: 'Content'` — same group as Posts → they appear together
- `description: '...'` — explains the collection's purpose

Plus `timestamps: true` on both collections.

All of this is repetition from 01.9. You've seen every option before.

---

## 3. What you'll learn — TypeScript

> **TS Lessons:** [04.1 — Arrays](../ts-lessons/04-1-arrays.md), [03.1 — Literal types](../ts-lessons/03-1-literal-types.md)
>
> No new TS lesson. This is repetition of 01.9.

Same concepts as 01.9: typed arrays for `defaultColumns`, booleans for
`timestamps`. One limit to notice: `group: 'Content'` is typed as
`string`, not a union of known groups. Typo `'Conent'`? No squiggle —
TypeScript doesn't validate group consistency across collections. You'll
see this in break-it experiment 5.5.

---

## 4. Builds on

- **Step 01.9** — Posts admin polish (same options, same pattern)
- **Step 02.1 & 02.2** — Categories collection
- **Step 02.4** — Tags collection

---

## 5. Steps

### 5.1 — Polish Categories

Open `src/collections/Categories.ts`. Add the admin block and timestamps:

```ts
import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: 'Content',
    description: 'Topic categories for organizing posts. The SEO plugin will analyze content gaps per category.',
  },
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
  timestamps: true,
}
```

Save.

### 5.2 — Polish Tags

Open `src/collections/Tags.ts`. Same treatment:

```ts
import type { CollectionConfig } from 'payload'

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: 'Content',
    description: 'Granular keyword tags. Posts can have many tags — used for topic analysis in the SEO plugin.',
  },
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
  timestamps: true,
}
```

Save.

### 5.3 — Restart and verify the sidebar

Restart `pnpm dev`. Open `/admin`.

The sidebar should now show a **Content** group with three collections:
- Posts
- Categories
- Tags

All three under the same heading. Users and Media are separate (no group
or a different group).

### 5.4 — Verify list views

Click **Categories**. The list should show columns: title, slug,
updatedAt. Each row is labeled with its title (not its ID).

Click **Tags**. Same layout.

### 5.5 — Break it: typo the group name

On Tags, change `group: 'Content'` to `group: 'Conent'`:

```ts
group: 'Conent', // ← typo
```

Save, restart. The sidebar now has TWO groups: "Content" (Posts +
Categories) and "Conent" (Tags alone). No red squiggle — TypeScript
doesn't validate group name consistency across collections.

Fix it back to `'Content'`. That's the string-equality lesson.

### 5.6 — Typing drill: write Categories from memory

Close `Categories.ts`. Open a blank file. Type the entire collection
from memory — slug, admin block (useAsTitle, defaultColumns, group,
description), all three fields, timestamps. No peeking.

Compare with the original. What did you forget? That gap is what
needs more reps.

Do the same for Tags if you want extra practice — it's nearly identical.

---

## 6. Verify

- [ ] Categories has `admin: { useAsTitle, defaultColumns, group: 'Content', description }` and `timestamps: true`
- [ ] Tags has the same admin structure and `timestamps: true`
- [ ] Sidebar shows Posts, Categories, and Tags under one "Content" group
- [ ] List views use title (not ID) and show the right columns
- [ ] You saw the typo group create a separate sidebar section (5.5)

Commit:

```bash
git add .
git commit -m "step 02.6 — admin polish for Categories and Tags (group, useAsTitle, timestamps)"
```

---

## 7. Unlocks

- **Step 02.7** — generate types. See the relationship fields appear on
  the `Post` interface — `category` as a single value, `tags` as an
  array. Read the generated types and understand the union shapes.
