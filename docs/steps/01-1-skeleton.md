# Step 01.1 — Skeleton Posts collection

Add an empty `Posts` collection — no fields yet — and register it in
`payload.config.ts`. Watch it appear in the admin sidebar. This proves the
wiring before we touch a single field.

---

## 1. The story

After step 00 the only collections that exist are `Users` and `Media` — the
two that come with the blank template. Before adding fields, taxonomy,
hooks, or anything else, we want to confirm one thing: **does Payload pick
up a new collection at all when we register it?**

The smallest possible collection is just a `slug` and an empty `fields`
array. If that's enough to make a new entry appear in the admin sidebar, we
know the registration plumbing works and every later sub-step is just "add
one more thing to a working surface."

This is the pattern we'll use throughout step 01: prove the surface first,
then add features one at a time. No "I'll come back and verify it later."

---

## 2. What you'll learn — Payload

> **Official docs:** [Collections — Overview](https://payloadcms.com/docs/configuration/collections)
> **Skill reference:** `.claude/skills/payload/reference/COLLECTIONS.md`

- **A collection is a config object.** The minimum it needs: `slug` (a URL-safe identifier) and `fields` (an array — can be empty for now).
- **Registering happens in `payload.config.ts`.** Import the collection module, add it to the `collections` array in `buildConfig({...})`. Payload picks it up on the next dev-server restart.
- **The slug is everywhere.** Admin sidebar shows it (pluralized automatically), the REST API uses it (`/api/posts`), GraphQL types use it, type generation uses it. Pick it carefully — renaming later is migration work.

---

## 3. What you'll learn — TypeScript

> **TS Lessons:** [01 — Type annotations](../ts-lessons/01-type-annotations.md), [06 — `import type`](../ts-lessons/06-import-type.md)
>
> If these concepts are new, read those lessons first — they have plain
> non-Payload examples. Come back here when the ideas click.

Two concepts this step:

1. **Type annotations** — the `: CollectionConfig` after the variable
   name. It tells TypeScript "this object must match this shape." Your
   editor uses it to power autocomplete and catch typos. The annotation
   gets erased at compile time — it's scaffolding, not runtime code.

2. **`import type`** — importing a label, not actual code. The line
   `import type { CollectionConfig } from 'payload'` vanishes from the
   JavaScript output. Use `import type` whenever you're importing
   something only for annotations.

---

## 4. Builds on

- **Step 00** — Payload scaffolded, `pnpm dev` runs, you can log into `/admin`, `src/collections/` exists with `Users.ts` and `Media.ts`.

---

## 5. Steps

> **Don't copy-paste the final code.** Type it yourself. Stop where the doc tells you to stop, observe, then continue. The bugs we hit on purpose are the lesson.

### 5.1 — Type the skeleton, no types yet

Create the file `src/collections/Posts.ts`. Type — don't paste:

```ts
export const Posts = {
  slug: 'posts',
  fields: [],
}
```

That's a plain JavaScript object. No imports, no annotations.

### 5.2 — Register it

In `src/payload.config.ts`, add the import and put `Posts` in the `collections` array:

```ts
import { Posts } from './collections/Posts' // ← new line

export default buildConfig({
  // ...everything else unchanged...
  collections: [Users, Media, Posts], // ← Posts appended
  // ...
})
```

Save. If `pnpm dev` is running, the terminal will say it's recompiling.
Refresh `localhost:3000/admin`. **Posts** is now in the sidebar alongside
Users and Media. Click it — empty list view, **Create New** button at the top.

**Wait — it worked? Without any TypeScript annotation?** Yes. TypeScript is
opt-in. Payload accepts the object because the shape happens to be right
*at runtime*. But you got zero help from your editor while writing it. The
next steps fix that.

### 5.3 — Look at what your editor knows right now

In `src/collections/Posts.ts`, put your cursor inside the object (between
the `{` and `}` braces). Press `Ctrl+Space` (Windows/Linux) or `Cmd+Space`
(Mac) — this asks your editor to suggest what you could type here.

You'll see almost nothing useful. The editor only knows what you literally
typed; it has no idea what *other* properties a Payload collection accepts.

Close the suggestion popup.

### 5.4 — Add the annotation, look again

Now edit the file to add the `import type` line and the `: CollectionConfig`
annotation:

```ts
import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  fields: [],
}
```

Save. Back inside the object, press `Ctrl+Space` (or `Cmd+Space`) again.

**Look at the list now.** Your editor shows you every property a Payload
collection accepts: `slug`, `fields`, `admin`, `labels`, `hooks`, `access`,
`versions`, `auth`, `upload`, and more. That list exists *because of the
annotation*. The editor read `CollectionConfig` and knows the full shape.

### 5.5 — Break it on purpose

Inside `Posts`, add a line with a deliberately misspelled property:

```ts
export const Posts: CollectionConfig = {
  slgu: 'posts', // ← typo: should be "slug"
  fields: [],
}
```

Save. **Red squiggle under `slgu`.** Hover the squiggle — your editor tells
you `slgu` doesn't exist on `CollectionConfig` and may suggest you meant
`slug`. That's the annotation catching the typo before you ever run the
code.

Now fix it back to `slug: 'posts',`.

### 5.6 — Confirm in the admin

Refresh `localhost:3000/admin`. **Posts** is still in the sidebar. Clicking
it shows the empty list. We're done with this sub-step — we have a working
surface to add fields to next.

---

## 6. Verify

- [ ] `src/collections/Posts.ts` exists, has the `import type` line, exports `Posts`, has `: CollectionConfig` annotation, and `fields: []`
- [ ] `src/payload.config.ts` imports `Posts` and lists it in `collections`
- [ ] `pnpm dev` runs clean — no Payload startup errors
- [ ] **Posts** appears in the admin sidebar
- [ ] Clicking **Posts** shows an empty list view with a **Create New** button
- [ ] You saw the autocomplete list change between 5.3 (small) and 5.4 (full Payload shape)
- [ ] You typed a deliberate typo in 5.5 and saw the red squiggle — then fixed it

Commit:

```bash
git add .
git commit -m "step 01.1 — skeleton Posts collection (no fields yet)"
```

---

## 7. Unlocks

- **Step 01.2** — add the first field (`title`). The annotation you wrote here will start carrying real weight: autocomplete on field types, errors on typos like `type: 'tex'`.
- The "type-it-yourself, break-it-on-purpose" rhythm from this sub-step is the rhythm of every later one. Don't shortcut to the final code; the bugs we cause on purpose are the lesson.
