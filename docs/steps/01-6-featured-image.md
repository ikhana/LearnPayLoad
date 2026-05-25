# Step 01.6 — Add the `featuredImage` field (upload)

Add a field that points at the existing Media collection. Watch Payload
know — at the type level — exactly which collections you're allowed to reference.

---

## 1. The story

Every blog post benefits from a featured image — the hero shot at the top
of the post page, the thumbnail in listing views, the default OG image
when the post gets shared on social media.

Storing the image *inside* the Posts collection would duplicate files
across posts that share an image. Instead, Payload keeps uploaded files in
a separate `Media` collection (which already exists from step 00) and
lets other collections *reference* a media record by its ID. That's a
relationship.

The `upload` field type is the convenient version of this: it gives editors
a file-picker UI that either uploads a new file (creating a new Media
record) or picks an existing one.

---

## 2. What you'll learn — Payload

> **Official docs:** [Upload Field](https://payloadcms.com/docs/fields/upload)
> **Skill reference:** `.claude/skills/payload/reference/FIELDS.md`

- **The `upload` field type.** Renders a file-picker UI in the admin. Underneath, it's a typed relationship to an upload-enabled collection.
- **`relationTo: 'media'`.** Points the field at the collection slug `media` (the Media collection from step 00). The value of `relationTo` must match a collection that has `upload: true` in its config.
- **What gets stored.** Not the file. Not the file's URL. The *ID of the Media record*. When you query a post with default depth, Payload automatically expands that ID into the full Media object (URL, alt text, sizes) — that's relationship "population."

---

## 3. What you'll learn — TypeScript

One TS concept: **literal types that come from the project itself**.

### 3a. The valid collection slugs are known to TypeScript

When you set `relationTo: 'media'`, TypeScript doesn't accept *any* string. It accepts only the slugs of collections that actually exist in your project — Payload teaches TS about them through generated types.

In our project right now, the valid options are `'users'`, `'media'`, and `'posts'`. You can write `relationTo: 'media'` but not `relationTo: 'manfacturers'` (a typo) or `relationTo: 'comments'` (a collection we haven't built).

### 3b. Why this is powerful

In a regular language, "string for the collection name" would just mean "any string." Typos would silently fail at runtime — the API would return "no such collection" only when someone actually exercised the relationship in production.

In a TS-aware framework like Payload, the project's own collection slugs become a literal union type. Rename a collection in `payload.config.ts`, and every `relationTo` pointing at the old name lights up red instantly.

### 3c. The narrowing is strongest after `pnpm generate:types`

A subtle thing: for the cleanest narrowing of `relationTo`, Payload uses the *generated* types in `payload-types.ts`. That file gets regenerated whenever you run `pnpm generate:types` (which we do in 01.10).

You'll see some autocomplete even before then, from Payload's internal type machinery. But the most reliable experience is "generate types after every schema change." That's the loop we'll formalize in 01.10.

---

## 4. Builds on

- **Step 00** — Media collection exists with `upload: true` and image config. Available at slug `'media'`.
- **Step 01.5** — Posts has title, slug, excerpt, content.

---

## 5. Steps

### 5.1 — Add the featuredImage field, minimal

After content, add:

```ts
{
  name: 'featuredImage',
  type: 'upload',
  relationTo: 'media',
},
```

Save. Refresh a post's edit view in `/admin`. **A file-picker appears below the content editor**, labeled "Featured Image."

### 5.2 — Upload an image

Click the file-picker. Upload any image from your machine. Save the post.

You can also click the existing-media browser to pick an image you already uploaded. Either way, the field stores the Media record's ID — not the file itself.

### 5.3 — See what got stored

Visit `/api/posts/<id>?depth=0` (depth zero means "don't expand relationships"). The `featuredImage` field is just an ID — a number or a hash, depending on the DB.

Now visit `/api/posts/<id>` (default depth 2). The `featuredImage` field is the *full Media object* — URL, mime type, sizes, alt text. That's population.

This is the difference between "depth 0" (raw IDs) and "depth ≥ 1" (expanded objects). We'll come back to depth in step 02 when we add real relationships.

### 5.4 — Break it: typo on collection name

Change `relationTo` to a misspelling:

```ts
{
  name: 'featuredImage',
  type: 'upload',
  relationTo: 'medai', // ← typo
},
```

**Red squiggle on `'medai'`.** Hover the error. TypeScript tells you `'medai'` isn't assignable to the expected type — and the expected type is the literal union of your real collection slugs.

Fix it back to `'media'`.

### 5.5 — Break it: a collection that doesn't exist yet

Try a plausible-but-nonexistent name:

```ts
relationTo: 'comments',
```

**Red squiggle.** No `comments` collection exists in our project. The error tells you the valid options: `'users' | 'media' | 'posts'`.

This is the kind of safety net that catches bugs at the editor instead of in production.

Fix it back to `'media'`.

---

## 6. Verify

- [ ] `src/collections/Posts.ts` has the featuredImage field with `name: 'featuredImage'`, `type: 'upload'`, `relationTo: 'media'`
- [ ] The admin edit view shows a file-picker labeled "Featured Image"
- [ ] You uploaded an image and the post saved successfully
- [ ] `/api/posts/<id>?depth=0` shows just an ID for featuredImage
- [ ] `/api/posts/<id>` (default depth) shows the full Media object
- [ ] You saw the red squiggle when you tried `relationTo: 'medai'` and `relationTo: 'comments'`

Commit:

```bash
git add .
git commit -m "step 01.6 — add Posts.featuredImage field (upload to Media)"
```

---

## 7. Unlocks

- **Step 01.7** — `publishedAt` (date). New field type, plus a deeper nested admin config (the date picker has its own sub-config inside `admin: {}`).
- The `relationTo` narrowing you just saw is the foundation of how Payload handles real relationships in step 02 — Posts to Categories, Posts to Tags. Same mechanism, scaled up.
