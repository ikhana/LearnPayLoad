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

One TS concept: **complex types vs primitive types**.

### 3a. Primitive vs complex

In 01.2 and 01.3 you saw primitive types: `string`, `boolean`. A primitive is a single, atomic value — no internal structure.

A **complex type** is one that has internal structure. An object with properties is complex. An array of objects is complex. The Lexical document tree is a deeply nested complex type:

```ts
type LexicalDocument = {
  root: {
    type: 'root'
    children: Array<{
      type: string         // 'paragraph', 'heading', 'list', etc.
      children: Array<...> // recursive!
      format?: number      // formatting flags
      // many more properties
    }>
  }
}
```

You don't need to memorize this — Payload handles it. But knowing the value is *structured* (not a string) matters once we start using the data.

### 3b. The generated type won't be `string`

Later (in 01.10) when you run `pnpm generate:types`, the generated `Post` type will look like:

```ts
type Post = {
  title: string
  slug: string
  excerpt: string | null
  content: { root: { children: ... } } | null   // ← NOT string!
  // ...
}
```

If you tried to do `<p>{post.content}</p>` on the frontend, React would scream (it doesn't know how to render an arbitrary object). You'd need a converter function — `lexicalToHtml(post.content)` or similar — to turn the tree into renderable markup.

### 3c. Why this matters

Plain text fields give you string-in, string-out simplicity. Rich text fields give you structured-in, structured-out — which means more power (you can analyze the structure, walk the tree, transform nodes) but also more responsibility (you can't treat it like a string).

The type system protects you from one side of the mistake: it won't let you pass `post.content` to a function expecting a string. That's a real win once we start rendering posts on the frontend.

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
