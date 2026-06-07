# Step 01.3 — Add the `slug` field

Add a URL-safe identifier with three constraints: `unique`, `index`, and
sidebar positioning. Each constraint teaches one new thing.

---

## 1. The story

Every post needs a URL. The title alone won't do — titles can have spaces,
capital letters, punctuation, all things browsers handle poorly.
`/blog/hello-payload` reads cleaner than `/blog/Hello%20Payload%21`.

So we add a `slug` field: a URL-safe identifier alongside the human-readable
title. In this sub-step we also pick up three new pieces of field config:
`unique`, `index`, and `admin.position`. Each one teaches something we'll
reuse in later steps.

---

## 2. What you'll learn — Payload

> **Official docs:** [Text Field](https://payloadcms.com/docs/fields/text), [Field Schema](https://payloadcms.com/docs/fields/overview)
> **Skill reference:** `.claude/skills/payload/reference/FIELDS.md`

- **`unique: true`.** Tells Payload (and the database) "no two records in this collection can share this field's value." Enforced as a SQL unique constraint. Save a duplicate → API rejects it.
- **`index: true`.** Adds a database index on this field. Lookups like `/api/posts?where[slug][equals]=hello-payload` become much faster — instead of scanning every row, the DB jumps straight to the match. Always index fields you'll query by.
- **`admin: { position: 'sidebar' }`.** Pushes this field out of the main edit form into the right-hand sidebar. Good for metadata-style fields that aren't the main content — slug, status, publishedAt.

---

## 3. What you'll learn — TypeScript

> **TS Lessons:** [01.3 — Booleans](../ts-lessons/01-3-booleans-and-primitives.md), [02.4 — Optional & null](../ts-lessons/02-4-optional-and-null.md)

Two concepts:

1. **Booleans** — `unique: true`, `index: true`, `required: true` are
   all typed as `boolean`. Only `true` or `false` — not `'true'` (a
   string). Try `unique: 'true'` in section 5 below to see TS catch it.

2. **Optional properties** — `unique` doesn't have to be there. In
   Payload's type it's `unique?: boolean` — the `?` means "might be
   present, might not." Omit it and the field is non-unique by default.

---

## 4. Builds on

- **Step 01.2** — Posts has one field: `title`. The `: CollectionConfig` annotation gives us autocomplete on field options.

---

## 5. Steps

### 5.1 — Add the slug field, minimal

In `src/collections/Posts.ts`, add a second field to the array, after the title:

```ts
fields: [
  {
    name: 'title',
    type: 'text',
    required: true,
  },
  {
    name: 'slug',
    type: 'text',
  },
],
```

Save. Refresh `/admin`. Open a post — the form now has two inputs: Title and Slug.

### 5.2 — Save two posts with the same slug (before `unique`)

Create a post with title `"First"` and slug `"hello"`. Save.
Create another with title `"Second"` and slug `"hello"`. Save.

**Both save.** Two posts in the list, both with slug `"hello"`. That's a
bug waiting to happen — two posts can't realistically share a URL.

### 5.3 — Add `unique: true`

Update the slug field:

```ts
{
  name: 'slug',
  type: 'text',
  unique: true,
},
```

Save. The dev server may complain that existing data violates the new
constraint (you have two posts with the same slug). **Delete one of the
duplicate posts** in the admin, then restart `pnpm dev` if the migration
got stuck.

### 5.4 — Try to save a duplicate now

Create a new post with slug `"hello"` (the slug that still exists).
Save. **Error.** The API rejects it because `unique: true` is now enforcing
at the database level.

Change the slug to `"hello-2"`. Save. Success.

### 5.5 — Break the boolean type on purpose

Set `unique: 'true'` (a string instead of a boolean):

```ts
{
  name: 'slug',
  type: 'text',
  unique: 'true', // ← wrong type
},
```

**Red squiggle.** Hover the error. Your editor says `Type 'string' is not assignable to type 'boolean | undefined'`. That's the boolean lesson from section 3 in action — `'true'` (a string) is not the same as `true` (a boolean).

Fix it back to `unique: true`.

### 5.6 — Add `index: true`

Update the slug field again:

```ts
{
  name: 'slug',
  type: 'text',
  unique: true,
  index: true,
},
```

Save. Visually nothing changes in the admin. But under the hood, the database now has an index on the slug column. If you had millions of posts, queries like "find the post with slug X" would be way faster.

### 5.7 — Move slug to the sidebar

Add an `admin` block:

```ts
{
  name: 'slug',
  type: 'text',
  unique: true,
  index: true,
  admin: { position: 'sidebar' },
},
```

Save. Refresh a post's edit view in `/admin`. **The slug input moved.** It's now in the right-hand sidebar instead of the main form area. Title stays in the main area; slug is metadata off to the side.

### 5.8 — Try an invalid `position`

Break it:

```ts
admin: { position: 'middle' }, // ← invalid
```

**Red squiggle.** `position` only accepts the literal `'sidebar'` (the absence of position means "main area," which is the default). Any other value is rejected.

Fix it back to `'sidebar'`.

---

## 6. Verify

- [ ] `src/collections/Posts.ts` has the slug field with `name: 'slug'`, `type: 'text'`, `unique: true`, `index: true`, `admin: { position: 'sidebar' }`
- [ ] Two posts can't share the same slug — duplicates are rejected
- [ ] The slug input appears in the right sidebar of a post's edit view, not the main form area
- [ ] You saw the red squiggle in 5.5 when you used `unique: 'true'` (string)
- [ ] You saw the red squiggle in 5.8 when you used `position: 'middle'`

Commit:

```bash
git add .
git commit -m "step 01.3 — add Posts.slug field (unique, indexed, sidebar)"
```

---

## 7. Unlocks

- **Step 01.4** — add the `excerpt` field (textarea). New: a different field type, plus `admin.description` to give editors guidance text.
- The `admin` nested object you used here will keep growing. Many later sub-steps add new properties inside `admin: {}` — description, condition, hidden, components, etc. Same pattern, new keys.
