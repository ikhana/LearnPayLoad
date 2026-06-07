# Step 01.5 — Add the `content` field (richText)

Add a rich-text field that uses the Lexical editor — block-level content
with headings, lists, links, and inline formatting.

---

## 1. The story

So far the only text we can store is plain strings — single-line (title,
slug) or multi-line (excerpt). But the body of a blog post is usually
*rich*: headings, paragraphs, bold text, links, images embedded inside the
text, lists. None of that fits in a plain string cleanly.

The `richText` field type solves this. Instead of storing a string in the
database, it stores a structured tree representing the document. Headings
are nodes, paragraphs are nodes, formatting is metadata on those nodes.
The editor renders that tree visually; the API exposes it as JSON.

Payload supports two rich-text editors out of the box: **Slate** (the
older one) and **Lexical** (the newer, Meta-built one — which we
configured globally in step 00).

---

## 2. What you'll learn — Payload

> **Official docs:** [RichText Field](https://payloadcms.com/docs/fields/rich-text), [Lexical Editor](https://payloadcms.com/docs/rich-text/overview)
> **Skill reference:** `.claude/skills/payload/reference/FIELDS.md`

- **The `richText` field type.** Renders a full WYSIWYG editor. Different from `text` and `textarea` in two ways: (a) the UI is a real editor with toolbars, not just an input; (b) the saved value is structured JSON, not a plain string.
- **The editor is configured globally.** In `src/payload.config.ts`, `editor: lexicalEditor()` makes Lexical the default for every `richText` field. You don't configure it per-field unless you want to override.
- **What gets saved.** When you save a post with rich content, what lands in SQLite isn't HTML or markdown — it's Lexical's serialized state, a JSON object with `root`, `children`, node types, formatting flags, etc. Your frontend converts that back to HTML when rendering.

---

## 3. What you'll learn — TypeScript

> **TS Lesson:** [02.1 — Object types](../ts-lessons/02-1-object-types.md)

One concept: **complex types vs primitives**. Previous fields were
`string` or `boolean` — single values. The `richText` field stores a
Lexical JSON tree, a deeply nested object. In the generated types,
`content` won't be `string` — it'll be `{ root: { children: ... } }`.

The type system protects you: if you try `<p>{post.content}</p>` on
the frontend, TypeScript flags it because an object isn't renderable
as a string. You'd need a converter like `lexicalToHtml(post.content)`.

Plain text = string in, string out. Rich text = structured in,
structured out. More power, more responsibility — and the types catch
the mismatch.

---

## 4. Builds on

- **Step 00** — `editor: lexicalEditor()` was set in `payload.config.ts` by the scaffolder. Every `richText` field uses it by default.
- **Step 01.4** — `excerpt` is a textarea (plain string). After this step, compare the editor experience side-by-side with content (rich).

---

## 5. Steps

### 5.1 — Add the content field

After the excerpt field, add:

```ts
{
  name: 'content',
  type: 'richText',
},
```

That's it. No admin config, no required, no anything else. Save the file.

### 5.2 — See what it looks like in the admin

Refresh a post's edit view. Below Excerpt you now see a big editor with a toolbar at the top — headings, bold, italic, lists, link, etc. That's Lexical.

Type a heading (use the toolbar to mark it). Type a paragraph. Add a link. Click **Save**.

### 5.3 — Look at what got stored

In `/admin`, click your saved post. Its content is rendered back with the formatting you applied — heading shows as a heading, link is clickable in the editor.

Now look at the raw data. Visit `http://localhost:3000/api/posts/<id>` (replace `<id>` with the post's actual ID from the admin URL). You'll see JSON. The `content` field isn't a string — it's an object with nested `root` and `children` and node types.

That's what "structured" means in section 3 above.

### 5.4 — Try a required richText (compare to text/textarea)

Add `required: true` to the content field:

```ts
{
  name: 'content',
  type: 'richText',
  required: true,
},
```

Save. Try creating a new post and saving with the content field empty (don't click in the editor at all). **Required validation fires** — same as it did for title in 01.2. The behavior is consistent across field types.

For this curriculum we want flexibility, so **remove `required: true`** — content can be optional for now.

### 5.5 — Try a wrong field type one more time (consistency check)

Just to confirm the pattern: try `type: 'richtext'` (lowercase). **Red squiggle.** The valid type is `'richText'` (camelCase). The same string literal union catches it.

Fix it back to `'richText'`.

---

## 6. Verify

- [ ] `src/collections/Posts.ts` has the content field with `name: 'content'`, `type: 'richText'`, no required
- [ ] The admin edit view shows a Lexical editor below Excerpt
- [ ] You can type text, mark headings, add formatting, save, and see it persist
- [ ] Visiting `/api/posts/<id>` shows the content as nested JSON (object with `root`/`children`), not a string
- [ ] You saw the required-validation behavior in 5.4 before removing `required: true`

Commit:

```bash
git add .
git commit -m "step 01.5 — add Posts.content field (richText / Lexical)"
```

---

## 7. Unlocks

- **Step 01.6** — `featuredImage` (upload). Our first field that *points at another collection* (Media). We'll meet `relationTo` and see how Payload knows the valid collection slugs at the type level.
- The "rich content is not a string" lesson matters for our SEO plugin: when we eventually analyze content for keyword density, readability, or schema generation, we'll walk the Lexical tree, not split a string.
