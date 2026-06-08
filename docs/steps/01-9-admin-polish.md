# Step 01.9 — Admin polish

Set the title shown in list views, pick which columns appear, group the
collection in the sidebar, add a description, and turn on automatic
timestamps. Five small collection-level config tweaks.

---

## 1. The story

We have seven fields. The collection works. But the list view labels every
post with its ID instead of its title. The list shows columns we don't
care about by default. The sidebar groups everything together with no
separation.

This sub-step is polish — five small collection-level config tweaks that
take Posts from "functional" to "feels right." Editors will be happier;
you'll see the difference immediately.

We also turn on `timestamps: true` — Payload's automatic `createdAt` and
`updatedAt` fields. Should be on for nearly every content collection.

---

## 2. What you'll learn — Payload

> **Official docs:** [Collections — Admin Options](https://payloadcms.com/docs/configuration/collections#admin-options)
> **Skill reference:** `.claude/skills/payload/reference/COLLECTIONS.md`

Five collection-level options, inside one `admin: {}` block at the top of the collection (not inside any field):

- **`useAsTitle: 'title'`.** Tells Payload which field to use as each record's display name. Used in list views, breadcrumbs, document pickers. Currently the list shows IDs because this is unset.
- **`defaultColumns: ['title', 'status', 'publishedAt', 'updatedAt']`.** Which columns show in the list view by default. Editors can toggle others on, but these are the starting four.
- **`group: 'Content'`.** Groups the collection under a heading in the admin sidebar. Multiple collections can share a group.
- **`description: '...'`.** Short description shown above the collection's list view.
- **`timestamps: true`** — *not* inside `admin`. A top-level collection option. Adds `createdAt` and `updatedAt` columns automatically.

---

## 3. What you'll learn — TypeScript

> **TS Lesson:** [04.1 — Arrays](../ts-lessons/04-lists-and-imports/04-1-arrays.md)

One concept: **typed arrays**. `defaultColumns` is `string[]` — every
item must be a string. Try `['title', 42, true]` and TS rejects it.

But `string[]` doesn't validate against your actual field names. Typo
`'tilte'`? No squiggle — TS only knows it's a string, not whether
that string matches a field. The admin just won't show that column.
This is a real limit of the type system here.

`timestamps: true` is the same `boolean` from 01.3. Try
`timestamps: 'true'` (string) to confirm it still squiggles.

---

## 4. Builds on

- **Step 01.8** — Posts has 7 fields. Field-level config is done.
- **All earlier sub-steps** — you've been adding *field-level* `admin` configs. This step adds the *collection-level* `admin` config, a different shape with different keys (`useAsTitle`, `defaultColumns`, `group`, `description`) than field-level admin (`position`, `description`, `condition`, etc.).

---

## 5. Steps

### 5.1 — Add the collection-level `admin` block

Open `src/collections/Posts.ts`. Above the `fields:` line, add an `admin` block:

```ts
export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'publishedAt', 'updatedAt'],
    group: 'Content',
    description:
      'Blog posts and articles — the canonical content type our AI SEO plugin will analyze.',
  },
  fields: [
    // ...your seven fields, unchanged
  ],
}
```

Save. Refresh `/admin`.

**Three things change visually:**

1. **Sidebar** — Posts is now under a "Content" group heading. Users and Media stay where they were (different/no groups).
2. **List view** — go to Posts. The columns are now `title`, `status`, `publishedAt`, `updatedAt`. Each row is labeled with the post's *title*, not its ID. The description text appears above the list.
3. **Document picker** — anywhere a Post can be picked (we'll see this in step 02), it shows the title.

### 5.2 — Try a typo in `defaultColumns` (the TS limit lesson)

Change one column name to a typo:

```ts
defaultColumns: ['title', 'staus', 'publishedAt', 'updatedAt'], // ← 'staus'
```

Save. **No red squiggle** — TS doesn't validate the strings against your field names. The list view will just be missing the Status column.

This shows you the limit of the type system here: it catches the *shape* of values (string array), not the *meaning* of those strings within Payload's runtime.

Fix it back to `'status'`.

### 5.3 — Try `defaultColumns` as a string (not an array)

Try the wrong shape:

```ts
defaultColumns: 'title', // ← string instead of array
```

**Red squiggle.** The type expects `string[]`, not `string`. TS catches the shape mismatch — even though it doesn't catch the typo case above.

Fix it back to the array.

### 5.4 — Add `timestamps: true`

Outside the `admin` block, at the top-level of the collection config:

```ts
export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: { /* ... */ },
  fields: [ /* ... */ ],
  timestamps: true, // ← new
}
```

Save. The `createdAt` and `updatedAt` columns in the list view now have real values (they were there before — Payload adds them by default in many setups — but `timestamps: true` makes the intention explicit and future-proofs the collection).

### 5.5 — Break it: `timestamps: 'true'`

Same boolean lesson as 01.3:

```ts
timestamps: 'true', // ← string, not boolean
```

**Red squiggle.** `boolean` doesn't accept a string. Fix it back to `timestamps: true`.

### 5.6 — Typing drill: rebuild Posts from memory

Close `Posts.ts`. Open a new blank file. Without looking at the original,
type the entire collection config from memory — all 7 fields, the admin
block, timestamps. Don't copy-paste. Don't peek.

You'll forget something. That's the point — what you forget is what you
haven't internalized yet. Check against the original after, note what
you missed, then delete the blank file.

This is the last sub-step before `generate:types`. From here on, your
muscle memory for writing collection configs should be solid.

---

## 6. Verify

- [ ] `src/collections/Posts.ts` has a collection-level `admin: {}` block with `useAsTitle`, `defaultColumns`, `group: 'Content'`, `description`
- [ ] `timestamps: true` is at the top-level of the config (not inside admin)
- [ ] List view labels each post with its title, not its ID
- [ ] List view shows columns: title, status, publishedAt, updatedAt
- [ ] Posts appears under a "Content" group heading in the sidebar
- [ ] Description text appears above the list view
- [ ] You saw the difference between 5.2 (TS doesn't catch the field-name typo) and 5.3 (TS catches the shape mismatch)
- [ ] You saw the red squiggle on `timestamps: 'true'` in 5.5

Commit:

```bash
git add .
git commit -m "step 01.9 — Posts admin polish (useAsTitle, defaultColumns, group, timestamps)"
```

---

## 7. Unlocks

- **Step 01.10** — generate TypeScript types from the schema. Watch `src/payload-types.ts` light up with a fully-typed `Post` interface that matches every field we built.
- The collection-level `admin` config you used here is the same place we'll later configure live preview, custom components, list-view actions, and more. Same nested-config pattern, different keys.
