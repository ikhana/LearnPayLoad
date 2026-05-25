# Step 01.4 — Add the `excerpt` field (textarea)

Add a multi-line text field with a help description so editors know what
to put in it.

---

## 1. The story

A blog post needs a summary. Something short you can show on a listing
page, in social media meta tags, or as a fallback meta description when
SEO data isn't filled in.

`text` (single-line) is wrong for this — summaries are usually 1–3
sentences. We need a `textarea` field: multi-line, scrollable. Same data
type as text (just a string under the hood), different UI.

This sub-step also introduces our first piece of *help text*: a
description that shows up in the admin to tell editors what to write in
this field.

---

## 2. What you'll learn — Payload

> **Official docs:** [Textarea Field](https://payloadcms.com/docs/fields/textarea)
> **Skill reference:** `.claude/skills/payload/reference/FIELDS.md`

- **The `textarea` field type.** Renders as a multi-line scrollable input. Data is still just a string in the database — same shape as `text`, different UI.
- **`admin.description`.** A help message that appears under the field label in the admin. Use it to give editors context: "what should go here?" "what's the format?"
- **Field-level admin config is one small object that can hold multiple sub-keys.** We touched it in 01.3 with `admin: { position: 'sidebar' }`. This time we add a sibling key: `admin: { description: '...' }`. The `admin` object can hold many options at once.

---

## 3. What you'll learn — TypeScript

One TS concept: **nested object types**.

### 3a. What is a nested object type?

A type can describe a value that's *itself an object containing more typed properties*. The outer type names the property; the inner type describes the shape of the object that property holds.

```ts
type Person = {
  name: string
  address: {              // address is itself an object
    street: string
    city: string
  }
}

const alice: Person = {
  name: 'Alice',
  address: {
    street: '123 Main',
    city: 'Quetta',
  }
}
```

Reading the type: a `Person` has a `name` (string) and an `address` (which is itself an object with `street` and `city`).

### 3b. Where you'll see it in this sub-step

The `admin` property on a Payload field is one of these nested objects. Inside it you can put properties like `position`, `description`, `condition`, `hidden`, and more — each with its own type.

When you type `admin: { ` and then press `Ctrl+Space`, your editor shows you the inner shape. Try it after you add the `admin` block in the steps below — autocomplete reveals what else lives in there.

### 3c. Why this matters going forward

Payload uses nested-object configs *everywhere*. The whole collection has an `admin` config. Each field has its own `admin`. Hooks have nested arrays of functions. Globals look similar. The lesson is the same in every later sub-step: when you see `: { ... }` after a property, the inside is its own typed shape, and autocomplete works inside it.

---

## 4. Builds on

- **Step 01.3** — Posts has `title` and `slug` fields. The `admin: { position: 'sidebar' }` pattern is already on `slug`.

---

## 5. Steps

### 5.1 — Add the excerpt field, minimal

After the slug field, add:

```ts
{
  name: 'excerpt',
  type: 'textarea',
},
```

Save. Refresh a post's edit view in `/admin`. Below the Title input you now see an Excerpt input — taller than Title, scrollable, multi-line.

### 5.2 — Try a wrong field type to see the error

Break it on purpose:

```ts
{
  name: 'excerpt',
  type: 'textarae', // ← typo
},
```

**Red squiggle on `'textarae'`.** The string literal union from 01.2 catches it — `'textarae'` isn't in the list of valid field types. Hover the error and your editor probably suggests `'textarea'` as the closest match.

Fix it back to `'textarea'`.

### 5.3 — Add an admin description

Update the field to include an `admin` block with a description:

```ts
{
  name: 'excerpt',
  type: 'textarea',
  admin: {
    description: 'Short summary used on listing pages and as a fallback meta description.',
  },
},
```

Save. Refresh the edit view. **The description appears under the Excerpt label** — it tells editors what this field is for.

### 5.4 — See what else lives inside `admin`

Put your cursor inside the `admin: { ... }` block, after the `description` line. Press `Ctrl+Space`.

Your editor shows the full list of properties available inside `admin` for a field: `description`, `position`, `condition`, `hidden`, `readOnly`, `disabled`, `components`, `placeholder`, `style`, and more. You don't need to use all of these — they're just options that exist for when you do.

That list exists *because* of the annotation. The editor read the type and knows the shape of every nested object.

### 5.5 — Try an invalid key inside `admin`

Add a bad key:

```ts
admin: {
  description: 'Short summary...',
  positoin: 'sidebar', // ← typo: should be "position"
},
```

**Red squiggle.** TypeScript rejects `positoin` because the nested admin type doesn't have that key. Hover to confirm; fix it (or remove the line — excerpt doesn't need to be sidebar-positioned).

---

## 6. Verify

- [ ] `src/collections/Posts.ts` has the excerpt field with `name: 'excerpt'`, `type: 'textarea'`, `admin: { description: '...' }`
- [ ] In the admin, the Excerpt field appears as a multi-line input, below Title
- [ ] The description text from `admin.description` appears under the Excerpt label
- [ ] You saw the red squiggle when you typed `'textarae'` in 5.2
- [ ] You saw the autocomplete fire on `admin: {` in 5.4

Commit:

```bash
git add .
git commit -m "step 01.4 — add Posts.excerpt field (textarea, admin description)"
```

---

## 7. Unlocks

- **Step 01.5** — add `content` (richText). Same field-config pattern, but with a completely different UI — the Lexical editor instead of a plain input. And the data shape stops being a plain string.
- The pattern of "field has an `admin` nested config, autocomplete shows what's inside" is fully in your hands now. You'll re-use it in every later sub-step.
