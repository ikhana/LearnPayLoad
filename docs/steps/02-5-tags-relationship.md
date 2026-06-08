# Step 02.5 — Add `tags` relationship field to Posts (hasMany)

Connect Posts to Tags with `hasMany: true`. A post can have many tags.
This changes the stored value from a single ID to an **array** of IDs —
and the generated type changes to match.

---

## 1. The story

The `category` field from 02.3 is a one-to-one link: one post → one
category. Tags are different. A single post about "Building a Payload
plugin with React hooks" should be tagged with *both* `react-hooks` and
`payload-cms`.

`hasMany: true` makes that possible. The field stores an array of IDs
instead of a single ID. The admin renders a multi-select picker instead
of a single dropdown.

For the SEO plugin: more tags = more keyword signals = better topic
analysis. The many-to-many relationship is what makes tag-based content
gap analysis work — "you have 12 posts tagged `react-hooks` but zero
tagged `react-server-components`."

---

## 2. What you'll learn — Payload

> **Official docs:** [Relationship Field](https://payloadcms.com/docs/fields/relationship)

One new option: **`hasMany: true`**.

Everything else is the same as the `category` field from 02.3:
- `type: 'relationship'`
- `relationTo: 'tags'`

The difference:

| | `category` (02.3) | `tags` (this step) |
|---|---|---|
| `hasMany` | not set (defaults to `false`) | `true` |
| Admin UI | single dropdown picker | multi-select picker |
| Stored value | one ID (`1`) | array of IDs (`[1, 2, 3]`) |
| REST API (depth 0) | `"category": 1` | `"tags": [1, 2, 3]` |
| REST API (depth 2) | `"category": { ... }` | `"tags": [{ ... }, { ... }]` |
| Generated type | `number \| Category` | `(number \| Tag)[]` |

---

## 3. What you'll learn — TypeScript

> **TS Lessons:** [04.1 — Arrays](../ts-lessons/04-lists-and-imports/04-1-arrays.md), [05.3 — Generics in Payload](../ts-lessons/05-generics/05-3-generics-in-payload.md)

One concept: **`hasMany` turns a single value into an array**.

Without `hasMany`: `category: number | Category` (one thing)
With `hasMany: true`: `tags: (number | Tag)[]` (array of things)

The parentheses matter:
- `(number | Tag)[]` = array where each item is number or Tag
- `number | Tag[]` = a number, OR an array of Tags — different!

Payload generates the right shape from your config. You need to *read*
it in `payload-types.ts` (step 02.7) and understand the difference.

---

## 4. Builds on

- **Step 02.3** — single relationship field (`category`). This step adds
  the `hasMany` variant.
- **Step 02.4** — Tags collection exists to be referenced.
- **Step 02.2** — generic types / `Array<T>` concept.

---

## 5. Steps

### 5.1 — Add the `tags` field to Posts

Open `src/collections/Posts.ts`. Add after the `category` field:

```ts
{
  name: 'tags',
  type: 'relationship',
  relationTo: 'tags',
  hasMany: true,
  admin: {
    position: 'sidebar',
  },
},
```

Your fields array now has 9 fields: title, slug, excerpt, content,
featuredImage, publishedAt, status, category, **tags**.

Save.

### 5.2 — Restart and verify the admin

Restart `pnpm dev`. Open a post in `/admin`.

The sidebar should now have **two** relationship pickers:
- **Category** — single dropdown (from 02.3)
- **Tags** — multi-select (from this step)

Click the Tags picker. You can select multiple tags. Try selecting 2–3
of the tags you created in 02.4.

Save the post.

### 5.3 — Compare the two in the REST API

Visit `http://localhost:3000/api/posts/<id>` (default depth):

```json
{
  "category": {
    "id": 1,
    "title": "JavaScript",
    "slug": "javascript",
    ...
  },
  "tags": [
    {
      "id": 1,
      "title": "react-hooks",
      "slug": "react-hooks",
      ...
    },
    {
      "id": 2,
      "title": "typescript",
      "slug": "typescript",
      ...
    }
  ]
}
```

`category` is one object. `tags` is an **array** of objects. That
matches the `hasMany: true` behavior.

Now try `?depth=0`:

```json
{
  "category": 1,
  "tags": [1, 2]
}
```

`category` is one number. `tags` is an array of numbers.

### 5.4 — Break it: `hasMany` on the wrong field type

Try adding `hasMany` to a text field:

```ts
{
  name: 'title',
  type: 'text',
  required: true,
  hasMany: true,  // ← text doesn't support this
}
```

**Red squiggle.** The `text` field type doesn't have a `hasMany` option.
Only `relationship` and `select` do. TypeScript narrows valid options
by the `type` value.

Remove `hasMany` from the title field.

### 5.5 — Try `tags` without `hasMany` (observe the difference)

Temporarily remove `hasMany: true` from the tags field:

```ts
{
  name: 'tags',
  type: 'relationship',
  relationTo: 'tags',
  // hasMany: true,  ← commented out
  admin: { position: 'sidebar' },
},
```

Save and restart. In the admin, the Tags picker is now a **single**
dropdown — you can only pick one tag. That's the default behavior
without `hasMany`.

Add `hasMany: true` back. Restart. Multi-select returns.

---

## 6. Verify

- [ ] Posts has a `tags` field with `type: 'relationship'`, `relationTo: 'tags'`, `hasMany: true`
- [ ] Admin shows a multi-select picker for Tags (not a single dropdown)
- [ ] You assigned multiple tags to a post and saved
- [ ] REST API at default depth returns `tags` as an array of Tag objects
- [ ] REST API at `?depth=0` returns `tags` as an array of numbers
- [ ] You saw the squiggle on `hasMany` with a `text` field (5.4)
- [ ] You saw the UI change from multi-select to single when `hasMany` was removed (5.5)

Commit:

```bash
git add .
git commit -m "step 02.5 — add tags relationship field to Posts (hasMany)"
```

---

## 7. Unlocks

- **Step 02.6** — admin polish for Categories and Tags (useAsTitle,
  group, defaultColumns). Same pattern as 01.9 for Posts.
- The many-to-many pattern is now in place. Later (step 06, hooks),
  we can auto-generate tags from content using a `beforeChange` hook.
