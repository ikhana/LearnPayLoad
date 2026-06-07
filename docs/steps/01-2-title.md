# Step 01.2 — Add the `title` field

Add the first text field to `Posts`. Watch the admin form generate itself
from one object in your config.

---

## 1. The story

01.1 gave us a `Posts` collection with an empty `fields` array. Opening a
new post in the admin shows… nothing. No inputs. We need a first field.

Title is the right place to start — every post needs one, it's the
primary identifier we'll eventually use in list views, and it's the most
basic field type Payload offers: a single-line text input.

After this sub-step, opening a new post shows a form with one input. That
input was generated entirely from the field config — no UI code from us.
This is the whole pitch of Payload: define the shape, the admin appears.

---

## 2. What you'll learn — Payload

> **Official docs:** [Text Field](https://payloadcms.com/docs/fields/text)
> **Skill reference:** `.claude/skills/payload/reference/FIELDS.md`

- **The `text` field type.** Renders as a single-line input in the admin. The simplest Payload field.
- **`name` is the database column.** `name: 'title'` becomes a `title` column in SQLite and a `title: string` property on the generated `Post` type later.
- **`required: true`.** Marks the field as mandatory. The admin form refuses to save without it; the API rejects creates/updates that omit it. This is server-side validation, not just client-side.
- **The label is auto-derived.** No `label` option → Payload uses a humanized version of the `name`. `title` → `"Title"`. You can override with `label: '...'` when needed (later steps).

---

## 3. What you'll learn — TypeScript

> **TS Lessons:** [03.1 — Literal types](../ts-lessons/03-1-literal-types.md), [03.2 — Union types](../ts-lessons/03-2-union-types.md)
>
> Read that lesson first if unions are new. It uses a traffic light
> example before we get to Payload.

One concept: **string literal unions**. The `type` property on a field
isn't typed as "any string" — it's a union of every valid Payload field
type: `'text' | 'textarea' | 'richText' | 'date' | ...`. Type
`type: 'tex'` and the editor rejects it. The union forces you to pick
a real option.

The `|` means "or." `'draft' | 'published'` means "only these two
exact strings." You'll see this pattern on field types, select options,
and admin settings throughout the project.

---

## 4. Builds on

- **Step 01.1** — `Posts` collection exists and registers cleanly. The `import type` line and the `: CollectionConfig` annotation are in place.

---

## 5. Steps

> Type — don't paste. The order matters; some of these intentionally produce errors so you see what the annotation catches.

### 5.1 — Try to add a field without the right keys

In `src/collections/Posts.ts`, replace the empty `fields: []` with this:

```ts
fields: [
  {
    title: 'title', // ← intentionally wrong key
  },
],
```

Save. **Look at your editor.** Red squiggle under the field object, and
likely a red squiggle under `title:` inside it. Hover the error — your
editor tells you something like *"Object literal may only specify known
properties, and 'title' does not exist in type 'Field'."*

In plain English: Payload's field objects need a key called `name`, not
`title`. The annotation knows the shape of `Field` (the type of each item
inside the `fields` array) and is enforcing it.

### 5.2 — Fix it with the real keys

Replace the field object with the right shape. Type — don't paste:

```ts
fields: [
  {
    name: 'title',
    type: 'text',
  },
],
```

Save. **Squiggle gone.** That's the minimal valid text field.

### 5.3 — Try a typo on the field type

Now break it on purpose. Change `type: 'text'` to `type: 'tex'`:

```ts
{
  name: 'title',
  type: 'tex', // ← typo
},
```

Save. **Red squiggle under `'tex'`.** Hover it. The error lists the valid
options: `'text' | 'textarea' | 'richText' | 'date' | 'upload' | 'relationship' | 'select' | ...`. That's the string literal union from section 3 in action — Payload's type for `type` is a closed list, not "any string."

Fix it back to `type: 'text'`.

### 5.4 — Add the `required` constraint

Add one more line to the field:

```ts
{
  name: 'title',
  type: 'text',
  required: true,
},
```

Save. No errors. The full file should now look like:

```ts
import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
  ],
}
```

### 5.5 — Watch it in the admin

Refresh `localhost:3000/admin`. Click **Posts** in the sidebar, then **Create New**.

- The form now has one input labeled **Title**. Notice the label was generated automatically from the name `title` — humanized to title-case.
- A small red `*` next to the label indicates it's required.

### 5.6 — Try to save without filling it

Click **Save** without typing anything in the Title input.

**Validation error:** the admin tells you Title is required. The save is
blocked. This is `required: true` doing its job *on the server*, not just
visually in the UI. Even if you bypassed the form and posted directly to
`/api/posts`, the API would reject it.

### 5.7 — Save a real post

Type a title (anything — *"Hello Payload"*). Click **Save**.

The post saves. You're redirected to its edit view. Go back to the
**Posts** list — your post appears, labeled with its ID (a long number or
hash) instead of its title. That's expected; we set `useAsTitle: 'title'`
in step 01.9 to fix this.

---

## 6. Verify

- [ ] `src/collections/Posts.ts` has one field in the array: `name: 'title'`, `type: 'text'`, `required: true`
- [ ] Opening a new Post in `/admin` shows a `Title` input with a red `*`
- [ ] Saving with an empty title shows a validation error
- [ ] Saving with a title succeeds; the post appears in the list view
- [ ] You saw the red squiggle in 5.1 when you used `title:` instead of `name:`
- [ ] You saw the red squiggle in 5.3 when you typed `'tex'` instead of `'text'`

Commit:

```bash
git add .
git commit -m "step 01.2 — add Posts.title field (text, required)"
```

---

## 7. Unlocks

- **Step 01.3** — add the `slug` field. Two new TS ideas come with it: how `unique` and `index` are typed (boolean), and how the `admin` nested object lets you reposition a field out of the main form into the sidebar.
- The "break-it-on-purpose" experiments you ran in 5.1 and 5.3 are the test of whether you understand the TS lesson. Don't skip them in later sub-steps — the bugs are the point.
