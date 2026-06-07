# Step 01.10 — Generate TypeScript types

Run `pnpm generate:types` and watch `src/payload-types.ts` produce a
fully-typed `Post` interface that matches every field we've built.

---

## 1. The story

You've been writing the *input* side of TypeScript — annotations on the
collection config. The compiler used those to give you autocomplete and
catch typos *as you were defining the schema*.

Now flip it. Payload reads your collection config and generates TypeScript
types for the *output* side — the records your collection holds. The
generated types look like:

```ts
interface Post {
  id: number
  title: string
  slug: string
  excerpt?: string | null
  content?: { /* lexical tree */ } | null
  featuredImage?: number | Media | null
  publishedAt?: string | null
  status: 'draft' | 'published'
  createdAt: string
  updatedAt: string
}
```

Once those types exist, any code that reads or writes posts — frontend
pages, custom endpoints, hooks, plugin code — gets full type safety. The
loop is: **edit collection → generate types → use the types**.

---

## 2. What you'll learn — Payload

> **Official docs:** [TypeScript](https://payloadcms.com/docs/typescript/overview)
> **Skill reference:** `.claude/skills/payload/SKILL.md` (Type Generation section)

- **`pnpm generate:types`** — runs Payload's type generator. Writes to the file pointed at by `typescript.outputFile` in `payload.config.ts` (we have `src/payload-types.ts`).
- **The generated file is checked into git.** It's effectively documentation that your code can import. Every developer on the team sees the same generated types.
- **Triggered manually.** Payload doesn't auto-regen on file changes. You run the command after schema changes. Forgetting to is the most common Payload-with-TS gotcha — your editor will show stale autocomplete and red squiggles where things are actually fine.

---

## 3. What you'll learn — TypeScript

> **TS Lesson:** [02.2 — Interfaces](../ts-lessons/02-2-interfaces.md)

One concept: **the edit → generate → use loop**.

So far you've used types *from Payload* (`CollectionConfig`). Now
Payload generates types *from your config* — the `Post` interface in
`payload-types.ts` matches every field you defined.

The loop:
1. Add a field to `Posts.ts` → save
2. Run `pnpm generate:types`
3. Open `payload-types.ts` → see the new field on `Post`
4. Any code using `Post` now knows about the new field

Forget step 2 and your editor shows stale autocomplete. Always
regenerate after schema changes.

---

## 4. Builds on

- **Step 01.9** — Posts collection is fully built: 7 fields, admin polish, timestamps. Schema is final for step 01.
- `src/payload-types.ts` exists from step 00 (the scaffolder created it with `User` and `Media` interfaces but no `Post` yet).

---

## 5. Steps

### 5.1 — Look at `payload-types.ts` BEFORE running

Open `src/payload-types.ts`. Skim the file. You'll see interfaces for `User`, `Media`, and some auth helper types. **There's no `Post` interface yet** — that file hasn't been regenerated since step 00.

This is what "stale" looks like.

### 5.2 — Run the type generator

In your terminal (keep `pnpm dev` running in another tab if you want):

```bash
pnpm generate:types
```

The output reports something like "Generated types at src/payload-types.ts." Takes a second or two.

### 5.3 — Look at `payload-types.ts` AFTER running

Open the file again (your editor may need to discard cached state — close and reopen the tab if so).

**There's now a `Post` interface.** Find it. It has every field you defined: `title`, `slug`, `excerpt`, `content`, `featuredImage`, `publishedAt`, `status`, plus `id`, `createdAt`, `updatedAt`.

Read the types Payload chose for each:

- `title: string` — straightforward
- `slug: string` — same
- `excerpt?: string | null` — note the `?` (optional, because not required) and `| null` (the DB column can be null)
- `content?: { /* lexical tree */ } | null` — the complex structured type from 01.5
- `featuredImage?: (number | null) | Media` — depending on depth, either an ID or the populated Media object
- `status: 'draft' | 'published'` — the literal union from 01.8, generated from your options
- `createdAt: string`, `updatedAt: string` — ISO timestamps

Every config decision you made is reflected as a TS type. That's the entire point.

### 5.4 — Try using the type in a small experiment

Create a temporary file `src/scratch.ts` (we'll delete it at the end):

```ts
import type { Post } from './payload-types'

function describe(post: Post): string {
  return `${post.title} (${post.status})`
}

const fake: Post = {
  id: 1,
  title: 'Hello',
  slug: 'hello',
  status: 'draft',
  createdAt: '2026-05-25T10:00:00Z',
  updatedAt: '2026-05-25T10:00:00Z',
}

describe(fake)
```

Save. **No errors.** TypeScript sees `Post` and validates that your `fake` object matches its shape.

Now break it. Change `status: 'draft'` to `status: 'archived'`:

```ts
status: 'archived', // ← not in the union 'draft' | 'published'
```

**Red squiggle on `'archived'`.** The status union from your select options is now enforced for *every* place in the code that handles a Post — including this scratch file.

Delete `src/scratch.ts` when you're done.

### 5.5 — Confirm the gotcha: skipping `generate:types`

Skip this if the lesson is already obvious. To prove the gotcha cycle:

1. Add a temporary field to `Posts.ts` — say `subtitle: text`. Save.
2. Recreate `src/scratch.ts`. Try to access `post.subtitle`.
3. **Red squiggle** — TS doesn't know about `subtitle` yet, because you haven't re-run `generate:types`.
4. Run `pnpm generate:types`.
5. The squiggle clears. (Reopen the file if your editor's cache is being sticky.)
6. Remove the temporary `subtitle` field from `Posts.ts` — we don't actually want it. Re-run `generate:types` to keep types in sync.
7. Delete `src/scratch.ts`.

That cycle is one you'll repeat hundreds of times: schema change → regenerate → consume.

---

## 6. Verify

- [ ] `pnpm generate:types` ran without errors
- [ ] `src/payload-types.ts` contains a `Post` interface with every field from your collection
- [ ] The `status` field on `Post` is typed as `'draft' | 'published'` (the literal union from your options)
- [ ] You ran the scratch-file experiment in 5.4 and saw TS validate a `Post`-shaped object + reject an invalid `status` value
- [ ] You understand the "edit → generate → use" loop

Commit:

```bash
git add .
git commit -m "step 01.10 — generate types, see Post interface in payload-types.ts"
```

---

## 7. Unlocks

- **Step 01.11** — the capstone. Create a real test post in the admin, look at it via the REST API, and confirm everything fits together.
- Every future step assumes you re-run `pnpm generate:types` after schema changes. We'll mention it explicitly the next few times; eventually it's muscle memory.
- The `Post` type is now importable from `@/payload-types` anywhere in the codebase. The SEO plugin we eventually build will lean on this — when it analyzes a post, it does so with full type safety on every field it touches.
