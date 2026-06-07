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

> **TS Lesson:** [03.2 — Union types](../ts-lessons/03-2-union-types.md)

One concept: **project-derived literal types**. `relationTo: 'media'`
doesn't accept any string — TypeScript knows the valid collection slugs
(`'users'`, `'media'`, `'posts'`) and rejects anything else.

Try `relationTo: 'manfacturers'` (typo) — red squiggle. Try
`relationTo: 'comments'` (doesn't exist) — red squiggle. Rename a
collection in `payload.config.ts` and every `relationTo` pointing at
the old name lights up immediately.

This narrowing is strongest after `pnpm generate:types` (step 01.10).

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
