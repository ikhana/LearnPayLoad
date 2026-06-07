# Step 02.2 — Categories fields: title, slug, description

Add a `slug` and `description` field to Categories. The TS lesson
introduces **generic types** — the most important TypeScript concept
you'll learn in this entire project.

---

## 1. The story

A category with just a title isn't useful. We need:

- **slug** — for clean URLs (`/categories/javascript` instead of
  `/categories/abc123`)
- **description** — so editors (and eventually our SEO plugin) know what
  the category covers

These are the same field types you used in Posts (`text` and `textarea`).
The Payload side is pure repetition. The TS lesson is the new part.

---

## 2. What you'll learn — Payload

> **Official docs:** [Text Field](https://payloadcms.com/docs/fields/text), [Textarea Field](https://payloadcms.com/docs/fields/textarea)

Nothing new on the Payload side. You're using:

- `text` with `unique: true` and `index: true` — same as the Posts slug
  from 01.3
- `textarea` — same as the Posts excerpt from 01.4

The repetition is the point. By the third time you type `unique: true`,
you don't need to look it up anymore.

---

## 3. What you'll learn — TypeScript

> **TS Lesson:** [05.1 — What are generics?](../ts-lessons/05-1-what-are-generics.md)
>
> **Read this lesson first.** It explains generics with a Box example
> and connects `Array<string>` to `string[]`. Come back here after.

One big concept: **generic types** — the most important TS concept in
this project. A generic is a type with a fill-in-the-blank slot:

```ts
type Box<T> = { contents: T; label: string }

const shoeBox: Box<string> = { contents: 'Nike Air Max', label: 'Shoes' }
const ageBox: Box<number> = { contents: 30, label: 'My age' }
```

You already know one generic: `Array<string>` is `string[]`. Same thing.

Payload uses generics internally for field types (`TextField`,
`RelationshipField`, etc.). We'll use `RelationshipField` directly in
02.3. For now: **`< >` is the slot, you fill it in when you use the
type.**

---

## 4. Builds on

- **Step 02.1** — Categories exists with one `title` field
- **Step 01.3** — slug pattern (text, unique, index)
- **Step 01.4** — textarea pattern (description text)

---

## 5. Steps

### 5.1 — Add slug and description to Categories

Open `src/collections/Categories.ts`. Update the fields array:

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

Save. Restart `pnpm dev` if needed (field additions to existing
collections sometimes need a restart with SQLite).

### 5.2 — Verify in the admin

Open `/admin` → Categories → Create New. You should see three fields:
Title, Slug, Description.

Create a test category:
- Title: `JavaScript`
- Slug: `javascript`
- Description: `Posts about JavaScript fundamentals, ES2024+, and the ecosystem.`

Click **Save**.

### 5.3 — Try the generic syntax in a scratch experiment

Create a temporary file (anywhere — even in your head). Just understand
this:

```ts
// These two lines mean the EXACT same thing:
const a: string[] = ['hello']
const b: Array<string> = ['hello']
```

`string[]` is sugar for `Array<string>`. The `<string>` part is the
generic parameter — it tells `Array` what type of items it holds.

Now try a wrong type inside the generic:

```ts
const c: Array<string> = [42] // ← ERROR: number is not string
```

The generic parameter `<string>` constrains every element. That's the
enforcement mechanism.

### 5.4 — Break it: duplicate slug

Create another category with the same slug (`javascript`). Payload
should reject it — `unique: true` is enforced at the database level.
You'll see an error message about a unique constraint violation.

This is the same behavior from 01.3 with Posts slugs. Same field option,
same enforcement, different collection.

---

## 6. Verify

- [ ] Categories has three fields: title (required), slug (unique, indexed), description (textarea)
- [ ] You created a test category (`JavaScript`) successfully
- [ ] You understand that `Array<string>` and `string[]` are the same thing
- [ ] You understand the generic concept: a type with a fill-in-the-blank slot in `< >`
- [ ] Duplicate slug was rejected by the database

Commit:

```bash
git add .
git commit -m "step 02.2 — Categories fields (title, slug, description)"
```

---

## 7. Unlocks

- **Step 02.3** — add a `category` relationship field to Posts. This is
  where the `relationship` field type enters. The TS lesson uses the
  `RelationshipField` type directly — your first real generic in Payload
  code.
