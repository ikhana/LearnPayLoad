# Step 02.7 — Generate types — see relationship shapes

Run `pnpm generate:types` and read the new `Category`, `Tag`, and
updated `Post` interfaces. See how relationship fields become union
types — and how `hasMany` turns a single union into an array.

---

## 1. The story

In 01.10 you ran `generate:types` for the first time. The `Post`
interface had 7 fields. Now Posts has 9 fields (added `category` and
`tags`), and two new collections exist (Categories, Tags).

This sub-step is the "edit → generate → use" loop again. Same command,
more output, more to read. The new part: relationship fields generate
**union types** that reflect the depth behavior you saw in the REST API.

---

## 2. What you'll learn — Payload

> **Official docs:** [TypeScript](https://payloadcms.com/docs/typescript/overview)

Same concept as 01.10:

- `pnpm generate:types` reads your config and writes `payload-types.ts`
- The generated file now has **three** content interfaces: `Post`,
  `Category`, `Tag`
- Relationship fields generate union types that cover both the
  "populated" case (full object) and the "unpopulated" case (just an ID)

---

## 3. What you'll learn — TypeScript

> **TS Lesson:** [06.2 — `typeof` type guards](../ts-lessons/06-2-typeof-guards.md)
>
> **Read this lesson now.** It explains `typeof` checks and narrowing
> with plain examples before we apply them to Payload relationships.

One concept: **narrowing union types with type guards**.

After `generate:types`, `Post` will have:

```ts
category: number | Category          // single relationship
tags?: (number | Tag)[] | null       // hasMany relationship
```

To access `.title` on `category`, you must check first:

```ts
if (typeof post.category === 'number') {
  return `Category ID: ${post.category}`
}
return post.category.title   // TS knows it's Category here
```

The `typeof` check is a **type guard**. After it, TypeScript narrows
the union — removing `number` from the possibilities. Without it,
`post.category.title` is a red squiggle because `number` has no `.title`.

Why the union? Depth. `depth: 0` returns IDs, `depth: 1+` returns
objects. The type covers both cases.

---

## 4. Builds on

- **Step 01.10** — first `generate:types` run. Same command, same loop.
- **Steps 02.3 & 02.5** — the `category` and `tags` relationship fields

---

## 5. Steps

### 5.1 — Look at `payload-types.ts` BEFORE regenerating

Open `src/payload-types.ts`. The `Post` interface still has 7 fields —
no `category`, no `tags`. There's no `Category` or `Tag` interface.

Stale types. Same lesson as 01.10.

### 5.2 — Run the type generator

```bash
pnpm generate:types
```

### 5.3 — Read the new interfaces

Open `src/payload-types.ts` (close and reopen the tab if your editor
caches the old version).

**Find `Category`:**
```ts
export interface Category {
  id: number
  title: string
  slug?: string | null
  description?: string | null
  createdAt: string
  updatedAt: string
}
```

Simple. Three fields you defined, plus `id`, `createdAt`, `updatedAt`.

**Find `Tag`:**
```ts
export interface Tag {
  id: number
  title: string
  slug?: string | null
  description?: string | null
  createdAt: string
  updatedAt: string
}
```

Same shape as Category. Different interface name.

**Find the updated `Post`:**

Look for `category` and `tags` on the `Post` interface. They should be
typed as unions involving `Category` and `Tag` respectively.

Read the types carefully:
- Is `category` required or optional?
- Is `tags` an array?
- What are the union members?

### 5.4 — Try a scratch file with the new types

Create `src/scratch.ts`:

```ts
import type { Post, Category, Tag } from './payload-types'

function getCategoryTitle(post: Post): string {
  if (typeof post.category === 'number') {
    return `Category #${post.category}`
  }
  return post.category.title  // ← TypeScript knows this is Category
}

function getTagSlugs(post: Post): string[] {
  if (!post.tags) return []  // handle null/undefined

  return post.tags
    .filter((tag): tag is Tag => typeof tag !== 'number')
    .map((tag) => tag.slug ?? 'no-slug')
}
```

Type `post.category.` — if TypeScript complains, it's because it
doesn't know yet whether `category` is a number or an object. Add the
`typeof` check first, then try `post.category.` inside the `else` block.

That's the type guard in action.

### 5.5 — Break it: access `.title` without narrowing

Try this:

```ts
function broken(post: Post): string {
  return post.category.title  // ← ERROR
}
```

**Red squiggle.** TypeScript says property `title` doesn't exist on type
`number`. It can't assume `category` is populated — you need to check
first. The union type forces you to handle both cases.

Delete `src/scratch.ts` when done.

---

## 6. Verify

- [ ] `pnpm generate:types` ran without errors
- [ ] `payload-types.ts` has `Category` and `Tag` interfaces
- [ ] `Post` interface now includes `category` and `tags` fields with union types
- [ ] `category` is typed as something like `number | Category`
- [ ] `tags` is typed as an array (with `number | Tag` elements)
- [ ] You wrote the type guard in the scratch file and saw TypeScript narrow the type
- [ ] You saw the red squiggle when accessing `.title` without narrowing (5.5)

Commit:

```bash
git add .
git commit -m "step 02.7 — generate types, see Category/Tag interfaces and relationship unions on Post"
```

---

## 7. Unlocks

- **Step 02.8** — the capstone. Create categories, tags, assign them to
  a post, and verify end-to-end. See depth behavior in the REST API.
  Mark step 02 done.
