# Step 02.3 — Add `category` relationship field to Posts

Connect Posts to Categories with a `relationship` field. One post
belongs to one category. This is the core of step 02 — the first
cross-collection link.

---

## 1. The story

Right now Posts and Categories are islands. They sit in the same Payload
project, but they don't know about each other. A post has no way to say
"I belong to the JavaScript category."

The `relationship` field fixes that. It stores a reference (an ID) to a
document in another collection. In the admin, it renders as a dropdown
picker. In the REST API, it returns either the ID or the full related
document (depending on depth).

This is the most important field type in Payload after `text`. Every
real project uses it. The SEO plugin will eventually analyze posts *per
category* to find content gaps — and that analysis depends on this link
existing.

---

## 2. What you'll learn — Payload

> **Official docs:** [Relationship Field](https://payloadcms.com/docs/fields/relationship)
> **Skill reference:** `.claude/skills/payload/reference/FIELDS.md` (Relationship section)

The `relationship` field type:

- **`type: 'relationship'`** — tells Payload this field points to another
  collection
- **`relationTo: 'categories'`** — which collection it points to. Must
  be the exact `slug` of a registered collection. Payload validates this
  at startup — a typo crashes the server with a clear error message.
- **By default, it stores a single ID.** The database column holds one
  value — the ID of the related category. The admin shows a dropdown
  picker listing all categories.
- **Depth controls population.** When you fetch a post via the REST API,
  the default depth (2) means `category` comes back as the full Category
  object, not just an ID. We'll explore this in 02.8.

Key options we're using:
- `required: true` — every post must have a category
- No `hasMany` — this is a one-to-one link (one post → one category).
  We'll add `hasMany` in 02.5 for Tags.

---

## 3. What you'll learn — TypeScript

> **TS Lessons:** [03.2 — Union types](../ts-lessons/03-restricting-values/03-2-union-types.md), [06.1 — The narrowing problem](../ts-lessons/06-narrowing/06-1-the-narrowing-problem.md) (preview)

One concept: **`relationTo` narrowing and the union it generates**.

Same as 01.6: `relationTo: 'categories'` only accepts registered
collection slugs. Typo → red squiggle.

After `generate:types` (step 02.7), `Post` gets:

```ts
category: number | Category  // simplified
```

Why the union? Because **depth** controls what you get back:
- Depth 0: just an ID (`number`)
- Depth 1+: the full `Category` object

Your code needs to handle both. We'll learn how in 02.7–02.8 using
**type narrowing** (TS lesson 08).

---

## 4. Builds on

- **Step 02.1 & 02.2** — Categories exists with title, slug, description
- **Step 01.6** — `relationTo` pattern (you used it for the `upload`
  field pointing to `media`)
- **Step 01.2** — adding a field to an existing collection

---

## 5. Steps

### 5.1 — Add the `category` field to Posts

Open `src/collections/Posts.ts`. Add a new field after `status`:

```ts
{
  name: 'category',
  type: 'relationship',
  relationTo: 'categories',
  required: true,
  admin: {
    position: 'sidebar',
  },
},
```

Your full fields array now has 8 fields: title, slug, excerpt, content,
featuredImage, publishedAt, status, **category**.

Save.

### 5.2 — Restart and check the admin

Restart `pnpm dev`. Open `/admin` → Posts → your existing test post
(or create a new one).

You should see a **Category** picker in the sidebar. It's a dropdown
listing all categories you've created. If you created "JavaScript" in
02.2, it appears here.

**Important:** If you had an existing post, it now has a *required*
field (`category`) with no value. The admin will prevent you from saving
until you pick a category. That's `required: true` doing its job.

Pick a category and save.

### 5.3 — Look at the REST API

Visit `http://localhost:3000/api/posts/<your-post-id>`.

Find the `category` key in the JSON. At the default depth (2), it should
be the **full Category object** — not just an ID:

```json
"category": {
  "id": 1,
  "title": "JavaScript",
  "slug": "javascript",
  "description": "Posts about JavaScript fundamentals...",
  "createdAt": "...",
  "updatedAt": "..."
}
```

Now try depth 0: `http://localhost:3000/api/posts/<id>?depth=0`

The `category` is now just a number:

```json
"category": 1
```

That's the ID. The union type `number | Category` in the generated types
reflects exactly this runtime behavior.

### 5.4 — Break it: wrong `relationTo`

Try a typo:

```ts
relationTo: 'categoriez', // ← typo
```

**Red squiggle.** TypeScript (and Payload at startup) both reject this —
no collection with slug `'categoriez'` exists. Fix it back.

### 5.5 — Break it: `type: 'text'` with `relationTo`

Try mixing field types:

```ts
{
  name: 'category',
  type: 'text',          // ← text field
  relationTo: 'categories', // ← but with relationTo??
}
```

**Red squiggle on `relationTo`.** A `text` field doesn't accept
`relationTo` — that option only exists on `relationship` and `upload`
fields. TypeScript uses the `type` value to narrow which options are
valid. This is the same field-type narrowing from 01.5.

Fix it back to `type: 'relationship'`.

### 5.6 — SQLite migration note

If you get a migration error (like in 01.7), delete the `.db` file and
restart. You'll need to re-create your admin user and test data. This is
a learning-environment trade-off — production uses proper migrations.

---

## 6. Verify

- [ ] Posts has a `category` field of type `relationship` pointing to `categories`
- [ ] The admin shows a category picker in the sidebar when editing a post
- [ ] REST API at default depth returns the full Category object inside the post
- [ ] REST API at `?depth=0` returns just the category ID (a number)
- [ ] You saw the red squiggle on `relationTo: 'categoriez'` (typo, 5.4)
- [ ] You saw the red squiggle on `type: 'text'` with `relationTo` (wrong field type, 5.5)

Commit:

```bash
git add .
git commit -m "step 02.3 — add category relationship field to Posts"
```

---

## 7. Unlocks

- **Step 02.4** — Tags collection. Same skeleton pattern, but Tags will
  use a *many-to-many* relationship with Posts (a post can have multiple
  tags, a tag can appear on multiple posts).
- The single relationship pattern (`hasMany` unset / false) you just
  learned is the foundation. `hasMany: true` in 02.5 builds on it.
