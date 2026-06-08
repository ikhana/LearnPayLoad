# Step 01.8 — Add the `status` field (select)

The last field on Posts. A dropdown with a fixed set of options. We'll also
see that Payload accepts options in *two different shapes* — and
TypeScript keeps both honest.

---

## 1. The story

A post needs a publishing gate. We have `publishedAt` (when it's intended
to go live), but we also need a manual flag: "is this post ready for the
world, or still a draft?"

Why both? Because `publishedAt` can be set to a past date for a *draft*
post (the editor was planning, picked a date, never finished writing). We
need a separate "is it actually published" signal so the public site can
filter on that, not on date alone.

The `select` field type is the right shape. A dropdown with a fixed set of
options — no free-form text, no typos. Two choices in our case: `draft` or
`published`.

In step 10 we graduate to Payload's proper draft/version system (which
adds an automatic `_status` field). For now, a manual `status` select is
the right teaching step — it covers more of the type system.

---

## 2. What you'll learn — Payload

> **Official docs:** [Select Field](https://payloadcms.com/docs/fields/select)
> **Skill reference:** `.claude/skills/payload/reference/FIELDS.md`

- **The `select` field type.** Renders as a dropdown. Stores a single string value (or an array of strings if `hasMany: true`).
- **`options`** — an array describing the choices. Payload accepts two shapes:
  - **Short form:** an array of strings — `['draft', 'published']`. Label and stored value are the same string.
  - **Long form:** an array of objects — `[{ label: 'Draft', value: 'draft' }, ...]`. Use this when the human label should differ from the stored value.
- **`defaultValue`** — what gets pre-filled when an editor creates a new record. Should be one of the option values.
- **`required: true`** — the field can't be empty.

---

## 3. What you'll learn — TypeScript

> **TS Lessons:** [03.3 — Unions of shapes](../ts-lessons/03-restricting-values/03-3-unions-of-shapes.md), [04.1 — Arrays](../ts-lessons/04-lists-and-imports/04-1-arrays.md)

One concept: **unions between different shapes**. Payload's `options`
accepts two forms:

```ts
// Short form — string array
options: ['draft', 'published']

// Long form — object array
options: [{ label: 'Draft', value: 'draft' }, { label: 'Published', value: 'published' }]
```

The type is roughly `(string | { label: string; value: string })[]`.
You pick one form per field. The type system validates whichever form
you chose — try mixing both in one array and TS rejects it.

This pattern (simple string *or* detailed object) shows up throughout
Payload: plugins, hooks, access functions.

---

## 4. Builds on

- **Step 01.7** — Posts has 6 fields. This is the 7th.
- The `: CollectionConfig` annotation continues to power every TS lesson.

---

## 5. Steps

### 5.1 — Add the status field with short-form options

After `publishedAt`, add:

```ts
{
  name: 'status',
  type: 'select',
  options: ['draft', 'published'],
  defaultValue: 'draft',
  required: true,
  admin: { position: 'sidebar' },
},
```

Save. Refresh a post's edit view. **A dropdown appears in the right sidebar** labeled "Status," pre-set to "draft." Open it — you see `draft` and `published` as the two options.

### 5.2 — Try mixing both shapes (the TS lesson)

Break it. Change `options` to mix string and object:

```ts
options: ['draft', { label: 'Published', value: 'published' }],
```

**Red squiggle on the array.** TypeScript expects every item in the array to be the same shape — all strings, or all `{ label, value }` objects. Mixing them is rejected.

### 5.3 — Pick the long form for nicer labels

Fix it by going all-long-form:

```ts
options: [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
],
```

Save. Open the dropdown in the admin — the labels now read "Draft" and "Published" (capitalized) instead of lowercase. The stored values are still `'draft'` and `'published'`.

### 5.4 — Try a `defaultValue` not in `options`

Set `defaultValue` to something not in the options:

```ts
defaultValue: 'archived', // ← not in options
```

**Behavior:** TypeScript may not catch this at compile time (depending on Payload version). The admin form will fail at runtime when an editor tries to save with no value selected. The lesson: TS doesn't catch *every* logical mistake — sometimes the constraint lives in the runtime, not the type.

Fix it back to `defaultValue: 'draft'`.

### 5.5 — Confirm in the admin

Refresh. Create a new post. The Status dropdown is pre-set to "Draft." Change it to "Published." Save. Reload — it persisted.

The Posts collection now has **seven fields**. We're done adding fields.

---

## 6. Verify

- [ ] `src/collections/Posts.ts` has the status field with `name: 'status'`, `type: 'select'`, long-form `options`, `defaultValue: 'draft'`, `required: true`, `admin: { position: 'sidebar' }`
- [ ] In the admin, Status is a sidebar dropdown showing "Draft" and "Published"
- [ ] You saw the red squiggle in 5.2 when you mixed string and object option forms
- [ ] You observed what happens in 5.4 with a `defaultValue` that isn't in `options`

Commit:

```bash
git add .
git commit -m "step 01.8 — add Posts.status field (select, draft/published, default draft)"
```

---

## 7. Unlocks

- **Step 01.9** — admin polish at the *collection* level (`useAsTitle`, `defaultColumns`, `group`, `description`, `timestamps`). All fields exist; now we make the list view and sidebar nicer.
- The "string or object" union pattern from this step shows up again in `defaultColumns`, in many plugin APIs, and in hook configs you'll write later.
